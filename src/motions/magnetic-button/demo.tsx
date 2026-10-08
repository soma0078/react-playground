import type { MotionDemoProps } from '@/motions/registry'

import {
  MAGNETIC_VARIANTS,
  MagneticButton,
  type MagneticVariant
} from './Motion'

export default function MagneticButtonDemo({ variant }: MotionDemoProps) {
  const spring =
    MAGNETIC_VARIANTS[variant as MagneticVariant] ??
    MAGNETIC_VARIANTS['통 튕기게']

  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-16 bg-[#f5f3ee]">
      <MagneticButton
        spring={spring}
        className="rounded-full bg-zinc-900 px-10 py-5 text-lg font-bold text-white"
      >
        시작하기
      </MagneticButton>
      <MagneticButton
        spring={spring}
        className="grid size-28 place-items-center rounded-full border-2 border-zinc-900 text-sm font-bold text-zinc-900"
      >
        더 보기 →
      </MagneticButton>
    </div>
  )
}
