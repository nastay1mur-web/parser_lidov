interface Tab {
  id: string
  label: string
  icon: string
  badge?: number
}

interface BottomTabBarProps {
  active: string
  onChange: (id: string) => void
  newCount?: number
}

export function BottomTabBar({ active, onChange, newCount = 0 }: BottomTabBarProps) {
  const tabs: Tab[] = [
    { id: 'feed',     label: 'Лента',    icon: '📡', badge: newCount },
    { id: 'hot',      label: 'Горячие',  icon: '🔥' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ]

  return (
    <nav
      className="flex border-t"
      style={{
        background: 'var(--tg-theme-secondary-bg-color)',
        borderColor: 'color-mix(in srgb, var(--tg-theme-hint-color) 20%, transparent)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative min-h-[50px]"
            style={{ color: isActive ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)' }}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[11px] font-medium leading-none">{tab.label}</span>
            {!!tab.badge && (
              <span
                className="absolute top-1.5 right-[calc(50%-14px)] min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--tg-theme-button-color)' }}
              >
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
