/**
 * telegram.js — обёртка над Telegram.WebApp API
 * Все вызовы SDK проходят через этот файл.
 * В браузере (без Telegram) используются fallback-заглушки.
 */

const TG = (function () {
  // Ссылка на нативный объект WebApp (или null в браузере)
  const wa = window.Telegram?.WebApp ?? null;

  // ── Инициализация ─────────────────────────────────────────────
  function init() {
    if (!wa) return;
    wa.expand();
    wa.ready();
    try {
      wa.setHeaderColor('secondary_bg_color');
    } catch (_) { /* старые версии SDK не поддерживают */ }
  }

  // ── Данные пользователя ───────────────────────────────────────
  function getUser() {
    return wa?.initDataUnsafe?.user ?? {
      id: 0,
      first_name: 'Разработчик',
      username: 'dev',
    };
  }

  // ── Haptic Feedback ───────────────────────────────────────────
  const haptic = {
    light()     { wa?.HapticFeedback?.impactOccurred('light'); },
    medium()    { wa?.HapticFeedback?.impactOccurred('medium'); },
    heavy()     { wa?.HapticFeedback?.impactOccurred('heavy'); },
    success()   { wa?.HapticFeedback?.notificationOccurred('success'); },
    warning()   { wa?.HapticFeedback?.notificationOccurred('warning'); },
    error()     { wa?.HapticFeedback?.notificationOccurred('error'); },
    selection() { wa?.HapticFeedback?.selectionChanged(); },
  };

  // ── BackButton ────────────────────────────────────────────────
  // onBack = функция, вызываемая по нажатию "назад"
  function showBackButton(onBack) {
    if (!wa?.BackButton) return;
    wa.BackButton.onClick(onBack);
    wa.BackButton.show();
  }

  function hideBackButton() {
    if (!wa?.BackButton) return;
    wa.BackButton.hide();
    // Удаляем все предыдущие обработчики чтобы не накапливались
    wa.BackButton.offClick();
  }

  // ── MainButton ────────────────────────────────────────────────
  function showMainButton(text, onClick) {
    if (!wa?.MainButton) return;
    wa.MainButton.setText(text);
    wa.MainButton.onClick(onClick);
    wa.MainButton.show();
  }

  function hideMainButton() {
    if (!wa?.MainButton) return;
    wa.MainButton.hide();
    wa.MainButton.offClick();
  }

  function setMainButtonLoading(state) {
    if (!wa?.MainButton) return;
    if (state) {
      wa.MainButton.showProgress();
    } else {
      wa.MainButton.hideProgress();
    }
  }

  // ── Открытие ссылок ───────────────────────────────────────────
  function openLink(url) {
    if (!url) return;
    if (!wa) { window.open(url, '_blank'); return; }
    // t.me ссылки открываем внутри Telegram
    if (url.includes('t.me/') || url.includes('telegram.me/')) {
      wa.openTelegramLink(url);
    } else {
      wa.openLink(url);
    }
  }

  // ── Диалоги ───────────────────────────────────────────────────
  function showAlert(message, callback) {
    if (wa?.showAlert) {
      wa.showAlert(message, callback);
    } else {
      alert(message);
      callback?.();
    }
  }

  function showConfirm(message, callback) {
    if (wa?.showConfirm) {
      wa.showConfirm(message, (ok) => callback?.(ok));
    } else {
      const ok = confirm(message);
      callback?.(ok);
    }
  }

  // popup с кнопками
  function showPopup(params, callback) {
    if (wa?.showPopup) {
      wa.showPopup(params, callback);
    } else {
      const ok = confirm(params.message);
      callback?.(ok ? 'ok' : 'cancel');
    }
  }

  // ── Событие изменения viewport (клавиатура) ───────────────────
  function onViewportChanged(callback) {
    wa?.onEvent('viewportChanged', callback);
  }

  // ── Тема ─────────────────────────────────────────────────────
  function isDark() {
    return wa?.colorScheme === 'dark';
  }

  // ── Публичный интерфейс ───────────────────────────────────────
  return {
    init,
    getUser,
    haptic,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    setMainButtonLoading,
    openLink,
    showAlert,
    showConfirm,
    showPopup,
    onViewportChanged,
    isDark,
  };
})();

// Делаем глобальным
window.TG = TG;
