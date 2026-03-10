/**
 * app.js — точка входа приложения
 *
 * Порядок запуска:
 * 1. Инициализировать Telegram WebApp (expand + ready)
 * 2. Инициализировать роутер
 * 3. Проверить онбординг → показать нужный экран
 * 4. Привязать таббар
 *
 * Этот файл загружается последним, когда все остальные уже готовы.
 */

(function () {
  // ── 1. Инициализация Telegram WebApp ─────────────────────
  TG.init();

  // ── 2. Инициализация роутера ──────────────────────────────
  Router.init(document.getElementById('screen-stack'));

  // ── 3. Обновить таббар при изменении viewport (клавиатура) ─
  TG.onViewportChanged(() => {
    // Пересчёт при открытии/закрытии клавиатуры
    // (браузер сам управляет viewport, здесь только для доп. логики)
  });

  // ── 4. Первый экран ───────────────────────────────────────
  if (!isOnboardingDone()) {
    // Первый запуск → онбординг
    const stack = document.getElementById('screen-stack');
    const ob = createOnboarding(() => {
      // Онбординг пройден → показать ленту
      showFeedTab();
    });
    ob.element.classList.add('screen');
    stack.appendChild(ob.element);
  } else {
    // Повторный запуск → сразу лента
    showFeedTab();
  }

  // ── 5. Привязка таббара ───────────────────────────────────
  document.getElementById('tabbar').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-item');
    if (!btn) return;

    TG.haptic.selection();
    const tab = btn.dataset.tab;

    if (tab === 'feed')     showFeedTab();
    if (tab === 'hot')      showHotTab();
    if (tab === 'settings') showSettingsTab();
  });

  // ── Переключение вкладок ──────────────────────────────────

  function showFeedTab() {
    Router.setTab('feed', () => createFeed());
  }

  function showHotTab() {
    Router.setTab('hot', () => createHot());
  }

  function showSettingsTab() {
    // Настройки как таб (альтернативно — push экран)
    Router.push(() => createSettings());
  }

})();
