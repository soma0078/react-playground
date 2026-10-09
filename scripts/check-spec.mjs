#!/usr/bin/env node
// spec.md 형식 점검: 요청은 짧게, 수치는 ## 수치 섹션으로
// 사용: npm run spec:check -- <slug>   (--all: src/motions 전체)
// 종료 코드: 0 통과 · 1 위반 · 2 사용법 오류
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// 기존 채택 모션 기준: 요청 52~189자, 수치 0~1개
const LIMITS = {
  requestChars: 220,
  requestSentences: 4,
  // 결과를 크게 좌우하는 수치만 허용 (예: 85%). 나머지는 ## 수치로
  requestNumbers: 2,
  numberLines: 6,
  memoLines: 3
}

const MOTIONS_DIR = join(process.cwd(), 'src', 'motions')
const arg = process.argv[2]

if (!arg) {
  console.error('사용: node scripts/check-spec.mjs <slug> | --all')
  process.exit(2)
}

const slugs =
  arg === '--all'
    ? readdirSync(MOTIONS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [arg]

const sectionOf = (text, heading) => {
  const match = text.match(
    new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm')
  )
  return match ? match[1] : null
}

const check = (slug) => {
  const path = join(MOTIONS_DIR, slug, 'spec.md')
  if (!existsSync(path)) return [`spec.md가 없음: ${path}`]

  const text = readFileSync(path, 'utf8')
  const problems = []

  const requestBody = sectionOf(text, '요청')
  if (requestBody === null) return ['## 요청 섹션이 없음']

  const request = requestBody
    .split('\n')
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^>\s?/, '').trim())
    .join(' ')
    .trim()

  if (!request) problems.push('요청이 비어 있음')

  const numbers = request.match(/\d+(?:\.\d+)?/g) ?? []
  const sentences = request
    .split(/[.!?](?:\s|$)/)
    .filter((part) => part.trim()).length

  if (numbers.length > LIMITS.requestNumbers) {
    problems.push(
      `요청에 수치가 ${numbers.length}개 (${numbers.join(', ')}). 최대 ${LIMITS.requestNumbers}개. 결과를 크게 좌우하는 것만 남기고 나머지는 ## 수치로 옮길 것`
    )
  }
  if (request.length > LIMITS.requestChars) {
    problems.push(
      `요청이 ${request.length}자. 최대 ${LIMITS.requestChars}자. 무엇이 어떤 느낌으로 움직이는지만 짧게 쓰고 세부 값은 ## 수치로 옮길 것`
    )
  }
  if (sentences > LIMITS.requestSentences) {
    problems.push(
      `요청이 ${sentences}문장. 최대 ${LIMITS.requestSentences}문장`
    )
  }

  const lines = (heading) =>
    (sectionOf(text, heading) ?? '')
      .split('\n')
      .filter((line) => line.startsWith('- ')).length

  if (lines('수치') > LIMITS.numberLines) {
    problems.push(
      `수치가 ${lines('수치')}줄. 최대 ${LIMITS.numberLines}줄. 결과를 정하는 값만 남길 것`
    )
  }
  if (lines('메모') > LIMITS.memoLines) {
    problems.push(
      `메모가 ${lines('메모')}줄. 최대 ${LIMITS.memoLines}줄. 다시 만들 때 필요한 주의점만 남길 것`
    )
  }

  return problems
}

let failed = false
for (const slug of slugs) {
  const problems = check(slug)
  if (problems.length === 0) {
    console.log(`OK    ${slug}`)
  } else {
    failed = true
    console.log(`FAIL  ${slug}`)
    problems.forEach((problem) => console.log(`  - ${problem}`))
  }
}

process.exit(failed ? 1 : 0)
