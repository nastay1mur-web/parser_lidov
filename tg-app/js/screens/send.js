/**
 * screens/send.js — Экран 3: Bottom Sheet "Написать"
 *
 * Выезжает снизу поверх любого экрана.
 * Позволяет выбрать канал (TG/VK/Email), шаблон, отредактировать текст.
 * Нажатие "Открыть чат →" → открывает ссылку через TG.openLink().
 *
 * Использование:
 *   SheetSend.show(lead, onClose?)
 *   SheetSend.hide()
 */

const SheetSend = (function () {
  let currentLead  = null;
  let currentChannel = 'telegram';
  let onCloseCallback = null;

  const overlay = document.getElementById('sheet-overlay');
  const sheet   = document.getElementById('sheet');

  // ── Каналы (только те, у которых есть ссылка) ─────────────
  function getChannels(lead) {
    const channels = [];
    // Telegram всегда доступен — строим t.me/username
    channels.push({ id: 'telegram', icon: '💬', label: 'Telegram', url: `https://t.me/${lead.username}` });
    if (lead.vk_id)  channels.push({ id: 'vk', icon: '🔷', label: 'VK', url: `https://vk.com/${lead.vk_id}` });
    if (lead.email)  channels.push({ id: 'email', icon: '📧', label: 'Email', url: `mailto:${lead.email}` });
    if (lead.phone)  channels.push({ id: 'wa', icon: '📱', label: 'WhatsApp', url: `https://wa.me/${lead.phone.replace(/\D/g,'')}` });
    return channels;
  }

  // ── URL для открытия чата ──────────────────────────────────
  function getChannelUrl(lead, channelId) {
    const ch = getChannels(lead).find(c => c.id === channelId);
    return ch?.url ?? `https://t.me/${lead.username}`;
  }

  // ── Рендер шита ───────────────────────────────────────────
  function render() {
    const lead = currentLead;
    const channels = getChannels(lead);

    // Первый шаблон по умолчанию
    const defaultTemplate = MESSAGE_TEMPLATES[0];
    const defaultText = fillTemplate(defaultTemplate.text, lead);

    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <div class="sheet-title">Написать @${escapeHtml(lead.username)}</div>

      <!-- Табы каналов -->
      <div class="channel-tabs" id="channel-tabs">
        ${channels.map(ch => `
          <button class="channel-tab ${ch.id === currentChannel ? 'active' : ''}"
                  data-channel="${ch.id}">
            ${ch.icon} ${ch.label}
          </button>
        `).join('')}
      </div>

      <!-- Куда ведёт -->
      <div class="channel-hint" id="channel-hint">
        → ${getChannelUrl(lead, currentChannel)}
      </div>

      <!-- Выбор шаблона -->
      <div class="sheet-template-row">
        <span class="sheet-template-label">Шаблон:</span>
        <select class="sheet-template-select" id="template-select">
          ${MESSAGE_TEMPLATES.map(t => `
            <option value="${t.id}">${t.name}</option>
          `).join('')}
        </select>
      </div>

      <!-- Текст сообщения -->
      <textarea class="sheet-textarea" id="sheet-msg" placeholder="Введите сообщение...">${escapeHtml(defaultText)}</textarea>

      <!-- Кнопка отправки -->
      <div class="sheet-footer">
        <button class="btn-primary" id="btn-open-chat">
          Открыть чат →
        </button>
      </div>
    `;

    bindSheetEvents();
  }

  // ── События внутри шита ───────────────────────────────────
  function bindSheetEvents() {
    const channelTabs  = sheet.querySelector('#channel-tabs');
    const channelHint  = sheet.querySelector('#channel-hint');
    const templateSel  = sheet.querySelector('#template-select');
    const msgArea      = sheet.querySelector('#sheet-msg');

    // Переключение каналов
    channelTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.channel-tab');
      if (!btn) return;
      TG.haptic.selection();

      currentChannel = btn.dataset.channel;
      channelTabs.querySelectorAll('.channel-tab').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
      channelHint.textContent = `→ ${getChannelUrl(currentLead, currentChannel)}`;
    });

    // Смена шаблона
    templateSel.addEventListener('change', () => {
      TG.haptic.selection();
      const tpl = MESSAGE_TEMPLATES.find(t => t.id === templateSel.value);
      if (tpl) {
        msgArea.value = fillTemplate(tpl.text, currentLead);
      }
    });

    // Кнопка "Открыть чат"
    sheet.querySelector('#btn-open-chat').addEventListener('click', () => {
      TG.haptic.success();
      const url = getChannelUrl(currentLead, currentChannel);
      TG.openLink(url);

      // Обновить статус лида
      AppData.updateLeadStatus(currentLead.id, 'contacted');
      showToast('💬 Чат открыт');

      hide();
      onCloseCallback?.();
    });
  }

  // ── Открыть шит ──────────────────────────────────────────
  function show(lead, onClose) {
    currentLead      = lead;
    currentChannel   = 'telegram';
    onCloseCallback  = onClose;

    render();

    // Показать оверлей
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      overlay.classList.add('sheet-overlay-enter');
      sheet.classList.add('sheet-enter');
    });

    // Клик на тёмный фон — закрыть
    overlay.onclick = (e) => {
      if (e.target === overlay) hide();
    };
  }

  // ── Закрыть шит ──────────────────────────────────────────
  function hide() {
    sheet.classList.remove('sheet-enter');
    sheet.classList.add('sheet-exit');
    overlay.classList.remove('sheet-overlay-enter');
    overlay.classList.add('sheet-overlay-exit');

    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('sheet-overlay-exit');
      sheet.classList.remove('sheet-exit');
      sheet.innerHTML = '';
      overlay.onclick = null;
    }, 240);
  }

  return { show, hide };
})();

window.SheetSend = SheetSend;
