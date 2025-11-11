import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

const chartData = [
  { date: '2025-09-01', value: 186 },
  { date: '2025-09-02', value: 305 },
  { date: '2025-09-03', value: 237 },
  { date: '2025-09-04', value: 73 },
  { date: '2025-09-05', value: 209 },
  { date: '2025-09-06', value: 214 },
  { date: '2025-09-07', value: 240 }
]

const chartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-shady-lane)'
  }
} satisfies ChartConfig

export default function AreaChartGradient() {
  const [activeX, setActiveX] = useState<string | null>(null)

  return (
    <Card className="bg-pastel-gradient">
      <CardHeader>
        <CardTitle>Area Chart - Gradient</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setActiveX(state.activeLabel ?? null) // x축 값 (date)
              }
            }}
            onMouseLeave={() => setActiveX(null)}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd" // 첫 번째와 마지막 tick 보존
              tickFormatter={(value: string) => {
                const [, month, day] = value.split('-') // ['2025', '08', '01']
                return `${month}.${day}` // '0801'
              }}
            />
            <YAxis
              tickLine={false}
              stroke="var(--chart-shady-lane)"
              tickMargin={5}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  hideIndicator
                  chartType="areaChart"
                  chartData={chartData}
                />
              }
            />
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <defs>
              <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="5%" stopColor="#fff" />
                <stop
                  offset="80%"
                  stopOpacity={0.5}
                  stopColor="var(--chart-shady-lane)"
                />
              </radialGradient>
            </defs>

            {/* 호버 중일 때만 세로 라인 */}
            <ReferenceLine
              x={activeX ?? ''}
              stroke="#bbb"
              strokeDasharray="3 3"
            />

            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
              activeDot={{
                r: 7,
                fill: 'url(#dotGradient)'
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this date <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
