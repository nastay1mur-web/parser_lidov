/**
 * screens/details.js — Экран 2: Детали лида
 *
 * Открывается как push-экран при тапе на карточку.
 * Показывает полный текст, позволяет менять статус, добавлять заметки.
 *
 * Связь:
 *   BackButton → Router.pop()
 *   "Написать →" → SheetSend.show(lead)
 *   "♡ Сохранить" → AppData.toggleHot()
 *   "Открыть оригинал" → TG.openLink(lead.url)
 */

function createDetails(leadInit, onUpdate) {
  // Всегда берём актуальные данные из AppData
  function getLead() {
    return AppData.getById(leadInit.id) ?? leadInit;
  }

  // ── HTML ───────────────────────────────────────────────────
  const el = document.createElement('div');
  el.className = 'screen';

  function render() {
    const lead = getLead();
    const srcColor = SOURCE_COLORS[lead.source];
    const srcLabel = SOURCE_LABELS[lead.source];
    const isHot    = lead.isHot;

    el.innerHTML = `
      <!-- Хедер с кнопкой назад -->
      <div class="screen-header">
        <button class="btn-back" id="btn-back">←</button>
        <span class="screen-title" style="font-size:15px;">@${escapeHtml(lead.username)}</span>
        <button class="btn-icon" id="btn-heart-header" title="${isHot ? 'Убрать из горячих' : 'Добавить в горячие'}">
          ${isHot ? '🔥' : '♡'}
        </button>
      </div>

      <!-- Тело экрана -->
      <div class="screen-body pb-4">
        <!-- Профиль лида -->
        <div class="details-header-info">
          ${avatarHTML(lead, 52, 16)}
          <div>
            <div class="details-user-name">${escapeHtml(lead.name)}</div>
            <div class="details-user-meta">
              <span style="color:${srcColor}">${srcLabel}</span>
              <span>·</span>
              <span>${relativeTime(lead.createdAt)}</span>
              ${lead.isHot ? '<span>🔥</span>' : ''}
            </div>
            ${lead.sourceChat ? `<div style="font-size:12px;color:var(--tg-theme-hint-color);margin-top:2px">${escapeHtml(lead.sourceChat)}</div>` : ''}
          </div>
        </div>

        <!-- Тег специальности -->
        <div style="padding:0 12px 8px;display:flex;gap:8px;align-items:center">
          <span class="lead-keyword-chip">${escapeHtml(lead.keyword)}</span>
        </div>

        <!-- Полный текст сообщения -->
        <div class="details-section">
          <div class="details-section-title">Сообщение</div>
          <p class="details-message-text">${escapeHtml(lead.message)}</p>

          <!-- Ссылка на оригинал -->
          <button class="details-source-link" id="btn-open-source">
            🔗 Открыть оригинал
          </button>
        </div>

        <!-- Статус -->
        <div class="details-section">
          <div class="details-section-title">Статус</div>
          <div class="status-tabs" id="status-tabs">
            ${Object.entries(STATUS_LABELS).map(([key, label]) => `
              <button class="status-tab ${lead.status === key ? 'active' : ''}" data-status="${key}">
                ${label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Заметка -->
        <div class="details-section">
          <div class="details-section-title">Заметка</div>
          <textarea
            class="note-textarea"
            id="note-textarea"
            placeholder="Добавить заметку..."
            maxlength="500"
          >${escapeHtml(lead.note ?? '')}</textarea>
        </div>
      </div>

      <!-- Нижняя панель -->
      <div class="details-footer">
        <button class="btn-secondary ${isHot ? 'hot' : ''}" id="btn-save">
          ${isHot ? '♥ Горячий' : '♡ Сохранить'}
        </button>
        <button class="btn-primary-fill" id="btn-write">
          Написать →
        </button>
      </div>
    `;

    bindEvents();
  }

  // ── Привязка событий ───────────────────────────────────────
  function bindEvents() {
    // Назад
    el.querySelector('#btn-back').addEventListener('click', () => {
      Router.pop();
    });

    // Открыть оригинал
    el.querySelector('#btn-open-source').addEventListener('click', () => {
      TG.haptic.light();
      TG.openLink(getLead().url);
    });

    // Смена статуса
    el.querySelector('#status-tabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.status-tab');
      if (!btn) return;
      TG.haptic.success();

      const status = btn.dataset.status;
      AppData.updateLeadStatus(leadInit.id, status);
      onUpdate?.();

      // Обновить активный таб без полного re-render
      el.querySelectorAll('.status-tab').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
      showToast(`Статус: ${STATUS_LABELS[status]}`);
    });

    // Автосохранение заметки (debounce 800ms)
    const noteArea = el.querySelector('#note-textarea');
    const saveNote = debounce(() => {
      AppData.saveNote(leadInit.id, noteArea.value);
      onUpdate?.();
    }, 800);
    noteArea.addEventListener('input', saveNote);

    // Кнопка "♡ Сохранить" / "♥ Горячий"
    el.querySelector('#btn-save').addEventListener('click', () => {
      TG.haptic.medium();
      const isNowHot = AppData.toggleHot(leadInit.id);
      onUpdate?.();

      // Обновить кнопки без полного ре-рендера
      const btnSave = el.querySelector('#btn-save');
      const btnHeart = el.querySelector('#btn-heart-header');
      if (isNowHot) {
        btnSave.textContent = '♥ Горячий';
        btnSave.classList.add('hot');
        btnHeart.textContent = '🔥';
        showToast('🔥 Добавлено в горячие');
      } else {
        btnSave.textContent = '♡ Сохранить';
        btnSave.classList.remove('hot');
        btnHeart.textContent = '♡';
        showToast('Убрано из горячих');
      }
    });

    // Иконка ♡ в хедере
    el.querySelector('#btn-heart-header').addEventListener('click', () => {
      el.querySelector('#btn-save').click();
    });

    // Кнопка "Написать →"
    el.querySelector('#btn-write').addEventListener('click', () => {
      TG.haptic.medium();
      AppData.updateLeadStatus(leadInit.id, 'contacted');
      onUpdate?.();
      SheetSend.show(getLead(), () => {
        onUpdate?.();
      });
    });
  }

  // Первый рендер
  render();

  return {
    element: el,
    destroy: null,
  };
}

window.createDetails = createDetails;
