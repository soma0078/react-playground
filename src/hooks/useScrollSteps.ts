import { useState, type RefObject } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

interface UseScrollStepsOptions {
  /** 스크롤 구간을 잡을 바깥 래퍼 */
  target: RefObject<HTMLElement | null>
  /** 전체 단계 수 */
  total: number
  /** 한 단계 안에서 다음 단계로 넘어가는 지점 (0~1) */
  enterAt: number
}

/**
 * 스크롤 위치를 "지금 몇 번째 차례인가" 하나로 좁혀 돌려준다.
 *
 * 진행도(scrollYProgress)는 스크롤에 그대로 연동해야 하는 연출에,
 * activeIndex는 스크롤과 분리해 자기 시간으로 재생할 연출에 쓴다.
 * 차례가 실제로 바뀔 때만 리렌더가 일어난다.
 */
export const useScrollSteps = ({
  target,
  total,
  enterAt
}: UseScrollStepsOptions) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end']
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    let next = 0

    for (let i = 1; i < total; i += 1) {
      if (progress >= (i - 1 + enterAt) / total) next = i
    }

    setActiveIndex((current) => (current === next ? current : next))
  })

  return { scrollYProgress, activeIndex }
}
