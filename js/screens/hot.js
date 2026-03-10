/**
 * screens/hot.js — Экран 6: Горячие лиды (сохранённые)
 *
 * Таб-экран (не push). Показывает лиды помеченные ♥ + в работе.
 * Пустое состояние: предложение перейти в ленту.
 *
 * Связь:
 *   Тап на карточку → Router.push(createDetails)
 */

function createHot() {
  const el = document.createElement('div');
  el.className = 'screen';

  // Активный фильтр внутри вкладки горячих
  let currentFilter = 'all';

  function render() {
    const allHot = AppData.getHot();

    // Фильтрация по подвкладкам
    let leads = allHot;
    if (currentFilter === 'working') {
      leads = allHot.filter(l => l.status === 'contacted' || l.status === 'replied');
    } else if (currentFilter === 'saved') {
      leads = allHot.filter(l => l.isHot);
    }

    el.innerHTML = `
      <!-- Хедер -->
      <div class="screen-header">
        <span class="screen-title">Горячие</span>
        <span style="font-size:13px;color:var(--tg-theme-hint-color)">${allHot.length} лидов</span>
      </div>

      <!-- Под-фильтры -->
      <div class="filter-chips">
        <button class="chip ${currentFilter === 'all' ? 'active' : ''}" data-f="all">Все</button>
        <button class="chip ${currentFilter === 'working' ? 'active' : ''}" data-f="working">В работе</button>
        <button class="chip ${currentFilter === 'saved' ? 'active' : ''}" data-f="saved">Сохранённые</button>
      </div>

      <!-- Список -->
      <div class="screen-body pt-2 pb-4" id="hot-list">
        ${leads.length === 0 ? renderEmpty(allHot.length === 0) : leads.map(renderCard).join('')}
      </div>
    `;

    bindEvents();
  }

  // ── Карточка горячего лида (упрощённая версия) ─────────────
  function renderCard(lead) {
    const srcColor  = SOURCE_COLORS[lead.source];
    const statusBadgeColor = {
      contacted: 'var(--lead-hot)',
      replied:   'var(--lead-done)',
      new:       'var(--lead-new)',
      viewed:    'var(--tg-theme-hint-color)',
      closed:    'var(--lead-skip)',
    }[lead.status] ?? 'var(--tg-theme-hint-color)';

    return `
      <div class="lead-card" data-id="${lead.id}">
        <div class="lead-card-inner">
          <div class="lead-row-top">
            ${avatarHTML(lead, 40, 12)}
            <div class="lead-meta">
              <div class="lead-meta-row">
                <span class="lead-username">@${escapeHtml(lead.username)}</span>
                <span class="lead-source-badge" style="color:${srcColor}">
                  · ${SOURCE_LABELS[lead.source]}
                </span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
                <span class="lead-keyword-chip">${escapeHtml(lead.keyword)}</span>
                <span style="font-size:11px;font-weight:600;color:${statusBadgeColor};
                             background:${statusBadgeColor}22;padding:2px 7px;border-radius:20px">
                  ${STATUS_LABELS[lead.status]}
                </span>
                ${lead.isHot ? '<span style="font-size:13px">🔥</span>' : ''}
              </div>
            </div>
            <span class="lead-time">${relativeTime(lead.createdAt)}</span>
          </div>
          <p class="lead-message">${escapeHtml(lead.message)}</p>
          <div class="lead-actions">
            <button class="btn-write" data-action="write" data-id="${lead.id}">Написать →</button>
            <button class="btn-heart hot" data-action="unhot" data-id="${lead.id}" title="Убрать из горячих">♥</button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Пустое состояние ──────────────────────────────────────
  function renderEmpty(isGloballyEmpty) {
    return `
      <div class="empty-state">
        <span class="empty-icon">🔥</span>
        <p class="empty-title">${isGloballyEmpty ? 'Горячих лидов пока нет' : 'В этой категории пусто'}</p>
        <p class="empty-subtitle">
          ${isGloballyEmpty
            ? 'Нажми ♡ на карточке лида чтобы сохранить его здесь'
            : 'Попробуй другой фильтр или вернись в ленту'}
        </p>
        <button class="empty-action" id="btn-to-feed">← Вернуться в ленту</button>
      </div>
    `;
  }

  // ── Привязка событий ──────────────────────────────────────
  function bindEvents() {
    // Фильтры
    el.querySelectorAll('[data-f]').forEach(btn => {
      btn.addEventListener('click', () => {
        TG.haptic.selection();
        currentFilter = btn.dataset.f;
        render();
      });
    });

    // Кнопка перейти в ленту
    el.querySelector('#btn-to-feed')?.addEventListener('click', () => {
      Router.setTab('feed', () => createFeed());
    });

    const hotList = el.querySelector('#hot-list');
    if (!hotList) return;

    // Делегирование кликов
    hotList.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        e.stopPropagation();
        const id     = actionBtn.dataset.id;
        const action = actionBtn.dataset.action;

        if (action === 'write') {
          TG.haptic.medium();
          const lead = AppData.getById(id);
          if (lead) SheetSend.show(lead, () => render());
          return;
        }

        if (action === 'unhot') {
          TG.haptic.warning();
          AppData.toggleHot(id);
          showToast('Убрано из горячих');
          render();
          return;
        }
      }

      // Тап на карточку
      const card = e.target.closest('.lead-card');
      if (card) {
        TG.haptic.light();
        const lead = AppData.getById(card.dataset.id);
        if (lead) Router.push(() => createDetails(lead, () => render()));
      }
    });
  }

  render();

  return {
    element: el,
    destroy: null,
  };
}

window.createHot = createHot;
