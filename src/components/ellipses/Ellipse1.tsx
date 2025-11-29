import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { SVGProps } from 'react'

const originalPath =
  'M556.675 334.323C404.47 632.854 1300.99 716.523 1131.21 834.39C961.44 952.256 252.192 848.43 124.752 664.864C-2.6889 481.298 31.6298 236.939 201.405 119.073C371.18 1.20647 630.57 189.39 556.675 334.323Z'

const randomness = 150
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

export const Ellipse1 = (props: SVGProps<SVGSVGElement>) => {
  const [d, setD] = useState(originalPath)

  useEffect(() => {
    const interval = setInterval(() => {
      setD(generateRandomPath())
    }, 5000) // Change shape every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    // @ts-expect-error 임시 조치
    <motion.svg
      width="1235"
      height="967"
      viewBox="0 0 1235 967"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      initial={false}
      animate={{
        x: [-30, 20, -30],
        y: [20, -20, 20],
        scale: 1
      }}
      transition={{
        x: {
          duration: 30,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        },
        y: {
          duration: 25,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }
      }}
    >
      <g filter="url(#filter0_f_471_22725)">
        <motion.path
          initial={false}
          animate={{ d }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          fill="url(#paint0_linear_471_22725)"
          fillOpacity="0.7"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_471_22725"
          x="-34.2412"
          y="0"
          width="1268.95"
          height="966.469"
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
            result="effect1_foregroundBlur_471_22725"
          />
        </filter>
        <linearGradient
          id="paint0_linear_471_22725"
          x1="354.121"
          y1="450.259"
          x2="1348.55"
          y2="712.011"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3099F9" />
          <stop offset="1" stopColor="#6D76E9" stopOpacity="0.38" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
