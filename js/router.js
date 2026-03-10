/**
 * router.js — навигация между экранами
 *
 * Концепция:
 * - Таб-экраны (Лента, Горячие, Настройки) живут в одном слое
 * - Push-экраны (Детали, Поиск) добавляются поверх с анимацией slide
 * - Нижний таббар виден только на таб-экранах
 * - BackButton Telegram синхронизируется с глубиной стека
 */

const Router = (function () {
  // Стек push-экранов: [{element, destroy?}]
  const stack = [];

  // Текущий активный таб-экран
  let currentTab = null;
  let currentTabId = null;

  // Контейнер экранов
  let container = null;

  // ── Инициализация ───────────────────────────────────────────
  function init(containerEl) {
    container = containerEl;
  }

  // ── Таббар: показать / скрыть ───────────────────────────────
  function showTabbar() {
    document.getElementById('tabbar').style.display = 'flex';
  }

  function hideTabbar() {
    document.getElementById('tabbar').style.display = 'none';
  }

  // ── Обновить бейдж таббара ──────────────────────────────────
  function updateBadge() {
    const badge = document.getElementById('tab-badge');
    if (!badge) return;
    const count = AppData.getNewCount();
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  // ── BackButton: синхронизировать с глубиной стека ───────────
  function syncBackButton() {
    if (stack.length > 0) {
      TG.showBackButton(pop);
    } else {
      TG.hideBackButton();
    }
  }

  // ── Показать таб-экран (без анимации slide) ─────────────────
  // tabId: 'feed' | 'hot' | 'settings'
  // createFn: функция, возвращающая {element, destroy?}
  function setTab(tabId, createFn) {
    // Закрыть все push-экраны без анимации
    stack.forEach(item => {
      item.destroy?.();
      item.element.remove();
    });
    stack.length = 0;

    // Убрать предыдущий таб
    if (currentTab) {
      currentTab.destroy?.();
      currentTab.element.remove();
    }

    // Создать и смонтировать новый
    const screen = createFn();
    screen.element.classList.add('screen', 'screen-fade-in');
    container.appendChild(screen.element);

    currentTab = screen;
    currentTabId = tabId;

    // Обновить активность в таббаре
    document.querySelectorAll('.tab-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    showTabbar();
    syncBackButton();
    updateBadge();
  }

  // ── Push-экран: выезжает справа поверх текущего ─────────────
  function push(createFn) {
    // Предыдущий экран (таб или push) уходит влево
    const prev = stack.length > 0
      ? stack[stack.length - 1].element
      : currentTab?.element;

    if (prev) {
      prev.classList.remove('screen-under-pop', 'screen-enter');
      prev.classList.add('screen-under-push');
    }

    // Создать и смонтировать новый
    const screen = createFn();
    screen.element.classList.add('screen', 'screen-enter');
    container.appendChild(screen.element);

    stack.push(screen);

    hideTabbar();
    syncBackButton();
  }

  // ── Pop: убрать верхний push-экран ──────────────────────────
  function pop() {
    if (stack.length === 0) return;

    TG.haptic.light();

    const top = stack.pop();
    top.element.classList.remove('screen-enter');
    top.element.classList.add('screen-exit');

    // Предыдущий экран возвращается
    const prev = stack.length > 0
      ? stack[stack.length - 1].element
      : currentTab?.element;

    if (prev) {
      prev.classList.remove('screen-under-push');
      prev.classList.add('screen-under-pop');
    }

    // Удалить после анимации
    setTimeout(() => {
      top.destroy?.();
      top.element.remove();
      // Почистить класс анимации у prev
      prev?.classList.remove('screen-under-pop');
    }, 260);

    if (stack.length === 0) {
      showTabbar();
    }

    syncBackButton();
    updateBadge();
  }

  // ── Публичный интерфейс ─────────────────────────────────────
  return { init, setTab, push, pop, updateBadge };
})();

window.Router = Router;
