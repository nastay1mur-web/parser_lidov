import { useEffect, useState } from 'react'
import { telegram } from '@/lib/telegram'
import { useLeads } from '@/hooks/useLeads'
import { BottomTabBar } from '@/components/BottomTabBar'
import { Onboarding } from '@/pages/Onboarding'
import { LeadFeed } from '@/pages/LeadFeed'
import { LeadDetails } from '@/pages/LeadDetails'
import type { Lead } from '@/types/lead'

const ONBOARDING_KEY = 'onboarding-done'

type Tab = 'feed' | 'hot' | 'settings'

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true'
  )
  const [tab, setTab] = useState<Tab>('feed')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const { newCount, hotLeads } = useLeads()

  useEffect(() => {
    telegram.init()
  }, [])

  const handleOnboardingDone = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setOnboardingDone(true)
  }

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead)
  }

  const handleBack = () => {
    setSelectedLead(null)
  }

  if (!onboardingDone) {
    return <Onboarding onDone={handleOnboardingDone} />
  }

  if (selectedLead) {
    return <LeadDetails lead={selectedLead} onBack={handleBack} />
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: 'var(--tg-theme-bg-color)' }}
    >
      {/* Контент вкладки */}
      <div className="flex-1 min-h-0">
        {tab === 'feed' && (
          <LeadFeed onOpenLead={handleOpenLead} />
        )}

        {tab === 'hot' && (
          <div className="h-full flex flex-col">
            <div className="px-4 pt-3 pb-2 flex-shrink-0">
              <h1
                className="text-lg font-bold"
                style={{ color: 'var(--tg-theme-text-color)' }}
              >
                Горячие лиды
              </h1>
            </div>
            <div className="flex-1 scroll-y pt-1">
              {hotLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 pb-10">
                  <span className="text-5xl">🔥</span>
                  <p
                    className="text-base font-semibold"
                    style={{ color: 'var(--tg-theme-text-color)' }}
                  >
                    Горячих лидов пока нет
                  </p>
                  <p
                    className="text-sm text-center px-8"
                    style={{ color: 'var(--tg-theme-hint-color)' }}
                  >
                    Отмечай лидов сердечком в ленте
                  </p>
                </div>
              ) : (
                hotLeads.map((lead, i) => (
                  <div
                    key={lead.id}
                    className={`mx-3 mb-2 rounded-tg p-3.5 cursor-pointer active:opacity-80 fade-up-${Math.min(i + 1, 5)}`}
                    style={{ background: 'var(--tg-theme-secondary-bg-color)' }}
                    onClick={() => { telegram.haptic.light(); handleOpenLead(lead) }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: 'var(--tg-theme-text-color)' }}
                      >
                        @{lead.username}
                      </span>
                      {lead.isHot && <span className="text-xs">🔥</span>}
                    </div>
                    <p
                      className="text-xs mt-1 line-clamp-2"
                      style={{ color: 'var(--tg-theme-hint-color)' }}
                    >
                      {lead.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="h-full flex flex-col items-center justify-center gap-3 pb-10">
            <span className="text-5xl">⚙️</span>
            <p
              className="text-base font-semibold"
              style={{ color: 'var(--tg-theme-text-color)' }}
            >
              Настройки
            </p>
            <p
              className="text-sm text-center px-8"
              style={{ color: 'var(--tg-theme-hint-color)' }}
            >
              Скоро здесь появятся фильтры по ключевым словам и источникам
            </p>
          </div>
        )}
      </div>

      {/* Нижняя навигация */}
      <BottomTabBar
        active={tab}
        onChange={(id) => { telegram.haptic.selection(); setTab(id as Tab) }}
        newCount={newCount}
      />
    </div>
  )
}
