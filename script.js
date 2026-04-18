/* ================================================================
   PICAZO — script.js (MOBILE OPTIMIZED)
   Complete game logic: Canvas drawing, Timer, Word selection,
   Chat/guessing, Leaderboard, Toasts, Context menu, Vote kick
================================================================ */

'use strict';

/* ================================================================
   CONSTANTS & DATA
================================================================ */

const COLORS = [
  '#000000','#ffffff','#c0c0c0','#808080',
  '#ff0000','#ff6600','#ffcc00','#ffff00',
  '#00cc00','#00ffcc','#0088ff','#0000ff',
  '#8800ff','#ff00ff','#ff6699','#ff99cc',
  '#663300','#996600','#003366','#006633',
];

const WORD_BANK = [
  {w:'elephant',e:'🐘'},{w:'pizza',e:'🍕'},{w:'rainbow',e:'🌈'},
  {w:'submarine',e:'🚢'},{w:'telescope',e:'🔭'},{w:'butterfly',e:'🦋'},
  {w:'volcano',e:'🌋'},{w:'astronaut',e:'👨‍🚀'},{w:'octopus',e:'🐙'},
  {w:'lighthouse',e:'🏮'},{w:'dragon',e:'🐉'},{w:'waterfall',e:'💧'},
  {w:'pyramid',e:'🔺'},{w:'spaceship',e:'🚀'},{w:'treasure',e:'💎'},
  {w:'hurricane',e:'🌀'},{w:'keyboard',e:'⌨️'},{w:'guitar',e:'🎸'},
  {w:'sunflower',e:'🌻'},{w:'dinosaur',e:'🦕'},{w:'umbrella',e:'☂️'},
  {w:'ambulance',e:'🚑'},{w:'penguin',e:'🐧'},{w:'fireworks',e:'🎆'},
  {w:'basketball',e:'🏀'},{w:'helicopter',e:'🚁'},{w:'mushroom',e:'🍄'},
  {w:'cactus',e:'🌵'},{w:'scorpion',e:'🦂'},{w:'pineapple',e:'🍍'},
  {w:'snowman',e:'☃️'},{w:'tornado',e:'🌪️'},{w:'jellyfish',e:'🪼'},
  {w:'hammock',e:'🌴'},{w:'lantern',e:'🏮'},{w:'compass',e:'🧭'},
  {w:'hourglass',e:'⏳'},{w:'microscope',e:'🔬'},{w:'parachute',e:'🪂'},
  {w:'chandelier',e:'🕯️'},{w:'windmill',e:'🌬️'},{w:'anchor',e:'⚓'},
  {w:'trophy',e:'🏆'},{w:'carousel',e:'🎠'},{w:'popcorn',e:'🍿'},
];

// Avatar definitions — SVG-drawn, NO external API
const AVATAR_DEFS = [
  {name:'Alex',    skin:'#fdd09a',hair:'#3a2010',hCol:'#222',style:'m-short', accent:'#4a8fe8'},
  {name:'Jamie',   skin:'#f9c49a',hair:'#1a0a0a',hCol:'#111',style:'f-long',  accent:'#9c5cf8'},
  {name:'Morgan',  skin:'#e8a87c',hair:'#6a3010',hCol:'#4a1a0a',style:'m-beard',accent:'#e87c4a'},
  {name:'Taylor',  skin:'#fdd8b0',hair:'#8b4513',hCol:'#5a2a0a',style:'f-bun', accent:'#4acf8a'},
  {name:'Jordan',  skin:'#c8884a',hair:'#2a1808',hCol:'#1a0a00',style:'m-spec', accent:'#f4b942'},
  {name:'Casey',   skin:'#fce0c8',hair:'#d4406a',hCol:'#a82050',style:'f-long', accent:'#f0527a'},
  {name:'Riley',   skin:'#f0c090',hair:'#4a3020',hCol:'#2a1808',style:'m-short',accent:'#4a7ad8'},
  {name:'Quinn',   skin:'#fdd0a8',hair:'#508860',hCol:'#306040',style:'f-bun',  accent:'#50b8a8'},
  {name:'Sage',   skin:'#e8b890',hair:'#222222',hCol:'#111',style:'m-spec', accent:'#8060f0'},
  {name:'Nova',   skin:'#fcc0a0',hair:'#2050a0',hCol:'#102060',style:'f-long', accent:'#2090f0'},
];

/* ================================================================
   AVATAR RENDERER — Pure Canvas (no external images)
================================================================ */

