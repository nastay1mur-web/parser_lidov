export type LeadStatus = 'new' | 'viewed' | 'contacted' | 'replied' | 'closed'
export type LeadSource = 'telegram' | 'vk' | 'forum' | 'other'

export interface Lead {
  id: string
  name: string        // отображаемое имя
  username: string    // ник без @

  // Контакты
  telegram?: string
  email?: string
  phone?: string
  vk_id?: string

  // Источник
  source: LeadSource
  sourceChat?: string  // откуда (@freelance_ru, vc.ru)
  url: string          // прямая ссылка на сообщение/профиль

  // Контент
  keyword: string      // ключевое слово по которому найден
  message: string      // полный текст сообщения

  // Статус
  status: LeadStatus
  isHot: boolean       // горячий (< 30 мин от createdAt)
  note?: string        // заметка пользователя

  // Время
  createdAt: string    // ISO 8601, когда написал клиент
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new:       'Новый',
  viewed:    'Просмотрен',
  contacted: 'Написал',
  replied:   'Ответил',
  closed:    'Закрыт',
}

export const SOURCE_COLORS: Record<LeadSource, string> = {
  telegram: '#2AABEE',
  vk:       '#4C75A3',
  forum:    '#FF4500',
  other:    '#8e8e93',
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  telegram: 'Telegram',
  vk:       'ВКонтакте',
  forum:    'Форум',
  other:    'Другое',
}
