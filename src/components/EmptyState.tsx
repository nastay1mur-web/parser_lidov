interface EmptyStateProps {
  icon?: string
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📭', title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <span className="text-5xl mb-4 opacity-50">{icon}</span>
      <p
        className="text-base font-semibold mb-1"
        style={{ color: 'var(--tg-theme-text-color)' }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--tg-theme-hint-color)' }}
        >
          {subtitle}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-6 py-3 rounded-tg text-sm font-semibold min-h-touch"
          style={{
            background: 'var(--tg-theme-button-color)',
            color: 'var(--tg-theme-button-text-color)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
