interface SparklineProps {
  data: number[]
  width?: number
  height?: number
}

export default function Sparkline({ data, width = 72, height = 28 }: SparklineProps) {
  if (data.length < 2) return <div style={{ width, height }} />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((valor, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((valor - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline points={points} stroke="#0D9488" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
