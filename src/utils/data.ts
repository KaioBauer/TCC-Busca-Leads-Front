const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function formatarDataRelativa(iso: string): string {
  const data = new Date(iso)
  const agora = new Date()

  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const mesmodia = data.toDateString() === agora.toDateString()
  if (mesmodia) return `Hoje, ${horaFormatada}`

  const ontem = new Date(agora)
  ontem.setDate(agora.getDate() - 1)
  if (data.toDateString() === ontem.toDateString()) return `Ontem, ${horaFormatada}`

  return `${String(data.getDate()).padStart(2, '0')} ${MESES[data.getMonth()]}, ${horaFormatada}`
}
