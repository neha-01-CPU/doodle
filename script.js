/* ================================================================
   PICAZO — script.js
   Mobile-First Layout Update & Premium Toolbar System
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
   AVATAR RENDERER
================================================================ */

function drawAvatar(canvas, def, size = 96) {
  const c = canvas.getContext('2d');
  const W = size, H = size;
  c.clearRect(0, 0, W, H);

  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, def.accent + '33');
  bg.addColorStop(1, def.accent + '18');
  c.fillStyle = bg;
  
  c.beginPath();
  if(c.roundRect) {
    c.roundRect(0, 0, W, H, W * 0.2);
  } else {
    // Fallback if roundRect not supported
    c.rect(0, 0, W, H);
  }
  c.fill();

  const cx = W / 2, cy = H / 2;
  const headR = W * 0.22;
  const headY = H * 0.4;

  c.fillStyle = def.accent;
  c.beginPath();
  c.ellipse(cx, H * 0.88, W * 0.28, H * 0.22, 0, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = def.skin;
  c.fillRect(cx - W * 0.065, headY + headR * 0.8, W * 0.13, H * 0.1);

  drawHairBack(c, def.style, def.hCol, cx, headY, headR, W, H);

  c.fillStyle = def.skin;
  c.beginPath();
  c.ellipse(cx, headY, headR, headR * 1.1, 0, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = def.skin;
  c.beginPath(); c.ellipse(cx - headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx + headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();

  drawHairFront(c, def.style, def.hCol, cx, headY, headR, W, H);

  const eyeY = headY - headR * 0.08;
  const eyeOffX = headR * 0.42;
  [-1,1].forEach(side => {
    c.fillStyle = '#fff';
    c.beginPath(); c.ellipse(cx + side * eyeOffX, eyeY, headR * 0.2, headR * 0.24, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = def.hCol;
    c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.13, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#000';
    c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.065, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.beginPath(); c.arc(cx + side * eyeOffX + 2, eyeY - 2, headR * 0.04, 0, Math.PI * 2); c.fill();
  });

  c.strokeStyle = def.hCol; c.lineWidth = headR * 0.09; c.lineCap = 'round';
  [-1,1].forEach(side => {
    c.beginPath();
    c.moveTo(cx + side * (eyeOffX - headR * 0.16), eyeY - headR * 0.3);
    c.lineTo(cx + side * (eyeOffX + headR * 0.16), eyeY - headR * 0.28);
    c.stroke();
  });

  c.strokeStyle = shadeColor(def.skin, -20); c.lineWidth = headR * 0.07;
  c.beginPath();
  c.moveTo(cx - headR * 0.08, headY + headR * 0.12);
  c.lineTo(cx, headY + headR * 0.28);
  c.lineTo(cx + headR * 0.08, headY + headR * 0.12);
  c.stroke();

  const isFemale = def.style.startsWith('f-');
  c.strokeStyle = isFemale ? '#d07070' : '#a06060';
  c.lineWidth = headR * 0.09;
  c.beginPath();
  c.arc(cx, headY + headR * 0.5, headR * 0.22, 0.15, Math.PI - 0.15);
  c.stroke();

  if (isFemale) {
    [-1,1].forEach(side => {
      const g = c.createRadialGradient(cx + side * eyeOffX * 1.1, headY + headR * 0.35, 0, cx + side * eyeOffX * 1.1, headY + headR * 0.35, headR * 0.28);
      g.addColorStop(0, 'rgba(255,160,160,0.45)');
      g.addColorStop(1, 'rgba(255,160,160,0)');
      c.fillStyle = g;
      c.beginPath(); c.ellipse(cx + side * eyeOffX * 1.1, headY + headR * 0.35, headR * 0.28, headR * 0.18, 0, 0, Math.PI * 2); c.fill();
    });
  }

  if (def.style === 'm-beard') {
    c.fillStyle = def.hCol + 'cc';
    c.beginPath(); c.ellipse(cx, headY + headR * 0.65, headR * 0.4, headR * 0.28, 0, 0, Math.PI); c.fill();
    c.beginPath(); c.arc(cx - headR * 0.28, headY + headR * 0.52, headR * 0.18, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(cx + headR * 0.28, headY + headR * 0.52, headR * 0.18, 0, Math.PI * 2); c.fill();
  }

  if (def.style === 'm-spec' || def.style === 'f-spec') {
    c.strokeStyle = '#445'; c.lineWidth = headR * 0.1; c.fillStyle = 'rgba(180,220,255,0.25)';
    const gox = eyeOffX * 0.95, gr = headR * 0.22, gy = eyeY + 1;
    [-1,1].forEach(side => {
      c.beginPath(); c.arc(cx + side * gox, gy, gr, 0, Math.PI * 2); c.fill(); c.stroke();
    });
    c.beginPath();
    c.moveTo(cx - gox + gr, gy); c.lineTo(cx + gox - gr, gy); c.stroke();
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
    c.beginPath(); c.ellipse(cx - headR * 0.85, headY + headR * 0.2, headR * 0.32, headR * 0.9, -0.2, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx + headR * 0.85, headY + headR * 0.2, headR * 0.32, headR * 0.9, 0.2, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx, headY - headR * 0.7, headR * 0.95, headR * 0.45, 0, Math.PI, Math.PI * 2); c.fill();
  } else if (style === 'f-bun') {
    c.beginPath(); c.ellipse(cx, headY - headR * 0.72, headR * 0.92, headR * 0.44, 0, Math.PI, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx - headR * 0.8, headY + headR * 0.1, headR * 0.28, headR * 0.7, -0.15, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx + headR * 0.8, headY + headR * 0.1, headR * 0.28, headR * 0.7, 0.15, 0, Math.PI * 2); c.fill();
  }
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
  avatarIdx: 0,
  playerName: '',
  totalRounds: 5,
  drawTime: 90,
  botCount: 8,

  players: [],
  myId: 'me',
  drawerIdx: 0,       
  round: 1,
  currentWord: '',
  revealedIdx: [],
  guessedIds: new Set(),

  timeLeft: 90,
  timerInterval: null,
  wsTimerInterval: null,

  isDrawing: false,
  tool: 'pencil',
  color: '#000000',
  brushSize: 3,
  strokes: [],        
  shapeStart: null,
  snapBeforeShape: null,
  isDrawer: false,

  isMuted: false,
  ctxTarget: null,
  dpr: window.devicePixelRatio || 1
};

const CIRC = 2 * Math.PI * 25; 

/* ================================================================
   DOM REFS
================================================================ */
const $ = id => document.getElementById(id);

const screenLobby = $('screen-lobby');
const screenGame  = $('screen-game');

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

const timerNum   = $('timer-num');
const tFg        = $('t-fg');
const roundBadge = $('round-badge');
const wordDisplay = $('word-display');
const wordMeta   = $('word-meta');
const btnMute    = $('btn-mute');
const muteIcon   = $('mute-icon');

const playerList   = $('player-list');
const chatMessages = $('chat-messages');
const chatInput    = $('chat-input');
const btnChatSend  = $('btn-chat-send');

const gameCanvas = $('game-canvas');
const canvasWrap = $('canvas-wrap');
const ctx        = gameCanvas.getContext('2d', { willReadFrequently: true });

const overlayWaiting   = $('overlay-waiting');
const overlayWordSelect = $('overlay-word-select');
const overlayRoundEnd  = $('overlay-round-end');
const wsClock          = $('ws-timer');
const wsTimerBar       = $('ws-timer-bar');
const wsCards          = $('ws-cards');
const btnCopyLink      = $('btn-copy-link');

const reEmoji    = $('re-emoji');
const reTitle    = $('re-title');
const reWordVal  = $('re-word-val');
const reScores   = $('re-scores');
const reCountdown = $('re-countdown');
const reNext     = $('re-next');

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
  avDots.querySelectorAll('.av-dot').forEach((d, j) => d.classList.toggle('active', j === S.avatarIdx));
  avFrame.classList.add('glow');
  setTimeout(() => avFrame.classList.remove('glow'), 700);
}

btnAvPrev.addEventListener('click', () => setAvatar(S.avatarIdx - 1));
btnAvNext.addEventListener('click', () => setAvatar(S.avatarIdx + 1));

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
   TRANSITION & 100% PERFECT 50/50 MOBILE SPLIT
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
  const game = $('screen-game');
  const header = document.querySelector('.game-header');
  const body = document.querySelector('.game-body');
  const canvasCol = document.querySelector('.canvas-col');
  const lb = $('leaderboard-panel');
  const chat = $('chat-panel');

  let tRow = document.querySelector('.top-row-mobile');
  let bRow = document.querySelector('.bottom-row-mobile');

  if (isMobile) {
    if (!tRow) { 
      tRow = document.createElement('div'); 
      tRow.className = 'top-row-mobile'; 
      game.insertBefore(tRow, body); 
    }
    if (!bRow) { 
      bRow = document.createElement('div'); 
      bRow.className = 'bottom-row-mobile'; 
      game.insertBefore(bRow, body); 
    }
    
    if (!tRow.contains(header)) tRow.appendChild(header);
    if (!tRow.contains(canvasCol)) tRow.appendChild(canvasCol);
    if (!bRow.contains(lb)) bRow.appendChild(lb);
    if (!bRow.contains(chat)) bRow.appendChild(chat);
    
    body.style.display = 'none';
  } else {
    if (tRow) { 
      game.insertBefore(header, body); 
      body.insertBefore(canvasCol, body.firstChild); 
      tRow.remove(); 
    }
    if (bRow) { 
      body.insertBefore(lb, body.firstChild); 
      body.appendChild(chat); 
      bRow.remove(); 
    }
    body.style.display = 'flex';
  }
  
  resizeCanvas();
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
   PLAYERS & LEADERBOARD
================================================================ */
const BOT_NAMES = ['SketchBot','ArtGeek','DrawMaster','DoodleKing','PicassoJr','BrushWizard','InkMage','PixelPro'];

function buildPlayers() {
  S.players = [{
    id: S.myId, name: S.playerName, avatarDef: AVATAR_DEFS[S.avatarIdx], 
    score: 0, isSelf: true, guessed: false
  }];
  const shuffledBots = BOT_NAMES.slice().sort(() => Math.random() - 0.5);
  const shuffledAvs  = AVATAR_DEFS.slice(1).sort(() => Math.random() - 0.5);
  for (let i = 0; i < S.botCount - 1; i++) {
    S.players.push({
      id: 'bot_' + i, name: shuffledBots[i] || 'Bot' + i, avatarDef: shuffledAvs[i % shuffledAvs.length],
      score: 0, isSelf: false, guessed: false
    });
  }
  S.drawerIdx = 0;
}

function buildLeaderboard() {
  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  playerList.innerHTML = '';

  sorted.forEach((p, rank) => {
    const li = document.createElement('li');
    li.className = 'player-item' + (p.id === S.players[S.drawerIdx]?.id ? ' is-drawing' : '') + (p.guessed ? ' guessed' : '');
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

function updateRoundBadge() { roundBadge.textContent = `Round ${S.round}/${S.totalRounds}`; }

/* ================================================================
   WORD SELECTION & ROUND LOGIC
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
    card.innerHTML = `<span class="ws-emoji">${w.e}</span><div class="ws-word">${S.isDrawer ? w.w : '???'}</div><div class="ws-len">${w.w.length} letters</div>`;
    if (S.isDrawer) card.addEventListener('click', () => chooseWord(w.w));
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
    if (t <= 0) { clearInterval(S.wsTimerInterval); chooseWord(choices[0].w); }
  }, 1000);

  if (!S.isDrawer) setTimeout(() => { if (!overlayWordSelect.classList.contains('hidden')) chooseWord(choices[Math.floor(Math.random() * 3)].w); }, 4000);
}

function chooseWord(word) {
  clearInterval(S.wsTimerInterval);
  overlayWordSelect.classList.add('hidden');
  S.currentWord = word;
  S.revealedIdx = [];
  renderWordBlanks();
  startRoundTimer();
  addChat('system', '', `${S.players[S.drawerIdx].name} is now drawing! 🖊️`);
  scheduleBotGuesses();
}

function renderWordBlanks() {
  wordDisplay.innerHTML = '';
  if (!S.currentWord) { wordMeta.textContent = ''; return; }
  for (let i = 0; i < S.currentWord.length; i++) {
    const ch = S.currentWord[i];
    if (ch === ' ') {
      wordDisplay.insertAdjacentHTML('beforeend', `<div style="width:12px"></div>`);
      continue;
    }
    const grp = document.createElement('div');
    grp.className = 'wb-group';
    
    const charEl = document.createElement('div');
    charEl.className = 'wb-char' + (S.revealedIdx.includes(i) && !S.isDrawer ? ' reveal' : '');
    charEl.textContent = S.isDrawer || S.revealedIdx.includes(i) ? ch.toUpperCase() : '';
    
    grp.appendChild(charEl);
    grp.insertAdjacentHTML('beforeend', `<div class="wb-line" style="width:${Math.max(18, Math.floor(96 / S.currentWord.length))}px"></div>`);
    wordDisplay.appendChild(grp);
  }
  wordMeta.textContent = S.isDrawer ? `You are drawing — ${S.currentWord.length} letters` : `${S.currentWord.length} letters`;
}

function revealHintLetter() {
  const unrevealed = S.currentWord.split('').map((c, i) => i).filter(i => !S.revealedIdx.includes(i) && S.currentWord[i] !== ' ');
  if (unrevealed.length <= 1) return;
  S.revealedIdx.push(unrevealed[Math.floor(Math.random() * unrevealed.length)]);
  renderWordBlanks();
  showToast('💡 A hint letter was revealed!', 't-info');
}

function startRoundTimer() {
  S.timeLeft = S.drawTime;
  clearInterval(S.timerInterval);
  updateTimerUI();
  const hintAt = [Math.floor(S.drawTime * 0.6), Math.floor(S.drawTime * 0.3)];
  S.timerInterval = setInterval(() => {
    S.timeLeft--;
    if (hintAt.includes(S.timeLeft)) revealHintLetter();
    updateTimerUI();
    if (S.timeLeft <= 0) { clearInterval(S.timerInterval); endRound(false); }
  }, 1000);
}

function updateTimerUI() {
  timerNum.textContent = S.timeLeft;
  tFg.style.strokeDashoffset = CIRC * (1 - (S.timeLeft / S.drawTime));
  const warn = S.timeLeft <= 30;
  timerNum.className = 'timer-num' + (warn ? ' warn' : '');
  tFg.className = 't-fg' + (warn ? ' warn' : '');
}

function endRound(allGuessed = false) {
  clearInterval(S.timerInterval);
  clearInterval(S.wsTimerInterval);
  addChat('system', '', `⏰ Round over! The word was: "${S.currentWord}"`);

  if (S.guessedIds.size > 0) {
    const bonus = Math.min(S.guessedIds.size * 30, 150);
    S.players[S.drawerIdx].score += bonus;
    showToast(`✏️ ${S.players[S.drawerIdx].name} earned ${bonus} pts for drawing!`, 't-info');
  }

  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  reEmoji.textContent = allGuessed ? '🎉' : '⏰';
  reTitle.textContent = allGuessed ? 'Everyone guessed it!' : 'Round Over!';
  reWordVal.textContent = S.currentWord;
  reScores.innerHTML = sorted.map((p, i) => `<div class="re-score-row"><span class="re-score-name">${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${escHtml(p.name)}</span><span class="re-score-pts">${p.score} pts</span></div>`).join('');

  overlayRoundEnd.classList.remove('hidden');

  let cd = 5;
  reCountdown.textContent = cd;
  reNext.style.display = '';
  const cdInt = setInterval(() => {
    cd--; reCountdown.textContent = cd;
    if (cd <= 0) { clearInterval(cdInt); overlayRoundEnd.classList.add('hidden'); nextRound(); }
  }, 1000);
}

function nextRound() {
  S.round++;
  if (S.round > S.totalRounds) { endGame(); return; }
  S.drawerIdx = (S.drawerIdx + 1) % S.players.length;
  S.isDrawer = S.players[S.drawerIdx].id === S.myId;
  updateRoundBadge();
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  S.strokes = []; S.currentWord = ''; S.revealedIdx = [];
  renderWordBlanks(); buildLeaderboard();
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
  reScores.innerHTML = [...S.players].sort((a, b) => b.score - a.score).map((p, i) => `<div class="re-score-row"><span class="re-score-name">${i===0?'🥇':i===1?'🥈':i===2?'🥉':''} ${escHtml(p.name)}</span><span class="re-score-pts">${p.score} pts</span></div>`).join('');
}

function scheduleBotGuesses() {
  const bots = S.players.filter(p => !p.isSelf && p.id !== S.players[S.drawerIdx]?.id);
  const fakeGuesses = ['is it a bird?','house?','cat!','hmm a car?','tree?','fish!','airplane?','dog!','flower?','mountain?'];

  bots.forEach((bot, idx) => {
    const delay = 8000 + idx * 3000 + Math.random() * 6000;
    setTimeout(() => {
      if (!S.currentWord || bot.guessed) return;
      if (S.timeLeft / S.drawTime < 0.5 && Math.random() < 0.4) {
        botGuessCorrect(bot);
      } else {
        addChat('normal', bot.name, fakeGuesses[Math.floor(Math.random() * fakeGuesses.length)]);
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
   CANVAS DRAWING (POINTER EVENTS & DPR)
================================================================ */
function initCanvas() {
  resizeCanvas();
  gameCanvas.addEventListener('pointerdown',   onPointerDown);
  gameCanvas.addEventListener('pointermove',   onPointerMove);
  gameCanvas.addEventListener('pointerup',     onPointerUp);
  gameCanvas.addEventListener('pointercancel', onPointerUp);
}

function resizeCanvas() {
  const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
  if (W === 0 || H === 0) return;
  S.dpr = window.devicePixelRatio || 1;
  let snap = null;
  if (gameCanvas.width > 0) { try { snap = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height); } catch(e){} }
  
  gameCanvas.width  = W * S.dpr;
  gameCanvas.height = H * S.dpr;
  gameCanvas.style.width  = W + 'px';
  gameCanvas.style.height = H + 'px';
  
  ctx.scale(S.dpr, S.dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  if (snap) {
    const temp = document.createElement('canvas');
    temp.width = snap.width; temp.height = snap.height;
    temp.getContext('2d').putImageData(snap, 0, 0);
    ctx.drawImage(temp, 0, 0, W, H);
  }
}

function getPointerXY(e) {
  const r = gameCanvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function onPointerDown(e) { 
  if (S.isDrawer) {
    gameCanvas.setPointerCapture(e.pointerId); 
    S.isDrawing = true;
    const pos = getPointerXY(e);

    if (S.tool === 'fill') {
      floodFill(pos.x, pos.y, S.color);
      S.isDrawing = false;
      return;
    }
    if (S.tool === 'rect') {
      S.shapeStart = pos;
      S.snapBeforeShape = ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    applyBrushStyle();
  }
}

function onPointerMove(e) { 
  if (S.isDrawer && S.isDrawing) {
    const pos = getPointerXY(e);
    if (S.tool === 'rect') {
      ctx.putImageData(S.snapBeforeShape, 0, 0);
      applyBrushStyle();
      ctx.beginPath();
      const w = pos.x - S.shapeStart.x, h = pos.y - S.shapeStart.y;
      ctx.strokeRect(S.shapeStart.x, S.shapeStart.y, w, h);
      ctx.fillRect(S.shapeStart.x, S.shapeStart.y, w, h);
      return;
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
}

function onPointerUp(e) { 
  if (S.isDrawer) {
    gameCanvas.releasePointerCapture(e.pointerId);
    if (!S.isDrawing) return;
    S.isDrawing = false;

    if (S.tool === 'rect' && S.shapeStart) {
      const pos = getPointerXY(e);
      ctx.putImageData(S.snapBeforeShape, 0, 0);
      applyBrushStyle();
      ctx.beginPath();
      const w = pos.x - S.shapeStart.x, h = pos.y - S.shapeStart.y;
      ctx.strokeRect(S.shapeStart.x, S.shapeStart.y, w, h);
      ctx.fillRect(S.shapeStart.x, S.shapeStart.y, w, h);
      S.shapeStart = null;
    } else {
      ctx.closePath();
    }
    saveStroke();
  }
}

function applyBrushStyle() {
  const isEraser = S.tool === 'eraser';
  ctx.strokeStyle = isEraser ? '#ffffff' : S.color;
  ctx.fillStyle   = S.color + '18';
  ctx.lineWidth   = isEraser ? S.brushSize * 3 : S.brushSize;
  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
}

function saveStroke() {
  try {
    S.strokes.push(ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height));
    if (S.strokes.length > 30) S.strokes.shift();
  } catch(e) {}
  ctx.globalCompositeOperation = 'source-over';
}

function floodFill(startX, startY, fillHex) {
  const w = gameCanvas.width, h = gameCanvas.height;
  const id = ctx.getImageData(0, 0, w, h), d = id.data;
  const xi = Math.round(startX * S.dpr), yi = Math.round(startY * S.dpr);
  if (xi < 0 || xi >= w || yi < 0 || yi >= h) return;

  const idx = (yi * w + xi) * 4;
  const tr = d[idx], tg = d[idx+1], tb = d[idx+2], ta = d[idx+3];

  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fillHex);
  const fc = r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
  if (!fc || (tr === fc.r && tg === fc.g && tb === fc.b && ta === 255)) return;

  function match(i) { return Math.abs(d[i]-tr)<30 && Math.abs(d[i+1]-tg)<30 && Math.abs(d[i+2]-tb)<30 && Math.abs(d[i+3]-ta)<30; }

  const stack = [xi + yi * w], seen = new Uint8Array(w * h);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    const x = p % w, y = Math.floor(p / w);
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = p * 4;
    if (!match(i)) continue;
    seen[p] = 1;
    d[i] = fc.r; d[i+1] = fc.g; d[i+2] = fc.b; d[i+3] = 255;
    if (x+1 < w) stack.push(p+1); if (x-1 >= 0) stack.push(p-1);
    if (y+1 < h) stack.push(p+w); if (y-1 >= 0) stack.push(p-w);
  }
  ctx.putImageData(id, 0, 0);
  saveStroke();
}

/* ================================================================
   PREMIUM DARK TOOLBAR SYSTEM (POPUPS)
================================================================ */
function setupToolbar() {
  ['pencil','rect','fill','eraser'].forEach(t => {
    $('tool-' + t).addEventListener('click', () => selectTool(t));
  });

  $('tool-clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    S.strokes = [];
    showToast('🗑️ Canvas cleared', 't-info');
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

  // Popup logic
  const pColor = $('popup-color');
  const pSize = $('popup-size');

  $('btn-color-popup').addEventListener('click', (e) => {
    e.stopPropagation();
    pColor.classList.toggle('hidden');
    pSize.classList.add('hidden');
  });

  $('btn-size-popup').addEventListener('click', (e) => {
    e.stopPropagation();
    pSize.classList.toggle('hidden');
    pColor.classList.add('hidden');
  });

  // Close popups when clicking outside
  document.addEventListener('click', (e) => {
    if (!pColor.contains(e.target) && !$('btn-color-popup').contains(e.target)) pColor.classList.add('hidden');
    if (!pSize.contains(e.target) && !$('btn-size-popup').contains(e.target)) pSize.classList.add('hidden');
  });

  // Size slider
  $('size-slider').addEventListener('input', (e) => {
    S.brushSize = +e.target.value;
    $('size-val-txt').textContent = S.brushSize + 'px';
  });
}

function buildColorPalette() {
  $('color-palette').innerHTML = COLORS.map(hex => 
    `<div class="c-swatch ${hex===S.color?'active':''}" style="background:${hex}" onclick="pickColor('${hex}')"></div>`
  ).join('');

  $('color-picker').addEventListener('input', e => pickColor(e.target.value));
}

function pickColor(hex) {
  S.color = hex;
  $('color-indicator').style.background = hex;
  $('color-picker').value = hex;
  document.querySelectorAll('.c-swatch').forEach(s => s.classList.toggle('active', s.style.background === hex));
  if (S.tool === 'eraser') selectTool('pencil');
}

function selectTool(tool) {
  S.tool = tool;
  document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.toggle('active', b.id === 'tool-' + tool));
  gameCanvas.className = tool === 'eraser' ? 'eraser' : '';
  canvasWrap.className = 'canvas-wrap' + (tool === 'fill' ? ' fill-mode' : '');
}

/* ================================================================
   CHAT
================================================================ */
function setupChat() {
  btnChatSend.addEventListener('click', sendGuess);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendGuess(); });
}

function sendGuess() {
  const val = chatInput.value.trim();
  if (!val) return;
  chatInput.value = '';

  if (S.isDrawer || S.guessedIds.has(S.myId)) { addChat('normal', S.playerName, val); return; }

  if (S.currentWord && val.toLowerCase() === S.currentWord.toLowerCase()) {
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
  div.innerHTML = type === 'system' ? `<span class="msg-text">${escHtml(text)}</span>` : `<span class="msg-name">${escHtml(name)}:</span> <span class="msg-text">${escHtml(text)}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ================================================================
   UI UTILS
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

function showToast(msg, type = 't-info') {
  const tc = $('toast-container'), t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg;
  tc.prepend(t);
  setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 380); }, 4500);
}

function setupContextMenu() {
  document.addEventListener('click', e => { if (!contextMenu.contains(e.target)) contextMenu.classList.add('hidden'); });
  $('ctx-kick').addEventListener('click', () => { contextMenu.classList.add('hidden'); if (S.ctxTarget) initiateVoteKick(S.ctxTarget); });
  $('ctx-mute').addEventListener('click', () => { if (S.ctxTarget) showToast(`🔇 ${S.ctxTarget.name} muted locally`, 't-info'); contextMenu.classList.add('hidden'); });
  $('ctx-close').addEventListener('click', () => contextMenu.classList.add('hidden'));
}

function openContextMenu(e, player) {
  e.stopPropagation(); S.ctxTarget = player;
  ctxName.textContent = player.name; ctxPts.textContent = player.score + ' pts';
  ctxAv.innerHTML = '';
  const c = document.createElement('canvas'); c.width = 34; c.height = 34;
  drawAvatar(c, player.avatarDef, 34); ctxAv.appendChild(c);
  contextMenu.classList.remove('hidden');
  contextMenu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
  contextMenu.style.top = Math.min(e.clientY, window.innerHeight - 220) + 'px';
}

function setupVoteBanner() {
  $('btn-vote-yes').addEventListener('click', () => {
    voteBanner.classList.add('hidden');
    if (S.ctxTarget) {
      const name = S.ctxTarget.name;
      S.players = S.players.filter(p => p.id !== S.ctxTarget.id);
      buildLeaderboard();
      addChat('system', '', `🚪 ${name} was kicked by vote.`);
      showToast(`🚪 ${name} was kicked`, 't-warn');
    }
  });
  $('btn-vote-no').addEventListener('click', () => { voteBanner.classList.add('hidden'); showToast('✅ Vote cancelled', 't-info'); });
}

function initiateVoteKick(player) {
  $('vote-title').textContent = `Vote to kick ${player.name}?`;
  $('vote-sub').textContent = `${Math.ceil(S.players.length * 0.7)} of ${S.players.length} votes needed (70%)`;
  voteBanner.classList.remove('hidden');
  setTimeout(() => voteBanner.classList.add('hidden'), 12000);
}

function shuffled(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function escHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

buildAvDots(); setAvatar(0);
