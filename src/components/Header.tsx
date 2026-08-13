import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Search, Clock, Settings, Moon, Sun, Bell, ChevronDown, LogOut } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/buscas', label: 'Buscas', icon: Search },
  { to: '/historico', label: 'Histórico', icon: Clock },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Header() {
  const { nome, iniciais, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-8">
        <Logo size="sm" />

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-bg text-teal dark:bg-teal/20 dark:text-teal-light'
                    : 'text-ink-soft hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Alternar tema"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          aria-label="Notificações"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell size={18} />
        </button>

        <div className="relative ml-1" ref={menuRef}>
          <button
            onClick={() => setMenuAberto((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-teal text-xs font-semibold text-white">
              {iniciais}
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-medium text-ink dark:text-white">{nome}</p>
              <p className="text-xs text-ink-soft">Pro</p>
            </div>
            <ChevronDown size={16} className="text-ink-soft" />
          </button>

          {menuAberto && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-border bg-card py-1 shadow-card dark:border-slate-700 dark:bg-slate-900">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-soft transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut size={15} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
