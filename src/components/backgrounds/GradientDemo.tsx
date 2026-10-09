import Noise from '@/assets/noise.svg?react'
import { CanvasBackground } from '@/components/effects'

/** CSS 그라디언트 바탕 + 캔버스 블롭 + SVG 노이즈. */
export const GradientDemo = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#ADDEFC] to-[#AECDF9]">
      <CanvasBackground />
      <Noise
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  )
}
