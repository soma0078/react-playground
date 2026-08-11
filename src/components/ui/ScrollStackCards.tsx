import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * 스크롤 차례에 맞춰 한 장씩 쌓이는 카드 스택.
 *
 * 차례(activeIndex)만 밖에서 받고, 실제 움직임은 motion이 자기 시간으로
 * 재생한다. 스크롤을 멈춰도 카드가 중간에 서지 않는다.
 */

/** 카드가 떠오르기 직전 상태 */
const CARD_TILT = 14
const CARD_OFFSET_X = 6
const CARD_OFFSET_Y = 48
const CARD_SCALE = 0.9
/** 새 카드에 덮인 카드가 물러나 보이도록 낮추는 투명도 */
const CARD_COVERED_OPACITY = 0.8

export const STEP_TRANSITION = {
  opacity: { duration: 0.35, ease: 'linear' },
  default: { duration: 1.1, ease: [0.25, 1, 0.5, 1] }
} as const

/** 아직 차례가 오지 않았는지, 지금 차례인지, 이미 지나갔는지 */
export type StepState = 'hidden' | 'visible' | 'past'

export const stepStateOf = (index: number, activeIndex: number): StepState => {
  if (index > activeIndex) return 'hidden'
  if (index === activeIndex) return 'visible'
  return 'past'
}

export interface ScrollStackCard {
  image: string
  alt?: string
}

interface ScrollStackCardsProps {
  cards: ScrollStackCard[]
  /** 맨 위에 쌓인 카드의 인덱스 */
  activeIndex: number
  className?: string
}

export const ScrollStackCards = ({
  cards,
  activeIndex,
  className
}: ScrollStackCardsProps) => {
  return (
    <div
      className={cn('relative aspect-[494/406] w-[31rem] shrink-0', className)}
    >
      {cards.map((card, index) => {
        // 홀수는 우측, 짝수는 좌측으로 기운 채 올라온다
        const direction = (index + 1) % 2 === 1 ? 1 : -1

        return (
          <motion.div
            key={card.image}
            className="absolute top-0 left-[5%] h-[69%] w-[89%] overflow-hidden rounded-[2rem] bg-zinc-400"
            style={{ zIndex: index }}
            initial={false}
            animate={stepStateOf(index, activeIndex)}
            variants={{
              hidden: {
                opacity: 0,
                x: `${CARD_OFFSET_X * direction}%`,
                y: `${CARD_OFFSET_Y}%`,
                rotate: CARD_TILT * direction,
                scale: CARD_SCALE
              },
              visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
              past: {
                opacity: CARD_COVERED_OPACITY,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1
              }
            }}
            transition={STEP_TRANSITION}
          >
            <img
              src={card.image}
              alt={card.alt ?? ''}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )
      })}
    </div>
  )
}
