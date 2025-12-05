import React, { useRef, useEffect } from 'react'

/* ===========================
   Types & Constants
=========================== */

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
      { offset: 0, color: 'rgba(48, 153, 249, 0.7)' },
      { offset: 1, color: 'rgba(109, 118, 233, 0.2)' }
    ]
  },
  {
    type: 'linear',
    angle: 45,
    stops: [
      { offset: 0, color: 'rgba(28, 195, 255, 0.4)' },
      { offset: 0.8, color: 'rgba(41, 106, 255, 0.7)' },
      { offset: 0.9, color: 'rgba(0, 65, 216, 0.05)' }
    ]
  },
  {
    type: 'linear',
    angle: 180,
    stops: [
      { offset: 0.3, color: 'rgba(26, 132, 252, 0.7)' },
      { offset: 0.6, color: 'rgba(85, 138, 255, 0.7)' },
      { offset: 0.9, color: 'rgba(56, 167, 252, 0.3)' }
    ]
  }
]

type MouseRef = React.RefObject<{ x: number | null; y: number | null }>

/* ===========================
   Node (orbiting particle)
=========================== */

class Node {
  parent: Blob
  angle: number
  distance: number
  orbitalSpeed: number

  radius: number
  pulseSpeed: number
  pulseAmount: number
  pulsePhase: number
  currentRadius: number

  x = 0
  y = 0

  constructor(parent: Blob) {
    this.parent = parent

    this.angle = Math.random() * Math.PI * 2
    this.distance = Math.random() * parent.baseRadius * 0.4

    // Node 공전 속도
    this.orbitalSpeed = (Math.random() - 0.5) * 0.003

    this.radius = parent.baseRadius * 0.6

    // Node 사이즈 변화
    this.pulseSpeed = Math.random() * 0.008 + 0.004
    this.pulseAmount = this.radius * 0.08

    this.pulsePhase = Math.random() * Math.PI * 2
    this.currentRadius = this.radius
  }

  update() {
    this.angle += this.orbitalSpeed
    this.pulsePhase += this.pulseSpeed

    this.currentRadius =
      this.radius + Math.sin(this.pulsePhase) * this.pulseAmount

    this.x = this.parent.x + Math.cos(this.angle) * this.distance
    this.y = this.parent.y + Math.sin(this.angle) * this.distance
  }

  draw(ctx: CanvasRenderingContext2D, preset: GradientPreset) {
    ctx.beginPath()

    let gradient: CanvasGradient

    if (preset.type === 'linear' && preset.angle !== undefined) {
      const rad = (preset.angle * Math.PI) / 180
      const x0 = this.x - Math.cos(rad) * this.currentRadius
      const y0 = this.y - Math.sin(rad) * this.currentRadius
      const x1 = this.x + Math.cos(rad) * this.currentRadius
      const y1 = this.y + Math.sin(rad) * this.currentRadius
      gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    } else {
      gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.currentRadius
      )
    }

    preset.stops.forEach((stop) =>
      gradient.addColorStop(stop.offset, stop.color)
    )

    ctx.fillStyle = gradient
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2)
    ctx.fill()
  }
}

/* ===========================
   Blob (metaball container)
=========================== */

class Blob {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number

  canvasWidth: number
  canvasHeight: number
  mouse: MouseRef
  preset: GradientPreset
  nodes: Node[]

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    mouse: MouseRef,
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
    // Blob 이동 속도
    this.vx = (Math.random() - 0.5) * 0.03
    this.vy = (Math.random() - 0.5) * 0.03

    this.baseRadius = Math.min(canvasWidth, canvasHeight) / 2
    this.nodes = [new Node(this), new Node(this), new Node(this)]
  }

  update() {
    this.move()
    this.handleWallCollision()
    this.handleMouseRepel()
    this.nodes.forEach((node) => node.update())
  }

  private move() {
    this.x += this.vx
    this.y += this.vy
  }

  private handleWallCollision() {
    const r = this.baseRadius
    if (this.x + r > this.canvasWidth || this.x - r < 0) this.vx *= -1
    if (this.y + r > this.canvasHeight || this.y - r < 0) this.vy *= -1
  }

  private handleMouseRepel() {
    const mouse = this.mouse.current
    if (!mouse?.x || !mouse?.y) return

    const dx = this.x - mouse.x
    const dy = this.y - mouse.y
    const dist = Math.hypot(dx, dy)

    if (dist < this.baseRadius) {
      const force = (this.baseRadius - dist) / this.baseRadius
      // Mouse 반발
      this.x += (dx / dist) * force * 0.8
      this.y += (dy / dist) * force * 0.8
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.nodes.forEach((node) => node.draw(ctx, this.preset))
  }
}

/* ===========================
   Canvas Component
=========================== */

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

    ctx.filter = 'blur(40px)' // ✅ 매 프레임 설정 제거

    let blobs: Blob[] = []
    let animationFrameId: number

    /* -------- Mouse -------- */

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const handleMouseOut = () => {
      mouse.current.x = null
      mouse.current.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)

    /* -------- Resize -------- */

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

    /* -------- Animation -------- */

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = 'blur(40px)'

      blobs.forEach((blob) => {
        blob.update()
        blob.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    /* -------- Cleanup -------- */

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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: 0.8
      }}
    />
  )
}
