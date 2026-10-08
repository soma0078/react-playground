import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * `src/motions/<slug>/` 폴더를 읽어 갤러리 항목을 만든다.
 *
 * 폴더에 `spec.md` 와 `demo.tsx` 만 두면 사이드바·홈·⌘K·상세 페이지에 자동으로 붙는다.
 * 에이전트가 라우터나 네비게이션 코드를 건드리지 않아도 되도록 등록 단계를 없앴다.
 * spec 형식은 같은 폴더의 README.md 를 따른다.
 */

export type MotionOrigin = 'human' | 'ai'
export type MotionStatus = 'proposed' | 'adopted' | 'rejected'
/** frame: 고정 높이 박스 안에서 재생 / flow: 페이지 흐름에 그대로 (스크롤 연출용) */
export type MotionPreview = 'frame' | 'flow'

export interface MotionSection {
  heading: string
  body: string
}

export interface MotionEntry {
  slug: string
  title: string
  summary: string
  origin: MotionOrigin
  status: MotionStatus
  created: string
  preview: MotionPreview
  triggers: string[]
  properties: string[]
  timing: string[]
  feel: string[]
  /** 구현이 실제로 들어 있는 파일 (저장소 루트 기준) */
  source?: string
  /** `## 변형` 중 사람이 고른 것의 이름 */
  chosen?: string
  sections: MotionSection[]
  /** 변형이 있으면 그 이름을 variant로 받는다 */
  Demo: LazyExoticComponent<ComponentType<MotionDemoProps>>
}

export interface MotionDemoProps {
  variant?: string
}

const specFiles = import.meta.glob<string>('./*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

const demoFiles = import.meta.glob<{
  default: ComponentType<MotionDemoProps>
}>('./*/demo.tsx')

const slugOf = (path: string) => path.split('/')[1]

/** `key: value` 와 `key: [a, b]` 만 읽는 최소 frontmatter 파서 */
const parseFrontmatter = (raw: string) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match)
    return { data: {} as Record<string, string | string[]>, body: raw }

  const data: Record<string, string | string[]> = {}

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()

    data[key] =
      value.startsWith('[') && value.endsWith(']')
        ? value
            .slice(1, -1)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : value
  }

  return { data, body: match[2] }
}

/** 본문을 `## 제목` 단위로 나눈다 */
const parseSections = (body: string): MotionSection[] =>
  body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [heading, ...rest] = chunk.split(/\r?\n/)
      return { heading: heading.trim(), body: rest.join('\n').trim() }
    })

const asString = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : ''

const asList = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : value ? [value] : []

const oneOf = <T extends string>(
  value: string,
  allowed: readonly T[],
  fallback: T
): T => (allowed.includes(value as T) ? (value as T) : fallback)

const toEntry = (path: string, raw: string): MotionEntry | null => {
  const slug = slugOf(path)
  const loadDemo = demoFiles[`./${slug}/demo.tsx`]

  if (!loadDemo) {
    console.warn(`[motions] ${slug}: demo.tsx 가 없어 건너뜁니다`)
    return null
  }

  const { data, body } = parseFrontmatter(raw)

  return {
    slug,
    title: asString(data.title) || slug,
    summary: asString(data.summary),
    origin: oneOf(asString(data.origin), ['human', 'ai'] as const, 'ai'),
    status: oneOf(
      asString(data.status),
      ['proposed', 'adopted', 'rejected'] as const,
      'proposed'
    ),
    created: asString(data.created),
    preview: oneOf(asString(data.preview), ['frame', 'flow'] as const, 'frame'),
    triggers: asList(data.triggers),
    properties: asList(data.properties),
    timing: asList(data.timing),
    feel: asList(data.feel),
    source: asString(data.source) || undefined,
    chosen: asString(data.chosen) || undefined,
    sections: parseSections(body),
    Demo: lazy(loadDemo)
  }
}

/** 최근에 만든 것이 위로. 거절된 항목은 기록으로만 남기고 목록에서 뺀다 */
export const MOTIONS: MotionEntry[] = Object.entries(specFiles)
  .map(([path, raw]) => toEntry(path, raw))
  .filter((entry): entry is MotionEntry => entry !== null)
  .filter((entry) => entry.status !== 'rejected')
  .sort((a, b) => b.created.localeCompare(a.created))

export const findMotion = (slug: string | undefined) =>
  MOTIONS.find((entry) => entry.slug === slug)
