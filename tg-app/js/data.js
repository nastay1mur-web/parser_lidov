/**
 * data.js — данные приложения
 * - Моки лидов (реалистичные, на русском)
 * - Функции работы с localStorage
 * - Настройки пользователя
 */

// ── Константы ──────────────────────────────────────────────────
const STORAGE_KEYS = {
  LEADS:        'pars_leads',
  SETTINGS:     'pars_settings',
  ONBOARDING:   'pars_onboarding_done',
  RECENT_SEARCH:'pars_recent_search',
};

// Цвета источников
const SOURCE_COLORS = {
  telegram: '#2aabee',
  vk:       '#4c75a3',
  forum:    '#ff4500',
  other:    '#8e8e93',
};

const SOURCE_LABELS = {
  telegram: 'Telegram',
  vk:       'ВКонтакте',
  forum:    'Форум',
  other:    'Другое',
};

const STATUS_LABELS = {
  new:       'Новый',
  viewed:    'Просмотрен',
  contacted: 'Написал',
  replied:   'Ответил',
  closed:    'Закрыт',
};

// ── Мок-данные лидов ──────────────────────────────────────────
// Реалистичные заявки от потенциальных клиентов
const MOCK_LEADS = [
  {
    id: '1',
    name: 'Максим Карпов',
    username: 'maxim_karpov',
    source: 'telegram',
    sourceChat: '@freelance_ru',
    url: 'https://t.me/freelance_ru',
    keyword: 'ищу разработчика',
    specialty: 'dev',
    message: 'Ищу разработчика для создания CRM-системы для малого бизнеса. Бюджет 80–150к. Нужно быстро, есть подробное ТЗ. Стек: Python + React или что предложите. Пишите в личку, готов обсудить детали.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: '2',
    name: 'Анна Смирнова',
    username: 'anna_smm',
    source: 'vk',
    sourceChat: 'vk.com/freelance',
    url: 'https://vk.com/freelance',
    keyword: 'нужен SMM',
    specialty: 'smm',
    message: 'Нужен SMM-специалист для интернет-магазина одежды. ВК + Телеграм канал. 30к/мес, частичная занятость. Контент-план, stories, посты 1 раз в день. Жду предложения с портфолио.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 23 * 60_000).toISOString(),
  },
  {
    id: '3',
    name: 'Дмитрий Веб',
    username: 'dmitry_web_dev',
    source: 'telegram',
    sourceChat: '@web_freelance',
    url: 'https://t.me/web_freelance',
    keyword: 'нужен дизайнер',
    specialty: 'design',
    message: 'Нужен UI/UX дизайнер для редизайна корпоративного сайта. Примерно 15–20 страниц, Figma, есть брендбук. Бюджет обсуждается, ориентир 60–100к. Хочу видеть сайты сделанные вами.',
    status: 'new',
    isHot: true,
    note: '',
    createdAt: new Date(Date.now() - 47 * 60_000).toISOString(),
  },
  {
    id: '4',
    name: 'Елена Шопова',
    username: 'elena_shopdesign',
    source: 'vk',
    sourceChat: 'vk.com/business_freelance',
    url: 'https://vk.com/business_freelance',
    keyword: 'нужен копирайтер',
    specialty: 'copy',
    message: 'Ищу копирайтера для написания карточек товаров на Wildberries и Ozon. Примерно 200 карточек, SEO-оптимизация. Готова платить 80–120р за карточку. Тестовое задание — 5 карточек.',
    status: 'viewed',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 90 * 60_000).toISOString(),
  },
  {
    id: '5',
    name: 'Сергей Иванов',
    username: 'sergey_it_biz',
    source: 'forum',
    sourceChat: 'vc.ru',
    url: 'https://vc.ru/freelance',
    keyword: 'frontend разработчик',
    specialty: 'dev',
    message: 'Стартап ищет frontend-разработчика (React/Next.js) на фриланс, проект ~3 месяца. Задача: лендинг + личный кабинет с Dashboard. Бюджет 150к. Командная работа через Notion + GitHub.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: '6',
    name: 'Мария Кофе',
    username: 'maria_coffeeshop',
    source: 'telegram',
    sourceChat: '@smm_work',
    url: 'https://t.me/smm_work',
    keyword: 'нужен SMM',
    specialty: 'smm',
    message: 'Привет! Ищу SMM для небольшой кофейни в Москве. Инстаграм + ВК + Телеграм. Нужно вести аккаунты, снимать reels, делать тексты. Бюджет 25–35к/мес + оплата фотографа.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
  {
    id: '7',
    name: 'Александр Стартап',
    username: 'alex_startup77',
    source: 'telegram',
    sourceChat: '@devjobs_ru',
    url: 'https://t.me/devjobs_ru',
    keyword: 'fullstack разработчик',
    specialty: 'dev',
    message: 'Ищу fullstack-разработчика для MVP мобильного приложения. React Native + Node.js + PostgreSQL. Бюджет 200–300к. Есть инвестиции, команда 4 человека. Готов к долгосрочному сотрудничеству.',
    status: 'contacted',
    isHot: true,
    note: 'Договорились на звонок в четверг',
    createdAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
  },
  {
    id: '8',
    name: 'Наталья Пиарова',
    username: 'natasha_pr_agency',
    source: 'vk',
    sourceChat: 'vk.com/marketing_jobs',
    url: 'https://vk.com/marketing_jobs',
    keyword: 'нужен маркетолог',
    specialty: 'market',
    message: 'Digital-агентство ищет маркетолога на аутсорс для клиента (ниша: образование). Задачи: контекстная реклама Яндекс + ВКонтакте, ведение кабинетов. 60к/мес, 20 часов в неделю.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    id: '9',
    name: 'Кирилл Бизнес',
    username: 'kirill_mobile_app',
    source: 'telegram',
    sourceChat: '@flutter_jobs',
    url: 'https://t.me/flutter_jobs',
    keyword: 'Flutter разработчик',
    specialty: 'dev',
    message: 'Нужен Flutter-разработчик для мобильного приложения доставки еды. Дизайн готов, API готово. Нужно собрать приложение для iOS + Android. Бюджет 120–180к, срок 6 недель.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
  },
  {
    id: '10',
    name: 'Ольга Коуч',
    username: 'olga_coaching_pro',
    source: 'forum',
    sourceChat: 'tlgg.ru',
    url: 'https://tlgg.ru',
    keyword: 'нужен дизайнер',
    specialty: 'design',
    message: 'Коуч, ищу дизайнера для оформления онлайн-курса и продающего лендинга. Нужно: слайды в Canva/Figma (50 шт) + лендинг на Tilda. Бюджет 40–60к. Работаем быстро, дедлайн 2 недели.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
  },
  // Лиды для фотографов/видеографов
  {
    id: '11',
    name: 'Виктория Рест',
    username: 'vika_restaurant_msk',
    source: 'telegram',
    sourceChat: '@photo_jobs_ru',
    url: 'https://t.me/photo_jobs_ru',
    keyword: 'нужен фотограф',
    specialty: 'photo',
    message: 'Нужен фотограф для съёмки блюд ресторана. Примерно 50–70 позиций меню, нужны красивые фото для сайта и Instagram. Бюджет 15–25к за день съёмки. Студия есть, реквизит обсудим.',
    status: 'new',
    isHot: true,
    note: '',
    createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
  },
  {
    id: '12',
    name: 'Игорь Свадьба',
    username: 'igor_wedding_event',
    source: 'vk',
    sourceChat: 'vk.com/wedding_photo',
    url: 'https://vk.com/wedding_photo',
    keyword: 'ищу видеографа',
    specialty: 'photo',
    message: 'Ищем видеографа на свадьбу 15 июня в Подмосковье. Нужно: съёмка 8–10 часов, монтаж highlight 3–5 мин + полный ролик до 30 мин. Бюджет 40–60к. Портфолио обязательно, желательно с отзывами.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 55 * 60_000).toISOString(),
  },
  {
    id: '13',
    name: 'Белла Бьюти',
    username: 'bella_beauty_spb',
    source: 'telegram',
    sourceChat: '@freelance_photo',
    url: 'https://t.me/freelance_photo',
    keyword: 'нужен фотограф',
    specialty: 'photo',
    message: 'Студия красоты в СПб ищет фотографа на регулярную съёмку. Раз в месяц: интерьер + работы мастеров + контент для соцсетей. Бюджет 8–12к/съёмка. Хочу долгосрочное сотрудничество.',
    status: 'new',
    isHot: false,
    note: '',
    createdAt: new Date(Date.now() - 2.5 * 3600_000).toISOString(),
  },
];

