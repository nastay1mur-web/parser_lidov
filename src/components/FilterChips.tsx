import type { FilterSource } from '@/hooks/useLeads'

const FILTERS: { id: FilterSource; label: string }[] = [
  { id: 'all',      label: 'Все' },
  { id: 'telegram', label: 'TG' },
  { id: 'vk',       label: 'VK' },
  { id: 'forum',    label: 'Форумы' },
]

interface FilterChipsProps {
  active: FilterSource
  onChange: (v: FilterSource) => void
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div
      className="flex gap-2 px-3 py-2 overflow-x-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      {FILTERS.map(f => {
        const isActive = active === f.id
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className="flex-shrink-0 px-3 h-8 rounded-full text-xs font-semibold transition-all"
            style={
              isActive
                ? { background: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }
                : { background: 'color-mix(in srgb, var(--tg-theme-hint-color) 15%, transparent)', color: 'var(--tg-theme-hint-color)' }
            }
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
