import { Mail, Linkedin, MapPin, Star, Globe, Sparkles, ChevronRight } from 'lucide-react'
import type { Lead } from '../types'

function iniciaisEmpresa(empresa: string): string {
  const partes = empresa.trim().split(/\s+/)
  if (!partes[0]) return '--'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function LeadCard({ lead }: { lead: Lead }) {
  const score = lead.score ?? 0
  const empresa = lead.empresa || 'Empresa sem nome'
  const qualificado = Boolean(lead.qualificado) || lead.tier === 'SQL' || score >= 70
  const tierLabel = qualificado ? 'SQL' : 'MQL'

  return (
    <div className="rounded-xl border border-border p-4 transition hover:border-teal-light/50 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
            qualificado ? 'bg-teal-bg text-teal' : 'bg-amber/10 text-amber'
          }`}
        >
          <span className="text-lg font-bold leading-none">{score}</span>
          <span className="mt-0.5 text-[10px] font-semibold leading-none">{tierLabel}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-bg text-xs font-semibold text-teal dark:bg-teal/20">
                {iniciaisEmpresa(empresa)}
              </div>
              <div>
                <p className="font-semibold text-ink dark:text-white">{empresa}</p>
                <p className="text-sm text-ink-soft">
                  {lead.cidade ?? '—'} · {lead.uf ?? '—'}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                aria-label="Enviar e-mail"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Mail size={15} />
              </button>
              <button
                aria-label="Abrir LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Linkedin size={15} />
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {(lead.cidade || lead.uf) && (
              <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-ink-soft dark:bg-slate-800">
                <MapPin size={11} />
                {lead.cidade ?? '—'}, {lead.uf ?? '—'}
              </span>
            )}
            {lead.nota != null && (
              <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-ink-soft dark:bg-slate-800">
                <Star size={11} />
                {lead.nota.toFixed(1)} ({lead.avaliacoes ?? 0} avaliações)
              </span>
            )}
            {lead.website != null && (
              <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-ink-soft dark:bg-slate-800">
                <Globe size={11} />
                {lead.website ? 'Com website' : 'Sem website'}
              </span>
            )}
          </div>

          {lead.justificativa && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-teal-bg px-3 py-2.5 dark:bg-teal/10">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-teal" />
              <p className="text-sm italic text-ink/80 dark:text-slate-200">{lead.justificativa}</p>
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <button className="flex items-center gap-0.5 text-sm font-medium text-teal hover:underline">
              Ver detalhes
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
