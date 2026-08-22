import Noise from '@/assets/Noise.svg?react'
import { Blob } from '@/components/ui/Blob'

/** SVG path 를 매 프레임 다시 그리는 방식. 마우스에 반응한다. */
export const BlobsDemo = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#ADDEFC] to-[#AECDF9]">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-white md:text-7xl">
          Move Your Mouse
        </h2>
      </div>
      <Blob
        size={600}
        numPoints={4}
        shapeRandomness={100}
        colors={['#3099F9', '#6D76E9']}
        speed={1.2}
        className="absolute -top-20 -left-20 h-auto w-[40%]"
      />
      <Blob
        size={400}
        numPoints={8}
        shapeRandomness={100}
        colors={['#3099F9', '#6D76E9']}
        speed={0.8}
        className="absolute -right-1/4 -bottom-1/4 h-auto w-[60%]"
      />
      <Blob
        size={450}
        numPoints={7}
        shapeRandomness={250}
        colors={['#3099F9', '#6D76E9']}
        speed={1}
        className="absolute top-1/4 left-1/4 h-auto w-[40%]"
      />
      <Noise
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  )
}
