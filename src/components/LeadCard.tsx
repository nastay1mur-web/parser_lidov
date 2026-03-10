import type { Lead } from '@/types/lead'
import { SOURCE_COLORS, SOURCE_LABELS } from '@/types/lead'
import { telegram } from '@/lib/telegram'
import { relativeTime, initials } from '@/lib/utils'

interface LeadCardProps {
  lead: Lead
  onTap: () => void
  onWrite: () => void
  onToggleHot: () => void
  index?: number
}

export function LeadCard({ lead, onTap, onWrite, onToggleHot, index = 0 }: LeadCardProps) {
  const isNew = lead.status === 'new'
  const sourceColor = SOURCE_COLORS[lead.source]

  const handleWrite = (e: React.MouseEvent) => {
    e.stopPropagation()
    telegram.haptic.medium()
    onWrite()
  }

  const handleHot = (e: React.MouseEvent) => {
    e.stopPropagation()
    telegram.haptic.selection()
    onToggleHot()
  }

  return (
    <div
      className={`mx-3 mb-2 rounded-tg overflow-hidden cursor-pointer active:scale-[0.98] transition-transform fade-up-${Math.min(index + 1, 5)}`}
      style={{
        background: 'var(--tg-theme-secondary-bg-color)',
        borderLeft: isNew ? `3px solid ${sourceColor}` : '3px solid transparent',
      }}
      onClick={() => { telegram.haptic.light(); onTap() }}
    >
      <div className="p-3.5 flex items-start gap-3">
        {/* Аватар */}
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ background: `${sourceColor}cc` }}
        >
          {initials(lead.name)}
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          {/* Строка 1: ник + источник + время */}
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span
              className="text-sm font-semibold leading-none"
              style={{ color: 'var(--tg-theme-text-color)' }}
            >
              @{lead.username}
            </span>
            <span
              className="text-xs leading-none"
              style={{ color: sourceColor }}
            >
              · {SOURCE_LABELS[lead.source]}
            </span>
            {isNew && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ml-auto"
                style={{ background: `${sourceColor}22`, color: sourceColor }}
              >
                NEW
              </span>
            )}
          </div>

          {/* Строка 2: ключевое слово + время + 🔥 */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-full font-medium leading-none"
              style={{
                background: 'color-mix(in srgb, var(--tg-theme-hint-color) 12%, transparent)',
                color: 'var(--tg-theme-hint-color)',
              }}
            >
              {lead.keyword}
            </span>
            {lead.isHot && <span className="text-xs leading-none">🔥</span>}
            <span
              className="text-[11px] leading-none ml-auto"
              style={{ color: 'var(--tg-theme-hint-color)' }}
            >
              {relativeTime(lead.createdAt)}
            </span>
          </div>

          {/* Строка 3–4: текст сообщения */}
          <p
            className="text-sm leading-snug line-clamp-2 mb-2"
            style={{ color: 'var(--tg-theme-text-color)' }}
          >
            {lead.message}
          </p>

          {/* Строка 5: действия */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleWrite}
              className="flex-1 h-8 rounded-tg text-xs font-semibold"
              style={{
                background: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
              }}
            >
              Написать →
            </button>
            <button
              onClick={handleHot}
              className="w-8 h-8 rounded-tg flex items-center justify-center text-base"
              style={{
                background: 'color-mix(in srgb, var(--tg-theme-hint-color) 10%, transparent)',
              }}
            >
              {lead.isHot ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
