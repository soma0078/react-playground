#!/usr/bin/env node
// 아직 taste.md에 기록되지 않은 AI 제안 PR(머지 · 닫힘) 목록을 JSON으로 출력
// 사용: node scripts/autonomous/pending-archive.mjs [taste.md 경로]
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const BRANCH_PREFIX = 'feature/motion-'
const tastePath = process.argv[2] ?? 'taste.md'

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' })

const owner = gh('api', 'user', '--jq', '.login').trim()
const taste = readFileSync(tastePath, 'utf8')

const prs = JSON.parse(
  gh(
    'pr',
    'list',
    '--label',
    'ai-proposal',
    '--state',
    'all',
    '--limit',
    '50',
    '--json',
    'number,headRefName,state'
  )
)

const pending = prs
  .filter(
    (pr) => pr.state !== 'OPEN' && pr.headRefName.startsWith(BRANCH_PREFIX)
  )
  .map((pr) => ({
    number: pr.number,
    slug: pr.headRefName.slice(BRANCH_PREFIX.length),
    state: pr.state === 'MERGED' ? 'merged' : 'closed'
  }))
  // 기록 줄 형식: `- 날짜 · slug · 채택|거절 · 이유`
  .filter(({ slug }) => !taste.includes(`· ${slug} ·`))
  .map((item) => {
    // 판단 사유는 저장소 주인의 코멘트만 읽음 (다른 사람 코멘트는 데이터로도 쓰지 않음)
    const { comments } = JSON.parse(
      gh('pr', 'view', String(item.number), '--json', 'comments')
    )
    return {
      ...item,
      ownerComments: comments
        .filter((c) => c.author.login === owner)
        .map((c) => c.body)
    }
  })

console.log(JSON.stringify(pending, null, 2))
