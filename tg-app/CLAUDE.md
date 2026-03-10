# CLAUDE.md — Парсер лидов: Telegram Mini App (tg-app/)

Vanilla HTML + CSS + JS. Никаких фреймворков, никакой сборки.
Открывай `tg-app/index.html` напрямую в браузере или через любой dev-сервер.

---

## Структура файлов

```
tg-app/
├── index.html              ← Точка входа. HTML-оболочка, подключает все файлы.
├── css/
│   └── style.css           ← ВСЕ стили. Telegram CSS-переменные, анимации, компоненты.
└── js/
    ├── telegram.js         ← Обёртка Telegram.WebApp API (haptic, openLink, BackButton...).
    ├── data.js             ← Мок-данные лидов, localStorage, AppData, AppSettings.
    ├── utils.js            ← relativeTime, initials, avatarHTML, showToast, debounce.
    ├── router.js           ← Навигация: setTab() для вкладок, push/pop для экранов.
    └── screens/
        ├── onboarding.js   ← Экран 0: выбор специальности (первый запуск).
        ├── feed.js         ← Экран 1: лента лидов с фильтрами (главный экран).
        ├── details.js      ← Экран 2: детали лида, статус, заметка.
        ├── send.js         ← Экран 3: bottom sheet "Написать" (каналы + шаблоны).
        ├── search.js       ← Экран 4: поиск по лидам.
        ├── settings.js     ← Экран 5: настройки (ключевые слова, источники).
        └── hot.js          ← Экран 6: горячие / сохранённые лиды.
```

---

## Порядок загрузки JS (важно!)

```html
telegram.js → data.js → utils.js → router.js
→ onboarding.js → feed.js → details.js → send.js
→ hot.js → settings.js → search.js
→ app.js  ← запускает всё
```

Каждый файл кладёт свои функции в `window.*`. Нет ES-модулей, нет `import/export`.

---

## Навигация между экранами

```
Первый запуск:
  index.html → app.js → createOnboarding() → [Найти клиентов] → showFeedTab()

Повторный запуск:
  index.html → app.js → showFeedTab()  ← сразу лента

Таб-экраны (Router.setTab):
  📡 Лента      → createFeed()
  🔥 Горячие    → createHot()
  ⚙️ Настройки  → createSettings() (как push-экран)

Push-экраны (Router.push → Router.pop):
  Лента → тап на карточку → createDetails(lead)
  Лента → 🔍 → createSearch()
  Details → "Написать →" → SheetSend.show(lead)  ← bottom sheet поверх всего
  Settings → BackButton → pop()
```

**Правило:** `Router.setTab()` — без анимации (замена вкладки). `Router.push()` — slide справа. `Router.pop()` — slide обратно вправо.

---

## Где менять данные

### Лиды (мок-данные)
`js/data.js` → массив `MOCK_LEADS` (строки 20–120 примерно).

Структура лида:
```js
{
  id: '1',           // уникальный ID
  name: 'Имя',       // отображаемое имя
  username: 'ник',   // без @, используется для t.me/username
  source: 'telegram' | 'vk' | 'forum' | 'other',
  sourceChat: '@название', // откуда найден
  url: 'https://...',     // прямая ссылка (открывается по "Открыть оригинал")
  keyword: 'ключевое слово',
  message: 'полный текст сообщения',
  status: 'new' | 'viewed' | 'contacted' | 'replied' | 'closed',
  isHot: false,
  note: '',
  createdAt: '2026-03-10T10:00:00.000Z',
}
```

### Шаблоны ответов
`js/data.js` → массив `MESSAGE_TEMPLATES`.
Переменные: `{имя}`, `{ключевое_слово}`, `{источник}`.

### Специальности онбординга
`js/data.js` → массив `SPECIALTIES`.

### Цвета источников
`js/data.js` → объект `SOURCE_COLORS`.

### CSS-тема
`css/style.css` → секция `:root` (светлая тема) и `@media (prefers-color-scheme: dark)` (тёмная).
В Telegram цвета приходят автоматически через `--tg-theme-*` — менять не нужно.

---

## Ключевые API Telegram

| Функция | Файл | Где используется |
|---------|------|-----------------|
| `TG.init()` | telegram.js | app.js при старте |
| `TG.haptic.light/medium/success...` | telegram.js | Все экраны при касаниях |
| `TG.showBackButton(fn)` | telegram.js | router.js при push |
| `TG.openLink(url)` | telegram.js | details.js, send.js |
| `TG.showAlert/Confirm/Popup` | telegram.js | Диалоги |
| `TG.getUser()` | telegram.js | Данные пользователя из Telegram |

---

## localStorage ключи

| Ключ | Данные |
|------|--------|
| `pars_leads` | Массив лидов с изменёнными статусами |
| `pars_settings` | Настройки пользователя |
| `pars_onboarding_done` | `"true"` если онбординг пройден |
| `pars_recent_search` | Последние 5 поисковых запросов |

**Сбросить до начального состояния:** открыть DevTools → Application → localStorage → удалить все `pars_*` ключи.

---

## Добавить новый экран

1. Создать `js/screens/myscreen.js` по образцу:
```js
function createMyScreen(params) {
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `<div class="screen-header">...</div><div class="screen-body">...</div>`;
  // привязать события
  return { element: el, destroy: null };
}
window.createMyScreen = createMyScreen;
```
2. Подключить в `index.html` перед `app.js`.
3. Вызвать через `Router.push(() => createMyScreen(params))` или `Router.setTab(id, () => createMyScreen())`.

---

## Запуск в браузере

```bash
# Простейший способ (Python)
cd tg-app
python -m http.server 3000
# Открыть http://localhost:3000

# Или через Node.js (npx serve)
npx serve tg-app
```

Телеграм-тема в браузере: CSS-переменные подставляются из `:root` в `style.css`.
В Telegram переменные `--tg-theme-*` задаются автоматически через SDK.

---

## Что сделано (Sprint 1–3)

- [x] Экран 0: Онбординг (выбор специальности)
- [x] Экран 1: Лента лидов (фильтры, скелетон, пустое состояние)
- [x] Экран 2: Детали лида (полный текст, статус, заметка)
- [x] Экран 3: Bottom Sheet "Написать" (каналы, шаблоны)
- [x] Экран 4: Поиск (debounce, недавние запросы)
- [x] Экран 5: Настройки (специальности, ключевые слова, источники)
- [x] Экран 6: Горячие лиды (фильтры по статусу)
- [x] Telegram BackButton + Haptic Feedback
- [x] Toast-уведомления
- [x] Светлая и тёмная тема (через CSS-переменные)
- [x] Анимации переходов (slide + sheet)
- [x] 10 реалистичных мок-лидов

## Что делать дальше (Sprint 4+)

- [ ] Pull-to-refresh в ленте
- [ ] Swipe-to-action на карточках
- [ ] Подключить реальный API вместо мок-данных
- [ ] AI-фильтрация спама
- [ ] Аналитика и конверсия
- [ ] Реферальная программа
