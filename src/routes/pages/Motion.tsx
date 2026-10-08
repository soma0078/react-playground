import { Suspense, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { Check, Copy } from 'lucide-react'

import { SpecMarkdown } from '@/components/motions/SpecMarkdown'
import { PATHS } from '@/constants'
import { findMotion, type MotionEntry } from '@/motions/registry'

const sectionBody = (motion: MotionEntry, heading: string) =>
  motion.sections.find((section) => section.heading === heading)?.body ?? ''

/** `> 요청` 한 줄이 한 번의 요청. 첫 줄이 처음 한 말, 이후는 결과를 보고 고친 말 */
const requestsOf = (motion: MotionEntry) =>
  sectionBody(motion, '요청')
    .split(/\r?\n/)
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^>\s?/, '').trim())
    .filter(Boolean)

/** 누가 만들었고 지금 어떤 상태인지 */
const labelOf = (motion: MotionEntry) => {
  const origin = motion.origin === 'ai' ? 'AI 제안' : '직접 요청'
  return motion.status === 'proposed' ? `${origin} · 검토 대기` : origin
}

/** `- 항목: 값` 줄들 → [항목, 값] */
const numbersOf = (motion: MotionEntry) =>
  sectionBody(motion, '수치')
    .split(/\r?\n/)
    .filter((line) => line.startsWith('- '))
    .map((line) => {
      const text = line.slice(2)
      const separator = text.indexOf(':')
      return separator === -1
        ? ['', text.trim()]
        : [text.slice(0, separator).trim(), text.slice(separator + 1).trim()]
    })

/** 다른 곳에서 다시 만들 때 붙여 넣을 문장. 요청과 수치를 합쳐 만든다 */
const promptOf = (motion: MotionEntry) =>
  [
    ...requestsOf(motion),
    '',
    '아래 수치로 맞춰줘.',
    ...numbersOf(motion).map(([label, value]) =>
      label ? `- ${label}: ${value}` : `- ${value}`
    )
  ].join('\n')

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="nb-press shadow-nb-sm flex shrink-0 items-center gap-1 rounded-[4px] border-2 border-black bg-white px-2 py-1 text-[11px] font-extrabold uppercase"
    >
      {copied ? (
        <Check className="size-3.5" strokeWidth={3} />
      ) : (
        <Copy className="size-3.5" strokeWidth={3} />
      )}
      {copied ? '복사됨' : '프롬프트 복사'}
    </button>
  )
}

const Request = ({ motion }: { motion: MotionEntry }) => {
  const [first, ...followUps] = requestsOf(motion)

  return (
    <section className="bg-nb-yellow shadow-nb rounded-[5px] border-2 border-black p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-lg leading-relaxed font-bold break-keep">
          “{first}”
        </p>
        <CopyButton text={promptOf(motion)} />
      </div>
      {followUps.length > 0 && (
        <ol className="mt-2 flex flex-wrap gap-x-2 text-sm font-semibold break-keep">
          {followUps.map((followUp, index) => (
            <li key={index}>→ “{followUp}”</li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-xs font-bold">
        {labelOf(motion)}
        {motion.created && ` · ${motion.created}`}
      </p>
    </section>
  )
}

const Preview = ({ motion }: { motion: MotionEntry }) => {
  const { Demo } = motion
  const fallback = (
    <div className="text-nb-muted grid h-40 place-items-center text-sm font-bold">
      불러오는 중…
    </div>
  )

  if (motion.preview === 'flow') {
    return (
      <section className="space-y-3">
        <p className="bg-nb-orange shadow-nb-sm inline-block border-2 border-black px-2 py-0.5 text-[11px] font-extrabold tracking-[0.1em] uppercase">
          아래로 스크롤
        </p>
        <div className="-mx-6 border-y-2 border-black lg:-mx-10">
          <Suspense fallback={fallback}>
            <Demo />
          </Suspense>
        </div>
      </section>
    )
  }

  return (
    <div className="shadow-nb h-[min(70vh,640px)] min-h-[380px] overflow-hidden rounded-[5px] border-2 border-black">
      <Suspense fallback={fallback}>
        <Demo />
      </Suspense>
    </div>
  )
}

const Numbers = ({ motion }: { motion: MotionEntry }) => {
  const memo = sectionBody(motion, '메모')
  const tags = [
    ...motion.triggers,
    ...motion.properties,
    ...motion.timing
  ].filter((tag, index, all) => all.indexOf(tag) === index)

  return (
    <section className="shadow-nb space-y-4 rounded-[5px] border-2 border-black bg-white p-5">
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
        {numbersOf(motion).map(([label, value]) => (
          <div key={label + value} className="contents">
            <dt className="font-extrabold">{label}</dt>
            <dd className="font-medium break-keep">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="flex flex-wrap gap-1.5 border-t-2 border-black pt-4">
        {motion.feel.map((tag) => (
          <li
            key={tag}
            className="bg-nb-yellow border-2 border-black px-1.5 text-xs font-bold"
          >
            {tag}
          </li>
        ))}
        {tags.map((tag) => (
          <li
            key={tag}
            className="border-2 border-black bg-white px-1.5 text-xs font-bold"
          >
            {tag}
          </li>
        ))}
      </ul>

      {memo && (
        <div className="text-nb-muted">
          <SpecMarkdown source={memo} />
        </div>
      )}
    </section>
  )
}

/**
 * 모션 하나의 상세. "이 말을 하면 → 이게 나온다"만 보이게 한다.
 * 요청 → 실행 화면 → 수치 순서. 스크롤 연출(flow)은 길어서 수치를 화면 앞에 둔다.
 */
export default function MotionPage() {
  const { slug } = useParams()
  const motion = findMotion(slug)

  if (!motion) return <Navigate to={PATHS.HOME} replace />

  return (
    <div className="space-y-6">
      <Request motion={motion} />
      {motion.preview === 'flow' ? (
        <>
          <Numbers motion={motion} />
          <Preview motion={motion} />
        </>
      ) : (
        <>
          <Preview motion={motion} />
          <Numbers motion={motion} />
        </>
      )}
    </div>
  )
}
