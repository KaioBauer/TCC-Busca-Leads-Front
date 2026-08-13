import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export default function EmptyState({ icon: Icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-bg text-teal dark:bg-teal/10">
        <Icon size={22} />
      </div>
      <p className="text-sm font-medium text-ink dark:text-white">{title}</p>
      {subtitle && <p className="max-w-xs text-xs text-ink-soft">{subtitle}</p>}
    </div>
  )
}
