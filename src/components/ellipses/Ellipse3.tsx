import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { SVGProps } from 'react'

const originalPath =
  'M907.607 404.796C924.925 266.623 671.755 -94.5518 526.766 102.947C381.777 300.446 100.529 163.296 83.211 301.469C65.8927 439.643 236.401 574.786 464.051 603.319C691.702 631.852 890.288 542.97 907.607 404.796Z'

const randomness = 120
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

export const Ellipse3 = (props: SVGProps<SVGSVGElement>) => {
  const [d, setD] = useState(originalPath)

  useEffect(() => {
    const interval = setInterval(() => {
      setD(generateRandomPath())
    }, 4000) // Change shape every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    // @ts-expect-error 임시 조치
    <motion.svg
      width="991"
      height="691"
      viewBox="0 0 991 691"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      initial={false}
      animate={{
        x: [10, -20, 10],
        y: [-15, 15, -15],
        scale: 1
      }}
      transition={{
        x: {
          duration: 28,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        },
        y: {
          duration: 35,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }
      }}
    >
      <g filter="url(#filter0_f_471_22739)">
        <g clipPath="url(#clip_path_3)">
          <g transform="matrix(-0.1445 -0.6845 -1.45653 0.285315 873.645 318)">
            <foreignObject
              x="-680.601"
              y="-680.601"
              width="1361.2"
              height="1361.2"
            >
              <svg
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  background:
                    'conic-gradient(from 90deg,rgba(28, 194, 255, 1) 0deg,rgba(41, 105, 255, 1) 182.793deg,rgba(0, 65, 216, 0.5) 360deg)',
                  height: '100%',
                  width: '100%',
                  opacity: '0.7'
                }}
              />
            </foreignObject>
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_471_22739"
          x="0"
          y="-36.8174"
          width="990.451"
          height="727.466"
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
            result="effect1_foregroundBlur_471_22739"
          />
        </filter>
        <clipPath id="clip_path_3">
          <motion.path
            animate={{ d }}
            transition={{ duration: 3.5, ease: 'easeInOut' }}
          />
        </clipPath>
      </defs>
    </motion.svg>
  )
}
