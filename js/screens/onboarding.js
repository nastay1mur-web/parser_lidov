/**
 * screens/onboarding.js — Экран 0: Онбординг
 *
 * Показывается только при первом запуске.
 * Пользователь выбирает специальности → нажимает "Найти клиентов".
 * Выбор сохраняется в localStorage, больше не показывается.
 *
 * Связь: после выбора → Router.setTab('feed')
 */

function createOnboarding(onDone) {
  // Список выбранных специальностей (ID)
  const selected = new Set();

  // ── HTML экрана ─────────────────────────────────────────────
  const el = document.createElement('div');
  el.className = 'screen onboarding';
  el.innerHTML = `
    <div class="screen-body">
      <!-- Герой-блок -->
      <div class="onboarding-hero">
        <span class="onboarding-icon">📡</span>
        <h1 class="onboarding-title">Находи клиентов<br>раньше конкурентов</h1>
        <p class="onboarding-subtitle">
          Люди прямо сейчас пишут что ищут специалиста.
          Ты узнаёшь первым и пишешь раньше всех.
        </p>
      </div>

      <!-- Выбор специальности -->
      <p class="onboarding-question">Кто ты?</p>

      <div class="specialty-list" id="specialty-list">
        ${SPECIALTIES.map(s => `
          <div class="specialty-item" data-id="${s.id}">
            <span class="specialty-icon">${s.icon}</span>
            <span class="specialty-name">${s.name}</span>
            <span class="specialty-check">✓</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Кнопка -->
    <div class="onboarding-footer">
      <button class="btn-primary" id="btn-start" disabled>
        Найти клиентов →
      </button>
    </div>
  `;

  // ── Логика ─────────────────────────────────────────────────

  const list    = el.querySelector('#specialty-list');
  const btnStart = el.querySelector('#btn-start');

  // Тап на специальность — выделить / снять
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.specialty-item');
    if (!item) return;

    TG.haptic.selection();

    const id = item.dataset.id;
    if (selected.has(id)) {
      selected.delete(id);
      item.classList.remove('selected');
    } else {
      selected.add(id);
      item.classList.add('selected');
    }

    // Кнопка активна только если выбрана хоть одна
    btnStart.disabled = selected.size === 0;
  });

  // Кнопка "Найти клиентов"
  btnStart.addEventListener('click', () => {
    if (selected.size === 0) return;

    TG.haptic.success();

    // Сохранить специальности в настройках
    const settings = AppSettings.load();
    settings.specialties = [...selected];
    AppSettings.save(settings);

    // Пометить онбординг как пройденный
    setOnboardingDone();

    onDone();
  });

  return {
    element: el,
    destroy: null, // онбординг ничего не подписывает глобально
  };
}

window.createOnboarding = createOnboarding;