// Шаблоны ответов
const MESSAGE_TEMPLATES = [
  {
    id: 't1',
    name: 'Первый контакт',
    text: 'Здравствуйте, {имя}! Увидел ваш запрос по теме «{ключевое_слово}». Занимаюсь этим уже 5 лет, готов помочь. Когда удобно пообщаться?',
  },
  {
    id: 't2',
    name: 'С портфолио',
    text: 'Добрый день, {имя}! Видел вашу задачу — «{ключевое_слово}». У меня есть похожие кейсы, могу скинуть портфолио. Напишите, если интересно.',
  },
  {
    id: 't3',
    name: 'Фоллоу-ап',
    text: 'Привет, {имя}! Ранее писал вам по поводу {ключевое_слово}. Просто уточнить — вопрос ещё актуален? Буду рад помочь.',
  },
];

// ── Настройки по умолчанию ─────────────────────────────────────
const DEFAULT_SETTINGS = {
  specialties: [], // выбранные специальности
  keywords: ['ищу разработчика', 'нужен дизайнер', 'нужен SMM', 'нужен маркетолог', 'нужен копирайтер'],
  stopWords: ['бесплатно', 'сам сделаю', 'студент'],
  sources: { telegram: true, vk: true, forum: true },
};

const SPECIALTIES = [
  { id: 'dev',    icon: '💻', name: 'Разработчик' },
  { id: 'design', icon: '🎨', name: 'Дизайнер' },
  { id: 'market', icon: '📣', name: 'Маркетолог' },
  { id: 'copy',   icon: '✍️', name: 'Копирайтер' },
  { id: 'smm',    icon: '📱', name: 'SMM-специалист' },
  { id: 'photo',  icon: '📷', name: 'Фотограф/Видео' },
];

