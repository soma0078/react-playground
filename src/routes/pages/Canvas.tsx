import { useEffect, useRef } from 'react'
import Noise from '@/assets/Noise.svg?react'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 캔버스 크기를 윈도우에 맞춤
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class Blob {
      x: number
      y: number
      radius: number
      colors: (string | number)[]
      isConic: boolean
      isTriangle: boolean
      points: {
        angle: number
        distance: number
        speed: number
        targetDistance: number // 목표 거리 (자연스러운 복귀용)
      }[]
      time: number

      constructor(
        x: number,
        y: number,
        radius: number,
        colors: (string | number)[],
        isConic: boolean = false,
        isTriangle: boolean = false
      ) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colors = colors
        this.isConic = isConic
        this.isTriangle = isTriangle
        this.time = Math.random() * Math.PI * 2
        this.points = []

        const numPoints = isTriangle ? 6 : 8
        for (let i = 0; i < numPoints; i++) {
          this.points.push({
            angle: (Math.PI * 2 * i) / numPoints,
            distance: this.radius,
            speed: Math.random() * 0.02 + 0.01,
            targetDistance: this.radius
          })
        }
      }

      // 자체 애니메이션 업데이트 (morphing)
      update() {
        this.time += 0.015

        this.points.forEach((point, i) => {
          let morphing
          if (this.isTriangle) {
            // 세모 모양: 짝수 인덱스는 꼭지점, 홀수는 움푹
            if (i % 2 === 0) {
              morphing = Math.sin(this.time * 2 + point.angle * 3) * 50
            } else {
              morphing = Math.sin(this.time * 2 + point.angle * 3) * 15
            }
          } else {
            morphing = Math.sin(this.time * 2 + point.angle * 3) * 30
          }

          // targetDistance를 기본 형태로 설정
          point.targetDistance = this.radius + morphing

          // 현재 distance가 targetDistance로 부드럽게 복귀 (lerp)
          point.distance += (point.targetDistance - point.distance) * 0.07
        })
      }

      draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
        const vertices: { x: number; y: number }[] = []

        this.points.forEach((point) => {
          // 기본 위치 계산
          let px = this.x + Math.cos(point.angle) * point.distance
          let py = this.y + Math.sin(point.angle) * point.distance

          // 마우스와의 거리 계산
          const dx = mouseX - px
          const dy = mouseY - py
          const dist = Math.sqrt(dx * dx + dy * dy)

          // 마우스 인터랙션: 마우스 쪽으로만 늘어남
          if (dist < 300 && dist > 0) {
            // blob 중심에서 포인트로 향하는 방향
            const pointDx = px - this.x
            const pointDy = py - this.y

            // 내적으로 마우스 방향과 같은 쪽에 있는지 확인
            const dot =
              (dx * pointDx + dy * pointDy) /
              (dist * Math.sqrt(pointDx * pointDx + pointDy * pointDy))

            // 마우스 방향과 같은 쪽 포인트만 잡아당김
            if (dot > -0.2) {
              const force = (300 - dist) / 300
              const pullStrength = Math.pow(force, 0.3) * 120

              // 잡아당긴 위치 계산
              const pulledX = px + (dx / dist) * pullStrength
              const pulledY = py + (dy / dist) * pullStrength

              // 부드럽게 이동 (lerp)
              px += (pulledX - px) * 0.5
              py += (pulledY - py) * 0.5
            }
          }

          vertices.push({ x: px, y: py })
        })

        // 부드러운 곡선으로 blob 그리기
        ctx.beginPath()

        for (let i = 0; i < vertices.length; i++) {
          const current = vertices[i]
          const next = vertices[(i + 1) % vertices.length]

          if (i === 0) {
            ctx.moveTo(current.x, current.y)
          }

          const xc = (current.x + next.x) / 2
          const yc = (current.y + next.y) / 2
          ctx.quadraticCurveTo(current.x, current.y, xc, yc)
        }

        ctx.closePath()

        // Linear Gradient 생성 (45도 대각선)
        const gradient = ctx.createLinearGradient(
          this.x - this.radius,
          this.y - this.radius,
          this.x + this.radius,
          this.y + this.radius
        )

        // 요소별 gradient 색상 설정
        if (this.isConic) {
          // 요소 3: 3색 gradient
          gradient.addColorStop(0, this.colors[0] as string)
          gradient.addColorStop(0.5, this.colors[1] as string)
          gradient.addColorStop(1, this.colors[2] as string)
        } else if (
          this.colors.length === 3 &&
          typeof this.colors[2] === 'number'
        ) {
          // 요소 1: opacity 포함
          const color1 = this.colors[0] as string
          const color2 = this.colors[1] as string
          const opacity = this.colors[2] as number

          gradient.addColorStop(0, color1)

          // hex를 rgba로 변환
          const r = parseInt(color2.slice(1, 3), 16)
          const g = parseInt(color2.slice(3, 5), 16)
          const b = parseInt(color2.slice(5, 7), 16)
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity})`)
        } else {
          // 요소 2: 일반 2색 gradient
          gradient.addColorStop(0, this.colors[0] as string)
          gradient.addColorStop(1, this.colors[1] as string)
        }

        ctx.fillStyle = gradient

        // blur와 shadow 효과 적용
        ctx.filter = 'blur(35px)'
        ctx.shadowBlur = 15
        ctx.shadowColor = this.colors[0] as string
        ctx.fill()

        ctx.filter = 'none'
        ctx.shadowBlur = 0
      }
    }

    // 3개의 blob 생성
    const blobs = [
      // 요소 1: 왼쪽 위 (세모 모양)
      new Blob(
        canvas.width * 0.15,
        canvas.height * 0.15,
        350,
        ['#3099F9', '#6D76E9', 0.38],
        false,
        true
      ),
      // 요소 2: 정중앙 (동그란 모양, 3색)
      new Blob(canvas.width * 0.5, canvas.height * 0.5, 300, [
        '#1CC2FF',
        '#2969FF',
        '#0041D8'
      ]),
      // 요소 3: 오른쪽 아래 (동그란 모양)
      new Blob(
        canvas.width * 0.85,
        canvas.height * 0.85,
        350,
        ['#1A84FC', '#558AFF', '#38A7FC'],
        true
      )
    ]

    // 마우스 이동 이벤트
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    // 마우스가 캔버스를 벗어날 때
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // 애니메이션 루프
    const animate = () => {
      // 배경 그라데이션 그리기
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, '#ADDEFC')
      bgGradient.addColorStop(1, '#AECDF9')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 모든 blob 업데이트 및 그리기
      blobs.forEach((blob) => {
        blob.update()
        blob.draw(ctx, mouseRef.current.x, mouseRef.current.y)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // 클린업
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-gradient-to-b from-[#ADDEFC] to-[#AECDF9]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-4">
        <h1 className="mb-6 text-center text-6xl font-bold text-white drop-shadow-2xl md:text-8xl">
          Welcome
        </h1>
      </div>{' '}
      <Noise
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  )
}
