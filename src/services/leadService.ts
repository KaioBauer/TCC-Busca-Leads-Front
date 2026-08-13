import { supabase } from './supabase'
import type { Execucao, Lead, Metricas, NovaBuscaParams } from '../types'

/**
 * Dispara a busca de leads no fluxo n8n. O n8n é responsável por coletar,
 * qualificar e gravar os resultados diretamente nas tabelas `execucoes` e
 * `leads` do Supabase — o front apenas dispara o webhook e, em seguida,
 * volta a consultar o Supabase para acompanhar o progresso.
 *
 * // TODO: quando o fluxo n8n estiver publicado, VITE_N8N_WEBHOOK_URL e
 * // VITE_N8N_API_KEY devem apontar para o webhook real de produção.
 */
export async function iniciarBusca(params: NovaBuscaParams): Promise<void> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
  const apiKey = import.meta.env.VITE_N8N_API_KEY

  if (!webhookUrl) {
    throw new Error('VITE_N8N_WEBHOOK_URL não configurada no .env')
  }

  const resposta = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey ?? '',
    },
    body: JSON.stringify(params),
  })

  if (!resposta.ok) {
    throw new Error(`Falha ao iniciar a busca (HTTP ${resposta.status})`)
  }

  // Não aguardamos o processamento terminar: o n8n grava em `execucoes` e
  // `leads` de forma assíncrona. O front deve recarregar a lista de
  // execuções logo em seguida para exibir o novo registro (status "processando").
}

export async function getExecucoes(): Promise<Execucao[]> {
  const { data, error } = await supabase
    .from('execucoes')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getExecucaoById(execucaoId: string): Promise<Execucao | null> {
  const { data, error } = await supabase
    .from('execucoes')
    .select('*')
    .eq('id', execucaoId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function getLeadsByExecucao(execucaoId: string): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('execucao_id', execucaoId)
    .order('score', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export function getMetricas(leads: Lead[]): Metricas {
  const totalLeads = leads.length
  const totalSql = leads.filter((lead) => Boolean(lead.qualificado) || lead.tier === 'SQL' || (lead.score ?? 0) >= 70).length
  const totalMql = totalLeads - totalSql
  const scoreMedio = totalLeads
    ? Math.round(leads.reduce((soma, lead) => soma + (lead.score ?? 0), 0) / totalLeads)
    : 0

  return { totalLeads, totalSql, totalMql, scoreMedio }
}

export function exportarLeadsCsv(leads: Lead[], nomeArquivo = 'leads.csv'): void {
  const cabecalho = ['Empresa', 'Cidade', 'UF', 'Nota', 'Avaliações', 'Website', 'Score', 'Tier', 'Justificativa']
  const linhas = leads.map((lead) => [
    lead.empresa ?? '',
    lead.cidade ?? '',
    lead.uf ?? '',
    lead.nota ?? '',
    lead.avaliacoes ?? '',
    lead.website ? 'Sim' : 'Não',
    lead.score ?? '',
    lead.tier ?? '',
    `"${(lead.justificativa ?? '').replace(/"/g, '""')}"`,
  ])

  const csv = [cabecalho, ...linhas].map((linha) => linha.join(';')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  link.click()
  URL.revokeObjectURL(url)
}
