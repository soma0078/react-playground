import type { ReactNode } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * 잡아당기면 고무줄처럼 버티며 늘어나고, 놓으면 출렁이며 제자리로 돌아오는 카드.
 * 끌 수 있는 범위를 0으로 묶어 두고 탄성(dragElastic)만큼만 밀려나게 하는 방식이다.
 */

/** 0이면 꿈쩍 안 하고 1이면 손을 그대로 따라온다 */
const ELASTIC = 0.35
const BOUNCE = { bounceStiffness: 400, bounceDamping: 14 }
/** 옆으로 당긴 거리만큼 기울어진다 */
const TILT_RANGE_PX = 160
const MAX_TILT = 12
const GRAB_SCALE = 1.04

export interface ElasticDragProps {
  children: ReactNode
  className?: string
}

export const ElasticDrag = ({ children, className }: ElasticDragProps) => {
  const x = useMotionValue(0)
  const rotate = useTransform(
    x,
    [-TILT_RANGE_PX, TILT_RANGE_PX],
    [-MAX_TILT, MAX_TILT]
  )

  return (
    <motion.div
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={ELASTIC}
      dragTransition={BOUNCE}
      whileDrag={{ scale: GRAB_SCALE }}
      style={{ x, rotate }}
      className={cn('cursor-grab touch-none active:cursor-grabbing', className)}
    >
      {children}
    </motion.div>
  )
}
