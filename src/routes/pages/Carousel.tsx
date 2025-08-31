import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

const imgs = [
  '/assets/images/img-1.jpg',
  '/assets/images/img-2.jpg',
  '/assets/images/img-3.jpg',
  '/assets/images/img-4.jpg'
]

const DRAG_BUFFER = 50
const ONE_SECOND = 1000
const AUTO_DELAY = ONE_SECOND * 10

const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50
} as const

export const Carousel = () => {
  const [dragging, setDragging] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const dragX = useMotionValue(0)
  const lastIndex = imgs.length - 1
  const currentIndex = imgIndex + 1
  const totalImgs = imgs.length

  useEffect(() => {
    if (dragging) return
    const intervalRef = setInterval(() => {
      // TODO: autoplay
    }, AUTO_DELAY)

    return () => clearInterval(intervalRef)
  })

  const onDragStart = () => {
    setDragging(true)
  }
  const onDragEnd = () => {
    setDragging(false)

    const x = dragX.get()

    if (x <= -DRAG_BUFFER && imgIndex < lastIndex) {
      setImgIndex((prev) => prev + 1)
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((prev) => prev - 1)
    }
  }

  const handlePrevClick = () => {
    if (imgIndex > 0) setImgIndex((prev) => prev - 1)
  }
  const handleNextClick = () => {
    if (imgIndex < lastIndex) setImgIndex((prev) => prev + 1)
  }

  return (
    <div className="relative h-full overflow-hidden bg-neutral-950 p-8">
      <AnimatePresence mode="wait">
        <motion.div
          drag="x"
          dragConstraints={{
            left: 0,
            right: 0
          }}
          style={{
            x: dragX
          }}
          animate={{
            translateX: `-${imgIndex * 100}%`
          }}
          transition={SPRING_OPTIONS}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="flex cursor-grab items-center active:cursor-grabbing"
        >
          <Images imgIndex={imgIndex} />
        </motion.div>
        <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
      </AnimatePresence>

      <button
        onClick={handlePrevClick}
        disabled={imgIndex === 0}
        className="absolute top-1/2 left-5 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ◀
      </button>
      <button
        onClick={handleNextClick}
        disabled={imgIndex === lastIndex}
        className="absolute top-1/2 right-5 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ▶
      </button>

      <div className="text-right">
        <span>{currentIndex}</span>/<span>{totalImgs}</span>
      </div>
    </div>
  )
}

const Images = ({ imgIndex }: { imgIndex: number }) => {
  return (
    <>
      {imgs.map((imgSrc, i) => (
        <motion.div
          key={i}
          style={{ backgroundImage: `url(${imgSrc})` }}
          animate={{
            scale: imgIndex === i ? 0.95 : 0.85
          }}
          transition={SPRING_OPTIONS}
          className="aspect-video h-auto w-full shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
        />
      ))}
    </>
  )
}

const Dots = ({
  imgIndex,
  setImgIndex
}: {
  imgIndex: number
  setImgIndex: Dispatch<SetStateAction<number>>
}) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-x-2">
      {imgs.map((_, i) => {
        return (
          <button
            key={i}
            onClick={() => setImgIndex(i)}
            className={`h-3 w-3 rounded-full transition-colors ${i === imgIndex ? 'bg-neutral-50' : 'bg-neutral-500'}`}
          />
        )
      })}
    </div>
  )
}
