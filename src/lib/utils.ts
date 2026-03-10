/** Относительное время ("5 мин назад") */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (mins < 1)   return 'только что'
  if (mins < 60)  return `${mins} мин назад`
  if (hours < 24) return `${hours} ч назад`
  return `${days} дн назад`
}

/** Инициалы из имени */
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}