function drawAvatar(canvas, def, size = 96) {
  const c = canvas.getContext('2d');
  const W = size, H = size;
  c.clearRect(0, 0, W, H);

  // Background gradient
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, def.accent + '33');
  bg.addColorStop(1, def.accent + '18');
  c.fillStyle = bg;
  roundRect(c, 0, 0, W, H, W * 0.2);
  c.fill();

  const cx = W / 2, cy = H / 2;
  const headR = W * 0.22;
  const headY = H * 0.4;

  // ── Body / Shirt ──
  c.fillStyle = def.accent;
  c.beginPath();
  c.ellipse(cx, H * 0.88, W * 0.28, H * 0.22, 0, 0, Math.PI * 2);
  c.fill();

  // ── Neck ──
  c.fillStyle = def.skin;
  c.fillRect(cx - W * 0.065, headY + headR * 0.8, W * 0.13, H * 0.1);

  // ── Hair (back layer) ──
  drawHairBack(c, def.style, def.hCol, cx, headY, headR, W, H);

  // ── Head ──
  c.fillStyle = def.skin;
  c.beginPath();
  c.ellipse(cx, headY, headR, headR * 1.1, 0, 0, Math.PI * 2);
  c.fill();

  // ── Ears ──
  c.fillStyle = def.skin;
  c.beginPath(); c.ellipse(cx - headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx + headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();

  // ── Hair (front layer) ──
  drawHairFront(c, def.style, def.hCol, cx, headY, headR, W, H);

  // ── Eyes ──
  const eyeY = headY - headR * 0.08;
  const eyeOffX = headR * 0.42;
  [-1,1].forEach(side => {
    // White
    c.fillStyle = '#fff';
    c.beginPath(); c.ellipse(cx + side * eyeOffX, eyeY, headR * 0.2, headR * 0.24, 0, 0, Math.PI * 2); c.fill();
    // Iris
    c.fillStyle = def.hCol;
    c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.13, 0, Math.PI * 2); c.fill();
    // Pupil
    c.fillStyle = '#000';
    c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.065, 0, Math.PI * 2); c.fill();
    // Highlight
    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.beginPath(); c.arc(cx + side * eyeOffX + 2, eyeY - 2, headR * 0.04, 0, Math.PI * 2); c.fill();
  });

  // ── Eyebrows ──
  c.strokeStyle = def.hCol; c.lineWidth = headR * 0.09; c.lineCap = 'round';
  [-1,1].forEach(side => {
    c.beginPath();
    c.moveTo(cx + side * (eyeOffX - headR * 0.16), eyeY - headR * 0.3);
    c.lineTo(cx + side * (eyeOffX + headR * 0.16), eyeY - headR * 0.28);
    c.stroke();
  });

  // ── Nose ──
  c.strokeStyle = shadeColor(def.skin, -20); c.lineWidth = headR * 0.07;
  c.beginPath();
  c.moveTo(cx - headR * 0.08, headY + headR * 0.12);
  c.lineTo(cx, headY + headR * 0.28);
  c.lineTo(cx + headR * 0.08, headY + headR * 0.12);
  c.stroke();

  // ── Mouth ──
  const isFemale = def.style.startsWith('f-');
  c.strokeStyle = isFemale ? '#d07070' : '#a06060';
  c.lineWidth = headR * 0.09;
  c.beginPath();
  c.arc(cx, headY + headR * 0.5, headR * 0.22, 0.15, Math.PI - 0.15);
  c.stroke();

  // ── Blush (female) ──
  if (isFemale) {
    [-1,1].forEach(side => {
      const g = c.createRadialGradient(cx + side * eyeOffX * 1.1, headY + headR * 0.35, 0, cx + side * eyeOffX * 1.1, headY + headR * 0.35, headR * 0.28);
      g.addColorStop(0, 'rgba(255,160,160,0.45)');
      g.addColorStop(1, 'rgba(255,160,160,0)');
      c.fillStyle = g;
      c.beginPath(); c.ellipse(cx + side * eyeOffX * 1.1, headY + headR * 0.35, headR * 0.28, headR * 0.18, 0, 0, Math.PI * 2); c.fill();
    });
  }

  // ── Beard (m-beard) ──
  if (def.style === 'm-beard') {
    c.fillStyle = def.hCol + 'cc';
    c.beginPath(); c.ellipse(cx, headY + headR * 0.65, headR * 0.4, headR * 0.28, 0, 0, Math.PI); c.fill();
    c.beginPath(); c.arc(cx - headR * 0.28, headY + headR * 0.52, headR * 0.18, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(cx + headR * 0.28, headY + headR * 0.52, headR * 0.18, 0, Math.PI * 2); c.fill();
  }

  // ── Glasses (m-spec, f variant) ──
  if (def.style === 'm-spec' || def.style === 'f-spec') {
    c.strokeStyle = '#445'; c.lineWidth = headR * 0.1; c.fillStyle = 'rgba(180,220,255,0.25)';
    const gox = eyeOffX * 0.95, gr = headR * 0.22, gy = eyeY + 1;
    [-1,1].forEach(side => {
      c.beginPath(); c.arc(cx + side * gox, gy, gr, 0, Math.PI * 2); c.fill(); c.stroke();
    });
    // Bridge
    c.beginPath();
    c.moveTo(cx - gox + gr, gy); c.lineTo(cx + gox - gr, gy); c.stroke();
    // Arms
    c.beginPath(); c.moveTo(cx - gox - gr, gy); c.lineTo(cx - headR, gy - 2); c.stroke();
    c.beginPath(); c.moveTo(cx + gox + gr, gy); c.lineTo(cx + headR, gy - 2); c.stroke();
  }
}

function drawHairBack(c, style, hCol, cx, headY, headR, W, H) {
  c.fillStyle = hCol;
  if (style === 'f-long') {
    c.beginPath();
    c.ellipse(cx, headY + headR * 0.6, headR * 1.15, headR * 1.5, 0, 0, Math.PI * 2);
    c.fill();
  } else if (style === 'f-bun') {
    c.beginPath();
    c.ellipse(cx, headY + headR * 0.5, headR * 1.05, headR * 1.2, 0, 0, Math.PI * 2);
    c.fill();
    // Bun
    c.beginPath(); c.arc(cx, headY - headR * 1.05, headR * 0.4, 0, Math.PI * 2); c.fill();
  }
}

