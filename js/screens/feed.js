/**
 * screens/feed.js — Экран 1: Лента лидов (главный экран)
 *
 * Функции:
 * - Список карточек лидов с фильтрами
 * - Плашка "N новых лидов"
 * - Тапы → переход на детали
 * - Кнопка "Написать →" → bottom sheet
 * - ♡ → горячий лид
 * - Кнопки в хедере: поиск и настройки
 *
 * Связь:
 *   Тап на карточку → Router.push(createDetails)
 *   Тап "Написать →" → SheetSend.show(lead)
 *   Тап 🔍 → Router.push(createSearch)
 *   Тап ⚙️ → Router.setTab / Router.push(createSettings)
 */

function createFeed() {
  // Текущий фильтр источника
  let currentFilter = 'all';
  // Признак, была ли показана загрузка
  let loaded = false;

  // ── HTML ───────────────────────────────────────────────────
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `
    <!-- Хедер -->
    <div class="screen-header" style="background: var(--tg-theme-secondary-bg-color);">
      <span class="screen-title">Лиды</span>
      <button class="btn-icon" id="btn-search" title="Поиск">🔍</button>
      <button class="btn-icon" id="btn-settings" title="Настройки">⚙️</button>
    </div>

    <!-- Фильтр-чипы -->
    <div class="filter-chips" id="filter-chips">
      <button class="chip active" data-source="all">Все</button>
      <button class="chip" data-source="telegram">📡 TG</button>
      <button class="chip" data-source="vk">VK</button>
      <button class="chip" data-source="forum">Форумы</button>
    </div>

    <!-- Плашка новых лидов (скрыта по умолчанию) -->
    <div id="new-banner" class="new-leads-banner" style="display:none">
      🔴 <span id="new-banner-text"></span>
    </div>

    <!-- Список лидов -->
    <div class="screen-body" id="leads-list">
      <!-- Контент рендерится в renderLeads() -->
    </div>
  `;

  // ── Ссылки на DOM-элементы ─────────────────────────────────
  const leadsList    = el.querySelector('#leads-list');
  const filterChips  = el.querySelector('#filter-chips');
  const newBanner    = el.querySelector('#new-banner');
  const newBannerTxt = el.querySelector('#new-banner-text');

  // ── Рендер скелетона при загрузке ─────────────────────────
  function renderSkeleton() {
    leadsList.innerHTML = `
      <div class="pt-2">
        ${[1,2,3].map(() => `
          <div class="skeleton-card">
            <div class="skeleton-row">
              <div class="skeleton" style="width:40px;height:40px;border-radius:12px;flex-shrink:0"></div>
              <div style="flex:1;display:flex;flex-direction:column;gap:6px">
                <div class="skeleton" style="height:13px;width:65%"></div>
                <div class="skeleton" style="height:11px;width:40%"></div>
              </div>
            </div>
            <div class="skeleton" style="height:13px;width:100%;margin-bottom:6px"></div>
            <div class="skeleton" style="height:13px;width:80%;margin-bottom:10px"></div>
            <div class="skeleton" style="height:34px;width:100%;border-radius:10px"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ── Рендер карточки лида ───────────────────────────────────
  function renderLeadCard(lead) {
    const isNew     = lead.status === 'new';
    const srcColor  = SOURCE_COLORS[lead.source];
    const srcLabel  = SOURCE_LABELS[lead.source];
    const hotClass  = lead.isHot ? 'hot' : '';
    const heartIcon = lead.isHot ? '♥' : '♡';
    const newBadge  = isNew ? `<span class="lead-new-badge">NEW</span>` : '';

    return `
      <div class="lead-card ${isNew ? 'is-new' : ''}" data-id="${lead.id}">
        <div class="lead-card-inner">
          <div class="lead-row-top">
            ${avatarHTML(lead, 40, 12)}
            <div class="lead-meta">
              <div class="lead-meta-row">
                <span class="lead-username">@${escapeHtml(lead.username)}</span>
                <span class="lead-source-badge" style="color:${srcColor}">
                  · ${srcLabel}
                </span>
                <span class="lead-time">${relativeTime(lead.createdAt)}</span>
              </div>
            </div>
          </div>

          <div class="lead-tags-row">
            <span class="lead-keyword-chip">${escapeHtml(lead.keyword)}</span>
            ${lead.isHot ? `<span class="lead-hot-badge">🔥</span>` : ''}
            ${newBadge}
          </div>

          <p class="lead-message">${escapeHtml(lead.message)}</p>

          <div class="lead-actions">
            <button class="btn-write" data-action="write" data-id="${lead.id}">
              Написать →
            </button>
            <button class="btn-heart ${hotClass}" data-action="heart" data-id="${lead.id}">
              ${heartIcon}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Рендер списка лидов ────────────────────────────────────
  function renderLeads() {
    const leads = AppData.getFiltered(currentFilter);

    if (leads.length === 0) {
      leadsList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📭</span>
          <p class="empty-title">Лидов пока нет</p>
          <p class="empty-subtitle">Новые заявки появятся здесь автоматически. Проверьте ключевые слова в настройках.</p>
          <button class="empty-action" id="btn-to-settings">⚙️ Настроить поиск</button>
        </div>
      `;
      leadsList.querySelector('#btn-to-settings')?.addEventListener('click', () => {
        Router.setTab('settings', () => createSettings());
      });
      return;
    }

    // Обновить плашку новых
    const newCount = leads.filter(l => l.status === 'new').length;
    if (newCount > 0) {
      newBannerTxt.textContent = `${newCount} ${pluralLeads(newCount)}`;
      newBanner.style.display = 'flex';
    } else {
      newBanner.style.display = 'none';
    }

    leadsList.innerHTML = `
      <div class="pt-2 pb-4">
        ${leads.map(l => renderLeadCard(l)).join('')}
      </div>
    `;

    // Обновить бейдж на таббаре
    Router.updateBadge();
  }

  // ── Склонение слова "лид" ─────────────────────────────────
  function pluralLeads(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'новый лид';
    if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'новых лида';
    return 'новых лидов';
  }

  // ── Обработчики событий ───────────────────────────────────

  // Клик по плашке "N новых лидов" — скролл к первому новому
  newBanner.addEventListener('click', () => {
    TG.haptic.light();
    const firstNew = leadsList.querySelector('.is-new');
    if (firstNew) firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Фильтры
  filterChips.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    TG.haptic.selection();

    currentFilter = btn.dataset.source;
    filterChips.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('active', c === btn);
    });
    renderLeads();
  });

  // Клики по карточкам (делегирование)
  leadsList.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      e.stopPropagation();
      const id = actionBtn.dataset.id;
      const action = actionBtn.dataset.action;

      if (action === 'write') {
        TG.haptic.medium();
        const lead = AppData.getById(id);
        if (lead) {
          AppData.markViewed(id);
          SheetSend.show(lead, () => renderLeads());
        }
        return;
      }

      if (action === 'heart') {
        TG.haptic.medium();
        const isNowHot = AppData.toggleHot(id);
        actionBtn.textContent = isNowHot ? '♥' : '♡';
        actionBtn.classList.toggle('hot', isNowHot);
        showToast(isNowHot ? '🔥 Добавлено в горячие' : 'Убрано из горячих');
        return;
      }
    }

    // Тап на карточку → детали
    const card = e.target.closest('.lead-card');
    if (card) {
      TG.haptic.light();
      const id = card.dataset.id;
      const lead = AppData.getById(id);
      if (lead) {
        AppData.markViewed(id);
        Router.push(() => createDetails(lead, () => renderLeads()));
      }
    }
  });

  // Хедер: поиск
  el.querySelector('#btn-search').addEventListener('click', () => {
    TG.haptic.light();
    Router.push(() => createSearch());
  });

  // Хедер: настройки
  el.querySelector('#btn-settings').addEventListener('click', () => {
    TG.haptic.light();
    Router.push(() => createSettings());
  });

  // ── Первая отрисовка: скелетон → данные ───────────────────
  if (!loaded) {
    renderSkeleton();
    loaded = true;
    // Имитация небольшой задержки загрузки (в реальном приложении — API-запрос)
    setTimeout(() => renderLeads(), 500);
  }

  return {
    element: el,
    destroy: null,
  };
}

window.createFeed = createFeed;
