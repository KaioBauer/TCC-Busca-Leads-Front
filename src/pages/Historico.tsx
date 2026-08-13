import { useEffect, useState } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { getExecucoes } from '../services/leadService'
import { formatarDataRelativa } from '../utils/data'
import EmptyState from '../components/EmptyState'
import type { Execucao } from '../types'

const STATUS_CLASSNAME: Record<Execucao['status'], string> = {
  concluido: 'text-success bg-success/10',
  processando: 'text-amber bg-amber/10',
  erro: 'text-red-600 bg-red-50',
}

const STATUS_LABEL: Record<Execucao['status'], string> = {
  concluido: 'Concluído',
  processando: 'Processando',
  erro: 'Erro',
}

export default function Historico() {
  const [execucoes, setExecucoes] = useState<Execucao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    getExecucoes()
      .then(setExecucoes)
      .catch((err) => setErro(err instanceof Error ? err.message : 'Erro ao carregar histórico.'))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-ink dark:text-white">Histórico de execuções</h1>
        <p className="text-sm text-ink-soft">Todas as execuções, com data, ICP e resultados.</p>
      </div>

      {erro && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertTriangle size={16} />
          {erro}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card dark:border-slate-700 dark:bg-slate-900">
        {carregando ? (
          <div className="flex flex-col gap-2 p-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : execucoes.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Clock} title="Nenhuma execução registrada" subtitle="O histórico aparecerá aqui após sua primeira busca." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-soft dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Data</th>
                  <th className="px-5 py-3 font-medium">ICP</th>
                  <th className="px-5 py-3 font-medium">Leads</th>
                  <th className="px-5 py-3 font-medium">SQL</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-800">
                {execucoes.map((execucao) => (
                  <tr key={execucao.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-ink-soft">{formatarDataRelativa(execucao.criado_em)}</td>
                    <td className="max-w-md truncate px-5 py-3 text-ink dark:text-white">{execucao.icp}</td>
                    <td className="px-5 py-3 text-ink-soft">{execucao.total_leads}</td>
                    <td className="px-5 py-3 font-medium text-success">{execucao.total_sql}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSNAME[execucao.status]}`}>
                        {STATUS_LABEL[execucao.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
