// Обёртка над Telegram WebApp API с fallback для браузера

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  colorScheme: 'light' | 'dark'
  initDataUnsafe: { user?: { id: number; first_name: string; username?: string } }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    setText: (text: string) => void
    onClick: (fn: () => void) => void
    offClick: (fn: () => void) => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
    offClick: (fn: () => void) => void
  }
  openLink: (url: string) => void
  openTelegramLink: (url: string) => void
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type: string; text?: string }> }, callback?: (id: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  onEvent: (event: string, callback: () => void) => void
}

const tg = window.Telegram?.WebApp

export const telegram = {
  // ── Инициализация ──────────────────────────────────────
  init() {
    tg?.expand()
    tg?.ready()
    tg?.setHeaderColor('secondary_bg_color')
  },

  // ── Тема ───────────────────────────────────────────────
  colorScheme: tg?.colorScheme ?? 'light',
  user: tg?.initDataUnsafe?.user,

  // ── Haptic Feedback ────────────────────────────────────
  haptic: {
    light:     () => tg?.HapticFeedback.impactOccurred('light'),
    medium:    () => tg?.HapticFeedback.impactOccurred('medium'),
    heavy:     () => tg?.HapticFeedback.impactOccurred('heavy'),
    success:   () => tg?.HapticFeedback.notificationOccurred('success'),
    warning:   () => tg?.HapticFeedback.notificationOccurred('warning'),
    error:     () => tg?.HapticFeedback.notificationOccurred('error'),
    selection: () => tg?.HapticFeedback.selectionChanged(),
  },

  // ── MainButton ─────────────────────────────────────────
  mainButton: {
    show(text: string, onClick: () => void) {
      if (!tg) return
      tg.MainButton.setText(text)
      tg.MainButton.onClick(onClick)
      tg.MainButton.show()
    },
    hide() {
      tg?.MainButton.hide()
    },
    setLoading(state: boolean) {
      if (state) {
        tg?.MainButton.showProgress()
        tg?.MainButton.disable()
      } else {
        tg?.MainButton.hideProgress()
        tg?.MainButton.enable()
      }
    },
  },

  // ── BackButton ─────────────────────────────────────────
  backButton: {
    show(onClick: () => void) {
      if (!tg) return
      tg.BackButton.onClick(onClick)
      tg.BackButton.show()
    },
    hide() {
      tg?.BackButton.hide()
    },
  },

  // ── Ссылки ─────────────────────────────────────────────
  openLink(url: string) {
    if (!tg) { window.open(url, '_blank'); return }
    if (url.startsWith('https://t.me/') || url.startsWith('tg://')) {
      tg.openTelegramLink(url)
    } else {
      tg.openLink(url)
    }
  },

  // ── Диалоги ────────────────────────────────────────────
  showAlert(message: string, callback?: () => void) {
    if (tg) {
      tg.showAlert(message, callback)
    } else {
      alert(message)
      callback?.()
    }
  },

  showConfirm(message: string, callback: (confirmed: boolean) => void) {
    if (tg) {
      tg.showConfirm(message, callback)
    } else {
      callback(window.confirm(message))
    }
  },
}
