import { useState } from 'react'
import type { Lead } from '@/types/lead'
import { SOURCE_COLORS, SOURCE_LABELS, STATUS_LABELS } from '@/types/lead'
import { telegram } from '@/lib/telegram'
import { relativeTime, initials } from '@/lib/utils'
import { useLeads } from '@/hooks/useLeads'

interface LeadDetailsProps {
  lead: Lead
  onBack: () => void
}

export function LeadDetails({ lead: initialLead, onBack }: LeadDetailsProps) {
  const { getById, updateStatus, updateNote, toggleHot } = useLeads()
  const lead = getById(initialLead.id) ?? initialLead

  const [noteText, setNoteText] = useState(lead.note ?? '')
  const [noteSaved, setNoteSaved] = useState(false)

  const sourceColor = SOURCE_COLORS[lead.source]

  const handleWrite = () => {
    telegram.haptic.medium()
    updateStatus(lead.id, 'contacted')
    telegram.openLink(lead.url)
  }

  const handleToggleHot = () => {
    telegram.haptic.selection()
    toggleHot(lead.id)
  }

  const handleSaveNote = () => {
    telegram.haptic.light()
    updateNote(lead.id, noteText)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const handleStatusChange = (status: Lead['status']) => {
    telegram.haptic.selection()
    updateStatus(lead.id, status)
  }

  return (
    <div
      className="h-full flex flex-col screen-enter"
      style={{ background: 'var(--tg-theme-bg-color)' }}
    >
      {/* Шапка */}
      <div
        className="flex-shrink-0 px-4 pt-3 pb-3 flex items-center gap-3 border-b"
        style={{
          background: 'var(--tg-theme-secondary-bg-color)',
          borderColor: 'color-mix(in srgb, var(--tg-theme-hint-color) 15%, transparent)',
        }}
      >
        <button
          onClick={() => { telegram.haptic.light(); onBack() }}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg"
          style={{ background: 'color-mix(in srgb, var(--tg-theme-hint-color) 10%, transparent)' }}
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold text-sm truncate"
            style={{ color: 'var(--tg-theme-text-color)' }}
          >
            @{lead.username}
          </div>
          <div
            className="text-xs"
            style={{ color: 'var(--tg-theme-hint-color)' }}
          >
            {SOURCE_LABELS[lead.source]} · {relativeTime(lead.createdAt)}
          </div>
        </div>
        <button
          onClick={handleToggleHot}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-xl"
          style={{ background: 'color-mix(in srgb, var(--tg-theme-hint-color) 10%, transparent)' }}
        >
          {lead.isHot ? '♥' : '♡'}
        </button>
      </div>

      {/* Контент */}
      <div className="flex-1 scroll-y px-4 py-4 space-y-4">

        {/* Карточка профиля */}
        <div
          className="rounded-tg p-4 flex items-center gap-3"
          style={{ background: 'var(--tg-theme-secondary-bg-color)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-lg font-bold"
            style={{ background: `${sourceColor}cc` }}
          >
            {initials(lead.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="font-bold text-base"
              style={{ color: 'var(--tg-theme-text-color)' }}
            >
              {lead.name}
            </div>
            <div
              className="text-sm"
              style={{ color: sourceColor }}
            >
              @{lead.username}
            </div>
            {lead.sourceChat && (
              <div
                className="text-xs mt-0.5"
                style={{ color: 'var(--tg-theme-hint-color)' }}
              >
                из {lead.sourceChat}
              </div>
            )}
          </div>
        </div>

        {/* Ключевое слово + статус */}
        <div
          className="rounded-tg p-4 space-y-3"
          style={{ background: 'var(--tg-theme-secondary-bg-color)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{
                background: 'color-mix(in srgb, var(--tg-theme-hint-color) 12%, transparent)',
                color: 'var(--tg-theme-hint-color)',
              }}
            >
              {lead.keyword}
            </span>
            {lead.isHot && <span className="text-sm">🔥 Горячий</span>}
          </div>

          {/* Статусы */}
          <div className="flex gap-2 flex-wrap">
            {(['new', 'viewed', 'contacted', 'replied', 'closed'] as Lead['status'][]).map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
                style={{
                  background: lead.status === s
                    ? 'var(--tg-theme-button-color)'
                    : 'color-mix(in srgb, var(--tg-theme-hint-color) 10%, transparent)',
                  color: lead.status === s
                    ? 'var(--tg-theme-button-text-color)'
                    : 'var(--tg-theme-hint-color)',
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Сообщение */}
        <div
          className="rounded-tg p-4"
          style={{ background: 'var(--tg-theme-secondary-bg-color)' }}
        >
          <div
            className="text-xs font-semibold mb-2 uppercase tracking-wide"
            style={{ color: 'var(--tg-theme-hint-color)' }}
          >
            Сообщение
          </div>
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--tg-theme-text-color)' }}
          >
            {lead.message}
          </p>
        </div>

        {/* Заметка */}
        <div
          className="rounded-tg p-4"
          style={{ background: 'var(--tg-theme-secondary-bg-color)' }}
        >
          <div
            className="text-xs font-semibold mb-2 uppercase tracking-wide"
            style={{ color: 'var(--tg-theme-hint-color)' }}
          >
            Заметка
          </div>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Добавь заметку о лиде..."
            rows={3}
            className="w-full text-sm leading-relaxed resize-none outline-none bg-transparent"
            style={{ color: 'var(--tg-theme-text-color)' }}
          />
          {noteText !== (lead.note ?? '') && (
            <button
              onClick={handleSaveNote}
              className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{
                background: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
              }}
            >
              {noteSaved ? 'Сохранено ✓' : 'Сохранить'}
            </button>
          )}
        </div>
      </div>

      {/* Кнопка снизу */}
      <div
        className="flex-shrink-0 px-4 pt-3 pb-4 border-t"
        style={{
          background: 'var(--tg-theme-secondary-bg-color)',
          borderColor: 'color-mix(in srgb, var(--tg-theme-hint-color) 15%, transparent)',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <button
          onClick={handleWrite}
          className="w-full h-12 rounded-tg text-base font-semibold active:opacity-80 transition-opacity"
          style={{
            background: 'var(--tg-theme-button-color)',
            color: 'var(--tg-theme-button-text-color)',
          }}
        >
          Написать →
        </button>
      </div>
    </div>
  )
}
