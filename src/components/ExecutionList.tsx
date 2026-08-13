import { Clock, ChevronsRight, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import type { Execucao } from '../types'
import { formatarDataRelativa } from '../utils/data'
import EmptyState from './EmptyState'

interface ExecutionListProps {
  execucoes: Execucao[]
  execucaoSelecionadaId: string | null
  onSelecionar: (execucao: Execucao) => void
  carregando: boolean
}

export default function ExecutionList({
  execucoes,
  execucaoSelecionadaId,
  onSelecionar,
  carregando,
}: ExecutionListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-ink-soft" />
          <h2 className="text-sm font-semibold text-ink dark:text-white">Últimas execuções</h2>
        </div>
        <button
          aria-label="Expandir"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronsRight size={15} />
        </button>
      </div>

      {carregando ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : execucoes.length === 0 ? (
        <EmptyState icon={Clock} title="Nenhuma execução ainda" subtitle="Faça sua primeira busca de leads." />
      ) : (
        <div className="flex flex-col gap-2">
          {execucoes.map((execucao) => {
            const selecionada = execucao.id === execucaoSelecionadaId
            const processando = execucao.status === 'processando'

            return (
              <button
                key={execucao.id}
                onClick={() => onSelecionar(execucao)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selecionada
                    ? 'border-teal bg-teal-bg dark:border-teal dark:bg-teal/10'
                    : 'border-border hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink dark:text-slate-200">
                    {formatarDataRelativa(execucao.criado_em)}
                  </span>
                  <span className="text-xs text-ink-soft">{execucao.total_leads} leads</span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs text-ink-soft">{execucao.icp}</p>

                <div className="mt-2 flex items-center justify-between">
                  {processando ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber">
                      <Loader2 size={12} className="animate-spin" />
                      processando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-success">
                      <CheckCircle2 size={12} />
                      {execucao.total_sql} SQL
                    </span>
                  )}
                  <ChevronRight size={14} className="text-ink-soft" />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
