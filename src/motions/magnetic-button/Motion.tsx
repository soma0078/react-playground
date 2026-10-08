import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * 커서가 가까이 오면 버튼이 그쪽으로 끌려오고, 벗어나면 통 튕기며 제자리로 돌아간다.
 * 글자는 버튼보다 조금 더 따라가서 겹이 있는 것처럼 보인다.
 */

/** 버튼 바깥으로 자력이 미치는 범위 (px). 이 여백 안에서 커서를 추적한다 */
const FIELD = 40
/** 커서와 중심 사이 거리 중 이만큼만 따라간다 */
const PULL = 0.35
/** 글자가 버튼 이동에 더해 따라가는 비율 */
const LABEL_PULL = 0.4
/** damping을 낮춰 돌아올 때 한두 번 출렁이게 한다 */
const SPRING = { stiffness: 220, damping: 12, mass: 0.6 }
const PRESS_SCALE = 0.94

export interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const MagneticButton = ({
  children,
  className,
  onClick
}: MagneticButtonProps) => {
  const fieldRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)
  const labelX = useTransform(springX, (value) => value * LABEL_PULL)
  const labelY = useTransform(springY, (value) => value * LABEL_PULL)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current
    if (!field) return

    const rect = field.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * PULL)
    y.set((event.clientY - (rect.top + rect.height / 2)) * PULL)
  }

  const release = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={fieldRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={release}
      className="inline-block"
      style={{ padding: FIELD, margin: -FIELD }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: PRESS_SCALE }}
        className={cn('touch-none', className)}
      >
        <motion.span className="block" style={{ x: labelX, y: labelY }}>
          {children}
        </motion.span>
      </motion.button>
    </div>
  )
}
