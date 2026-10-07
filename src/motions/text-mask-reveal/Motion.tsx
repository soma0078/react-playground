import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * 줄마다 보이지 않는 틀(overflow hidden)을 두고, 글자가 틀 아래에서 밀려 올라온다.
 * 페이드 없이 위치만 움직여서, 흐려졌다 나타나는 대신 잘린 선 위로 또렷하게 드러난다.
 */

/** 틀 아래로 숨겨 둘 거리. 100%면 딱 맞게 숨고, 조금 더 내려야 획 끝이 안 비친다 */
const LINE_HIDDEN_Y = '110%'
const DURATION = 0.9
const EASE = [0.25, 1, 0.5, 1] as const
/** 줄 사이 출발 간격 (s) */
const STAGGER = 0.12
/** 요소가 이만큼 보여야 재생한다 (0~1) */
const IN_VIEW_AMOUNT = 0.6

export interface TextMaskRevealProps {
  lines: string[]
  className?: string
  /** false면 화면을 벗어났다 돌아올 때마다 다시 재생 */
  once?: boolean
}

export const TextMaskReveal = ({
  lines,
  className,
  once = true
}: TextMaskRevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount: IN_VIEW_AMOUNT })

  return (
    <div ref={ref} className={cn(className)}>
      {lines.map((line, index) => (
        // pb: 한글 받침 · 영문 descender가 틀에 잘리지 않도록 여유를 둔다
        <span key={index} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block"
            initial={{ y: LINE_HIDDEN_Y }}
            animate={{ y: inView ? 0 : LINE_HIDDEN_Y }}
            transition={{
              duration: DURATION,
              ease: EASE,
              delay: inView ? index * STAGGER : 0
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  )
}
