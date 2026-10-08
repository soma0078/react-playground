import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions
} from 'framer-motion'

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
/**
 * 복귀 spring. damping만 달리해 출렁임 정도를 비교한다.
 * 키 이름은 spec.md `## 변형`의 이름과 같아야 한다.
 */
export const MAGNETIC_VARIANTS = {
  차분하게: { stiffness: 220, damping: 18, mass: 0.6 },
  '통 튕기게': { stiffness: 220, damping: 12, mass: 0.6 },
  출렁이게: { stiffness: 220, damping: 8, mass: 0.6 }
} satisfies Record<string, SpringOptions>

export type MagneticVariant = keyof typeof MAGNETIC_VARIANTS
const PRESS_SCALE = 0.94

export interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  spring?: SpringOptions
}

export const MagneticButton = ({
  children,
  className,
  onClick,
  spring = MAGNETIC_VARIANTS['통 튕기게']
}: MagneticButtonProps) => {
  const fieldRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, spring)
  const springY = useSpring(y, spring)
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
