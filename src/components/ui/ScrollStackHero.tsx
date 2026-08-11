import { useRef } from 'react'
import { motion } from 'framer-motion'

import { useScrollSteps } from '@/hooks/useScrollSteps'
import { cn } from '@/lib/utils'

import {
  ScrollStackCards,
  STEP_TRANSITION,
  stepStateOf,
  type ScrollStackCard
} from './ScrollStackCards'

/**
 * 문장이 한 줄씩 떠오르는 히어로 템플릿.
 *
 * 지금 차례인 문장만 아래에서 위로 fade up 하고, 지나간 문장은 흐려져 물러난다.
 * 화면에 남는 글이 적어 카드에 시선이 모인다.
 */

/** 문장 구간에서 다음 문장·카드로 넘어가는 지점 (0~1) */
const STEP_ENTER_AT = 0.25
/** 문장 하나를 넘기는 데 필요한 스크롤 양 (뷰포트 높이 대비) */
const STEP_SCROLL_RATIO = 1

/** 문장이 fade up 할 때 아래에서 올라오는 거리 (px) */
const SENTENCE_RISE = 16
const SENTENCE_ACTIVE_COLOR = '#18181b'
const SENTENCE_PAST_COLOR = '#a1a1aa'

export interface ScrollStackItem extends ScrollStackCard {
  /** 카드와 짝지어져 함께 떠오를 문장 */
  sentence: string
}

export interface ScrollStackHeroProps {
  /** 문장과 카드를 1:1로 묶은 목록. 순서대로 쌓인다 */
  items: ScrollStackItem[]
  className?: string
}

export const ScrollStackHero = ({ items, className }: ScrollStackHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { activeIndex } = useScrollSteps({
    target: containerRef,
    total: items.length,
    enterAt: STEP_ENTER_AT
  })

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{
        height: `${(items.length * STEP_SCROLL_RATIO + 1) * 100}vh`
      }}
    >
      {/* sticky로 고정 — 바깥 래퍼의 남은 높이가 스크롤 구간이 된다 */}
      <div className="sticky top-0 flex h-screen items-center justify-center gap-8 overflow-hidden bg-[#f5f3ee] px-10">
        <div className="flex w-[36rem] shrink-0 flex-col gap-3">
          {items.map((item, index) => (
            <motion.p
              key={index}
              className="text-[15px] leading-relaxed"
              initial={false}
              animate={stepStateOf(index, activeIndex)}
              variants={{
                hidden: { opacity: 0, y: SENTENCE_RISE },
                visible: { opacity: 1, y: 0, color: SENTENCE_ACTIVE_COLOR },
                past: { opacity: 1, y: 0, color: SENTENCE_PAST_COLOR }
              }}
              transition={STEP_TRANSITION}
            >
              {item.sentence}
            </motion.p>
          ))}
        </div>

        <ScrollStackCards cards={items} activeIndex={activeIndex} />
      </div>
    </div>
  )
}
