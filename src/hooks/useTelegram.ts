import { useEffect } from 'react'
import { telegram } from '@/lib/telegram'

/** Инициализация Telegram WebApp при монтировании */
export function useTelegramInit() {
  useEffect(() => {
    telegram.init()
  }, [])
}

/** Управление BackButton Telegram */
export function useBackButton(onBack: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      telegram.backButton.hide()
      return
    }
    telegram.backButton.show(onBack)
    return () => telegram.backButton.hide()
  }, [onBack, enabled])
}

/** Управление MainButton Telegram */
export function useMainButton(text: string, onClick: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      telegram.mainButton.hide()
      return
    }
    telegram.mainButton.show(text, onClick)
    return () => telegram.mainButton.hide()
  }, [text, onClick, enabled])
}
