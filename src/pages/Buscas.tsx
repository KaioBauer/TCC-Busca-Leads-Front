import { useEffect, useState } from 'react'
import { Search, CheckCircle2, Loader2, AlertCircle, AlertTriangle } from 'lucide-react'
import { getExecucoes } from '../services/leadService'
import { formatarDataRelativa } from '../utils/data'
import EmptyState from '../components/EmptyState'
import type { Execucao } from '../types'

const STATUS_INFO: Record<Execucao['status'], { label: string; className: string; icon: typeof CheckCircle2 }> = {
  concluido: { label: 'Concluído', className: 'text-success bg-success/10', icon: CheckCircle2 },
  processando: { label: 'Processando', className: 'text-amber bg-amber/10', icon: Loader2 },
  erro: { label: 'Erro', className: 'text-red-600 bg-red-50', icon: AlertCircle },
}

export default function Buscas() {
  const [execucoes, setExecucoes] = useState<Execucao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    getExecucoes()
      .then(setExecucoes)
      .catch((err) => setErro(err instanceof Error ? err.message : 'Erro ao carregar buscas.'))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-ink dark:text-white">Buscas salvas</h1>
        <p className="text-sm text-ink-soft">Todas as buscas de leads disparadas por você.</p>
      </div>

      {erro && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertTriangle size={16} />
          {erro}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : execucoes.length === 0 ? (
          <EmptyState icon={Search} title="Nenhuma busca ainda" subtitle="Vá até o Dashboard e inicie sua primeira busca de leads." />
        ) : (
          <div className="flex flex-col divide-y divide-border dark:divide-slate-800">
            {execucoes.map((execucao) => {
              const status = STATUS_INFO[execucao.status]
              const StatusIcon = status.icon
              return (
                <div key={execucao.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink dark:text-white">{execucao.icp}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {execucao.setor} · {execucao.regiao} · {execucao.cargo} · {formatarDataRelativa(execucao.criado_em)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-sm text-ink-soft">{execucao.total_leads} leads</span>
                    <span className="text-sm font-medium text-success">{execucao.total_sql} SQL</span>
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                      <StatusIcon size={12} className={execucao.status === 'processando' ? 'animate-spin' : ''} />
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
