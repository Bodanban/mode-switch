// ============================================================
// APP.JS — Mode Switch Dashboard
// Pure vanilla JS, no frameworks, no dependencies
// Requires modes.js to be loaded first (globals: MODES,
// EMERGENCY_PROTOCOLS, UNIVERSAL_RULES, RESET_CHECKLIST,
// MEDICAL_CONTENT_RULES, NUTRITION_REMINDERS, SYSTEM_MATERIAL)
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // SYSTEM QUOTES (rotated daily)
  // ============================================================
  const SYSTEM_QUOTES = [
    'Le protocole prime sur l\'émotion.',
    'Un mode. Un objectif. Une exécution.',
    'La récupération est aussi de la performance.',
    'L\'environnement prime sur la volonté.',
    'Identifier. Activer. Exécuter.',
    'Pas d\'improvisation. Pas de négociation.',
    'Ce qui est mesuré est maîtrisé.',
    'Un seul écran. Une seule tâche. Un seul but.',
    'Le noyau ne se négocie pas.',
    'Reprendre n\'est pas échouer — c\'est le système qui fonctionne.',
  ];

  // Mode order for keyboard shortcuts
  const MODE_ORDER = ['normal', 'stage', 'pregarde', 'garde', 'recovery', 'off', 'reprise'];

  // ============================================================
  // STATE
  // ============================================================
  const State = {
    currentMode: null,            // selected mode id (not yet entered)
    activeMode: null,             // currently active/entered mode id
    activeScreen: 'home',         // 'home' | 'mode'
    theme: 'dark',
    lastMode: null,
    lastModeTimestamp: null,
    checklistState: {},           // { key: boolean }
    timer: {
      running: false,
      remaining: 0,               // seconds remaining
      total: 0,                   // total seconds for current preset
      interval: null,
      selectedPreset: 20,         // minutes
    },
    timerFullscreen: false,
    suggestionDismissed: false,
  };

  // ============================================================
  // LOCALSTORAGE HELPERS
  // ============================================================
  function lsGet(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function lsSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) { /* storage might be full or unavailable */ }
  }

  function lsGetJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function lsSetJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* noop */ }
  }

  // ============================================================
  // DOM HELPERS
  // ============================================================
  function el(id) { return document.getElementById(id); }
  function qs(selector, context) { return (context || document).querySelector(selector); }
  function qsAll(selector, context) { return Array.from((context || document).querySelectorAll(selector)); }

  function setText(id, text) {
    const element = el(id);
    if (element) element.textContent = text;
  }

  function announce(message) {
    const announcer = el('sr-announcer');
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => { announcer.textContent = message; }, 50);
    }
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    loadStateFromStorage();
    setSystemQuote();
    initClock();
    renderModeGrid();
    renderLastModeIndicator();
    checkAndShowSuggestion();
    setupHomeEventListeners();
    setupModeScreenListeners();
    setupModalListeners();
    setupKeyboardShortcuts();
    setupTheme();
    initTimer();
    renderResetChecklist();
    renderEmergencyProtocols();
    renderUniversalModal();

    // PWA service worker registration (if available)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () {
        // Service worker not found — that's OK, works without it
      });
    }
  }

  // ============================================================
  // LOAD STATE FROM STORAGE
  // ============================================================
  function loadStateFromStorage() {
    State.lastMode = lsGet('lastMode', null);
    State.lastModeTimestamp = lsGet('lastModeTimestamp', null);
    State.theme = lsGet('theme', 'dark');
    State.checklistState = lsGetJSON('checklistState', {});
    State.suggestionDismissed = lsGet('suggestionDismissed', null) === 'true';

    // Re-open last active mode if it was recently active (within same day)
    const savedActiveMode = lsGet('activeMode', null);
    if (savedActiveMode && MODES[savedActiveMode]) {
      State.activeMode = savedActiveMode;
      State.currentMode = savedActiveMode;
    }
  }

  // ============================================================
  // SYSTEM QUOTE
  // ============================================================
  function setSystemQuote() {
    const quoteEl = el('system-quote');
    if (!quoteEl) return;
    const dayIndex = Math.floor(Date.now() / 86400000) % SYSTEM_QUOTES.length;
    quoteEl.textContent = SYSTEM_QUOTES[dayIndex];
  }

  // ============================================================
  // CLOCK — updates every second
  // ============================================================
  function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
  }

  function updateClock() {
    const now = new Date();

    // Time display HH:MM:SS
    const timeStr = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Date display in French
    const dateStr = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    setText('clock-time', timeStr);
    setText('clock-date', dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
  }

  // ============================================================
  // SMART SUGGESTION LOGIC
  // ============================================================
  function getSuggestion() {
    const now = Date.now();
    const lastTS = State.lastModeTimestamp ? parseInt(State.lastModeTimestamp, 10) : null;
    const hourNow = new Date().getHours();
    const msSinceLastMode = lastTS ? now - lastTS : null;
    const HOUR = 3600000;
    const DAY = 86400000;

    // If dismissed recently (same session), don't show again
    if (State.suggestionDismissed) {
      return { show: false, message: '', targetMode: null };
    }

    // After garde, strongly suggest recovery
    if (State.lastMode === 'garde' && msSinceLastMode !== null && msSinceLastMode < 24 * HOUR) {
      return {
        show: true,
        message: 'Tu viens de terminer une garde. Mode RECOVERY recommandé.',
        targetMode: 'recovery',
      };
    }

    // After recovery, suggest normal or off
    if (State.lastMode === 'recovery' && msSinceLastMode !== null && msSinceLastMode < 36 * HOUR) {
      return {
        show: true,
        message: 'Recovery terminé. Retour en mode NORMAL ou OFF selon ton énergie.',
        targetMode: 'normal',
      };
    }

    // After reprise, suggest normal
    if (State.lastMode === 'reprise' && msSinceLastMode !== null && msSinceLastMode < 24 * HOUR) {
      return {
        show: true,
        message: 'Reprise effectuée. Mode NORMAL pour aujourd\'hui.',
        targetMode: 'normal',
      };
    }

    // No activity for 48h+ → suggest reprise
    if (lastTS !== null && msSinceLastMode > 48 * HOUR) {
      return {
        show: true,
        message: 'Absence de 48h+ détectée. Mode REPRISE recommandé.',
        targetMode: 'reprise',
      };
    }

    // Early morning without mode set, suggest checking garde
    if (hourNow >= 5 && hourNow < 7 && !State.activeMode) {
      return {
        show: true,
        message: 'Début de journée — identifie ton mode avant de commencer.',
        targetMode: null,
      };
    }

    // Pre-garde suggestion in the afternoon
    if (hourNow >= 14 && hourNow < 20 && State.lastMode === 'normal') {
      return {
        show: false, // subtle — don't always show this
        message: 'Garde demain ? Passe en mode PRÉ-GARDE dès maintenant.',
        targetMode: 'pregarde',
      };
    }

    return { show: false, message: '', targetMode: null };
  }

  function checkAndShowSuggestion() {
    const suggestion = getSuggestion();
    const banner = el('suggestion-banner');
    if (!banner) return;

    if (suggestion.show) {
      banner.style.display = 'flex';
      setText('suggestion-text', suggestion.message);

      const actionBtn = el('suggestion-action-btn');
      if (actionBtn) {
        if (suggestion.targetMode) {
          actionBtn.style.display = 'inline-flex';
          actionBtn.onclick = function () {
            selectMode(suggestion.targetMode);
            banner.style.display = 'none';
          };
        } else {
          actionBtn.style.display = 'none';
        }
      }

      const dismissBtn = el('suggestion-dismiss');
      if (dismissBtn) {
        dismissBtn.onclick = function () {
          banner.style.display = 'none';
          State.suggestionDismissed = true;
          lsSet('suggestionDismissed', 'true');
        };
      }
    } else {
      banner.style.display = 'none';
    }
  }

  // ============================================================
  // LAST MODE INDICATOR
  // ============================================================
  function renderLastModeIndicator() {
    const indicator = el('last-mode-indicator');
    if (!indicator) return;

    if (!State.lastMode || !MODES[State.lastMode]) {
      indicator.style.display = 'none';
      return;
    }

    indicator.style.display = 'flex';
    const mode = MODES[State.lastMode];
    setText('last-mode-name', mode.shortName.toUpperCase());

    if (State.lastModeTimestamp) {
      const diff = getRelativeTime(parseInt(State.lastModeTimestamp, 10));
      setText('last-mode-time', diff);
    }
  }

  function getRelativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 5) return 'à l\'instant';
    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours}h`;
    if (days === 1) return 'hier';
    return `il y a ${days} jours`;
  }

  // ============================================================
  // MODE GRID RENDERING
  // ============================================================
  function renderModeGrid() {
    const grid = el('mode-grid');
    if (!grid) return;

    grid.innerHTML = '';

    MODE_ORDER.forEach(function (modeId, index) {
      const mode = MODES[modeId];
      if (!mode) return;

      const card = document.createElement('div');
      card.className = 'mode-card';
      card.setAttribute('data-mode-id', modeId);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', mode.name);
      card.style.setProperty('--card-color', mode.color);

      if (State.currentMode === modeId) {
        card.classList.add('active');
      }

      card.innerHTML = [
        '<div class="mode-card-shortcut">[' + (index + 1) + ']</div>',
        '<div class="mode-card-name">' + escapeHtml(mode.shortName.toUpperCase()) + '</div>',
        '<div class="mode-card-energy" style="color:' + mode.color + '">' + escapeHtml(mode.energyLevel) + '</div>',
        '<div class="mode-card-intent">' + escapeHtml(mode.intent) + '</div>',
      ].join('');

      card.addEventListener('click', function () {
        selectMode(modeId);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMode(modeId);
        }
      });

      grid.appendChild(card);
    });
  }

  // ============================================================
  // SELECT MODE (highlights card, enables enter button)
  // ============================================================
  function selectMode(modeId) {
    if (!MODES[modeId]) return;

    State.currentMode = modeId;

    // Update card highlighting
    qsAll('.mode-card').forEach(function (card) {
      if (card.getAttribute('data-mode-id') === modeId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Enable enter button
    const enterBtn = el('btn-enter-mode');
    if (enterBtn) {
      enterBtn.disabled = false;
      enterBtn.textContent = 'ENTRER — ' + MODES[modeId].shortName.toUpperCase();
    }

    // Set mode color
    document.body.setAttribute('data-mode', modeId);

    announce('Mode sélectionné : ' + MODES[modeId].name);
  }

  // ============================================================
  // ENTER MODE — switch to mode screen
  // ============================================================
  function enterMode(modeId) {
    if (!modeId) modeId = State.currentMode;
    if (!modeId || !MODES[modeId]) return;

    const mode = MODES[modeId];

    // Update state
    State.activeMode = modeId;
    State.currentMode = modeId;
    State.activeScreen = 'mode';

    // Save to localStorage
    lsSet('lastMode', modeId);
    lsSet('activeMode', modeId);
    lsSet('lastModeTimestamp', Date.now().toString());
    State.lastMode = modeId;
    State.lastModeTimestamp = Date.now().toString();

    // Apply mode color
    document.body.setAttribute('data-mode', modeId);

    // Render mode screen
    renderModeScreen(mode);

    // Switch screens
    const homeScreen = el('screen-home');
    const modeScreen = el('screen-mode');

    if (homeScreen) homeScreen.style.display = 'none';
    if (modeScreen) {
      modeScreen.style.display = 'block';
      modeScreen.scrollTop = 0;
      window.scrollTo(0, 0);
    }

    announce('Mode activé : ' + mode.name + '. ' + mode.intent);
  }

  // ============================================================
  // RENDER MODE SCREEN
  // ============================================================
  function renderModeScreen(mode) {
    // HEADER
    setText('mode-name', mode.name);
    setText('mode-badge', mode.id.toUpperCase());
    setText('mode-energy', 'ÉNERGIE : ' + mode.energyLevel);
    setText('mode-intent', mode.intent);
    setText('mode-when', 'Contexte : ' + mode.when);

    const modeHeader = el('mode-header');
    if (modeHeader) {
      modeHeader.style.borderBottomColor = mode.color;
    }

    // OBJECTIVE
    setText('mode-objective', mode.objective);

    // CRITICAL RULES
    const criticalList = el('critical-list');
    if (criticalList) {
      criticalList.innerHTML = '';
      mode.criticalRules.forEach(function (rule) {
        const li = document.createElement('li');
        li.textContent = rule;
        criticalList.appendChild(li);
      });
    }

    // PLANNING
    renderPlanning(mode);

    // CORE
    const coreList = el('core-list');
    if (coreList) {
      coreList.innerHTML = '';
      mode.core.forEach(function (item) {
        const li = document.createElement('li');
        li.textContent = item;
        coreList.appendChild(li);
      });
    }

    // INTERDICTIONS
    const interdictionsList = el('interdictions-list');
    if (interdictionsList) {
      interdictionsList.innerHTML = '';
      mode.interdictions.forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'interdiction-item';
        li.textContent = item;
        interdictionsList.appendChild(li);
      });
    }

    // START CHECKLIST
    renderChecklist('start-checklist', mode.startChecklist, mode.id, 'start');

    // END CHECKLIST
    renderChecklist('end-checklist', mode.endChecklist, mode.id, 'end');

    // BEHAVIORAL LAYER
    setText('beh-when', mode.when);
    setText('beh-error', mode.classicError);
    setText('beh-validation', mode.validation);
    setText('beh-exit', mode.exitSignal);

    // NEXT MODE SUGGESTIONS
    renderNextModes(mode);

    // TRANSITION NOTE
    setText('transition-note', mode.transitionNote);

    // RESET timer preset display
    updateTimerDisplay();
  }

  // ============================================================
  // RENDER PLANNING
  // ============================================================

  // Parse "HH:MM" or "HH:MM–HH:MM" → returns start time as total minutes
  function parseBlockStartMinutes(timeStr) {
    if (!timeStr) return null;
    // Take only the start time (before "–" if range)
    const start = timeStr.split('–')[0].trim().replace('h', ':');
    const parts = start.split(':');
    if (parts.length < 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }

  function highlightCurrentPlanningBlock() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const blocks = qsAll('.time-block');
    if (!blocks.length) return;

    // Build array of start times
    const startTimes = blocks.map(function (b) {
      return parseBlockStartMinutes(b.querySelector('.time-block-time').textContent);
    });

    let activeIndex = -1;
    for (let i = 0; i < startTimes.length; i++) {
      const t = startTimes[i];
      if (t === null) continue;
      const next = startTimes.slice(i + 1).find(function (v) { return v !== null; });
      const end = (next !== undefined) ? next : t + 90;
      if (currentMinutes >= t && currentMinutes < end) {
        activeIndex = i;
        break;
      }
    }

    // If no active found but all times are past, mark last as past
    blocks.forEach(function (b, i) {
      b.classList.remove('time-block--active', 'time-block--past', 'time-block--next');
      const t = startTimes[i];
      if (t === null) return;

      if (i === activeIndex) {
        b.classList.add('time-block--active');
      } else if (activeIndex === -1) {
        // Nothing active yet — mark past items
        const allFuture = startTimes.every(function (v) { return v === null || v > currentMinutes; });
        if (!allFuture && t < currentMinutes) {
          b.classList.add('time-block--past');
        } else if (b === blocks[0] || (t !== null && t > currentMinutes)) {
          // first upcoming = next
          if (!blocks.some(function (bb) { return bb.classList.contains('time-block--next'); })) {
            b.classList.add('time-block--next');
          }
        }
      } else if (t < startTimes[activeIndex]) {
        b.classList.add('time-block--past');
      } else if (i === activeIndex + 1) {
        b.classList.add('time-block--next');
      }
    });
  }

  function renderPlanning(mode) {
    const container = el('time-blocks');
    if (!container) return;

    container.innerHTML = '';

    mode.planning.forEach(function (item) {
      const block = document.createElement('div');
      block.className = 'time-block';
      block.setAttribute('data-type', item.type || 'content');

      block.innerHTML = [
        '<span class="time-block-time">' + escapeHtml(item.time) + '</span>',
        '<span class="time-block-action">' + escapeHtml(item.action) + '</span>',
        '<span class="time-block-now-label">EN COURS</span>',
      ].join('');

      container.appendChild(block);
    });

    // Highlight immediately then every 60s
    highlightCurrentPlanningBlock();
    if (State._planningInterval) clearInterval(State._planningInterval);
    State._planningInterval = setInterval(highlightCurrentPlanningBlock, 60000);
  }

  // ============================================================
  // RENDER CHECKLIST
  // ============================================================
  function renderChecklist(containerId, items, modeId, listType) {
    const container = el(containerId);
    if (!container) return;

    container.innerHTML = '';

    items.forEach(function (itemText, index) {
      const key = 'checklist_' + modeId + '_' + listType + '_' + index;
      const isChecked = State.checklistState[key] === true;

      const li = document.createElement('li');
      li.className = 'checklist-item' + (isChecked ? ' checked' : '');
      li.setAttribute('data-key', key);

      li.innerHTML = [
        '<span class="checklist-checkbox" role="checkbox" aria-checked="' + isChecked + '" aria-label="' + escapeHtml(itemText) + '"></span>',
        '<span class="checklist-label">' + escapeHtml(itemText) + '</span>',
      ].join('');

      li.addEventListener('click', function () {
        toggleChecklist(li, key);
      });

      container.appendChild(li);
    });
  }

  // ============================================================
  // CHECKLIST TOGGLE
  // ============================================================
  function toggleChecklist(itemEl, key) {
    const isChecked = itemEl.classList.contains('checked');
    const newState = !isChecked;

    if (newState) {
      itemEl.classList.add('checked');
    } else {
      itemEl.classList.remove('checked');
    }

    const checkbox = qs('.checklist-checkbox', itemEl);
    if (checkbox) checkbox.setAttribute('aria-checked', newState.toString());

    State.checklistState[key] = newState;
    lsSetJSON('checklistState', State.checklistState);
  }

  function checkAllInList(listId, modeId, listType) {
    const container = el(listId);
    if (!container) return;

    const items = qsAll('.checklist-item', container);
    items.forEach(function (item) {
      const key = item.getAttribute('data-key');
      if (key && !item.classList.contains('checked')) {
        item.classList.add('checked');
        State.checklistState[key] = true;
        const checkbox = qs('.checklist-checkbox', item);
        if (checkbox) checkbox.setAttribute('aria-checked', 'true');
      }
    });

    lsSetJSON('checklistState', State.checklistState);
  }

  // ============================================================
  // RENDER NEXT MODES
  // ============================================================
  function renderNextModes(mode) {
    const container = el('next-modes');
    if (!container) return;

    container.innerHTML = '';

    if (!mode.nextModes || mode.nextModes.length === 0) {
      container.textContent = 'Aucune suggestion';
      return;
    }

    mode.nextModes.forEach(function (nextModeId) {
      const nextMode = MODES[nextModeId];
      if (!nextMode) return;

      const btn = document.createElement('button');
      btn.className = 'next-mode-btn';
      btn.textContent = nextMode.shortName.toUpperCase();
      btn.style.borderColor = nextMode.color;
      btn.style.color = nextMode.color;

      btn.addEventListener('click', function () {
        // Go back to home and pre-select this mode
        goHome();
        setTimeout(function () {
          selectMode(nextModeId);
        }, 50);
      });

      container.appendChild(btn);
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  function goHome() {
    State.activeScreen = 'home';

    const homeScreen = el('screen-home');
    const modeScreen = el('screen-mode');

    if (modeScreen) modeScreen.style.display = 'none';
    if (homeScreen) homeScreen.style.display = 'block';

    window.scrollTo(0, 0);
    renderLastModeIndicator();

    // Keep mode color indicator but don't override
    if (State.currentMode) {
      document.body.setAttribute('data-mode', State.currentMode);
    }

    announce('Retour à l\'accueil');
  }

  // ============================================================
  // HOME EVENT LISTENERS
  // ============================================================
  function setupHomeEventListeners() {
    // Enter mode button
    const enterBtn = el('btn-enter-mode');
    if (enterBtn) {
      enterBtn.addEventListener('click', function () {
        if (State.currentMode) {
          enterMode(State.currentMode);
        }
      });
    }

    // Reset environment modal
    const resetBtn = el('btn-reset-env');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        openModal('modal-reset');
      });
    }

    // Emergency modal
    const emergencyBtn = el('btn-emergency');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', function () {
        openModal('modal-emergency');
      });
    }

    // Theme toggle
    const themeBtn = el('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Universal rules
    const universalBtn = el('btn-universal');
    if (universalBtn) {
      universalBtn.addEventListener('click', function () {
        openModal('modal-universal');
      });
    }

    // Fullscreen
    const fsBtn = el('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', toggleFullscreen);
    }

    // If a mode was active last session, allow re-entering
    if (State.activeMode && MODES[State.activeMode]) {
      selectMode(State.activeMode);
    }
  }

  // ============================================================
  // MODE SCREEN EVENT LISTENERS
  // ============================================================
  function setupModeScreenListeners() {
    // Back buttons
    const backBtn = el('btn-back');
    const backBtn2 = el('btn-back-2');

    if (backBtn) backBtn.addEventListener('click', goHome);
    if (backBtn2) backBtn2.addEventListener('click', goHome);

    // Change mode = go home
    const changeModeBtn = el('btn-change-mode');
    if (changeModeBtn) changeModeBtn.addEventListener('click', goHome);

    // Execute button
    const executeBtn = el('btn-execute');
    if (executeBtn) {
      executeBtn.addEventListener('click', function () {
        document.body.classList.add('focus-mode');
        announce('Exécution du mode ' + (State.activeMode ? MODES[State.activeMode].name : '') + ' confirmée.');

        // Start timer if not running
        if (!State.timer.running) {
          startTimer();
        }
      });
    }

    // Mode done → recovery
    const modeDoneBtn = el('btn-mode-done');
    if (modeDoneBtn) {
      modeDoneBtn.addEventListener('click', function () {
        document.body.classList.remove('focus-mode');
        lsSet('activeMode', '');
        State.activeMode = null;
        goHome();
        selectMode('recovery');
        announce('Mode terminé. Passage en mode Recovery recommandé.');
      });
    }

    // Copy protocol
    const copyBtn = el('btn-copy-protocol');
    if (copyBtn) copyBtn.addEventListener('click', copyProtocol);

    // Print
    const printBtn = el('btn-print');
    if (printBtn) printBtn.addEventListener('click', printProtocol);

    // Timer controls
    const timerStartBtn = el('btn-timer-start');
    const timerResetBtn = el('btn-timer-reset');
    const timerFsBtn = el('btn-timer-fullscreen');

    if (timerStartBtn) timerStartBtn.addEventListener('click', toggleTimer);
    if (timerResetBtn) timerResetBtn.addEventListener('click', resetTimer);
    if (timerFsBtn) timerFsBtn.addEventListener('click', openTimerFullscreen);

    // Timer presets
    qsAll('.timer-preset').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const minutes = parseInt(this.getAttribute('data-minutes'), 10);
        setTimerPreset(minutes);
        qsAll('.timer-preset').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    // Check-all buttons
    qsAll('.check-all-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-target');
        if (target === 'start') {
          checkAllInList('start-checklist', State.activeMode, 'start');
        } else if (target === 'end') {
          checkAllInList('end-checklist', State.activeMode, 'end');
        }
      });
    });

    // Fullscreen timer controls
    const fsBtnStart = el('btn-fs-timer-start');
    const fsBtnReset = el('btn-fs-timer-reset');
    const fsBtnClose = el('btn-fs-timer-close');

    if (fsBtnStart) fsBtnStart.addEventListener('click', toggleTimer);
    if (fsBtnReset) fsBtnReset.addEventListener('click', resetTimer);
    if (fsBtnClose) fsBtnClose.addEventListener('click', closeTimerFullscreen);
  }

  // ============================================================
  // MODAL SYSTEM
  // ============================================================
  function openModal(modalId) {
    const modal = el(modalId);
    if (!modal) return;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');

    // Focus trap — focus first interactive element
    setTimeout(function () {
      const focusable = modal.querySelector('button, [tabindex="0"]');
      if (focusable) focusable.focus();
    }, 100);

    // Click outside to close
    modal.addEventListener('click', function handler(e) {
      if (e.target === modal) {
        closeModal(modalId);
        modal.removeEventListener('click', handler);
      }
    });

    announce('Modal ouvert : ' + (modal.getAttribute('aria-labelledby') ? (el(modal.getAttribute('aria-labelledby')) || {}).textContent || '' : ''));
  }

  function closeModal(modalId) {
    const modal = el(modalId);
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  function setupModalListeners() {
    // Close buttons in modals
    qsAll('.modal-close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const modalId = this.getAttribute('data-modal');
        if (modalId) closeModal(modalId);
      });
    });

    // Reset modal
    const resetAllBtn = el('btn-reset-all');
    const resetClearBtn = el('btn-reset-clear');

    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', function () {
        qsAll('#reset-checklist .checklist-item').forEach(function (item) {
          item.classList.add('checked');
          const checkbox = qs('.checklist-checkbox', item);
          if (checkbox) checkbox.setAttribute('aria-checked', 'true');
        });
      });
    }

    if (resetClearBtn) {
      resetClearBtn.addEventListener('click', function () {
        qsAll('#reset-checklist .checklist-item').forEach(function (item) {
          item.classList.remove('checked');
          const checkbox = qs('.checklist-checkbox', item);
          if (checkbox) checkbox.setAttribute('aria-checked', 'false');
        });
      });
    }

    // Universal modal tabs
    qsAll('.universal-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        const tabId = this.getAttribute('data-tab');

        qsAll('.universal-tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        // Hide all tab content
        qsAll('.universal-tab-content').forEach(function (content) {
          content.style.display = 'none';
        });

        // Show target
        const targetContent = el('tab-' + tabId);
        if (targetContent) targetContent.style.display = 'block';
      });
    });
  }

  // ============================================================
  // RENDER RESET CHECKLIST
  // ============================================================
  function renderResetChecklist() {
    const container = el('reset-checklist');
    if (!container) return;

    container.innerHTML = '';

    RESET_CHECKLIST.forEach(function (itemText, index) {
      const li = document.createElement('li');
      li.className = 'checklist-item';
      li.setAttribute('data-index', index);

      li.innerHTML = [
        '<span class="checklist-checkbox" role="checkbox" aria-checked="false" aria-label="' + escapeHtml(itemText) + '"></span>',
        '<span class="checklist-label">' + escapeHtml(itemText) + '</span>',
      ].join('');

      li.addEventListener('click', function () {
        const isChecked = li.classList.contains('checked');
        if (isChecked) {
          li.classList.remove('checked');
          qs('.checklist-checkbox', li).setAttribute('aria-checked', 'false');
        } else {
          li.classList.add('checked');
          qs('.checklist-checkbox', li).setAttribute('aria-checked', 'true');
        }
      });

      container.appendChild(li);
    });
  }

  // ============================================================
  // RENDER EMERGENCY PROTOCOLS
  // ============================================================
  function renderEmergencyProtocols() {
    const container = el('emergency-protocols');
    if (!container) return;

    container.innerHTML = '';

    EMERGENCY_PROTOCOLS.forEach(function (protocol) {
      const section = document.createElement('div');
      section.className = 'emergency-protocol';
      section.setAttribute('data-id', protocol.id);

      // Header (toggle button)
      const header = document.createElement('button');
      header.className = 'emergency-protocol-header';
      header.innerHTML = [
        '<span class="emergency-protocol-icon">' + (protocol.icon || '!') + '</span>',
        '<span>' + escapeHtml(protocol.name) + '</span>',
        '<span class="emergency-protocol-toggle">▼</span>',
      ].join('');

      header.addEventListener('click', function () {
        section.classList.toggle('expanded');
      });

      // Body
      const body = document.createElement('div');
      body.className = 'emergency-protocol-body';

      // Symptom
      const symptomEl = document.createElement('div');
      symptomEl.className = 'emergency-symptom';
      symptomEl.textContent = protocol.symptom;
      body.appendChild(symptomEl);

      // Immediate response
      const responseTitle = document.createElement('div');
      responseTitle.className = 'emergency-section-title';
      responseTitle.textContent = 'RÉPONSE IMMÉDIATE';
      body.appendChild(responseTitle);

      const steps = document.createElement('div');
      steps.className = 'emergency-steps';
      protocol.immediateResponse.forEach(function (step, i) {
        const stepEl = document.createElement('div');
        stepEl.className = 'emergency-step';
        stepEl.setAttribute('data-step', (i + 1) + '.');
        stepEl.textContent = step;
        steps.appendChild(stepEl);
      });
      body.appendChild(steps);

      // Cancel list
      if (protocol.cancel && protocol.cancel.length > 0) {
        const cancelTitle = document.createElement('div');
        cancelTitle.className = 'emergency-section-title';
        cancelTitle.textContent = 'À ANNULER / ÉVITER';
        body.appendChild(cancelTitle);

        const cancelList = document.createElement('div');
        cancelList.className = 'emergency-cancel-list';
        protocol.cancel.forEach(function (item) {
          const itemEl = document.createElement('div');
          itemEl.className = 'emergency-cancel-item';
          itemEl.textContent = item;
          cancelList.appendChild(itemEl);
        });
        body.appendChild(cancelList);
      }

      // Min vital
      if (protocol.minVital) {
        const minVitalEl = document.createElement('div');
        minVitalEl.className = 'emergency-minvital';
        minVitalEl.textContent = 'MINIMUM VITAL : ' + protocol.minVital;
        body.appendChild(minVitalEl);
      }

      section.appendChild(header);
      section.appendChild(body);
      container.appendChild(section);
    });
  }

  // ============================================================
  // RENDER UNIVERSAL MODAL
  // ============================================================
  function renderUniversalModal() {
    renderListIntoEl('universal-rules-list', UNIVERSAL_RULES);
    renderListIntoEl('medical-rules-list', MEDICAL_CONTENT_RULES);
    renderListIntoEl('nutrition-list', NUTRITION_REMINDERS);
    renderListIntoEl('material-list', SYSTEM_MATERIAL);
  }

  function renderListIntoEl(containerId, items) {
    const container = el(containerId);
    if (!container) return;

    container.innerHTML = '';
    (items || []).forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = item;
      container.appendChild(li);
    });
  }

  // ============================================================
  // TIMER
  // ============================================================
  function initTimer() {
    const savedPreset = parseInt(lsGet('timerPreset', '20'), 10);
    State.timer.selectedPreset = savedPreset || 20;
    State.timer.total = State.timer.selectedPreset * 60;
    State.timer.remaining = State.timer.total;
    updateTimerDisplay();
  }

  function setTimerPreset(minutes) {
    if (State.timer.running) {
      stopTimer();
    }
    State.timer.selectedPreset = minutes;
    State.timer.total = minutes * 60;
    State.timer.remaining = State.timer.total;
    lsSet('timerPreset', minutes.toString());
    updateTimerDisplay();

    const timerWidget = qs('.timer-widget');
    if (timerWidget) {
      timerWidget.classList.remove('timer-running', 'timer-done');
    }

    const startBtn = el('btn-timer-start');
    if (startBtn) startBtn.textContent = 'DÉMARRER';

    const fsBtnStart = el('btn-fs-timer-start');
    if (fsBtnStart) fsBtnStart.textContent = 'DÉMARRER';
  }

  function toggleTimer() {
    if (State.timer.running) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    if (State.timer.remaining <= 0) {
      resetTimer();
      return;
    }

    State.timer.running = true;

    const timerWidget = qs('.timer-widget');
    if (timerWidget) {
      timerWidget.classList.add('timer-running');
      timerWidget.classList.remove('timer-done');
    }

    const startBtn = el('btn-timer-start');
    const fsBtnStart = el('btn-fs-timer-start');
    if (startBtn) startBtn.textContent = 'ARRÊTER';
    if (fsBtnStart) fsBtnStart.textContent = 'ARRÊTER';

    State.timer.interval = setInterval(function () {
      if (State.timer.remaining > 0) {
        State.timer.remaining--;
        updateTimerDisplay();
      } else {
        timerDone();
      }
    }, 1000);

    announce('Timer démarré : ' + formatTime(State.timer.remaining));
  }

  function stopTimer() {
    State.timer.running = false;
    clearInterval(State.timer.interval);
    State.timer.interval = null;

    const timerWidget = qs('.timer-widget');
    if (timerWidget) timerWidget.classList.remove('timer-running');

    const startBtn = el('btn-timer-start');
    const fsBtnStart = el('btn-fs-timer-start');
    if (startBtn) startBtn.textContent = 'REPRENDRE';
    if (fsBtnStart) fsBtnStart.textContent = 'REPRENDRE';
  }

  function resetTimer() {
    stopTimer();
    State.timer.remaining = State.timer.total;
    updateTimerDisplay();

    const timerWidget = qs('.timer-widget');
    if (timerWidget) timerWidget.classList.remove('timer-done');

    const startBtn = el('btn-timer-start');
    const fsBtnStart = el('btn-fs-timer-start');
    if (startBtn) startBtn.textContent = 'DÉMARRER';
    if (fsBtnStart) fsBtnStart.textContent = 'DÉMARRER';
  }

  function timerDone() {
    stopTimer();
    State.timer.remaining = 0;
    updateTimerDisplay();

    const timerWidget = qs('.timer-widget');
    const fsDisplay = el('timer-fs-display');

    if (timerWidget) {
      timerWidget.classList.add('timer-done');
      timerWidget.classList.add('timer-done-flash');
      setTimeout(function () {
        timerWidget.classList.remove('timer-done-flash');
      }, 1500);
    }

    if (fsDisplay) {
      fsDisplay.classList.add('done');
      fsDisplay.classList.add('timer-done-flash');
      setTimeout(function () {
        fsDisplay.classList.remove('timer-done-flash');
        fsDisplay.classList.remove('done');
      }, 1500);
    }

    const startBtn = el('btn-timer-start');
    const fsBtnStart = el('btn-fs-timer-start');
    if (startBtn) startBtn.textContent = 'DÉMARRER';
    if (fsBtnStart) fsBtnStart.textContent = 'DÉMARRER';

    announce('Timer terminé !');
  }

  function updateTimerDisplay() {
    const timeStr = formatTime(State.timer.remaining);
    const totalStr = formatTime(State.timer.total);
    const progressPercent = State.timer.total > 0
      ? (State.timer.remaining / State.timer.total) * 100
      : 100;

    // Widget
    setText('timer-display', timeStr);
    const fill = el('timer-progress-fill');
    if (fill) fill.style.width = progressPercent + '%';

    // Fullscreen
    setText('timer-fs-display', timeStr);
    setText('timer-fs-label', 'TIMER — ' + totalStr);
    const fsFill = el('timer-fs-progress-fill');
    if (fsFill) fsFill.style.width = progressPercent + '%';

    if (State.timer.running) {
      const fsDisplay = el('timer-fs-display');
      if (fsDisplay) {
        fsDisplay.classList.add('running');
        fsDisplay.classList.remove('done');
      }
    }
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  // ============================================================
  // TIMER FULLSCREEN
  // ============================================================
  function openTimerFullscreen() {
    State.timerFullscreen = true;
    const overlay = el('timer-fullscreen');
    if (overlay) overlay.style.display = 'flex';
    updateTimerDisplay();
    announce('Timer plein écran ouvert');
  }

  function closeTimerFullscreen() {
    State.timerFullscreen = false;
    const overlay = el('timer-fullscreen');
    if (overlay) overlay.style.display = 'none';
    announce('Timer plein écran fermé');
  }

  // ============================================================
  // COPY PROTOCOL
  // ============================================================
  function copyProtocol() {
    if (!State.activeMode || !MODES[State.activeMode]) return;

    const mode = MODES[State.activeMode];
    const lines = [];

    lines.push('=== ' + mode.name + ' ===');
    lines.push('Énergie : ' + mode.energyLevel);
    lines.push('Intent : ' + mode.intent);
    lines.push('');
    lines.push('OBJECTIF : ' + mode.objective);
    lines.push('');
    lines.push('--- RÈGLES CRITIQUES ---');
    mode.criticalRules.forEach(function (r) { lines.push('! ' + r); });
    lines.push('');
    lines.push('--- PLANNING ---');
    mode.planning.forEach(function (p) { lines.push(p.time + ' — ' + p.action); });
    lines.push('');
    lines.push('--- NOYAU ---');
    mode.core.forEach(function (c) { lines.push('◆ ' + c); });
    lines.push('');
    lines.push('--- INTERDICTIONS ---');
    mode.interdictions.forEach(function (i) { lines.push('✗ ' + i); });
    lines.push('');
    lines.push('--- CHECKLIST DÉMARRAGE ---');
    mode.startChecklist.forEach(function (c) { lines.push('☐ ' + c); });
    lines.push('');
    lines.push('--- CHECKLIST FIN ---');
    mode.endChecklist.forEach(function (c) { lines.push('☐ ' + c); });
    lines.push('');
    lines.push('Erreur classique : ' + mode.classicError);
    lines.push('Validation : ' + mode.validation);
    lines.push('Signal de sortie : ' + mode.exitSignal);

    const text = lines.join('\n');

    try {
      navigator.clipboard.writeText(text).then(function () {
        showCopyConfirmation();
      }).catch(function () {
        fallbackCopy(text);
      });
    } catch (e) {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopyConfirmation();
    } catch (e) { /* noop */ }
    document.body.removeChild(textarea);
  }

  function showCopyConfirmation() {
    const conf = el('copy-confirmation');
    if (!conf) return;
    conf.style.display = 'block';
    setTimeout(function () {
      conf.style.display = 'none';
    }, 2000);
    announce('Protocole copié !');
  }

  // ============================================================
  // PRINT PROTOCOL
  // ============================================================
  function printProtocol() {
    document.body.classList.add('printing');
    window.print();
    setTimeout(function () {
      document.body.classList.remove('printing');
    }, 1000);
  }

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  function setupTheme() {
    if (State.theme === 'light') {
      document.body.classList.add('light-theme');
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    State.theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    lsSet('theme', State.theme);
    announce('Thème ' + (State.theme === 'light' ? 'clair' : 'sombre') + ' activé');
  }

  // ============================================================
  // FULLSCREEN
  // ============================================================
  function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen().catch(function () {});
      }
    } catch (e) { /* noop */ }
  }

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Ignore if modifier keys (except shift for ?)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key;

      // Mode selection 1–7
      if (key >= '1' && key <= '7') {
        const index = parseInt(key, 10) - 1;
        const modeId = MODE_ORDER[index];
        if (modeId) {
          // If on home, select mode
          if (State.activeScreen === 'home') {
            selectMode(modeId);
          }
          e.preventDefault();
        }
        return;
      }

      switch (key) {
        case 'Enter':
          e.preventDefault();
          if (State.activeScreen === 'home' && State.currentMode) {
            enterMode(State.currentMode);
          }
          break;

        case 'Escape':
          e.preventDefault();
          // Close modals first
          const openModals = qsAll('.modal-overlay').filter(function (m) {
            return m.style.display !== 'none';
          });
          if (openModals.length > 0) {
            closeModal(openModals[openModals.length - 1].id);
          } else if (State.timerFullscreen) {
            closeTimerFullscreen();
          } else if (State.activeScreen === 'mode') {
            goHome();
          }
          break;

        case 'r':
        case 'R':
          e.preventDefault();
          openModal('modal-reset');
          break;

        case 'u':
        case 'U':
          e.preventDefault();
          openModal('modal-emergency');
          break;

        case 't':
        case 'T':
          e.preventDefault();
          if (State.activeScreen === 'mode') {
            // Focus timer widget
            const timerWidget = el('timer-widget');
            if (timerWidget) timerWidget.scrollIntoView({ behavior: 'smooth' });
          }
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          if (State.timerFullscreen) {
            closeTimerFullscreen();
          } else {
            openTimerFullscreen();
          }
          break;

        case ' ':
          // Space bar = toggle timer (only if not focused on button)
          if (e.target.tagName !== 'BUTTON' && State.activeScreen === 'mode') {
            e.preventDefault();
            toggleTimer();
          }
          break;

        case 'd':
        case 'D':
          toggleTheme();
          break;

        case 'p':
        case 'P':
          if (State.activeScreen === 'mode') {
            e.preventDefault();
            printProtocol();
          }
          break;

        case '?':
          e.preventDefault();
          openModal('modal-shortcuts');
          break;

        default:
          break;
      }
    });
  }

  // ============================================================
  // UTILITY — HTML escape
  // ============================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ============================================================
  // START
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
