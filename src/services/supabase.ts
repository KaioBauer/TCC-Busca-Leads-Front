import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fica true quando as credenciais do Supabase não foram configuradas no .env.
// Usado pela UI para exibir um aviso amigável em vez de quebrar a aplicação.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[LeadFlow] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas. Preencha o arquivo .env (veja .env.example).'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
