export function calcularTendencia(scores: number[]): string | null {
  if (scores.length < 4) return null

  const metade = Math.floor(scores.length / 2)
  const mediaAnterior = media(scores.slice(0, metade))
  const mediaRecente = media(scores.slice(metade))

  if (mediaAnterior === 0) return null

  const variacao = ((mediaRecente - mediaAnterior) / mediaAnterior) * 100
  const sinal = variacao >= 0 ? '+' : ''
  return `${variacao >= 0 ? '↗' : '↘'} ${sinal}${variacao.toFixed(1).replace('.', ',')}%`
}

function media(valores: number[]): number {
  if (!valores.length) return 0
  return valores.reduce((soma, v) => soma + v, 0) / valores.length
}
