import { useState } from 'react'
import { telegram } from '@/lib/telegram'

interface OnboardingProps {
  onDone: () => void
}

const slides = [
  {
    icon: '📡',
    title: 'Парсер лидов',
    subtitle: 'Находи клиентов раньше конкурентов',
    desc: 'Мы мониторим Telegram-чаты, ВКонтакте и форумы — и показываем тебе свежие заявки от людей, которым нужны твои услуги.',
  },
  {
    icon: '⚡',
    title: 'Всё в одном месте',
    subtitle: 'Лента, фильтры, быстрый ответ',
    desc: 'Видишь заявку — нажимаешь «Написать» и сразу попадаешь в диалог. Никаких лишних шагов.',
  },
  {
    icon: '🔥',
    title: 'Горячие лиды',
    subtitle: 'Не пропусти важное',
    desc: 'Отмечай перспективных клиентов звёздочкой — они сохранятся в отдельной вкладке.',
  },
]

export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const isLast = step === slides.length - 1
  const slide = slides[step]

  const handleNext = () => {
    telegram.haptic.light()
    if (isLast) {
      onDone()
    } else {
      setStep(s => s + 1)
    }
  }

  const handleSkip = () => {
    telegram.haptic.selection()
    onDone()
  }

  return (
    <div
      className="h-full flex flex-col items-center justify-between px-6 pt-12 pb-10"
      style={{ background: 'var(--tg-theme-bg-color)' }}
    >
      {/* Кнопка пропустить */}
      <div className="w-full flex justify-end">
        {!isLast && (
          <button
            onClick={handleSkip}
            className="text-sm px-3 py-1"
            style={{ color: 'var(--tg-theme-hint-color)' }}
          >
            Пропустить
          </button>
        )}
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 w-full max-w-sm">
        <div className="text-7xl leading-none">{slide.icon}</div>

        <div className="space-y-2">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--tg-theme-text-color)' }}
          >
            {slide.title}
          </h1>
          <p
            className="text-base font-medium"
            style={{ color: 'var(--tg-theme-button-color)' }}
          >
            {slide.subtitle}
          </p>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--tg-theme-hint-color)' }}
        >
          {slide.desc}
        </p>
      </div>

      {/* Индикатор + кнопка */}
      <div className="w-full max-w-sm space-y-5">
        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                background: i === step
                  ? 'var(--tg-theme-button-color)'
                  : 'color-mix(in srgb, var(--tg-theme-hint-color) 30%, transparent)',
              }}
            />
          ))}
        </div>

        {/* Кнопка */}
        <button
          onClick={handleNext}
          className="w-full h-12 rounded-tg text-base font-semibold active:opacity-80 transition-opacity"
          style={{
            background: 'var(--tg-theme-button-color)',
            color: 'var(--tg-theme-button-text-color)',
          }}
        >
          {isLast ? 'Начать →' : 'Далее'}
        </button>
      </div>
    </div>
  )
}
