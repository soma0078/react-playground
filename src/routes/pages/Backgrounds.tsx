import { Link, useSearchParams } from 'react-router'

import { BlobsDemo, CanvasDemo, GradientDemo } from '@/components/backgrounds'
import { BACKGROUND_TABS, type BackgroundTabId } from '@/constants'
import { cn } from '@/lib/utils'

const DEMOS: Record<BackgroundTabId, () => React.ReactElement> = {
  'css-canvas': GradientDemo,
  'svg-motion': BlobsDemo,
  'canvas-2d': CanvasDemo
}

/**
 * 같은 배경 화면을 도구만 바꿔 만들어 본 비교 페이지.
 * 페이지를 나누면 서로 비교가 안 되므로 탭 하나로 묶는다.
 */
export default function BackgroundsPage() {
  const [searchParams] = useSearchParams()

  const requested = searchParams.get('tab')
  const active =
    BACKGROUND_TABS.find((tab) => tab.id === requested) ?? BACKGROUND_TABS[0]

  const Demo = DEMOS[active.id]

  return (
    <div className="space-y-6">
      {/* 탭 — 링크라서 주소로 바로 공유된다 */}
      <div
        role="tablist"
        aria-label="배경 구현 방식"
        className="flex flex-wrap gap-3"
      >
        {BACKGROUND_TABS.map((tab) => {
          const isActive = tab.id === active.id

          return (
            <Link
              key={tab.id}
              to={`?tab=${tab.id}`}
              role="tab"
              aria-selected={isActive}
              className={cn(
                'nb-press rounded-[5px] border-2 border-black px-4 py-2 text-sm font-extrabold uppercase',
                isActive
                  ? 'bg-nb-green shadow-nb'
                  : 'shadow-nb-sm hover:bg-nb-yellow bg-white'
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* 어떤 성격의 구현인지 — 이름·설명은 상단 헤더가 이미 보여준다 */}
      <div className="flex flex-wrap items-center gap-2 border-t-2 border-black pt-4">
        <span className="bg-nb-yellow shadow-nb-sm border-2 border-black px-2 py-0.5 text-[11px] font-extrabold tracking-[0.1em] uppercase">
          {active.kind}
        </span>
        {active.notes.map((note) => (
          <span
            key={note}
            className="border-2 border-black bg-white px-2 py-0.5 text-xs font-bold"
          >
            {note}
          </span>
        ))}
      </div>

      {/* 미리보기 */}
      <div className="shadow-nb h-[min(70vh,640px)] min-h-[380px] overflow-hidden rounded-[5px] border-2 border-black">
        <Demo key={active.id} />
      </div>
    </div>
  )
}
