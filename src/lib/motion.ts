// Helper function to generate a natural-looking blob path
export const generateNaturalBlobPath = (options: {
  xRadius: number
  yRadius: number
  numPoints: number
  randomness: number
  seed: number
  pullPoint?: { x: number; y: number } | null
}): string => {
  const { xRadius, yRadius, numPoints, randomness, seed, pullPoint } = options
  type Point = { x: number; y: number }
  const points: Point[] = []
  const angleStep = (Math.PI * 2) / numPoints
  let currentSeed = seed
  const centerX = xRadius
  const centerY = yRadius

  const seededRandom = () => {
    const x = Math.sin(currentSeed++) * 10000
    return x - Math.floor(x)
  }

  const pullAngle = pullPoint
    ? Math.atan2(pullPoint.y - centerY, pullPoint.x - centerX)
    : null
  const pullDistance = pullPoint
    ? Math.min(
        Math.sqrt(
          Math.pow(pullPoint.x - centerX, 2) +
            Math.pow(pullPoint.y - centerY, 2)
        ),
        Math.max(xRadius, yRadius) * 1.5
      )
    : 0

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep
    let pointXRadius = xRadius + (seededRandom() - 0.5) * randomness
    let pointYRadius = yRadius + (seededRandom() - 0.5) * randomness

    if (pullAngle !== null) {
      let angleDiff = Math.abs(angle - pullAngle)
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff
      }
      const pullFactor = 1 - Math.min(angleDiff / (Math.PI / 2), 1)
      if (pullFactor > 0) {
        const pullX = pullDistance * Math.pow(pullFactor, 2) * 0.5
        const pullY = pullDistance * Math.pow(pullFactor, 2) * 0.5
        pointXRadius += pullX
        pointYRadius += pullY
      }
    }

    points.push({
      x: centerX + pointXRadius * Math.cos(angle),
      y: centerY + pointYRadius * Math.sin(angle)
    })
  }

  const smoothing = 0.2
  const line = (pointA: Point, pointB: Point) => {
    const lengthX = pointB.x - pointA.x
    const lengthY = pointB.y - pointA.y
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }

  const controlPoint = (
    current: Point,
    previous: Point | undefined,
    next: Point | undefined,
    reverse?: boolean
  ): [number, number] => {
    const p = previous || current
    const n = next || current
    const l = line(p, n)
    const angle = l.angle + (reverse ? Math.PI : 0)
    const length = l.length * smoothing
    const x = current.x + Math.cos(angle) * length
    const y = current.y + Math.sin(angle) * length
    return [x, y]
  }

  const pathParts = points.map((point, i) => {
    const prev = points[i - 1]
    const next = points[i + 1]
    if (i === 0) {
      return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    }
    const [cp1x, cp1y] = controlPoint(prev, points[i - 2], point)
    const [cp2x, cp2y] = controlPoint(point, prev, next, true)
    return `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(
      2
    )},${cp2y.toFixed(2)} ${point.x.toFixed(2)},${point.y.toFixed(2)}`
  })

  const lastPoint = points[points.length - 1]
  const firstPoint = points[0]
  const [cp1x, cp1y] = controlPoint(
    lastPoint,
    points[points.length - 2],
    firstPoint
  )
  const [cp2x, cp2y] = controlPoint(firstPoint, lastPoint, points[1], true)
  pathParts.push(
    `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(
      2
    )} ${firstPoint.x.toFixed(2)},${firstPoint.y.toFixed(2)}`
  )

  return pathParts.join(' ')
}