function drawHairFront(c, style, hCol, cx, headY, headR, W, H) {
  c.fillStyle = hCol;
  if (style === 'm-short') {
    c.beginPath();
    c.ellipse(cx, headY - headR * 0.65, headR * 1.0, headR * 0.55, 0, Math.PI, Math.PI * 2);
    c.fill();
  } else if (style === 'm-beard' || style === 'm-spec') {
    c.beginPath();
    c.ellipse(cx, headY - headR * 0.7, headR * 0.95, headR * 0.48, 0, Math.PI, Math.PI * 2);
    c.fill();
  } else if (style === 'f-long') {
    // Side strands
    c.beginPath();
    c.ellipse(cx - headR * 0.85, headY + headR * 0.2, headR * 0.32, headR * 0.9, -0.2, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(cx + headR * 0.85, headY + headR * 0.2, headR * 0.32, headR * 0.9, 0.2, 0, Math.PI * 2);
    c.fill();
    // Top
    c.beginPath();
    c.ellipse(cx, headY - headR * 0.7, headR * 0.95, headR * 0.45, 0, Math.PI, Math.PI * 2);
    c.fill();
  } else if (style === 'f-bun') {
    c.beginPath();
    c.ellipse(cx, headY - headR * 0.72, headR * 0.92, headR * 0.44, 0, Math.PI, Math.PI * 2);
    c.fill();
    // side
    c.beginPath(); c.ellipse(cx - headR * 0.8, headY + headR * 0.1, headR * 0.28, headR * 0.7, -0.15, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx + headR * 0.8, headY + headR * 0.1, headR * 0.28, headR * 0.7, 0.15, 0, Math.PI * 2); c.fill();
  }
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.arcTo(x + w, y, x + w, y + r, r);
  c.lineTo(x + w, y + h - r);
  c.arcTo(x + w, y + h, x + w - r, y + h, r);
  c.lineTo(x + r, y + h);
  c.arcTo(x, y + h, x, y + h - r, r);
  c.lineTo(x, y + r);
  c.arcTo(x, y, x + r, y, r);
  c.closePath();
}

function shadeColor(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ================================================================
   GAME STATE
================================================================ */
let S = {
  // Lobby
  avatarIdx: 0,
  playerName: '',
  totalRounds: 5,
  drawTime: 90,
  botCount: 4,

  // Game
  players: [],
  myId: 'me',
  drawerIdx: 0,       
  round: 1,
  currentWord: '',
  revealedIdx: [],
  guessedIds: new Set(),

  // Timer
  timeLeft: 90,
  timerInterval: null,
  wsTimerInterval: null,

  // Canvas
  isDrawing: false,
  tool: 'pencil',
  color: '#000000',
  brushSize: 3,
  strokes: [],        
  shapeStart: null,
  snapBeforeShape: null,
  isDrawer: false,

  // UI
  isMuted: false,
  ctxTarget: null,
  dpr: window.devicePixelRatio || 1 // Track Device Pixel Ratio for HD Canvas
};

const CIRC = 2 * Math.PI * 25; 

/* ================================================================
   DOM REFS
================================================================ */
const $ = id => document.getElementById(id);

const screenLobby = $('screen-lobby');
const screenGame  = $('screen-game');

// Lobby
const btnAvPrev  = $('btn-av-prev');
const btnAvNext  = $('btn-av-next');
const avCanvas   = $('av-canvas');
const avFrame    = $('av-frame');
const avDots     = $('av-dots');
const inpName    = $('inp-name');
const selRounds  = $('sel-rounds');
const selTime    = $('sel-time');
const selBots    = $('sel-bots');
const btnPlay    = $('btn-play');

// Game header
const timerNum   = $('timer-num');
const tFg        = $('t-fg');
const roundBadge = $('round-badge');
const wordDisplay = $('word-display');
const wordMeta   = $('word-meta');
const btnMute    = $('btn-mute');
const muteIcon   = $('mute-icon');

// Panels
const playerList   = $('player-list');
const chatMessages = $('chat-messages');
const chatInput    = $('chat-input');
const btnChatSend  = $('btn-chat-send');

// Canvas
const gameCanvas = $('game-canvas');
const canvasWrap = $('canvas-wrap');
const ctx        = gameCanvas.getContext('2d', { willReadFrequently: true });

// Overlays
const overlayWaiting   = $('overlay-waiting');
const overlayWordSelect = $('overlay-word-select');
const overlayRoundEnd  = $('overlay-round-end');
const wsClock          = $('ws-timer');
const wsTimerBar       = $('ws-timer-bar');
const wsCards          = $('ws-cards');
const btnCopyLink      = $('btn-copy-link');

// Round end
const reEmoji    = $('re-emoji');
const reTitle    = $('re-title');
const reWordVal  = $('re-word-val');
const reScores   = $('re-scores');
const reCountdown = $('re-countdown');
const reNext     = $('re-next');

// Toolbar
const colorPalette = $('color-palette');
const colorActive  = $('color-active');
const colorPicker  = $('color-picker');

// Context + Vote
const contextMenu = $('context-menu');
const ctxName     = $('ctx-name');
const ctxPts      = $('ctx-pts');
const ctxAv       = $('ctx-av');
const voteBanner  = $('vote-banner');

/* ================================================================
   LOBBY
================================================================ */

function buildAvDots() {
  avDots.innerHTML = '';
  AVATAR_DEFS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'av-dot' + (i === S.avatarIdx ? ' active' : '');
    d.setAttribute('aria-label', `Avatar ${i+1}`);
    d.addEventListener('click', () => setAvatar(i));
    avDots.appendChild(d);
  });
}

function setAvatar(i) {
  S.avatarIdx = ((i % AVATAR_DEFS.length) + AVATAR_DEFS.length) % AVATAR_DEFS.length;
  drawAvatar(avCanvas, AVATAR_DEFS[S.avatarIdx], 96);
  // Dots
  avDots.querySelectorAll('.av-dot').forEach((d, j) => d.classList.toggle('active', j === S.avatarIdx));
  // Glow pulse
  avFrame.classList.add('glow');
  setTimeout(() => avFrame.classList.remove('glow'), 700);
}

btnAvPrev.addEventListener('click', () => setAvatar(S.avatarIdx - 1));
btnAvNext.addEventListener('click', () => setAvatar(S.avatarIdx + 1));

