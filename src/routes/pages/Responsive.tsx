import { useMediaQuery } from '@/lib/useMediaQuery'
import { useEffect, useRef, useState } from 'react'

const DUMMY_ITEMS = Array.from({ length: 300 }, (_, i) => ({
  id: i,
  title: `Item ${i}`,
  description: `더미 데이터 ${i} — 메모리 차이를 측정하기 위한 무거운 리스트입니다.`,
  imageUrl: `https://picsum.photos/seed/${i}/200/150`
}))

function HeavyList({ label }: { label: string }) {
  return (
    <ul className="grid max-h-60 grid-cols-3 gap-2 overflow-y-auto">
      {DUMMY_ITEMS.map((item) => (
        <li key={item.id} className="rounded border p-2 text-xs">
          <img src={item.imageUrl} alt={item.title} className="w-full" />
          <p className="font-bold">
            {label} — {item.title}
          </p>
          <p className="text-gray-400">{item.description}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * 블로그 스크린샷용 데모 패널.
 * 예시 하나를 제목·코드 캡션과 함께 독립 카드로 감싸 화면에 하나씩 담기 좋게 한다.
 */
function DemoPanel({
  index,
  title,
  code,
  desc,
  children
}: {
  index: string
  title: string
  code: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <section className="shadow-nb mx-auto max-w-2xl scroll-mt-6 space-y-4 rounded-[5px] border-2 border-black bg-white p-8">
      <header className="space-y-1">
        <h3 className="text-base font-bold">
          <span className="mr-2 text-indigo-500">{index}</span>
          {title}
        </h3>
        <p className="text-sm text-gray-500">{desc}</p>
        <code className="inline-block rounded bg-gray-800 px-2 py-1 font-mono text-xs text-gray-100">
          {code}
        </code>
      </header>
      <div className="pt-2">{children}</div>
    </section>
  )
}

function FluidCard({ label }: { label: string }) {
  return (
    <div
      className="rounded-lg border bg-white text-gray-800 shadow-sm"
      style={{ containerType: 'inline-size' }}
    >
      <div style={{ padding: '3cqi' }}>
        <h3
          className="font-bold"
          style={{ fontSize: 'clamp(14px, 5cqi, 28px)', lineHeight: 1.3 }}
        >
          {label}
        </h3>
      </div>
    </div>
  )
}

function ClampCard() {
  return (
    <div className="rounded-lg border bg-white p-4 text-gray-800 shadow-sm">
      <h3
        className="font-bold"
        style={{ fontSize: 'clamp(14px, 4vw, 32px)', lineHeight: 1.3 }}
      >
        창 크기에 맞춰 유동합니다
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        font-size: clamp(14px, 4vw, 32px) — 최소 14px, 최대 32px, 그 사이는
        뷰포트 4%
      </p>
    </div>
  )
}

/**
 * 순수 cqi 카드 (clamp 없음).
 * font-size: 5cqi → 컨테이너 폭에 정비례. 상·하한이 없어 폭이 커지면 글자가
 * 무한정 커지고, 좁아지면 읽을 수 없을 만큼 작아진다. clamp의 필요성을 보여주는 대조군.
 */
function PureCqiCard({ label }: { label: string }) {
  return (
    <div
      className="rounded-lg border bg-white text-gray-800 shadow-sm"
      style={{ containerType: 'inline-size' }}
    >
      <div style={{ padding: '3cqi' }}>
        <h3
          className="font-bold whitespace-nowrap"
          style={{ fontSize: '6.4cqi', lineHeight: 1.3 }}
        >
          {label}
        </h3>
        <p className="text-gray-500" style={{ fontSize: '2.5cqi' }}>
          font-size: 5cqi — 폭에 정비례해 커지고 작아진다.
        </p>
      </div>
    </div>
  )
}

/**
 * resize 핸들로 폭을 드래그할 수 있는 컨테이너.
 * 현재 폭을 측정해 renderReadout 으로 넘겨 캡션을 렌더한다.
 */
function ResizableBox({
  initialWidth = 360,
  renderReadout,
  children
}: {
  initialWidth?: number
  renderReadout?: (width: number) => React.ReactNode
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(Math.round(el.getBoundingClientRect().width))
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400">
        ↘ 오른쪽 아래 모서리를 드래그해 폭을 바꿔보세요 (resize: horizontal)
      </p>
      <div
        ref={ref}
        className="max-w-full min-w-[180px] resize-x overflow-auto rounded-lg border-2 border-dashed border-indigo-300 p-2"
        style={{ width: initialWidth }}
      >
        {children}
      </div>
      {width != null && renderReadout?.(width)}
    </div>
  )
}

export default function Responsive() {
  const isDesktop = useMediaQuery(1024)

  useEffect(() => {
    console.log(
      'DOM nodes:',
      document.querySelectorAll('#section-responsive li').length
    )
  }, [isDesktop])

  return (
    <section id="section-responsive" className="space-y-6">
      <h1>Responsive Design</h1>
      <p>This is a responsive design example.</p>
      <button className={`border ${isDesktop ? 'p-8' : 'p-2'}`}>
        반응형 버튼
      </button>
      {/* ① CSS hidden: HeavyList 2개 항상 마운트 → DOM 노드 300*2 = 600개 */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">
          CSS hidden — li 노드 항상 600개 (300 * 2)
        </p>
        <div className="hidden lg:block">
          <HeavyList label="[CSS] Desktop" />
        </div>
        <div className="lg:hidden">
          <HeavyList label="[CSS] Mobile" />
        </div>
      </div>
      {/* ② useMediaQuery: HeavyList 1개만 마운트 → DOM 노드 300개 */}
      {/* 검증 방식: Dev Tools > Memory 탭 > 📸 Take heap snapshot (①,② 각각 측정) > Statistics 에서 수치 확인
        => useMediaQuery 방식에서 img 노드 300개가 DOM에서 제거되어 70.8KB 절약 */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">useMediaQuery — li 노드 300개</p>
        {isDesktop ? (
          <HeavyList label="[useMediaQuery] Desktop" />
        ) : (
          <HeavyList label="[useMediaQuery] Mobile" />
        )}
      </div>

      {/* ③ cqi + clamp 컨테이너 기반 유동 사이징 — 블로그 캡처용, 예시별 독립 패널 */}
      <div className="space-y-16 border-t px-4 pt-10 pb-50">
        <h2 className="mx-auto max-w-2xl text-lg font-bold">
          cqi + clamp — 컨테이너 기반 유동 사이징
        </h2>

        <DemoPanel
          index="예시 1"
          title="cqi — 컨테이너 기준 유동"
          code="font-size: 6.4cqi;  (container-type: inline-size 필요)"
          desc="컨테이너 폭에 정비례. 오른쪽 아래를 드래그해 폭을 바꿔보세요."
        >
          <ResizableBox>
            <PureCqiCard label="컨테이너 폭에 맞춰 커지고 작아집니다" />
          </ResizableBox>
        </DemoPanel>

        <DemoPanel
          index="예시 2"
          title="clamp — 최소·유동·최대"
          code="font-size: clamp(14px, 4vw, 32px);"
          desc="브라우저 창 크기를 바꾸면 14px~32px 사이에서 유동. 최솟값·최댓값을 벗어나지 않는다."
        >
          <ClampCard />
        </DemoPanel>

        <DemoPanel
          index="예시 3"
          title="같은 컴포넌트, 다른 컨테이너"
          code="font-size: clamp(14px, 5cqi, 28px);  container-type: inline-size"
          desc="동일한 카드를 좁은 사이드바와 넓은 메인에 배치. 뷰포트가 같아도 컨테이너 폭에 따라 폰트가 달라진다."
        >
          <div className="flex gap-4">
            <aside className="w-40 shrink-0">
              <p className="mb-1 text-xs text-gray-400">sidebar (160px)</p>
              <FluidCard label="좁으면 작게 보입니다" />
            </aside>
            <main className="flex-1">
              <p className="mb-1 text-xs text-gray-400">main (flex-1)</p>
              <FluidCard label="넓으면 크게 보입니다" />
            </main>
          </div>
        </DemoPanel>
      </div>
    </section>
  )
}
