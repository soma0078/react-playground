import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'

/** 스크롤 따라 카드 모양 히어로 이미지가 화면 가득 펼쳐지는 섹션 */

/** 시작 모양: 위아래 · 좌우 안쪽 여백(%)과 모서리(px). 클수록 작은 카드에서 시작 */
const START_INSET_Y = 14
const START_INSET_X = 18
const START_RADIUS = 24
/** 다 펼쳐지는 지점(0~1). 낮출수록 일찍 펼쳐지고 펼쳐진 채 머무는 구간이 길어짐 */
const EXPAND_END = 0.85
/** 다 펼쳐질 때까지 스크롤 양(화면 높이 배수). 1 빠름 · 2 보통 · 3 느림 */
const SCROLL_SCREENS = 2

const START_CLIP = `inset(${START_INSET_Y}% ${START_INSET_X}% round ${START_RADIUS}px)`
const FULL_CLIP = 'inset(0% 0% round 0px)'

export interface ScrollExpandHeroProps {
  image: string
  alt?: string
  /** 이미지 위 내용 */
  children?: ReactNode
  scrollScreens?: number
  className?: string
}

export const ScrollExpandHero = ({
  image,
  alt = '',
  children,
  scrollScreens = SCROLL_SCREENS,
  className
}: ScrollExpandHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // 입력 구간 1까지 명시. 비우면 ScrollTimeline이 끝을 처음 모양으로 채워 다시 줄어듦
  const clipPath = useTransform(
    scrollYProgress,
    [0, EXPAND_END, 1],
    [START_CLIP, FULL_CLIP, FULL_CLIP]
  )

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      // 고정 구간 = 바깥 높이 - 화면 1장
      style={{ height: `${(scrollScreens + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <img src={image} alt={alt} className="h-full w-full object-cover" />
          {/* 글자 가독성용 어두운 막 */}
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>

        {children && (
          <div className="relative z-10 grid h-full place-items-center px-6">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