// Keyboard arrow nav for avatar
window.addEventListener('keydown', e => {
  if (!screenLobby.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') setAvatar(S.avatarIdx - 1);
  if (e.key === 'ArrowRight') setAvatar(S.avatarIdx + 1);
});

selRounds.addEventListener('change', e => { S.totalRounds = +e.target.value; });
selTime.addEventListener('change',   e => { S.drawTime    = +e.target.value; });
selBots.addEventListener('change',   e => { S.botCount    = +e.target.value; });

btnPlay.addEventListener('click', () => {
  const name = inpName.value.trim();
  if (!name) {
    inpName.classList.add('shake');
    setTimeout(() => inpName.classList.remove('shake'), 500);
    inpName.focus();
    return;
  }
  S.playerName = name;
  S.totalRounds = +selRounds.value;
  S.drawTime    = +selTime.value;
  S.botCount    = +selBots.value;
  transitionToGame();
});
inpName.addEventListener('keydown', e => { if (e.key === 'Enter') btnPlay.click(); });

btnCopyLink.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
  btnCopyLink.textContent = 'Copied!';
  setTimeout(() => { btnCopyLink.textContent = 'Copy'; }, 2000);
});

/* ================================================================
   TRANSITION LOBBY → GAME
================================================================ */
function transitionToGame() {
  screenLobby.style.transition = 'opacity 0.4s, transform 0.4s';
  screenLobby.style.opacity = '0';
  screenLobby.style.transform = 'scale(1.06)';
  setTimeout(() => {
    screenLobby.classList.remove('active');
    screenLobby.style.display = 'none';
    screenGame.classList.add('active');
    initGame();
  }, 420);
}

function setupMobileLayout() {
  const isMobile = window.innerWidth < 768;
  const gameBody = document.querySelector('.game-body');
  const lbPanel  = $('leaderboard-panel');
  const chatPanel = $('chat-panel');
  let bottomRow = document.querySelector('.bottom-row');

  if (isMobile) {
    if (!bottomRow) {
      bottomRow = document.createElement('div');
      bottomRow.className = 'bottom-row';
      gameBody.appendChild(bottomRow);
    }
    if (!bottomRow.contains(lbPanel))  bottomRow.appendChild(lbPanel);
    if (!bottomRow.contains(chatPanel)) bottomRow.appendChild(chatPanel);
  } else {
    if (bottomRow) {
      gameBody.insertBefore(lbPanel, gameBody.firstChild);
      gameBody.appendChild(chatPanel);
    }
  }
}
window.addEventListener('resize', setupMobileLayout);

/* ================================================================
   GAME INIT
================================================================ */
function initGame() {
  buildPlayers();
  buildColorPalette();
  setupToolbar();
  setupChat();
  setupMuteBtn();
  setupContextMenu();
  setupVoteBanner();
  initCanvas();
  setupMobileLayout();

  overlayWaiting.classList.add('hidden');

  addChat('system', '', '🎨 Welcome to Picazo! Game is starting…');
  addChat('system', '', `${S.players[S.drawerIdx].name} draws first!`);

  S.round = 1;
  S.drawerIdx = 0;
  S.isDrawer = S.players[S.drawerIdx].id === S.myId;
  updateRoundBadge();
  buildLeaderboard();

  startWordSelection();
}

/* ================================================================
   PLAYERS
================================================================ */
const BOT_NAMES = ['SketchBot','ArtGeek','DrawMaster','DoodleKing','PicassoJr','BrushWizard','InkMage','PixelPro'];

function buildPlayers() {
  S.players = [];
  S.players.push({
    id: S.myId,
    name: S.playerName,
    avatarDef: AVATAR_DEFS[S.avatarIdx],
    score: 0,
    isSelf: true,
    guessed: false,
  });
  const shuffledBots = BOT_NAMES.slice().sort(() => Math.random() - 0.5);
  const shuffledAvs  = AVATAR_DEFS.slice(1).sort(() => Math.random() - 0.5);
  for (let i = 0; i < S.botCount - 1; i++) {
    S.players.push({
      id: 'bot_' + i,
      name: shuffledBots[i] || 'Bot' + i,
      avatarDef: shuffledAvs[i % shuffledAvs.length],
      score: 0,
      isSelf: false,
      guessed: false,
    });
  }
  S.drawerIdx = 0;
}

/* ================================================================
   LEADERBOARD
================================================================ */
function buildLeaderboard() {
  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  playerList.innerHTML = '';

  sorted.forEach((p, rank) => {
    const li = document.createElement('li');
    li.className = 'player-item'
      + (p.id === S.players[S.drawerIdx]?.id ? ' is-drawing' : '')
      + (p.guessed ? ' guessed' : '');

    const rankClass = rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : '';
    const rankSymbol = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : (rank + 1);

    const avWrap = document.createElement('div');
    avWrap.className = 'pi-av';
    const avC = document.createElement('canvas');
    avC.width = 32; avC.height = 32;
    drawAvatar(avC, p.avatarDef, 32);
    avWrap.appendChild(avC);

    li.innerHTML = `<div class="pi-rank ${rankClass}">${rankSymbol}</div>`;
    li.appendChild(avWrap);
    li.insertAdjacentHTML('beforeend', `
      <div class="pi-info">
        <div class="pi-name">${p.isSelf ? '⭐ ' : ''}${escHtml(p.name)}</div>
        <div class="pi-score">${p.score} pts</div>
      </div>
    `);
    
    if (p.id === S.players[S.drawerIdx]?.id) {
      li.insertAdjacentHTML('beforeend', `<span class="pi-badge drawing">✏️</span>`);
    } else if (p.guessed) {
      li.insertAdjacentHTML('beforeend', `<span class="pi-badge guessed">✅</span>`);
    }

    if (!p.isSelf) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', e => openContextMenu(e, p));
    }

    playerList.appendChild(li);
  });
}

function updateRoundBadge() {
  roundBadge.textContent = `Round ${S.round}/${S.totalRounds}`;
}