// ── localStorage helpers ───────────────────────────────────────

function loadLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (!raw) return [...MOCK_LEADS];
    const saved = JSON.parse(raw);
    // Миграция: если у сохранённых лидов нет поля specialty — сбрасываем на мок-данные
    if (saved.length > 0 && !saved[0].specialty) {
      localStorage.removeItem(STORAGE_KEYS.LEADS);
      return [...MOCK_LEADS];
    }
    return saved;
  } catch (_) {
    return [...MOCK_LEADS];
  }
}

function saveLeads(leads) {
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch (_) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function isOnboardingDone() {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
}

function setOnboardingDone() {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
}

function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCH);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function addRecentSearch(query) {
  const list = loadRecentSearches().filter(q => q !== query);
  list.unshift(query);
  localStorage.setItem(STORAGE_KEYS.RECENT_SEARCH, JSON.stringify(list.slice(0, 5)));
}

// ── Операции с лидами ─────────────────────────────────────────

// Состояние приложения — единственный источник правды
const AppData = {
  leads: loadLeads(),

  // Обновить статус лида
  updateLeadStatus(id, status) {
    const lead = this.leads.find(l => l.id === id);
    if (lead) lead.status = status;
    saveLeads(this.leads);
  },

  // Переключить "горячий"
  toggleHot(id) {
    const lead = this.leads.find(l => l.id === id);
    if (lead) lead.isHot = !lead.isHot;
    saveLeads(this.leads);
    return lead?.isHot;
  },

  // Сохранить заметку
  saveNote(id, note) {
    const lead = this.leads.find(l => l.id === id);
    if (lead) lead.note = note;
    saveLeads(this.leads);
  },

  // Отметить просмотренным (только если был "new")
  markViewed(id) {
    const lead = this.leads.find(l => l.id === id);
    if (lead && lead.status === 'new') {
      lead.status = 'viewed';
      saveLeads(this.leads);
    }
  },

  // Получить лид по ID
  getById(id) {
    return this.leads.find(l => l.id === id);
  },

  // Получить отфильтрованные лиды (по источнику + по специальностям из настроек)
  getFiltered(source = 'all') {
    let base = source === 'all'
      ? this.leads
      : this.leads.filter(l => l.source === source);

    // Фильтр по специальностям (если пользователь выбрал при онбординге)
    const settings = loadSettings();
    if (settings.specialties && settings.specialties.length > 0) {
      base = base.filter(l => settings.specialties.includes(l.specialty));
    }

    return [...base].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Горячие лиды
  getHot() {
    return this.leads
      .filter(l => l.isHot || l.status === 'contacted' || l.status === 'replied')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Количество новых
  getNewCount() {
    return this.leads.filter(l => l.status === 'new').length;
  },

  // Поиск по тексту
  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.username.toLowerCase().includes(q) ||
      l.message.toLowerCase().includes(q) ||
      l.keyword.toLowerCase().includes(q)
    );
  },
};

// Глобальный доступ
window.AppData = AppData;
window.AppSettings = { load: loadSettings, save: saveSettings };
window.SPECIALTIES = SPECIALTIES;
window.SOURCE_COLORS = SOURCE_COLORS;
window.SOURCE_LABELS = SOURCE_LABELS;
window.STATUS_LABELS = STATUS_LABELS;
window.MESSAGE_TEMPLATES = MESSAGE_TEMPLATES;
window.isOnboardingDone = isOnboardingDone;
window.setOnboardingDone = setOnboardingDone;
window.loadRecentSearches = loadRecentSearches;
window.addRecentSearch = addRecentSearch;
