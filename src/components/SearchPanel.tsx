import { useState, type CSSProperties } from 'react'
import { Sparkles, Building2, Globe2, Briefcase, Zap, Clock, Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { iniciarBusca } from '../services/leadService'
import type { NovaBuscaParams } from '../types'

const SETORES = ['Tecnologia', 'SaaS', 'Indústria', 'Varejo', 'Financeiro', 'Saúde', 'Educação']
const REGIOES = ['Brasil', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte']
const CARGOS = ['Diretor / C-Level', 'Gerente', 'Coordenador', 'Head', 'Analista Sênior']

interface SearchPanelProps {
  onBuscaIniciada: () => void
}

export default function SearchPanel({ onBuscaIniciada }: SearchPanelProps) {
  const { user } = useAuth()

  const [icp, setIcp] = useState('Diretores de TI em empresas de tecnologia com mais de 50 funcionários no Brasil')
  const [setor, setSetor] = useState('Tecnologia')
  const [regiao, setRegiao] = useState('Brasil')
  const [cargo, setCargo] = useState('Diretor / C-Level')
  const [quantidade, setQuantidade] = useState(40)
  const [scoreMinimo, setScoreMinimo] = useState(60)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleIniciarBusca() {
    if (!user) return
    setErro(null)
    setEnviando(true)

    const params: NovaBuscaParams = {
      icp,
      setor,
      regiao,
      cargo,
      quantidade,
      scoreMinimo,
      user_id: user.id,
    }

    try {
      await iniciarBusca(params)
      onBuscaIniciada()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível iniciar a busca.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-teal-light to-teal" />

      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-bg text-teal dark:bg-teal/10">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-bold text-ink dark:text-white">Nova busca de leads</h2>
            <p className="text-sm text-ink-soft">Descreva seu cliente ideal e deixe o agente coletar e qualificar.</p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Agente pronto
        </span>
      </div>

      {erro && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {erro}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">
          Perfil de cliente ideal (ICP)
        </label>
        <textarea
          value={icp}
          onChange={(e) => setIcp(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="mb-5 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">Setor</label>
          <div className="relative">
            <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <select
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {SETORES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">Região</label>
          <div className="relative">
            <Globe2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <select
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {REGIOES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">Cargo-alvo</label>
          <div className="relative">
            <Briefcase size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {CARGOS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-8">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-ink dark:text-slate-200">Quantidade de leads</label>
            <span className="text-sm font-bold text-ink dark:text-white">{quantidade} leads</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            style={{ '--range-progress': `${quantidade}%` } as CSSProperties}
            className="w-full"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-ink dark:text-slate-200">Pontuação mínima desejada</label>
            <span className="text-sm font-bold text-teal">{scoreMinimo} pts</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={scoreMinimo}
            onChange={(e) => setScoreMinimo(Number(e.target.value))}
            style={{ '--range-progress': `${scoreMinimo}%` } as CSSProperties}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleIniciarBusca}
          disabled={enviando}
          className="flex items-center gap-2 rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-light disabled:opacity-60"
        >
          {enviando ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" strokeWidth={0} />}
          {enviando ? 'Coletando e qualificando...' : 'Iniciar busca'}
        </button>
        <span className="flex items-center gap-1.5 text-sm text-ink-soft">
          <Clock size={14} />
          Tempo estimado: ~ 2 min
        </span>
      </div>
    </div>
  )
}