/* ================================================================
   WORD SELECTION PHASE
================================================================ */
function startWordSelection() {
  S.players.forEach(p => p.guessed = false);
  S.guessedIds.clear();
  buildLeaderboard();

  overlayWordSelect.classList.remove('hidden');

  const choices = shuffled(WORD_BANK).slice(0, 3);
  wsCards.innerHTML = '';
  choices.forEach(w => {
    const card = document.createElement('div');
    card.className = 'ws-card';
    card.innerHTML = `
      <span class="ws-emoji">${w.e}</span>
      <div class="ws-word">${S.isDrawer ? w.w : '???'}</div>
      <div class="ws-len">${w.w.length} letters</div>
    `;
    if (S.isDrawer) {
      card.addEventListener('click', () => chooseWord(w.w));
    }
    wsCards.appendChild(card);
  });

  let t = 15;
  wsClock.textContent = t;
  wsTimerBar.style.transition = 'none';
  wsTimerBar.style.width = '100%';

  clearInterval(S.wsTimerInterval);
  S.wsTimerInterval = setInterval(() => {
    t--;
    wsClock.textContent = t;
    wsTimerBar.style.transition = 'width 1s linear';
    wsTimerBar.style.width = (t / 15 * 100) + '%';
    if (t <= 0) {
      clearInterval(S.wsTimerInterval);
      chooseWord(choices[0].w);
    }
  }, 1000);

  if (!S.isDrawer) {
    setTimeout(() => {
      if (!overlayWordSelect.classList.contains('hidden')) {
        chooseWord(choices[Math.floor(Math.random() * 3)].w);
      }
    }, 4000);
  }
}

function chooseWord(word) {
  clearInterval(S.wsTimerInterval);
  overlayWordSelect.classList.add('hidden');
  S.currentWord = word;
  S.revealedIdx = [];
  renderWordBlanks();
  startRoundTimer();

  const drawerName = S.players[S.drawerIdx].name;
  addChat('system', '', `${drawerName} is now drawing! 🖊️`);

  scheduleBotGuesses();
}

/* ================================================================
   WORD BLANKS
================================================================ */
function renderWordBlanks() {
  wordDisplay.innerHTML = '';
  if (!S.currentWord) { wordMeta.textContent = ''; return; }

  const word = S.currentWord;
  const isDrawer = S.isDrawer;

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (ch === ' ') {
      const sp = document.createElement('div');
      sp.style.cssText = 'width:12px';
      wordDisplay.appendChild(sp);
      continue;
    }
    const grp = document.createElement('div');
    grp.className = 'wb-group';

    const charEl = document.createElement('div');
    charEl.className = 'wb-char';
    charEl.id = 'wc-' + i;

    if (isDrawer || S.revealedIdx.includes(i)) {
      charEl.textContent = ch.toUpperCase();
      if (S.revealedIdx.includes(i) && !isDrawer) charEl.classList.add('reveal');
    } else {
      charEl.textContent = '';
    }

    const line = document.createElement('div');
    line.className = 'wb-line';
    line.style.width = Math.max(18, Math.floor(96 / word.length)) + 'px';

    grp.appendChild(charEl);
    grp.appendChild(line);
    wordDisplay.appendChild(grp);
  }

  wordMeta.textContent = isDrawer
    ? `You are drawing — ${word.length} letters`
    : `${word.length} letters`;
}

function revealHintLetter() {
  const word = S.currentWord;
  const unrevealed = word.split('').map((c, i) => i)
    .filter(i => !S.revealedIdx.includes(i) && word[i] !== ' ');
  if (unrevealed.length <= 1) return;
  const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
  S.revealedIdx.push(pick);
  renderWordBlanks();
  showToast('💡 A hint letter was revealed!', 't-info');
}

/* ================================================================
   ROUND TIMER
================================================================ */
function startRoundTimer() {
  S.timeLeft = S.drawTime;
  clearInterval(S.timerInterval);
  updateTimerUI();

  const hintAt = [Math.floor(S.drawTime * 0.6), Math.floor(S.drawTime * 0.3)];

  S.timerInterval = setInterval(() => {
    S.timeLeft--;
    if (hintAt.includes(S.timeLeft)) revealHintLetter();
    updateTimerUI();
    if (S.timeLeft <= 0) {
      clearInterval(S.timerInterval);
      endRound(false);
    }
  }, 1000);
}

function updateTimerUI() {
  const t = S.timeLeft;
  timerNum.textContent = t;
  const ratio = t / S.drawTime;
  tFg.style.strokeDashoffset = CIRC * (1 - ratio);
  const warn = t <= 30;
  timerNum.className = 'timer-num' + (warn ? ' warn' : '');
  tFg.className = 't-fg' + (warn ? ' warn' : '');
}

/* ================================================================
   END ROUND
================================================================ */
function endRound(allGuessed = false) {
  clearInterval(S.timerInterval);
  clearInterval(S.wsTimerInterval);

  const word = S.currentWord;
  addChat('system', '', `⏰ Round over! The word was: "${word}"`);

  const guessedCount = S.guessedIds.size;
  if (guessedCount > 0) {
    const drawer = S.players[S.drawerIdx];
    const bonus = Math.min(guessedCount * 30, 150);
    drawer.score += bonus;
    showToast(`✏️ ${drawer.name} earned ${bonus} pts for drawing!`, 't-info');
  }

  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  reEmoji.textContent = allGuessed ? '🎉' : '⏰';
  reTitle.textContent = allGuessed ? 'Everyone guessed it!' : 'Round Over!';
  reWordVal.textContent = word;
  reScores.innerHTML = sorted.map((p, i) => `
    <div class="re-score-row">
      <span class="re-score-name">${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${escHtml(p.name)}</span>
      <span class="re-score-pts">${p.score} pts</span>
    </div>
  `).join('');

  overlayRoundEnd.classList.remove('hidden');

  let cd = 5;
  reCountdown.textContent = cd;
  reNext.style.display = '';
  const cdInt = setInterval(() => {
    cd--;
    reCountdown.textContent = cd;
    if (cd <= 0) {
      clearInterval(cdInt);
      overlayRoundEnd.classList.add('hidden');
      nextRound();
    }
  }, 1000);
}

