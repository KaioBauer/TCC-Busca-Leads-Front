import type { LucideIcon } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import Sparkline from './Sparkline'

interface MetricCardProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  value: number | string
  label: string
  subtext?: string
  badge?: { text: string; tone: 'success' | 'amber' }
  sparklineData?: number[]
  trend?: string
}

export default function MetricCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  subtext,
  badge,
  sparklineData,
  trend,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              badge.tone === 'success' ? 'bg-success/10 text-success' : 'bg-amber/10 text-amber'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold text-ink dark:text-white">{value}</p>
          <p className="text-sm text-ink-soft">{label}</p>
          {subtext && <p className="mt-0.5 text-xs text-ink-soft/80">{subtext}</p>}
        </div>

        {sparklineData && (
          <div className="flex flex-col items-end gap-1">
            <Sparkline data={sparklineData} />
            {trend && (
              <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[11px] font-semibold text-success">
                <TrendingUp size={11} />
                {trend}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
