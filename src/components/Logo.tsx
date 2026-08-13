import { Zap } from 'lucide-react'

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const icon = size === 'lg' ? 24 : size === 'sm' ? 16 : 18
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${box} items-center justify-center rounded-xl bg-teal text-white shadow-soft`}>
        <Zap size={icon} fill="currentColor" strokeWidth={0} />
      </div>
      <span className={`${text} font-bold text-ink dark:text-white`}>LeadFlow</span>
    </div>
  )
}
