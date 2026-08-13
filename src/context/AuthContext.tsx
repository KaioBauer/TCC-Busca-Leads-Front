import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  nome: string
  iniciais: string
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (nome: string, email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function iniciaisDe(nomeOuEmail: string): string {
  const partes = nomeOuEmail.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, novaSessao) => {
      setSession(novaSessao)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const nome = (user?.user_metadata?.full_name as string | undefined) || user?.email || ''
  const iniciais = nome ? iniciaisDe(nome) : ''

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      nome,
      iniciais,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error ? traduzErro(error.message) : null }
      },
      async signUp(nomeCompleto, email, password) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: nomeCompleto } },
        })
        return { error: error ? traduzErro(error.message) : null }
      },
      async signOut() {
        await supabase.auth.signOut()
      },
    }),
    [session, loading, user, nome, iniciais]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function traduzErro(mensagem: string): string {
  if (mensagem.includes('Invalid login credentials')) return 'E-mail ou senha inválidos.'
  if (mensagem.includes('User already registered')) return 'Este e-mail já está cadastrado.'
  if (mensagem.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  return mensagem
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
