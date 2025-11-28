import Noise from '@/assets/Noise.svg?react'
import { Ellipse1, Ellipse2, Ellipse3 } from '@/components/ellipses'

export default function GradientPage() {
  return (
    <section className="relative h-[calc(100dvh-56px)] overflow-hidden bg-gradient-to-b from-[#ADDEFC] to-[#AECDF9]">
      {/* TODO: initial Ellipses position */}
      <Ellipse1 className="absolute top-0 -left-[7.5rem]" />
      <Ellipse2 className="absolute -right-[5rem] -bottom-[5rem]" />
      <Ellipse3 className="absolute -top-[5rem] left-1/2 -translate-x-1/2" />
      <Noise
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </section>
  )
}
