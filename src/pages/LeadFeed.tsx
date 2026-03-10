import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { LeadCard } from '@/components/LeadCard'
import { SkeletonFeed } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/EmptyState'
import { FilterChips } from '@/components/FilterChips'
import type { FilterSource } from '@/hooks/useLeads'
import type { Lead } from '@/types/lead'

interface LeadFeedProps {
  onOpenLead: (lead: Lead) => void
}

export function LeadFeed({ onOpenLead }: LeadFeedProps) {
  const [filter, setFilter] = useState<FilterSource>('all')
  const [loading] = useState(false)
  const { leads, toggleHot, markViewed } = useLeads(filter)

  const handleTap = (lead: Lead) => {
    markViewed(lead.id)
    onOpenLead(lead)
  }

  const handleWrite = (lead: Lead) => {
    markViewed(lead.id)
    onOpenLead(lead)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div
        className="px-4 pt-3 pb-2 flex-shrink-0"
        style={{ background: 'var(--tg-theme-bg-color)' }}
      >
        <h1
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--tg-theme-text-color)' }}
        >
          Лента лидов
        </h1>
        <FilterChips value={filter} onChange={setFilter} />
      </div>

      {/* Список */}
      <div className="flex-1 scroll-y pt-1 pb-2">
        {loading ? (
          <SkeletonFeed />
        ) : leads.length === 0 ? (
          <EmptyState
            icon="📭"
            title="Лидов пока нет"
            subtitle="Новые заявки появятся здесь автоматически"
          />
        ) : (
          leads.map((lead, i) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              index={i}
              onTap={() => handleTap(lead)}
              onWrite={() => handleWrite(lead)}
              onToggleHot={() => toggleHot(lead.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
