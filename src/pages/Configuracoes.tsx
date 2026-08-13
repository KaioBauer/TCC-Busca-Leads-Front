import { User, Mail, Crown, Link2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Configuracoes() {
  const { user, nome, iniciais } = useAuth()
  const webhookConfigurado = Boolean(import.meta.env.VITE_N8N_WEBHOOK_URL)

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-ink dark:text-white">Configurações</h1>
        <p className="text-sm text-ink-soft">Seu perfil, plano e integração com o n8n.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-ink dark:text-white">Perfil</h2>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-teal text-lg font-semibold text-white">
            {iniciais}
          </div>
          <div>
            <p className="font-semibold text-ink dark:text-white">{nome}</p>
            <p className="flex items-center gap-1 text-sm text-ink-soft">
              <Crown size={13} className="text-amber" />
              Plano Pro
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink dark:text-slate-200">
              <User size={14} />
              Nome
            </label>
            <input
              readOnly
              value={nome}
              className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2.5 text-sm text-ink outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink dark:text-slate-200">
              <Mail size={14} />
              E-mail
            </label>
            <input
              readOnly
              value={user?.email ?? ''}
              className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2.5 text-sm text-ink outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-1 text-sm font-semibold text-ink dark:text-white">Integração n8n</h2>
        <p className="mb-4 text-xs text-ink-soft">
          URL do webhook usado para disparar a coleta e qualificação de leads. Configurado via variável de ambiente.
        </p>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink dark:text-slate-200">
          <Link2 size={14} />
          URL do Webhook n8n
        </label>
        <input
          readOnly
          value={webhookConfigurado ? '••••••••••••••••••••••••••••••• (configurado no .env)' : 'Não configurado'}
          placeholder="https://seu-n8n.exemplo.com/webhook/leadflow"
          className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2.5 text-sm text-ink-soft outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      </div>
    </div>
  )
}
