import React, { useRef, useEffect } from 'react'

// --- Perlin Noise utility ---
// This is a simplified Perlin noise implementation for 2D noise.
const PerlinNoise = (() => {
  const p = new Uint8Array(512)
  for (let i = 0; i < 256; i++)
    p[i] = p[i + 256] = Math.floor(Math.random() * 256)

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (t: number, a: number, b: number) => a + t * (b - a)
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return {
    noise: (x: number, y: number) => {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255
      x -= Math.floor(x)
      y -= Math.floor(y)
      const u = fade(x)
      const v = fade(y)
      const a = p[X] + Y,
        aa = p[a],
        ab = p[a + 1]
      const b = p[X + 1] + Y,
        ba = p[b],
        bb = p[b + 1]

      return lerp(
        v,
        lerp(u, grad(p[aa], x, y), grad(p[ba], x - 1, y)),
        lerp(u, grad(p[ab], x, y - 1), grad(p[bb], x - 1, y - 1))
      )
    }
  }
})()

type GradientStop = { offset: number; color: string }
type GradientPreset = {
  type: 'linear' | 'radial'
  angle?: number
  stops: GradientStop[]
}

const gradientPresets: GradientPreset[] = [
  {
    type: 'linear',
    angle: 45,
    stops: [
      { offset: 0, color: 'rgba(48, 153, 249, 0.70)' },
      { offset: 1, color: 'rgba(109, 118, 233, 0.27)' }
    ]
  },
  {
    type: 'linear',
    angle: 45,
    stops: [
      { offset: 0, color: 'rgba(28, 195, 255, 0.70)' },
      { offset: 0.9, color: 'rgba(41, 106, 255, 0.70)' },
      { offset: 1, color: 'rgba(0, 65, 216, 0.35)' }
    ]
  },
  {
    type: 'linear',
    angle: 180,
    stops: [
      { offset: 0.3, color: 'rgba(26, 132, 252, 0.70)' },
      { offset: 0.6, color: 'rgba(85, 138, 255, 0.70)' },
      { offset: 1, color: 'rgba(56, 167, 252, 0.35)' }
    ]
  }
]

class Blob {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  radius: number
  preset: GradientPreset
  canvasWidth: number
  canvasHeight: number
  mouse: React.RefObject<{ x: number | null; y: number | null }>

  // For amorphous shape
  numVertices: number
  vertices: { x: number; y: number }[]
  noiseTime: number
  noiseStep: number

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    mouse: React.RefObject<{ x: number | null; y: number | null }>,
    preset: GradientPreset,
    initialX: number,
    initialY: number
  ) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.mouse = mouse
    this.preset = preset
    this.x = initialX
    this.y = initialY
    this.vx = (Math.random() - 0.5) * 0.2 // 수평 속도
    this.vy = (Math.random() - 0.5) * 0.2 // 수직 속도
    this.baseRadius = Math.min(canvasWidth, canvasHeight) / 2.5
    this.radius = this.baseRadius

    this.numVertices = 20
    this.vertices = []
    this.noiseTime = Math.random() * 1000
    this.noiseStep = 0.005
  }

  update() {
    // Reduced overall size pulsation
    const pulseAmount = this.baseRadius * 0.08
    this.radius = this.baseRadius + Math.sin(this.noiseTime * 0.5) * pulseAmount

    // Update main position
    this.x += this.vx
    this.y += this.vy
    if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0)
      this.vx *= -1
    if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0)
      this.vy *= -1

    // Mouse interaction
    if (this.mouse.current?.x !== null && this.mouse.current?.y !== null) {
      const dx = this.x - this.mouse.current.x
      const dy = this.y - this.mouse.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < this.radius) {
        const force = (this.radius - distance) / this.radius
        this.x += (dx / distance) * force * 2
        this.y += (dy / distance) * force * 2
      }
    }

    // Update vertices for the amorphous shape
    this.noiseTime += this.noiseStep
    for (let i = 0; i < this.numVertices; i++) {
      const angle = (i / this.numVertices) * Math.PI * 2
      const noiseValue = PerlinNoise.noise(
        Math.cos(angle) + this.noiseTime,
        Math.sin(angle) + this.noiseTime
      )
      const r = this.radius + noiseValue * this.radius * 0.1 // 20% bumpiness
      this.vertices[i] = {
        x: this.x + Math.cos(angle) * r,
        y: this.y + Math.sin(angle) * r
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Create gradient (centered on the blob)
    let gradient: CanvasGradient
    if (this.preset.type === 'linear' && this.preset.angle) {
      const angleRad = (this.preset.angle * Math.PI) / 180
      const x0 = this.x - Math.cos(angleRad) * this.radius
      const y0 = this.y - Math.sin(angleRad) * this.radius
      const x1 = this.x + Math.cos(angleRad) * this.radius
      const y1 = this.y + Math.sin(angleRad) * this.radius
      gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    } else {
      gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius
      )
    }
    this.preset.stops.forEach((stop) =>
      gradient.addColorStop(stop.offset, stop.color)
    )
    ctx.fillStyle = gradient

    // Draw the custom path
    ctx.beginPath()
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y)
    for (let i = 1; i < this.numVertices; i++) {
      const p1 = this.vertices[i]
      const p2 = this.vertices[(i + 1) % this.numVertices]
      const xc = (p1.x + p2.x) / 2
      const yc = (p1.y + p2.y) / 2
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc)
    }
    ctx.closePath()
    ctx.fill()
  }
}

export const CanvasBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let blobs: Blob[] = []
    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseOut = () => {
      mouse.current = { x: null, y: null }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const positions = [
        { x: canvas.width * 0.2, y: canvas.height * 0.4 },
        { x: canvas.width * 0.5, y: canvas.height * 0.6 },
        { x: canvas.width * 0.8, y: canvas.height * 0.5 }
      ]
      blobs = gradientPresets.map(
        (preset, index) =>
          new Blob(
            canvas.width,
            canvas.height,
            mouse,
            preset,
            positions[index].x,
            positions[index].y
          )
      )
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = 'blur(35px)'
      blobs.forEach((b) => {
        b.update()
        b.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    />
  )
}