function nextRound() {
  S.round++;
  if (S.round > S.totalRounds) {
    endGame();
    return;
  }

  S.drawerIdx = (S.drawerIdx + 1) % S.players.length;
  S.isDrawer = S.players[S.drawerIdx].id === S.myId;

  updateRoundBadge();

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  S.strokes = [];
  S.currentWord = '';
  S.revealedIdx = [];
  renderWordBlanks();
  buildLeaderboard();

  addChat('system', '', `🔄 Round ${S.round} — ${S.players[S.drawerIdx].name} draws!`);
  startWordSelection();
}

function endGame() {
  clearInterval(S.timerInterval);
  const winner = [...S.players].sort((a, b) => b.score - a.score)[0];
  addChat('system', '', `🏆 Game Over! Winner: ${winner.name} with ${winner.score} pts!`);
  showToast(`🏆 ${winner.name} wins! GG!`, 't-info');

  overlayRoundEnd.classList.remove('hidden');
  reEmoji.textContent = '🏆';
  reTitle.textContent = 'Game Over!';
  reWordVal.textContent = winner.name + ' wins!';
  reNext.style.display = 'none';
  document.getElementById('re-word').innerHTML = `Winner: <strong>${escHtml(winner.name)}</strong>`;

  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  reScores.innerHTML = sorted.map((p, i) => `
    <div class="re-score-row">
      <span class="re-score-name">${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${escHtml(p.name)}</span>
      <span class="re-score-pts">${p.score} pts</span>
    </div>
  `).join('');
}

/* ================================================================
   BOT GUESSING SIMULATION
================================================================ */
function scheduleBotGuesses() {
  const bots = S.players.filter(p => !p.isSelf && p.id !== S.players[S.drawerIdx]?.id);
  const fakeGuesses = [
    'is it a bird?','house?','cat!','hmm a car?','tree?','fish!','airplane?',
    'dog!','no idea lol','flower?','mountain?','I think it\'s a boat',
    'rocket ship?','castle!','unicorn?','looks like a phone to me',
  ];

  bots.forEach((bot, idx) => {
    const delay = 8000 + idx * 3000 + Math.random() * 6000;
    setTimeout(() => {
      if (!S.currentWord) return;
      if (bot.guessed) return;

      const ratio = S.timeLeft / S.drawTime;
      const guessCorrect = ratio < 0.5 && Math.random() < 0.4;

      if (guessCorrect && !bot.guessed) {
        botGuessCorrect(bot);
      } else {
        const msg = fakeGuesses[Math.floor(Math.random() * fakeGuesses.length)];
        addChat('normal', bot.name, msg);
      }
    }, delay);
  });
}

function botGuessCorrect(bot) {
  const pts = Math.max(10, Math.round(S.timeLeft / S.drawTime * 100));
  bot.score += pts;
  bot.guessed = true;
  S.guessedIds.add(bot.id);
  addChat('correct', bot.name, `🎉 Guessed the word! (+${pts} pts)`);
  showToast(`✅ ${bot.name} guessed it!`, 't-correct');
  buildLeaderboard();

  const nonDrawers = S.players.filter(p => p.id !== S.players[S.drawerIdx]?.id);
  if (nonDrawers.every(p => p.guessed)) {
    clearInterval(S.timerInterval);
    setTimeout(() => endRound(true), 1000);
  }
}

/* ================================================================
   CANVAS DRAWING (MOBILE OPTIMIZED: PointerEvents + DPR)
================================================================ */
function initCanvas() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // UPGRADE: Unified Pointer Events for flawless mobile drawing
  gameCanvas.addEventListener('pointerdown',   onPointerDown);
  gameCanvas.addEventListener('pointermove',   onPointerMove);
  gameCanvas.addEventListener('pointerup',     onPointerUp);
  gameCanvas.addEventListener('pointercancel', onPointerUp);
}

function resizeCanvas() {
  const W = canvasWrap.clientWidth;
  const H = canvasWrap.clientHeight;
  if (W === 0 || H === 0) return;

  S.dpr = window.devicePixelRatio || 1;

  let snap = null;
  if (gameCanvas.width > 0 && gameCanvas.height > 0) {
    try { snap = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height); } catch(e){}
  }

  // 1. Scale internal resolution for crisp HD
  gameCanvas.width  = W * S.dpr;
  gameCanvas.height = H * S.dpr;
  
  // 2. Set CSS display size
  gameCanvas.style.width  = W + 'px';
  gameCanvas.style.height = H + 'px';

  // 3. Normalize coordinates so we can still code using CSS pixels
  ctx.scale(S.dpr, S.dpr);
  ctx.lineCap   = 'round';
  ctx.lineJoin  = 'round';

  // Restore drawing if we had one
  if (snap) {
    const temp = document.createElement('canvas');
    temp.width = snap.width; temp.height = snap.height;
    temp.getContext('2d').putImageData(snap, 0, 0);
    ctx.drawImage(temp, 0, 0, W, H);
  }
}

function getPointerXY(e) {
  const r = gameCanvas.getBoundingClientRect();
  // With PointerEvents and CSS mapping, we just need standard client bounds
  return { 
    x: e.clientX - r.left, 
    y: e.clientY - r.top 
  };
}

function onPointerDown(e) { 
  if (S.isDrawer) {
    // Locks the pointer to the canvas so drawing continues even if finger slips off edge
    gameCanvas.setPointerCapture(e.pointerId); 
    pointerDown(getPointerXY(e)); 
  }
}

function onPointerMove(e) { 
  if (S.isDrawer && S.isDrawing) pointerMove(getPointerXY(e)); 
}

function onPointerUp(e) { 
  if (S.isDrawer) {
    gameCanvas.releasePointerCapture(e.pointerId);
    pointerUp(getPointerXY(e)); 
  }
}

function isShape() { return S.tool === 'line' || S.tool === 'rect' || S.tool === 'circle'; }

