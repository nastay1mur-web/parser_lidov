/**
 * screens/settings.js — Экран 5: Настройки
 *
 * Управление:
 * - Специальности (чекбоксы)
 * - Ключевые слова (теги с удалением + добавление)
 * - Источники (toggles)
 * - Стоп-слова (теги)
 *
 * Данные сохраняются в localStorage через AppSettings.
 *
 * Связь:
 *   BackButton → Router.pop()
 *   "Сохранить" → save + Router.pop() или setTab('feed')
 */

function createSettings() {
  // Загружаем актуальные настройки
  let settings = AppSettings.load();
  // Копия для мутации
  let draft = {
    specialties: [...(settings.specialties ?? [])],
    keywords:    [...(settings.keywords ?? [])],
    stopWords:   [...(settings.stopWords ?? [])],
    sources:     { ...settings.sources },
  };

  const el = document.createElement('div');
  el.className = 'screen';

  // ── Рендер всего экрана ───────────────────────────────────
  function render() {
    el.innerHTML = `
      <!-- Хедер -->
      <div class="screen-header">
        <button class="btn-back" id="btn-back">←</button>
        <span class="screen-title">Настройки</span>
      </div>

      <!-- Тело -->
      <div class="screen-body pb-4">

        <!-- Специальности -->
        <div class="settings-section" style="margin-top:12px">
          <div class="settings-section-title">Специальности</div>
          ${SPECIALTIES.map(s => `
            <div class="settings-row" data-specialty="${s.id}">
              <span class="settings-row-icon">${s.icon}</span>
              <span class="settings-row-label">${s.name}</span>
              <div class="toggle ${draft.specialties.includes(s.id) ? 'on' : ''}"
                   data-toggle-specialty="${s.id}"></div>
            </div>
          `).join('')}
        </div>

        <!-- Ключевые слова -->
        <div class="settings-section">
          <div class="settings-section-title">Ключевые слова</div>
          <div class="tags-container" id="keywords-container">
            ${renderTags(draft.keywords, 'keyword')}
            <button class="btn-add-tag" data-add="keyword">+ Добавить слово</button>
          </div>
        </div>

        <!-- Источники -->
        <div class="settings-section">
          <div class="settings-section-title">Источники</div>
          <div class="settings-row">
            <span class="settings-row-icon">💬</span>
            <span class="settings-row-label">Telegram чаты</span>
            <div class="toggle ${draft.sources.telegram ? 'on' : ''}"
                 data-toggle-source="telegram"></div>
          </div>
          <div class="settings-row">
            <span class="settings-row-icon">🔷</span>
            <span class="settings-row-label">ВКонтакте</span>
            <div class="toggle ${draft.sources.vk ? 'on' : ''}"
                 data-toggle-source="vk"></div>
          </div>
          <div class="settings-row">
            <span class="settings-row-icon">💬</span>
            <span class="settings-row-label">Форумы (vc.ru, habr)</span>
            <div class="toggle ${draft.sources.forum ? 'on' : ''}"
                 data-toggle-source="forum"></div>
          </div>
        </div>

        <!-- Стоп-слова -->
        <div class="settings-section">
          <div class="settings-section-title">Стоп-слова</div>
          <div class="tags-container" id="stopwords-container">
            ${renderTags(draft.stopWords, 'stopword')}
            <button class="btn-add-tag" data-add="stopword">+ Добавить</button>
          </div>
        </div>

        <!-- Версия приложения -->
        <p style="text-align:center;color:var(--tg-theme-hint-color);font-size:12px;margin:16px 0 0">
          Парсер лидов v1.0 · мок-данные
        </p>

      </div>

      <!-- Кнопка сохранения -->
      <div class="settings-footer">
        <button class="btn-primary" id="btn-save">Сохранить</button>
      </div>
    `;

    bindEvents();
  }

  // ── Рендер тегов-чипов ────────────────────────────────────
  function renderTags(list, type) {
    return list.map(word => `
      <span class="tag-chip">
        ${escapeHtml(word)}
        <span class="tag-chip-remove" data-remove="${type}" data-word="${escapeHtml(word)}">×</span>
      </span>
    `).join('');
  }

  // ── Перерисовать только контейнер тегов ──────────────────
  function refreshTags(containerId, list, type) {
    const container = el.querySelector(`#${containerId}`);
    if (!container) return;
    container.innerHTML =
      renderTags(list, type) +
      `<button class="btn-add-tag" data-add="${type}">+ Добавить</button>`;
    // Кнопка "+" нужна снова — убрать тут addTagListeners нет,
    // клик обрабатывается делегатом на всём экране
  }

  // ── Показать нативный диалог ввода ───────────────────────
  function promptAddTag(type, list, containerId) {
    TG.showPopup(
      {
        title: type === 'keyword' ? 'Добавить ключевое слово' : 'Добавить стоп-слово',
        message: 'Введите слово или фразу:',
        buttons: [
          { type: 'default', text: 'Отмена', id: 'cancel' },
        ],
      },
      (btnId) => {
        // Telegram.WebApp.showPopup не поддерживает input —
        // используем браузерный prompt как fallback
        const word = prompt(
          type === 'keyword' ? 'Добавить ключевое слово:' : 'Добавить стоп-слово:'
        );
        if (word && word.trim()) {
          const clean = word.trim().toLowerCase();
          if (!list.includes(clean)) {
            list.push(clean);
            refreshTags(containerId, list, type);
            TG.haptic.light();
          }
        }
      }
    );
  }

  // ── Привязка событий ──────────────────────────────────────
  function bindEvents() {
    // Назад
    el.querySelector('#btn-back').addEventListener('click', () => {
      Router.pop();
    });

    // Делегирование кликов
    el.addEventListener('click', (e) => {

      // Toggle специальности
      const toggleSpec = e.target.closest('[data-toggle-specialty]');
      if (toggleSpec) {
        TG.haptic.selection();
        const id = toggleSpec.dataset.toggleSpecialty;
        if (draft.specialties.includes(id)) {
          draft.specialties = draft.specialties.filter(s => s !== id);
          toggleSpec.classList.remove('on');
        } else {
          draft.specialties.push(id);
          toggleSpec.classList.add('on');
        }
        return;
      }

      // Toggle источника
      const toggleSrc = e.target.closest('[data-toggle-source]');
      if (toggleSrc) {
        TG.haptic.selection();
        const src = toggleSrc.dataset.toggleSource;
        draft.sources[src] = !draft.sources[src];
        toggleSrc.classList.toggle('on', draft.sources[src]);
        return;
      }

      // Удалить ключевое слово
      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        TG.haptic.warning();
        const type = removeBtn.dataset.remove;
        const word = removeBtn.dataset.word;
        if (type === 'keyword') {
          draft.keywords = draft.keywords.filter(w => w !== word);
          refreshTags('keywords-container', draft.keywords, 'keyword');
        } else {
          draft.stopWords = draft.stopWords.filter(w => w !== word);
          refreshTags('stopwords-container', draft.stopWords, 'stopword');
        }
        return;
      }

      // Добавить тег
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        const type = addBtn.dataset.add;
        if (type === 'keyword') {
          promptAddTag('keyword', draft.keywords, 'keywords-container');
        } else {
          promptAddTag('stopword', draft.stopWords, 'stopwords-container');
        }
        return;
      }

      // Тап на строку специальности (кроме togglea)
      const row = e.target.closest('[data-specialty]');
      if (row && !e.target.closest('[data-toggle-specialty]')) {
        const toggle = row.querySelector('[data-toggle-specialty]');
        if (toggle) toggle.click();
      }
    });

    // Кнопка "Сохранить"
    el.querySelector('#btn-save').addEventListener('click', () => {
      TG.haptic.success();
      AppSettings.save(draft);
      showToast('✓ Настройки сохранены');
      setTimeout(() => Router.pop(), 300);
    });
  }

  render();
  bindEvents();

  return {
    element: el,
    destroy: null,
  };
}

window.createSettings = createSettings;
