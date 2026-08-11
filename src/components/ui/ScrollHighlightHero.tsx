import { useRef } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'

import { useScrollSteps } from '@/hooks/useScrollSteps'
import { cn } from '@/lib/utils'

import { ScrollStackCards, type ScrollStackCard } from './ScrollStackCards'

/**
 * 문장 전체를 깔아두고 색으로 읽는 위치를 짚어주는 히어로 템플릿.
 *
 * 글은 처음부터 전부 보이고, 스크롤을 따라 단어가 왼쪽부터 차례로 선명해진다.
 * 색만 변하므로 레이아웃이 흔들리지 않고, 전체 분량이 한눈에 들어온다.
 *
 * 문장의 80% 지점에서 하이라이트가 끝나고 그 시점에 카드가 올라온다.
 * 색 변화만 스크롤에 그대로 연동되고, 카드는 시점만 받아 자기 시간으로 재생된다.
 */

/** 문장 구간에서 카드가 올라오는 지점 (0~1) */
const CARD_ENTER_AT = 0.8
/** 문장 구간에서 단어 하이라이트가 끝나는 지점 (0~1) */
const HIGHLIGHT_END = 0.8
/** 문장 하나를 넘기는 데 필요한 스크롤 양 (뷰포트 높이 대비) */
const STEP_SCROLL_RATIO = 1

const WORD_DIM_COLOR = '#c4c4cc'
const WORD_ACTIVE_COLOR = '#18181b'

export interface ScrollHighlightItem extends ScrollStackCard {
  /** 카드와 짝지어져 하이라이트될 문장 */
  sentence: string
}

export interface ScrollHighlightHeroProps {
  /** 문장과 카드를 1:1로 묶은 목록. 순서대로 쌓인다 */
  items: ScrollHighlightItem[]
  className?: string
}

/**
 * 단어 하나. 자기 구간을 지날 때 흐린 색에서 선명한 색으로 바뀐다.
 * 색 계산을 단어 컴포넌트로 내려, 스크롤마다 부모가 다시 그리지 않게 한다.
 */
const HighlightWord = ({
  progress,
  start,
  end,
  children
}: {
  progress: MotionValue<number>
  start: number
  end: number
  children: string
}) => {
  const color = useTransform(
    progress,
    [start, end],
    [WORD_DIM_COLOR, WORD_ACTIVE_COLOR]
  )

  return <motion.span style={{ color }}>{children} </motion.span>
}

export const ScrollHighlightHero = ({
  items,
  className
}: ScrollHighlightHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const total = items.length

  const { scrollYProgress, activeIndex } = useScrollSteps({
    target: containerRef,
    total,
    enterAt: CARD_ENTER_AT
  })

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{ height: `${(total * STEP_SCROLL_RATIO + 1) * 100}vh` }}
    >
      {/* sticky로 고정 — 바깥 래퍼의 남은 높이가 스크롤 구간이 된다 */}
      <div className="sticky top-0 flex h-screen items-center justify-center gap-8 overflow-hidden bg-[#f5f3ee] px-10">
        <p className="w-[36rem] shrink-0 text-[15px] leading-relaxed">
          {items.map((item, itemIndex) => {
            const words = item.sentence.split(' ')
            // 문장 구간을 단어 수만큼 나눠 왼쪽부터 차례로 선명해지게 한다
            const span = HIGHLIGHT_END / total / words.length

            return (
              <span key={itemIndex}>
                {words.map((word, wordIndex) => {
                  const ratio =
                    words.length > 1 ? wordIndex / (words.length - 1) : 0
                  const start = (itemIndex + ratio * HIGHLIGHT_END) / total

                  return (
                    <HighlightWord
                      key={wordIndex}
                      progress={scrollYProgress}
                      start={start}
                      end={start + span}
                    >
                      {word}
                    </HighlightWord>
                  )
                })}{' '}
              </span>
            )
          })}
        </p>

        <ScrollStackCards cards={items} activeIndex={activeIndex} />
      </div>
    </div>
  )
}
