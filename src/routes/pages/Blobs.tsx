import { Blob } from '@/components/ui/Blob'
import Noise from '@/assets/Noise.svg?react'

const BlobsPage = () => {
  return (
    <div className="relative -z-1 h-screen w-screen overflow-hidden bg-gradient-to-b from-[#ADDEFC] to-[#AECDF9]">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white md:text-8xl">
          Move Your Mouse
        </h1>
      </div>
      <Blob
        size={600}
        numPoints={4}
        shapeRandomness={100}
        colors={['#3099F9', '#6D76E9']}
        speed={1.2}
        className="absolute -top-20 -left-20 h-auto w-[40vw]"
      />
      <Blob
        size={400}
        numPoints={8}
        shapeRandomness={100}
        colors={['#3099F9', '#6D76E9']}
        speed={0.8}
        className="absolute -right-1/4 -bottom-1/4 h-auto w-[60vw]"
      />
      <Blob
        size={450}
        numPoints={7}
        shapeRandomness={250}
        colors={['#3099F9', '#6D76E9']}
        speed={1}
        className="absolute top-1/4 left-1/4 h-auto w-[40vw]"
      />
      <Noise
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  )
}

export default BlobsPage
