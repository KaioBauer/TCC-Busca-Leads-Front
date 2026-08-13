import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import { supabase } from '../services/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setCarregando(false)
    if (error) {
      setErro(error.message)
      return
    }
    setEnviado(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-[#0b1220]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <h1 className="mb-1 text-xl font-bold text-ink dark:text-white">Recuperar senha</h1>
          <p className="mb-6 text-sm text-ink-soft">Enviaremos um link de redefinição para o seu e-mail.</p>

          {enviado ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-6 text-center">
              <CheckCircle2 size={32} className="text-success" />
              <p className="text-sm font-medium text-ink dark:text-white">Link enviado!</p>
              <p className="text-xs text-ink-soft">Verifique sua caixa de entrada.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {erro && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com"
                    className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-light disabled:opacity-60"
              >
                {carregando && <Loader2 size={16} className="animate-spin" />}
                Enviar link
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-ink-soft">
            <Link to="/login" className="font-semibold text-teal hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
