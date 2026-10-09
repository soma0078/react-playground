#!/usr/bin/env node
// 모션 스모크 점검: 상세 페이지가 에러 없이 뜨는지 확인하고 단계별 캡처를 남김
// 사용: npm run motion:check -- <slug>   (사전에 npm run build 필요)
// 외부 의존성 없이 Chrome DevTools Protocol 직접 사용 (Node 22+)
import { spawn } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const slug = process.argv[2]
if (!slug) {
  console.error('사용: node scripts/check-motion.mjs <slug>')
  process.exit(2)
}

const PORT = Number(process.env.PORT ?? 4799)
const BASE = `http://localhost:${PORT}`
const SHOT_DIR = join(process.cwd(), '.motion-shots', slug)
const VIEWPORT = { width: 1440, height: 900 }
// 스크롤 점검 지점 (문서 높이 대비). 올라가는 구간까지 포함해 되돌아감 버그를 잡음
const SCROLL_STEPS = [0, 0.25, 0.5, 0.75, 1, 0.5, 0]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const chromePath = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].find((path) => path && existsSync(path))

if (!chromePath) {
  console.error('Chrome을 찾지 못함. CHROME_PATH 지정 필요')
  process.exit(2)
}

const children = []
const profile = mkdtempSync(join(tmpdir(), 'motion-check-'))

// 자식 프로세스가 끝난 뒤 프로필 삭제. 종료 코드는 정리 실패와 무관하게 유지
const finish = async (code) => {
  children.forEach((child) => child.kill('SIGKILL'))
  await Promise.all(
    children.map((child) =>
      child.exitCode === null && child.signalCode === null
        ? new Promise((resolve) => child.once('exit', resolve))
        : null
    )
  )
  try {
    rmSync(profile, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100
    })
  } catch {
    // 임시 폴더라 남아도 무방
  }
  process.exit(code)
}

// 1. 미리보기 서버
const server = spawn(
  'npx',
  ['vite', 'preview', '--port', String(PORT), '--strictPort'],
  {
    stdio: 'ignore'
  }
)
children.push(server)

for (let i = 0; ; i += 1) {
  try {
    if ((await fetch(BASE)).ok) break
  } catch {
    // 서버 기동 대기
  }
  if (i > 40) {
    console.error('미리보기 서버가 뜨지 않음 (npm run build 했는지 확인)')
    await finish(2)
  }
  await sleep(500)
}

// 2. Chrome 기동 후 DevTools 주소 파싱
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank'
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] }
)
children.push(chrome)

const wsUrl = await new Promise((resolve, reject) => {
  let buffer = ''
  const timer = setTimeout(
    () => reject(new Error('Chrome 기동 시간 초과')),
    15000
  )
  chrome.stderr.on('data', (chunk) => {
    buffer += chunk
    const match = buffer.match(/ws:\/\/\S+/)
    if (match) {
      clearTimeout(timer)
      resolve(match[0])
    }
  })
})

// 3. CDP 연결
const socket = new WebSocket(wsUrl)
await new Promise((resolve) => (socket.onopen = resolve))

let nextId = 0
const pending = new Map()
const listeners = []

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data)
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  } else {
    listeners.forEach((listener) => listener(message))
  }
}

const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    nextId += 1
    pending.set(nextId, { resolve, reject })
    socket.send(JSON.stringify({ id: nextId, method, params, sessionId }))
  })

const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', {
  targetId,
  flatten: true
})
const cdp = (method, params) => send(method, params, sessionId)

const errors = []
listeners.push((message) => {
  if (message.sessionId !== sessionId) return
  const { method, params } = message
  if (method === 'Runtime.exceptionThrown') {
    const detail = params.exceptionDetails
    errors.push(detail.exception?.description ?? detail.text)
  }
  // 리소스 로딩 실패(오프라인 등)는 로그 채널이라 여기서 제외됨
  if (method === 'Runtime.consoleAPICalled' && params.type === 'error') {
    errors.push(
      params.args.map((arg) => arg.value ?? arg.description).join(' ')
    )
  }
})

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setDeviceMetricsOverride', {
  ...VIEWPORT,
  deviceScaleFactor: 1,
  mobile: false
})

const evaluate = async (expression) =>
  (
    await cdp('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    })
  ).result.value

mkdirSync(SHOT_DIR, { recursive: true })
const shots = []
const shoot = async (name) => {
  const { data } = await cdp('Page.captureScreenshot', { format: 'png' })
  const path = join(SHOT_DIR, `${name}.png`)
  writeFileSync(path, Buffer.from(data, 'base64'))
  shots.push(path)
}

// 4. 상세 페이지 로드
const loaded = new Promise((resolve) =>
  listeners.push(
    (message) => message.method === 'Page.loadEventFired' && resolve()
  )
)
await cdp('Page.navigate', { url: `${BASE}/motions/${slug}` })
await loaded
await sleep(1500)

const checks = {
  routeKept: (await evaluate('location.pathname')) === `/motions/${slug}`,
  requestShown:
    (
      (await evaluate(
        `document.querySelector('[data-motion="request"] p')?.textContent`
      )) ?? ''
    ).trim().length > 0,
  previewHeight: await evaluate(
    `document.querySelector('[data-motion="preview"]')?.getBoundingClientRect().height ?? 0`
  )
}
checks.previewShown = checks.previewHeight > 50

await shoot('00-initial')

// 5. 스크롤 점검: 문서 전체를 내렸다 올리며 캡처
const maxScroll = await evaluate(
  'document.documentElement.scrollHeight - innerHeight'
)
if (maxScroll > 100) {
  for (const [index, ratio] of SCROLL_STEPS.entries()) {
    await evaluate(`scrollTo(0, ${Math.round(maxScroll * ratio)})`)
    await sleep(400)
    await shoot(`scroll-${index}-${Math.round(ratio * 100)}pct`)
  }
}

// 6. 포인터 점검: 미리보기 위를 가로질러 이동 후 드래그
await evaluate('scrollTo(0, 0)')
const rect = await evaluate(`(() => {
  const r = document.querySelector('[data-motion="preview"]')?.getBoundingClientRect()
  return r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null
})()`)

if (rect && rect.y < VIEWPORT.height) {
  const mouse = (type, x, y, extra = {}) =>
    cdp('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: 'left',
      clickCount: 1,
      ...extra
    })
  const cx = rect.x + rect.w / 2
  const cy = rect.y + Math.min(rect.h, VIEWPORT.height - rect.y) / 2

  for (let step = 0; step <= 10; step += 1) {
    await mouse('mouseMoved', rect.x + (rect.w * step) / 10, cy, {
      button: 'none'
    })
    await sleep(40)
  }
  await sleep(300)
  await shoot('pointer-hover')

  await mouse('mouseMoved', cx, cy, { button: 'none' })
  await mouse('mousePressed', cx, cy)
  for (let step = 1; step <= 10; step += 1) {
    await mouse('mouseMoved', cx + step * 20, cy + step * 8, { buttons: 1 })
    await sleep(30)
  }
  await shoot('pointer-drag')
  await mouse('mouseReleased', cx + 200, cy + 80)
  await sleep(600)
  await shoot('pointer-released')
}

const ok =
  checks.routeKept &&
  checks.requestShown &&
  checks.previewShown &&
  errors.length === 0
console.log(JSON.stringify({ slug, ok, checks, errors, shots }, null, 2))
await finish(ok ? 0 : 1)
