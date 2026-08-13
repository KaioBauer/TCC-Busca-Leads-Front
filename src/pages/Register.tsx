import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp, session } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  if (session) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)
    const { error } = await signUp(nome, email, senha)
    setCarregando(false)

    if (error) {
      setErro(error)
      return
    }

    setSucesso(true)
    setTimeout(() => navigate('/login'), 1800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-[#0b1220]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <h1 className="mb-1 text-xl font-bold text-ink dark:text-white">Criar sua conta</h1>
          <p className="mb-6 text-sm text-ink-soft">Comece a gerar e qualificar leads B2B com IA.</p>

          {sucesso ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-6 text-center">
              <CheckCircle2 size={32} className="text-success" />
              <p className="text-sm font-medium text-ink dark:text-white">Conta criada com sucesso!</p>
              <p className="text-xs text-ink-soft">Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {erro && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">Nome completo</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Camila Andrade"
                    className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">Senha</label>
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
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink dark:text-slate-200">Confirmar</label>
                  <div className="relative">
                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                    <input
                      type="password"
                      required
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-light disabled:opacity-60"
              >
                {carregando && <Loader2 size={16} className="animate-spin" />}
                Criar conta
              </button>
            </form>
          )}

          {!sucesso && (
            <p className="mt-6 text-center text-sm text-ink-soft">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-semibold text-teal hover:underline">
                Entrar
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
