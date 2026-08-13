export type StatusExecucao = 'processando' | 'concluido' | 'erro'

export interface Execucao {
  id: string
  user_id: string
  icp: string
  setor: string
  regiao: string
  cargo: string
  quantidade: number
  score_minimo: number
  status: StatusExecucao
  total_leads: number
  total_sql: number
  criado_em: string
}

export interface Lead {
  id: string
  execucao_id: string
  empresa: string
  cidade: string | null
  uf: string | null
  nota: number | null
  avaliacoes: number | null
  website: boolean | null
  score: number | null
  tier: 'SQL' | 'MQL' | string | null
  qualificado: boolean | null
  justificativa: string | null
  criado_em: string
}

export interface Metricas {
  totalLeads: number
  totalSql: number
  totalMql: number
  scoreMedio: number
}

export interface NovaBuscaParams {
  icp: string
  setor: string
  regiao: string
  cargo: string
  quantidade: number
  scoreMinimo: number
  user_id: string
}

export interface PerfilUsuario {
  id: string
  nome: string
  email: string
  plano: string
}
