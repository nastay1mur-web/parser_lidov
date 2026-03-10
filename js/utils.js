/**
 * utils.js — вспомогательные функции
 * Форматирование времени, инициалы, тост, и т.д.
 */

// ── Относительное время ("5 мин назад") ──────────────────────
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins < 1)   return 'только что';
  if (mins < 60)  return `${mins} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  return `${days} дн назад`;
}

// ── Инициалы из имени ("Максим Карпов" → "МК") ───────────────
function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

// ── Случайный цвет из палитры (для аватаров) ─────────────────
const AVATAR_COLORS = [
  '#5a67d8', '#38a169', '#dd6b20', '#d53f8c',
  '#2b6cb0', '#805ad5', '#2c7a7b', '#b7791f',
];

function avatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Рендер HTML аватара с инициалами ─────────────────────────
function avatarHTML(lead, size = 40, radiusPx = 12) {
  const color   = SOURCE_COLORS[lead.source];
  const initStr = initials(lead.name);
  const fontSize = size > 45 ? 19 : 15;
  return `
    <div class="lead-avatar" style="
      width: ${size}px; height: ${size}px;
      border-radius: ${radiusPx}px;
      background: ${color}cc;
      font-size: ${fontSize}px;
    ">${initStr}</div>
  `;
}

// ── Тост-уведомление ─────────────────────────────────────────
let toastTimer = null;

function showToast(text, duration = 2000) {
  const el = document.getElementById('toast');
  if (!el) return;

  el.textContent = text;
  el.style.display = 'block';

  // Даём браузеру перерисоваться, потом добавляем класс
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('visible');
    });
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => { el.style.display = 'none'; }, 200);
  }, duration);
}

// ── Дебаунс ──────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ── Escaping HTML ────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Заполнить шаблон переменными ────────────────────────────
// {имя} → имя лида, {ключевое_слово} → keyword, {источник} → source
function fillTemplate(template, lead) {
  return template
    .replace(/\{имя\}/gi, lead.name.split(' ')[0])
    .replace(/\{ключевое_слово\}/gi, lead.keyword)
    .replace(/\{источник\}/gi, SOURCE_LABELS[lead.source] ?? lead.source);
}

// ── Глобальный доступ ─────────────────────────────────────────
window.relativeTime = relativeTime;
window.initials = initials;
window.avatarColor = avatarColor;
window.avatarHTML = avatarHTML;
window.showToast = showToast;
window.debounce = debounce;
window.escapeHtml = escapeHtml;
window.fillTemplate = fillTemplate;
