import { useCallback, useEffect, useState } from 'react'
import { Users, CheckCircle2, Target, Gauge, Download, Search, SlidersHorizontal, AlertTriangle, Inbox } from 'lucide-react'
import SearchPanel from '../components/SearchPanel'
import MetricCard from '../components/MetricCard'
import LeadCard from '../components/LeadCard'
import ExecutionList from '../components/ExecutionList'
import EmptyState from '../components/EmptyState'
import { getExecucoes, getLeadsByExecucao, getMetricas, exportarLeadsCsv } from '../services/leadService'
import { calcularTendencia } from '../utils/metrics'
import type { Execucao, Lead } from '../types'

type FiltroTier = 'todos' | 'sql' | 'mql'

export default function Dashboard() {
  const [execucoes, setExecucoes] = useState<Execucao[]>([])
  const [execucaoSelecionada, setExecucaoSelecionada] = useState<Execucao | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [carregandoExecucoes, setCarregandoExecucoes] = useState(true)
  const [carregandoLeads, setCarregandoLeads] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [filtroTier, setFiltroTier] = useState<FiltroTier>('todos')
  const [ordenarPorScoreAsc, setOrdenarPorScoreAsc] = useState(false)
  const [busca, setBusca] = useState('')

  const carregarLeads = useCallback(async (execucaoId: string) => {
    setCarregandoLeads(true)
    try {
      const dados = await getLeadsByExecucao(execucaoId)
      setLeads(dados)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar leads.')
    } finally {
      setCarregandoLeads(false)
    }
  }, [])

  const carregarExecucoes = useCallback(
    async (manterSelecao = true) => {
      setCarregandoExecucoes(true)
      try {
        const dados = await getExecucoes()
        setExecucoes(dados)

        if (dados.length > 0) {
          const atual = manterSelecao ? dados.find((e) => e.id === execucaoSelecionada?.id) : undefined
          const alvo = atual ?? dados[0]
          setExecucaoSelecionada(alvo)
          await carregarLeads(alvo.id)
        } else {
          setExecucaoSelecionada(null)
          setLeads([])
        }
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar execuções.')
      } finally {
        setCarregandoExecucoes(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [carregarLeads]
  )

  useEffect(() => {
    carregarExecucoes(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Enquanto a execução selecionada estiver "processando", o n8n ainda está
  // gravando leads no Supabase — fazemos polling leve para refletir o progresso.
  useEffect(() => {
    if (execucaoSelecionada?.status !== 'processando') return
    const intervalo = setInterval(() => carregarExecucoes(true), 5000)
    return () => clearInterval(intervalo)
  }, [execucaoSelecionada?.status, carregarExecucoes])

  async function handleSelecionarExecucao(execucao: Execucao) {
    setExecucaoSelecionada(execucao)
    await carregarLeads(execucao.id)
  }

  async function handleBuscaIniciada() {
    await carregarExecucoes(false)
  }

  const metricas =
    leads.length > 0
      ? getMetricas(leads)
      : {
          totalLeads: execucaoSelecionada?.total_leads ?? 0,
          totalSql: execucaoSelecionada?.total_sql ?? 0,
          totalMql: (execucaoSelecionada?.total_leads ?? 0) - (execucaoSelecionada?.total_sql ?? 0),
          scoreMedio: 0,
        }

  const pctSql = metricas.totalLeads ? Math.round((metricas.totalSql / metricas.totalLeads) * 100) : 0
  const pctMql = metricas.totalLeads ? Math.round((metricas.totalMql / metricas.totalLeads) * 100) : 0

  const scoresCronologicos = [...leads]
    .sort((a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime())
    .map((l) => l.score ?? 0)
  const tendencia = calcularTendencia(scoresCronologicos)

  const leadsFiltrados = leads
    .filter((lead) => {
      const score = lead.score ?? 0
      if (filtroTier === 'sql') return Boolean(lead.qualificado) || lead.tier === 'SQL' || score >= 70
      if (filtroTier === 'mql') return !(lead.qualificado || lead.tier === 'SQL') && score < 70
      return true
    })
    .filter((lead) => {
      if (!busca.trim()) return true
      const termo = busca.toLowerCase()
      return (lead.empresa ?? '').toLowerCase().includes(termo) || (lead.cidade ?? '').toLowerCase().includes(termo)
    })
    .sort((a, b) => (ordenarPorScoreAsc ? (a.score ?? 0) - (b.score ?? 0) : (b.score ?? 0) - (a.score ?? 0)))

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
      <div className="flex flex-col gap-6 xl:col-span-3">
        <SearchPanel onBuscaIniciada={handleBuscaIniciada} />

        {erro && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <AlertTriangle size={16} />
            {erro}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            iconBg="bg-slate-100 dark:bg-slate-800"
            iconColor="text-ink-soft"
            value={metricas.totalLeads}
            label="Leads processados"
            subtext="última execução"
          />
          <MetricCard
            icon={CheckCircle2}
            iconBg="bg-success/10"
            iconColor="text-success"
            value={metricas.totalSql}
            label="Qualificados (SQL)"
            subtext={`${pctSql}% do total`}
            badge={{ text: `${pctSql}%`, tone: 'success' }}
          />
          <MetricCard
            icon={Target}
            iconBg="bg-amber/10"
            iconColor="text-amber"
            value={metricas.totalMql}
            label="Em nutrição (MQL)"
            subtext={`${pctMql}% do total`}
            badge={{ text: `${pctMql}%`, tone: 'amber' }}
          />
          <MetricCard
            icon={Gauge}
            iconBg="bg-teal-bg dark:bg-teal/10"
            iconColor="text-teal"
            value={metricas.scoreMedio}
            label="Pontuação média"
            sparklineData={scoresCronologicos.length > 1 ? scoresCronologicos : undefined}
            trend={tendencia ?? undefined}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-ink dark:text-white">Resultados da última execução</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-ink-soft dark:bg-slate-800">
                {leads.length} leads
              </span>
            </div>
            <button
              onClick={() => exportarLeadsCsv(leads)}
              disabled={leads.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Download size={14} />
              Exportar CSV
            </button>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(
                [
                  { key: 'todos', label: 'Todos' },
                  { key: 'sql', label: 'SQL' },
                  { key: 'mql', label: 'MQL' },
                ] as { key: FiltroTier; label: string }[]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFiltroTier(key)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filtroTier === key
                      ? 'bg-teal-bg text-teal dark:bg-teal/20 dark:text-teal-light'
                      : 'text-ink-soft hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setOrdenarPorScoreAsc((v) => !v)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  ordenarPorScoreAsc
                    ? 'bg-teal-bg text-teal dark:bg-teal/20 dark:text-teal-light'
                    : 'text-ink-soft hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal size={13} />
                Por score
              </button>
            </div>

            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou empresa..."
                className="w-64 rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {carregandoLeads ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : execucoes.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Faça sua primeira busca"
              subtitle="Use o formulário acima para descrever seu cliente ideal e iniciar a coleta de leads."
            />
          ) : leadsFiltrados.length === 0 ? (
            <EmptyState icon={Search} title="Nenhum lead encontrado" subtitle="Ajuste os filtros ou o termo de busca." />
          ) : (
            <div className="flex flex-col gap-3">
              {leadsFiltrados.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="xl:col-span-1">
        <ExecutionList
          execucoes={execucoes}
          execucaoSelecionadaId={execucaoSelecionada?.id ?? null}
          onSelecionar={handleSelecionarExecucao}
          carregando={carregandoExecucoes}
        />
      </div>
    </div>
  )
}
