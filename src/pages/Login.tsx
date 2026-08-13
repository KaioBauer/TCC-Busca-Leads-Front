import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2, AlertTriangle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../services/supabase'

export default function Login() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  if (session) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    const { error } = await signIn(email, senha)
    setCarregando(false)
    if (error) {
      setErro(error)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-[#0b1220]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <h1 className="mb-1 text-xl font-bold text-ink dark:text-white">Bem-vinda de volta</h1>
          <p className="mb-6 text-sm text-ink-soft">Entre para continuar gerando e qualificando leads.</p>

          {!isSupabaseConfigured && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber/30 bg-amber/10 p-3 text-xs text-amber-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Supabase não configurado. Preencha <code>VITE_SUPABASE_URL</code> e{' '}
                <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code>.
              </span>
            </div>
          )}

          {erro && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-ink dark:text-slate-200">Senha</label>
                <Link to="/esqueci-senha" className="text-xs font-medium text-teal hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
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
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="font-semibold text-teal hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
