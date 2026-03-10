export function SkeletonCard() {
  return (
    <div
      className="rounded-tg mx-3 mb-2 p-4"
      style={{ background: 'var(--tg-theme-secondary-bg-color)' }}
    >
      <div className="flex items-start gap-3">
        <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="skeleton h-3.5 w-28 rounded" />
            <div className="skeleton h-3.5 w-12 rounded" />
          </div>
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3.5 w-4/5 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonFeed() {
  return (
    <div className="pt-2">
      {[1, 2, 3].map(i => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
