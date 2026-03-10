/**
 * screens/search.js — Экран 4: Поиск
 *
 * Push-экран. Поиск по нику, тексту, ключевому слову.
 * Автофокус на поле ввода. Debounce 300ms.
 * Последние запросы сохраняются в localStorage.
 *
 * Связь:
 *   BackButton / btn-back → Router.pop()
 *   Тап на карточку → Router.push(createDetails)
 */

function createSearch() {
  const el = document.createElement('div');
  el.className = 'screen';

  el.innerHTML = `
    <!-- Хедер -->
    <div class="screen-header">
      <button class="btn-back" id="btn-back">←</button>
      <span class="screen-title">Поиск</span>
    </div>

    <!-- Поле ввода -->
    <div class="search-input-wrap">
      <input
        class="search-input"
        id="search-input"
        type="search"
        placeholder="🔍 Поиск по лидам..."
        autocomplete="off"
        autocorrect="off"
      >
    </div>

    <!-- Результаты / недавние запросы -->
    <div class="screen-body" id="search-results">
      <!-- Рендерится в renderResults() -->
    </div>
  `;

  const input   = el.querySelector('#search-input');
  const results = el.querySelector('#search-results');

  // ── Рендер недавних запросов ──────────────────────────────
  function renderRecents() {
    const recents = loadRecentSearches();
    if (recents.length === 0) {
      results.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-title">Начните вводить запрос</p>
          <p class="empty-subtitle">Поиск по нику, тексту и ключевым словам</p>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <div class="recent-searches-title">Недавние запросы</div>
      ${recents.map(q => `
        <div class="recent-search-item" data-query="${escapeHtml(q)}">
          <span style="font-size:16px;color:var(--tg-theme-hint-color)">🕐</span>
          <span style="font-size:15px;color:var(--tg-theme-text-color)">${escapeHtml(q)}</span>
        </div>
      `).join('')}
    `;

    // Тап на недавний → заполнить поле и искать
    results.querySelectorAll('.recent-search-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.query;
        doSearch(input.value);
      });
    });
  }

  // ── Рендер результатов поиска ────────────────────────────
  function renderLeadCards(leads) {
    if (leads.length === 0) {
      results.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-title">Ничего не найдено</p>
          <p class="empty-subtitle">Попробуйте другой запрос</p>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <div class="pt-2 pb-4">
        ${leads.map(lead => {
          const srcColor = SOURCE_COLORS[lead.source];
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
                      <span class="lead-time">${relativeTime(lead.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <span class="lead-keyword-chip">${escapeHtml(lead.keyword)}</span>
                <p class="lead-message" style="margin-top:6px">${escapeHtml(lead.message)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Тапы на карточки
    results.querySelectorAll('.lead-card').forEach(card => {
      card.addEventListener('click', () => {
        TG.haptic.light();
        const lead = AppData.getById(card.dataset.id);
        if (lead) {
          AppData.markViewed(lead.id);
          Router.push(() => createDetails(lead, null));
        }
      });
    });
  }

  // ── Поиск ────────────────────────────────────────────────
  function doSearch(query) {
    const q = query.trim();
    if (!q) { renderRecents(); return; }

    addRecentSearch(q);
    const found = AppData.search(q);
    renderLeadCards(found);
  }

  const debouncedSearch = debounce(doSearch, 300);

  // ── Событии ──────────────────────────────────────────────
  el.querySelector('#btn-back').addEventListener('click', () => {
    Router.pop();
  });

  input.addEventListener('input', () => {
    debouncedSearch(input.value);
  });

  // Очистка поля (кнопка × в input[type="search"])
  input.addEventListener('search', () => {
    if (!input.value) renderRecents();
  });

  // ── Первый рендер и автофокус ────────────────────────────
  renderRecents();

  // Автофокус с небольшой задержкой (после анимации slide-in)
  setTimeout(() => input.focus(), 280);

  return {
    element: el,
    destroy: () => input.blur(), // убрать клавиатуру при pop
  };
}

window.createSearch = createSearch;
