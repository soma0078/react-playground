import { motion } from 'framer-motion'
import ellipse1Url from '../../assets/ellipse_1.svg?raw'
import ellipse2Url from '../../assets/ellipse_2.svg?raw'
import ellipse3Url from '../../assets/ellipse_3.svg?raw'

const gradients = [
  {
    id: 1,
    url: ellipse1Url,
    style: { bottom: '0%', left: '-20%' },
    initial: { x: 0, y: 0, scale: 1 },
    animate: {
      x: [0, 40, -50, 0],
      y: [0, -15, 15, 0],
      scale: 1.1
    }
  },
  {
    id: 2,
    url: ellipse2Url,
    style: { bottom: '-5%', right: '-12%' },
    initial: { x: 0, y: 0, scale: 1, rotate: 0 },
    animate: {
      rotate: [0, -10, 0],
      x: [0, -25, 25, 0],
      y: [0, 20, -20, 0],
      scale: 0.9
    }
  },
  {
    id: 3,
    url: ellipse3Url,
    style: { top: '-15%', right: '5%' },
    initial: { x: 0, y: 0, scale: 0.9, rotate: 0 },
    animate: {
      rotate: [0, 10, 0],
      x: [0, 15, -10, 0],
      y: [0, -50, 10, 0],
      scale: 0.7
    }
  }
]

export function GradientBackground() {
  return (
    <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
      {gradients.map((gradient, index) => (
        <motion.div
          key={gradient.id}
          className="absolute h-full w-full blur-xs"
          style={{
            ...gradient.style,
            backgroundImage: `url("data:image/svg+xml;base64,${btoa(gradient.url)}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain'
          }}
          initial={gradient.initial}
          animate={gradient.animate}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: index * 2
          }}
        />
      ))}
    </div>
  )
}
