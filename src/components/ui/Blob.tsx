import {
  useId,
  useState,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef
} from 'react'
import { motion, type MotionProps, useSpring } from 'framer-motion'
import { generateNaturalBlobPath } from '../../lib/motion'

// 1. Define the component's own logic props
interface BlobLogicProps {
  colors: string[]
  size?: number
  numPoints?: number
  shapeRandomness?: number
  speed?: number
}

// 2. motion.svg 기본 타입 패턴 (표준)
type MotionSVGProps = ComponentPropsWithoutRef<'svg'> & MotionProps

// 3. Blob 내부에서 제어하는 Props
type ControlledProps =
  | 'animate'
  | 'transition'
  | 'initial'
  | 'onMouseMove'
  | 'onMouseLeave'
  | 'viewBox'
  | 'filter'
  | 'values'

// 4. 최종 Blob Props
export type BlobProps = Omit<MotionSVGProps, ControlledProps> & BlobLogicProps

// 5. Component
export const Blob = ({
  colors,
  size = 500,
  numPoints = 8,
  shapeRandomness = 100,
  speed = 1,
  ...props
}: BlobProps) => {
  const gradientId = useId()
  const filterId = useId()
  const blobRef = useRef<SVGSVGElement>(null)
  const padding = 200

  const [d, setD] = useState(
    generateNaturalBlobPath({
      xRadius: size,
      yRadius: size,
      numPoints,
      randomness: shapeRandomness,
      seed: Math.random()
    })
  )
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Spring-animated mouse position values for smoothness
  const smoothMouseX = useSpring(size, {
    stiffness: 20,
    damping: 25,
    mass: 1
  })
  const smoothMouseY = useSpring(size, {
    stiffness: 20,
    damping: 25,
    mass: 1
  })

  // Throttled path update based on smoothed mouse position
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const updatePath = () => {
      const x = smoothMouseX.get()
      const y = smoothMouseY.get()
      const isInteracting = x !== size || y !== size

      const newPath = generateNaturalBlobPath({
        xRadius: size,
        yRadius: size,
        numPoints,
        randomness: isInteracting ? shapeRandomness * 1.5 : shapeRandomness,
        seed: isInteracting ? 1 : Math.random(),
        pullPoint: isInteracting ? { x, y } : null
      })
      setD(newPath)
    }

    // Throttle the path updates to avoid re-calculating on every frame
    const throttledUpdate = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          updatePath()

          timeoutId = null
        }, 120) // Update max every 120ms
      }
    }

    const unsubscribeX = smoothMouseX.onChange(throttledUpdate)
    const unsubscribeY = smoothMouseY.onChange(throttledUpdate)

    return () => {
      unsubscribeX()
      unsubscribeY()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [smoothMouseX, smoothMouseY, size, numPoints, shapeRandomness])

  // Idle Animation: Only runs when not interacting
  useEffect(() => {
    const isInteracting =
      smoothMouseX.get() !== size || smoothMouseY.get() !== size
    if (isInteracting) return

    const intervalId = setInterval(
      () => {
        setD(
          generateNaturalBlobPath({
            xRadius: size,
            yRadius: size,
            numPoints,
            randomness: shapeRandomness,
            seed: Math.random()
          })
        )
      },
      (Math.random() * 2000 + 3000) / speed
    )
    return () => clearInterval(intervalId)
  }, [d, size, numPoints, shapeRandomness, speed, smoothMouseX, smoothMouseY])

  // Position Animation
  useEffect(() => {
    if (speed === 0) return
    const intervalId = setInterval(
      () => {
        setPosition({
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100
        })
      },
      (Math.random() * 3000 + 4000) / speed
    )
    return () => clearInterval(intervalId)
  }, [speed])

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = blobRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    smoothMouseX.set(svgP.x)
    smoothMouseY.set(svgP.y)
  }

  const handleMouseLeave = () => {
    smoothMouseX.set(size)
    smoothMouseY.set(size)
  }

  return (
    <motion.svg
      ref={blobRef}
      viewBox={`-${padding} -${padding} ${size * 2 + padding * 2} ${
        size * 2 + padding * 2
      }`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      filter={`url(#${filterId})`}
      initial={{ x: 0, y: 0 }}
      animate={position}
      transition={{
        x: { type: 'spring', stiffness: 40, damping: 20 },
        y: { type: 'spring', stiffness: 40, damping: 20 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <g>
        <motion.path
          initial={false}
          animate={{ d }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          fill={`url(#${gradientId})`}
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="-200"
          y="-200"
          width={size * 2 + 400}
          height={size * 2 + 400}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="30" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          {colors.map((color, index) => (
            <stop
              key={index}
              stopColor={color}
              offset={`${(index / (colors.length - 1)) * 100}%`}
            />
          ))}
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