function pointerDown(pos) {
  S.isDrawing = true;

  if (S.tool === 'fill') {
    floodFill(pos.x, pos.y, S.color);
    S.isDrawing = false;
    return;
  }
  if (isShape()) {
    S.shapeStart = pos;
    S.snapBeforeShape = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  applyBrushStyle();
}

function pointerMove(pos) {
  if (!S.isDrawing) return;

  if (isShape()) {
    ctx.putImageData(S.snapBeforeShape, 0, 0);
    applyBrushStyle();
    ctx.beginPath();
    drawShapePreview(S.shapeStart, pos);
    return;
  }
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function pointerUp(pos) {
  if (!S.isDrawing) return;
  S.isDrawing = false;

  if (isShape() && S.shapeStart) {
    ctx.putImageData(S.snapBeforeShape, 0, 0);
    applyBrushStyle();
    ctx.beginPath();
    drawShapePreview(S.shapeStart, pos);
    ctx.stroke();
    if (S.tool === 'rect' || S.tool === 'circle') ctx.fill();
    S.shapeStart = null;
  } else {
    ctx.closePath();
  }
  saveStroke();
}

function applyBrushStyle() {
  const isEraser = S.tool === 'eraser';
  ctx.strokeStyle = isEraser ? '#ffffff' : S.color;
  ctx.fillStyle   = S.color + '18';
  ctx.lineWidth   = isEraser ? S.brushSize * 3 : S.brushSize;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
}

function drawShapePreview(s, e) {
  const t = S.tool;
  if (t === 'line') {
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();
  } else if (t === 'rect') {
    const w = e.x - s.x, h = e.y - s.y;
    ctx.strokeRect(s.x, s.y, w, h);
    ctx.fillRect(s.x, s.y, w, h);
  } else if (t === 'circle') {
    const rx = Math.abs(e.x - s.x) / 2, ry = Math.abs(e.y - s.y) / 2;
    const cx = s.x + (e.x - s.x) / 2, cy = s.y + (e.y - s.y) / 2;
    ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

function saveStroke() {
  try {
    const snap = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
    S.strokes.push(snap);
    if (S.strokes.length > 30) S.strokes.shift();
  } catch(e) {}
  ctx.globalCompositeOperation = 'source-over';
}

/* ── Flood Fill (DPR Scaled) ── */
function floodFill(startX, startY, fillHex) {
  const w = gameCanvas.width, h = gameCanvas.height;
  const id = ctx.getImageData(0, 0, w, h);
  const d  = id.data;
  
  // Must scale the CSS click coordinates up to match the High-Res Canvas pixels
  const xi = Math.round(startX * S.dpr), yi = Math.round(startY * S.dpr);
  if (xi < 0 || xi >= w || yi < 0 || yi >= h) return;

  const idx = (yi * w + xi) * 4;
  const tr = d[idx], tg = d[idx+1], tb = d[idx+2], ta = d[idx+3];

  const fc = hexToRgb(fillHex);
  if (!fc) return;
  if (tr === fc.r && tg === fc.g && tb === fc.b && ta === 255) return;

  function match(i) {
    return Math.abs(d[i]  -tr) < 30
        && Math.abs(d[i+1]-tg) < 30
        && Math.abs(d[i+2]-tb) < 30
        && Math.abs(d[i+3]-ta) < 30;
  }

  const stack = [xi + yi * w];
  const seen  = new Uint8Array(w * h);

  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    const x = p % w, y = Math.floor(p / w);
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = p * 4;
    if (!match(i)) continue;
    seen[p] = 1;
    d[i] = fc.r; d[i+1] = fc.g; d[i+2] = fc.b; d[i+3] = 255;
    if (x+1 < w)  stack.push(p+1);
    if (x-1 >= 0) stack.push(p-1);
    if (y+1 < h)  stack.push(p+w);
    if (y-1 >= 0) stack.push(p-w);
  }
  ctx.putImageData(id, 0, 0);
  saveStroke();
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
}

/* ================================================================
   TOOLBAR
================================================================ */
function setupToolbar() {
  ['pencil','brush','eraser','fill','line','rect','circle'].forEach(t => {
    const btn = $('tool-' + t);
    if (btn) btn.addEventListener('click', () => selectTool(t));
  });

  document.querySelectorAll('.brush-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      S.brushSize = +dot.dataset.size;
      document.querySelectorAll('.brush-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  $('tool-undo').addEventListener('click', () => {
    if (S.strokes.length > 1) {
      S.strokes.pop();
      ctx.putImageData(S.strokes[S.strokes.length - 1], 0, 0);
    } else {
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      S.strokes = [];
    }
  });

  $('tool-clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    S.strokes = [];
    showToast('🗑️ Canvas cleared', 't-info');
  });
}

function selectTool(tool) {
  S.tool = tool;
  document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
  const btn = $('tool-' + tool);
  if (btn) btn.classList.add('active');
  gameCanvas.className = tool === 'eraser' ? 'eraser' : '';
  canvasWrap.className = 'canvas-wrap' + (tool === 'fill' ? ' fill-mode' : '');
}

/* ================================================================
   COLOR PALETTE
================================================================ */
function buildColorPalette() {
  colorPalette.innerHTML = '';
  COLORS.forEach(hex => {
    const sw = document.createElement('div');
    sw.className = 'c-swatch' + (hex === S.color ? ' active' : '');
    sw.style.background = hex;
    if (hex === '#ffffff') sw.style.border = '2px solid #ccc';
    sw.title = hex;
    sw.addEventListener('click', () => pickColor(hex));
    colorPalette.appendChild(sw);
  });
  colorActive.style.background = S.color;
  colorPicker.value = S.color;

  colorActive.addEventListener('click', () => colorPicker.click());
  colorPicker.addEventListener('input', e => pickColor(e.target.value));
}

function pickColor(hex) {
  S.color = hex;
  colorActive.style.background = hex;
  colorPicker.value = hex;
  document.querySelectorAll('.c-swatch').forEach(s => s.classList.remove('active'));
  const match = [...document.querySelectorAll('.c-swatch')].find(s => s.style.background === hex || s.title === hex);
  if (match) match.classList.add('active');
  if (S.tool === 'eraser') selectTool('pencil');
}

/* ================================================================
   CHAT & GUESSING
================================================================ */
function setupChat() {
  btnChatSend.addEventListener('click', sendGuess);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendGuess(); });
}

