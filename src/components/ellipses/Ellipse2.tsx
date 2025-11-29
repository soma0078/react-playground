import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { SVGProps } from 'react'

const originalPath =
  'M959.621 227.835C916.559 602.738 -0.666545 152.317 88.0392 365.21C176.745 578.102 926.294 898.523 1165.8 798.729C1405.3 698.935 1527.55 445.453 1438.84 232.56C1350.14 19.6677 980.527 45.8239 959.621 227.835Z'

const randomness = 180
const generateRandomPath = () => {
  const numbers = originalPath.match(/-?\d+\.?\d*/g)?.map(Number)
  if (!numbers) return originalPath

  const newNumbers = numbers.map((num) => {
    return num + (Math.random() - 0.5) * randomness
  })

  let i = 0
  return originalPath.replace(
    /-?\d+\.?\d*/g,
    () => newNumbers[i++]?.toFixed(3) ?? ''
  )
}

export const Ellipse2 = (props: SVGProps<SVGSVGElement>) => {
  const [d, setD] = useState(originalPath)

  useEffect(() => {
    const interval = setInterval(() => {
      setD(generateRandomPath())
    }, 6000) // Change shape every 6 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    // @ts-expect-error 임시 조치
    <motion.svg
      width="1520"
      height="894"
      viewBox="0 0 1520 894"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      initial={false}
      animate={{
        x: [40, -10, 40],
        y: [-25, 25, -25],
        scale: 1
      }}
      transition={{
        x: {
          duration: 40,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        },
        y: {
          duration: 32,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }
      }}
    >
      <g filter="url(#filter0_f_471_22732)">
        <motion.path
          initial={false}
          animate={{ d }}
          transition={{ duration: 5, ease: 'easeInOut' }}
          fill="url(#paint0_linear_471_22732)"
          fillOpacity="0.7"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_471_22732"
          x="0"
          y="0"
          width="1549.75"
          height="899.504"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="30"
            result="effect1_foregroundBlur_471_22732"
          />
        </filter>
        <linearGradient
          id="paint0_linear_471_22732"
          x1="1461.64"
          y1="434.953"
          x2="132.292"
          y2="48.5651"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1A84FC" />
          <stop offset="0.366704" stopColor="#558AFF" />
          <stop offset="1" stopColor="#38A7FC" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