function sendGuess() {
  const val = chatInput.value.trim();
  if (!val) return;
  chatInput.value = '';

  if (S.isDrawer) { addChat('normal', S.playerName, val); return; }
  if (S.guessedIds.has(S.myId)) { addChat('normal', S.playerName, val); return; }

  const correct = S.currentWord && val.toLowerCase() === S.currentWord.toLowerCase();
  if (correct) {
    const pts = Math.max(10, Math.round(S.timeLeft / S.drawTime * 100));
    const me = S.players.find(p => p.isSelf);
    if (me) { me.score += pts; me.guessed = true; }
    S.guessedIds.add(S.myId);
    addChat('correct', S.playerName, `🎉 Guessed the word! (+${pts} pts)`);
    showToast(`✅ You guessed it! +${pts} pts`, 't-correct');
    buildLeaderboard();

    const nonDrawers = S.players.filter(p => p.id !== S.players[S.drawerIdx]?.id);
    if (nonDrawers.every(p => p.guessed)) {
      clearInterval(S.timerInterval);
      setTimeout(() => endRound(true), 800);
    }
  } else {
    addChat('normal', S.playerName, val);
  }
}

function addChat(type, name, text) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (type === 'correct' ? 'correct' : type === 'system' ? 'system' : 'normal');

  if (type === 'system') {
    div.innerHTML = `<span class="msg-text">${escHtml(text)}</span>`;
  } else {
    div.innerHTML = `<span class="msg-name">${escHtml(name)}:</span> <span class="msg-text">${escHtml(text)}</span>`;
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ================================================================
   MUTE
================================================================ */
function setupMuteBtn() {
  btnMute.addEventListener('click', () => {
    S.isMuted = !S.isMuted;
    muteIcon.innerHTML = S.isMuted
      ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`
      : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    showToast(S.isMuted ? '🔇 Sound muted' : '🔊 Sound on', 't-info');
  });
}

/* ================================================================
   TOAST NOTIFICATIONS
================================================================ */
function showToast(msg, type = 't-info') {
  const tc = $('toast-container');
  const t  = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  tc.prepend(t);
  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 380);
  }, 4500);
}

/* ================================================================
   CONTEXT MENU
================================================================ */
function setupContextMenu() {
  document.addEventListener('click', e => {
    if (!contextMenu.contains(e.target)) contextMenu.classList.add('hidden');
  });

  $('ctx-kick').addEventListener('click', () => {
    contextMenu.classList.add('hidden');
    if (S.ctxTarget) initiateVoteKick(S.ctxTarget);
  });
  $('ctx-mute').addEventListener('click', () => {
    if (S.ctxTarget) showToast(`🔇 ${S.ctxTarget.name} muted locally`, 't-info');
    contextMenu.classList.add('hidden');
  });
  $('ctx-report').addEventListener('click', () => {
    if (S.ctxTarget) showToast(`🚩 ${S.ctxTarget.name} reported`, 't-info');
    contextMenu.classList.add('hidden');
  });
  $('ctx-close').addEventListener('click', () => contextMenu.classList.add('hidden'));
}

function openContextMenu(e, player) {
  e.stopPropagation();
  S.ctxTarget = player;
  ctxName.textContent = player.name;
  ctxPts.textContent  = player.score + ' pts';

  ctxAv.innerHTML = '';
  const c = document.createElement('canvas');
  c.width = 34; c.height = 34;
  drawAvatar(c, player.avatarDef, 34);
  ctxAv.appendChild(c);

  contextMenu.classList.remove('hidden');
  const x = Math.min(e.clientX, window.innerWidth  - 200);
  const y = Math.min(e.clientY, window.innerHeight - 220);
  contextMenu.style.left = x + 'px';
  contextMenu.style.top  = y + 'px';
}

/* ================================================================
   VOTE TO KICK
================================================================ */
function setupVoteBanner() {
  $('btn-vote-yes').addEventListener('click', () => {
    voteBanner.classList.add('hidden');
    const total  = S.players.length;
    const needed = Math.ceil(total * 0.7);
    const votes  = 1 + Math.floor(Math.random() * (total - 1));
    if (votes >= needed && S.ctxTarget) {
      const name = S.ctxTarget.name;
      S.players = S.players.filter(p => p.id !== S.ctxTarget.id);
      buildLeaderboard();
      addChat('system', '', `🚪 ${name} was kicked by vote.`);
      showToast(`🚪 ${name} was kicked`, 't-warn');
    } else {
      showToast('❌ Not enough votes to kick', 't-info');
    }
  });
  $('btn-vote-no').addEventListener('click', () => {
    voteBanner.classList.add('hidden');
    showToast('✅ Vote cancelled', 't-info');
  });
}

function initiateVoteKick(player) {
  const total  = S.players.length;
  const needed = Math.ceil(total * 0.7);
  $('vote-title').textContent = `Vote to kick ${player.name}?`;
  $('vote-sub').textContent   = `${needed} of ${total} votes needed (70%)`;
  voteBanner.classList.remove('hidden');
  setTimeout(() => voteBanner.classList.add('hidden'), 12000);
}

/* ================================================================
   UTILS
================================================================ */
function shuffled(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ================================================================
   INIT LOBBY
================================================================ */
buildAvDots();
setAvatar(0);

window.addEventListener('resize', () => {
  if (screenGame.classList.contains('active')) resizeCanvas();
});
