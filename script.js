/* ================================================================
   PICAZO — script.js
   Error-Free Game Logic, Canvas Rendering & Toolbar Sync
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
  if (c.roundRect) c.roundRect(0, 0, W, H, W * 0.2);
  else c.rect(0, 0, W, H);
  c.fill();

  const cx = W / 2, cy = H / 2, headR = W * 0.22, headY = H * 0.4;

  c.fillStyle = def.accent; c.beginPath(); c.ellipse(cx, H * 0.88, W * 0.28, H * 0.22, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = def.skin; c.fillRect(cx - W * 0.065, headY + headR * 0.8, W * 0.13, H * 0.1);
  drawHairBack(c, def.style, def.hCol, cx, headY, headR, W, H);
  
  c.fillStyle = def.skin; c.beginPath(); c.ellipse(cx, headY, headR, headR * 1.1, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx - headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx + headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();

  drawHairFront(c, def.style, def.hCol, cx, headY, headR, W, H);

  const eyeY = headY - headR * 0.08, eyeOffX = headR * 0.42;
  [-1,1].forEach(side => {
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(cx + side * eyeOffX, eyeY, headR * 0.2, headR * 0.24, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = def.hCol; c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.13, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#000'; c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.065, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.arc(cx + side * eyeOffX + 2, eyeY - 2, headR * 0.04, 0, Math.PI * 2); c.fill();
  });

  c.strokeStyle = def.hCol; c.lineWidth = headR * 0.09; c.lineCap = 'round';
  [-1,1].forEach(side => {
    c.beginPath(); c.moveTo(cx + side * (eyeOffX - headR * 0.16), eyeY - headR * 0.3); c.lineTo(cx + side * (eyeOffX + headR * 0.16), eyeY - headR * 0.28); c.stroke();
  });

  c.strokeStyle = shadeColor(def.skin, -20); c.lineWidth = headR * 0.07;
  c.beginPath(); c.moveTo(cx - headR * 0.08, headY + headR * 0.12); c.lineTo(cx, headY + headR * 0.28); c.lineTo(cx + headR * 0.08, headY + headR * 0.12); c.stroke();

  const isFemale = def.style.startsWith('f-');
  c.strokeStyle = isFemale ? '#d07070' : '#a06060'; c.lineWidth = headR * 0.09;
  c.beginPath(); c.arc(cx, headY + headR * 0.5, headR * 0.22, 0.15, Math.PI - 0.15); c.stroke();

  if (isFemale) {
    [-1,1].forEach(side => {
      const g = c.createRadialGradient(cx + side * eyeOffX * 1.1, headY + headR * 0.35, 0, cx + side * eyeOffX * 1.1, headY + headR * 0.35, headR * 0.28);
      g.addColorStop(0, 'rgba(255,160,160,0.45)'); g.addColorStop(1, 'rgba(255,160,160,0)');
      c.fillStyle = g; c.beginPath(); c.ellipse(cx + side * eyeOffX * 1.1, headY + headR * 0.35, headR * 0.28, headR * 0.18, 0, 0, Math.PI * 2); c.fill();
    });
  }

  if (def.style === 'm-beard') {
    c.fillStyle = def.hCol + 'cc'; c.beginPath(); c.ellipse(cx, headY + headR * 0.65, headR * 0.4, headR * 0.28, 0, 0, Math.PI); c.fill();
    c.beginPath(); c.arc(cx - headR * 0.28, headY + headR * 0.52, headR * 0.18, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(cx + headR * 0.28, headY + headR * 0.52, headR * 0.18, 0, Math.PI * 2); c.fill();
  }

  if (def.style === 'm-spec' || def.style === 'f-spec') {
    c.strokeStyle = '#445'; c.lineWidth = headR * 0.1; c.fillStyle = 'rgba(180,220,255,0.25)';
    const gox = eyeOffX * 0.95, gr = headR * 0.22, gy = eyeY + 1;
    [-1,1].forEach(side => { c.beginPath(); c.arc(cx + side * gox, gy, gr, 0, Math.PI * 2); c.fill(); c.stroke(); });
    c.beginPath(); c.moveTo(cx - gox + gr, gy); c.lineTo(cx + gox - gr, gy); c.stroke();
    c.beginPath(); c.moveTo(cx - gox - gr, gy); c.lineTo(cx - headR, gy - 2); c.stroke();
    c.beginPath(); c.moveTo(cx + gox + gr, gy); c.lineTo(cx + headR, gy - 2); c.stroke();
  }
}

function drawHairBack(c, style, hCol, cx, headY, headR, W, H) {
  c.fillStyle = hCol;
  if (style === 'f-long') { c.beginPath(); c.ellipse(cx, headY + headR * 0.6, headR * 1.15, headR * 1.5, 0, 0, Math.PI * 2); c.fill(); } 
  else if (style === 'f-bun') { c.beginPath(); c.ellipse(cx, headY + headR * 0.5, headR * 1.05, headR * 1.2, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(cx, headY - headR * 1.05, headR * 0.4, 0, Math.PI * 2); c.fill(); }
}

function drawHairFront(c, style, hCol, cx, headY, headR, W, H) {
  c.fillStyle = hCol;
  if (style === 'm-short') { c.beginPath(); c.ellipse(cx, headY - headR * 0.65, headR * 1.0, headR * 0.55, 0, Math.PI, Math.PI * 2); c.fill(); } 
  else if (style === 'm-beard' || style === 'm-spec') { c.beginPath(); c.ellipse(cx, headY - headR * 0.7, headR * 0.95, headR * 0.48, 0, Math.PI, Math.PI * 2); c.fill(); } 
  else if (style === 'f-long') { c.beginPath(); c.ellipse(cx - headR * 0.85, headY + headR * 0.2, headR * 0.32, headR * 0.9, -0.2, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(cx + headR * 0.85, headY + headR * 0.2, headR * 0.32, headR * 0.9, 0.2, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(cx, headY - headR * 0.7, headR * 0.95, headR * 0.45, 0, Math.PI, Math.PI * 2); c.fill(); } 
  else if (style === 'f-bun') { c.beginPath(); c.ellipse(cx, headY - headR * 0.72, headR * 0.92, headR * 0.44, 0, Math.PI, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(cx - headR * 0.8, headY + headR * 0.1, headR * 0.28, headR * 0.7, -0.15, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(cx + headR * 0.8, headY + headR * 0.1, headR * 0.28, headR * 0.7, 0.15, 0, Math.PI * 2); c.fill(); }
}

function shadeColor(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt)), g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt)), b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ================================================================
   GAME STATE
================================================================ */
let S = {
  avatarIdx: 0, playerName: '', totalRounds: 5, drawTime: 90, botCount: 4,
  players: [], myId: 'me', drawerIdx: 0, round: 1, currentWord: '', revealedIdx: [], guessedIds: new Set(),
  timeLeft: 90, timerInterval: null, wsTimerInterval: null,
  isDrawing: false, tool: 'pencil', color: '#000000', brushSize: 3, strokes: [], shapeStart: null, snapBeforeShape: null, isDrawer: false,
  isMuted: false, ctxTarget: null, dpr: window.devicePixelRatio || 1
};
const CIRC = 2 * Math.PI * 25; 

/* ================================================================
   DOM REFS
================================================================ */
const $ = id => document.getElementById(id);
const screenLobby = $('screen-lobby'), screenGame = $('screen-game');
const gameCanvas = $('game-canvas'), canvasWrap = $('canvas-wrap'), ctx = gameCanvas.getContext('2d', {willReadFrequently:true});
const playerList = $('player-list'), chatMessages = $('chat-messages'), chatInput = $('chat-input');
const overlayWordSelect = $('overlay-word-select'), overlayRoundEnd = $('overlay-round-end'), overlayWaiting = $('overlay-waiting');

/* ================================================================
   LOBBY
================================================================ */
function setAvatar(i) {
  S.avatarIdx = ((i % AVATAR_DEFS.length) + AVATAR_DEFS.length) % AVATAR_DEFS.length;
  drawAvatar($('av-canvas'), AVATAR_DEFS[S.avatarIdx], 96);
  if($('av-dots')) {
    $('av-dots').innerHTML = AVATAR_DEFS.map((_,j) => `<button class="av-dot ${j===S.avatarIdx?'active':''}" onclick="setAvatar(${j})"></button>`).join('');
  }
  $('av-frame').classList.add('glow'); setTimeout(() => $('av-frame').classList.remove('glow'), 700);
}
if($('btn-av-prev')) $('btn-av-prev').onclick = () => setAvatar(S.avatarIdx - 1);
if($('btn-av-next')) $('btn-av-next').onclick = () => setAvatar(S.avatarIdx + 1);

if($('btn-play')) {
  $('btn-play').onclick = () => {
    const name = $('inp-name').value.trim();
    if (!name) { $('inp-name').classList.add('shake'); setTimeout(()=>$('inp-name').classList.remove('shake'), 500); $('inp-name').focus(); return; }
    S.playerName = name; S.totalRounds = +$('sel-rounds').value; S.drawTime = +$('sel-time').value; S.botCount = +$('sel-bots').value;
    screenLobby.style.opacity = '0'; setTimeout(() => { screenLobby.classList.remove('active'); screenLobby.style.display = 'none'; screenGame.classList.add('active'); initGame(); }, 400);
  };
}

/* ================================================================
   GAME INIT
================================================================ */
function initGame() {
  buildPlayers(); buildColorPalette(); setupToolbar(); setupChat(); setupMuteBtn(); initCanvas();
  overlayWaiting.classList.add('hidden');
  addChat('system', '', '🎨 Welcome to Picazo!'); addChat('system', '', `${S.players[S.drawerIdx].name} draws first!`);
  S.round = 1; S.drawerIdx = 0; S.isDrawer = S.players[S.drawerIdx].id === S.myId;
  updateRoundBadge(); buildLeaderboard(); startWordSelection();
}

function buildPlayers() {
  S.players = [{id: S.myId, name: S.playerName, avatarDef: AVATAR_DEFS[S.avatarIdx], score: 0, isSelf: true, guessed: false}];
  const bots = ['SketchBot','ArtGeek','DrawMaster','DoodleKing','PixelPro'].sort(() => Math.random() - 0.5);
  for (let i = 0; i < S.botCount - 1; i++) S.players.push({id: 'b'+i, name: bots[i] || 'Bot'+i, avatarDef: AVATAR_DEFS[(i+1)%AVATAR_DEFS.length], score: 0, isSelf: false, guessed: false});
}

function buildLeaderboard() {
  playerList.innerHTML = [...S.players].sort((a, b) => b.score - a.score).map((p, i) => `
    <li class="player-item ${p.id === S.players[S.drawerIdx].id ? 'is-drawing' : ''} ${p.guessed ? 'guessed' : ''}">
      <div class="pi-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)}</div>
      <div class="pi-info"><div class="pi-name">${p.isSelf?'⭐ ':''}${escHtml(p.name)}</div><div class="pi-score">${p.score} pts</div></div>
      ${p.id===S.players[S.drawerIdx].id ? `<span class="pi-badge drawing">✏️</span>` : p.guessed ? `<span class="pi-badge guessed">✅</span>` : ''}
    </li>`).join('');
}

function updateRoundBadge() { if($('round-badge')) $('round-badge').textContent = `Round ${S.round}/${S.totalRounds}`; }

/* ================================================================
   WORD SELECTION & ROUND LOOP
================================================================ */
function startWordSelection() {
  S.players.forEach(p => p.guessed = false); S.guessedIds.clear(); buildLeaderboard();
  overlayWordSelect.classList.remove('hidden');
  const choices = WORD_BANK.sort(()=>Math.random()-0.5).slice(0,3);
  $('ws-cards').innerHTML = choices.map(w => `<div class="ws-card" onclick="chooseWord('${w.w}')"><span class="ws-emoji">${w.e}</span><div class="ws-word">${S.isDrawer ? w.w : '???'}</div></div>`).join('');
  let t = 15; $('ws-timer').textContent = t; $('ws-timer-bar').style.width = '100%'; $('ws-timer-bar').style.transition = 'none';
  clearInterval(S.wsTimerInterval);
  S.wsTimerInterval = setInterval(() => { t--; $('ws-timer').textContent = t; $('ws-timer-bar').style.transition = 'width 1s linear'; $('ws-timer-bar').style.width = (t/15*100)+'%'; if (t <= 0) { clearInterval(S.wsTimerInterval); chooseWord(choices[0].w); } }, 1000);
  if (!S.isDrawer) setTimeout(() => { if (!overlayWordSelect.classList.contains('hidden')) chooseWord(choices[0].w); }, 4000);
}

function chooseWord(word) {
  clearInterval(S.wsTimerInterval); overlayWordSelect.classList.add('hidden');
  S.currentWord = word; S.revealedIdx = []; renderWordBlanks(); startRoundTimer();
  addChat('system', '', `${S.players[S.drawerIdx].name} is drawing!`); scheduleBotGuesses();
}

function renderWordBlanks() {
  $('word-display').innerHTML = S.currentWord.split('').map((c, i) => c === ' ' ? '<div style="width:12px"></div>' : `<div class="wb-group"><div class="wb-char ${S.revealedIdx.includes(i)&&!S.isDrawer?'reveal':''}">${S.isDrawer||S.revealedIdx.includes(i)?c.toUpperCase():''}</div><div class="wb-line" style="width:18px"></div></div>`).join('');
  $('word-meta').textContent = S.isDrawer ? `You are drawing — ${S.currentWord.length} letters` : `${S.currentWord.length} letters`;
}

function startRoundTimer() {
  S.timeLeft = S.drawTime; clearInterval(S.timerInterval); updateTimerUI();
  S.timerInterval = setInterval(() => { S.timeLeft--; updateTimerUI(); if (S.timeLeft <= 0) endRound(); }, 1000);
}

function updateTimerUI() {
  $('timer-num').textContent = S.timeLeft;
  $('t-fg').style.strokeDashoffset = CIRC * (1 - (S.timeLeft / S.drawTime));
}

function endRound() {
  clearInterval(S.timerInterval); addChat('system', '', `⏰ Round over! Word was: "${S.currentWord}"`);
  $('re-word-val').textContent = S.currentWord;
  $('re-scores').innerHTML = [...S.players].sort((a,b)=>b.score-a.score).map((p,i)=>`<div class="re-score-row"><span class="re-score-name">${i===0?'🥇':''} ${escHtml(p.name)}</span><span class="re-score-pts">${p.score} pts</span></div>`).join('');
  overlayRoundEnd.classList.remove('hidden');
  let cd = 5; $('re-countdown').textContent = cd;
  const cdInt = setInterval(() => { cd--; $('re-countdown').textContent = cd; if (cd <= 0) { clearInterval(cdInt); overlayRoundEnd.classList.add('hidden'); nextRound(); } }, 1000);
}

function nextRound() {
  S.round++; if (S.round > S.totalRounds) return alert('Game Over!');
  S.drawerIdx = (S.drawerIdx + 1) % S.players.length; S.isDrawer = S.players[S.drawerIdx].id === S.myId;
  updateRoundBadge(); ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height); S.strokes = [];
  buildLeaderboard(); startWordSelection();
}

function scheduleBotGuesses() {
  S.players.filter(p => !p.isSelf && p.id !== S.players[S.drawerIdx]?.id).forEach((bot, idx) => {
    setTimeout(() => {
      if (!S.currentWord || bot.guessed) return;
      if (S.timeLeft / S.drawTime < 0.5 && Math.random() < 0.4) {
        bot.score += Math.max(10, Math.round(S.timeLeft/S.drawTime*100)); bot.guessed = true; S.guessedIds.add(bot.id);
        addChat('correct', bot.name, 'Guessed it!'); buildLeaderboard();
      } else addChat('normal', bot.name, 'is it a dog?');
    }, 8000 + idx*3000 + Math.random()*5000);
  });
}

/* ================================================================
   ERROR-FREE TOOLBAR & COLOR PALETTE
================================================================ */
function setupToolbar() {
  // 1. Bind Drawing Tools safely
  const tools = ['pencil','brush','eraser','fill','line','rect','circle'];
  tools.forEach(t => {
    const btn = $('tool-' + t);
    if (btn) btn.addEventListener('click', () => selectTool(t));
  });

  // 2. Bind Action Buttons safely
  const btnClear = $('tool-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      S.strokes = []; showToast('🗑️ Canvas cleared', 't-info');
    });
  }

  const btnUndo = $('tool-undo');
  if (btnUndo) {
    btnUndo.addEventListener('click', () => {
      if (S.strokes.length > 1) { S.strokes.pop(); ctx.putImageData(S.strokes[S.strokes.length - 1], 0, 0); } 
      else { ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); S.strokes = []; }
    });
  }

  // Bonus: If you add a download button, it works automatically!
  const btnDownload = $('tool-download');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const link = document.createElement('a'); link.download = 'picazo-drawing.png';
      link.href = gameCanvas.toDataURL(); link.click(); showToast('💾 Drawing saved!', 't-correct');
    });
  }

  // 3. Bind Brush Size Dots safely
  document.querySelectorAll('.brush-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      S.brushSize = +dot.dataset.size;
      document.querySelectorAll('.brush-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}

function buildColorPalette() {
  const cp = $('color-palette');
  if (!cp) return;
  cp.innerHTML = '';
  COLORS.forEach(hex => {
    const sw = document.createElement('div');
    sw.className = 'c-swatch' + (hex === S.color ? ' active' : '');
    sw.style.background = hex;
    sw.title = hex; // We use title to match colors perfectly later
    if (hex === '#ffffff') sw.style.border = '2px solid #ccc';
    sw.addEventListener('click', () => pickColor(hex));
    cp.appendChild(sw);
  });

  // Bind custom color picker
  const cActive = $('color-active');
  const cPicker = $('color-picker');
  if (cActive && cPicker) {
    cActive.style.background = S.color;
    cPicker.value = S.color;
    cActive.onclick = () => cPicker.click();
    cPicker.oninput = e => pickColor(e.target.value);
  }
}

function pickColor(hex) {
  S.color = hex;
  const cActive = $('color-active');
  const cPicker = $('color-picker');
  if (cActive) cActive.style.background = hex;
  if (cPicker) cPicker.value = hex;

  document.querySelectorAll('.c-swatch').forEach(s => s.classList.remove('active'));
  // Safe matching by title to prevent rgb() vs hex conversion issues
  const match = [...document.querySelectorAll('.c-swatch')].find(s => s.title.toLowerCase() === hex.toLowerCase());
  if (match) match.classList.add('active');
  
  if (S.tool === 'eraser') selectTool('pencil');
}

function selectTool(tool) {
  S.tool = tool;
  document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
  const activeBtn = $('tool-' + tool);
  if (activeBtn) activeBtn.classList.add('active');
  gameCanvas.className = tool === 'eraser' ? 'eraser' : '';
  canvasWrap.className = 'canvas-wrap' + (tool === 'fill' ? ' fill-mode' : '');
}

/* ================================================================
   CANVAS DRAWING (POINTER EVENTS & HIGH-DPI)
================================================================ */
function initCanvas() {
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  gameCanvas.addEventListener('pointerdown', onPointerDown);
  gameCanvas.addEventListener('pointermove', onPointerMove);
  gameCanvas.addEventListener('pointerup', onPointerUp);
  gameCanvas.addEventListener('pointercancel', onPointerUp);
}

function resizeCanvas() {
  const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
  if (!W || !H) return;
  S.dpr = window.devicePixelRatio || 1;
  let snap = null;
  if (gameCanvas.width > 0) try { snap = ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height); } catch(e){}
  
  gameCanvas.width = W * S.dpr; gameCanvas.height = H * S.dpr;
  gameCanvas.style.width = W+'px'; gameCanvas.style.height = H+'px';
  ctx.scale(S.dpr, S.dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (snap) { const t=document.createElement('canvas'); t.width=snap.width; t.height=snap.height; t.getContext('2d').putImageData(snap,0,0); ctx.drawImage(t,0,0,W,H); }
}

function getPointerXY(e) {
  const r = gameCanvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function onPointerDown(e) {
  if (!S.isDrawer) return;
  gameCanvas.setPointerCapture(e.pointerId); S.isDrawing = true;
  const pos = getPointerXY(e);
  if (S.tool === 'fill') { floodFill(pos.x, pos.y, S.color); S.isDrawing = false; return; }
  if (['rect','circle','line'].includes(S.tool)) { S.shapeStart = pos; S.snapBeforeShape = ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height); return; }
  ctx.beginPath(); ctx.moveTo(pos.x, pos.y); applyBrushStyle();
}

function onPointerMove(e) {
  if (!S.isDrawer || !S.isDrawing) return;
  const pos = getPointerXY(e);
  if (['rect','circle','line'].includes(S.tool)) {
    ctx.putImageData(S.snapBeforeShape, 0, 0); applyBrushStyle(); ctx.beginPath();
    if(S.tool==='rect') { ctx.strokeRect(S.shapeStart.x, S.shapeStart.y, pos.x-S.shapeStart.x, pos.y-S.shapeStart.y); ctx.fillRect(S.shapeStart.x, S.shapeStart.y, pos.x-S.shapeStart.x, pos.y-S.shapeStart.y); }
    else if (S.tool==='circle') { const rx=Math.abs(pos.x-S.shapeStart.x)/2, ry=Math.abs(pos.y-S.shapeStart.y)/2; ctx.ellipse(S.shapeStart.x+(pos.x-S.shapeStart.x)/2, S.shapeStart.y+(pos.y-S.shapeStart.y)/2, Math.max(1,rx), Math.max(1,ry), 0,0,Math.PI*2); ctx.stroke(); ctx.fill(); }
    else { ctx.moveTo(S.shapeStart.x, S.shapeStart.y); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
    return;
  }
  ctx.lineTo(pos.x, pos.y); ctx.stroke();
}

function onPointerUp(e) {
  if (!S.isDrawer) return;
  gameCanvas.releasePointerCapture(e.pointerId);
  if (!S.isDrawing) return; S.isDrawing = false;
  if (['rect','circle','line'].includes(S.tool) && S.shapeStart) { onPointerMove(e); S.shapeStart = null; } 
  else ctx.closePath();
  try { S.strokes.push(ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height)); if(S.strokes.length>30) S.strokes.shift(); } catch(e){}
}

function applyBrushStyle() {
  const isEraser = S.tool === 'eraser';
  ctx.strokeStyle = isEraser ? '#ffffff' : S.color;
  ctx.fillStyle   = S.color + '18';
  ctx.lineWidth   = isEraser ? S.brushSize * 3 : S.brushSize;
  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  
  // Brush softness effect
  if (S.tool === 'brush') { ctx.shadowBlur = S.brushSize / 2; ctx.shadowColor = S.color; } 
  else { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; }
}

function floodFill(startX, startY, fillHex) {
  const w = gameCanvas.width, h = gameCanvas.height, id = ctx.getImageData(0, 0, w, h), d = id.data;
  const xi = Math.round(startX * S.dpr), yi = Math.round(startY * S.dpr);
  if (xi < 0 || xi >= w || yi < 0 || yi >= h) return;
  const idx = (yi * w + xi) * 4, tr = d[idx], tg = d[idx+1], tb = d[idx+2], ta = d[idx+3];
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fillHex), fc = r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
  if (!fc || (tr === fc.r && tg === fc.g && tb === fc.b && ta === 255)) return;
  function match(i) { return Math.abs(d[i]-tr)<30 && Math.abs(d[i+1]-tg)<30 && Math.abs(d[i+2]-tb)<30 && Math.abs(d[i+3]-ta)<30; }
  const stack = [xi + yi * w], seen = new Uint8Array(w * h);
  while (stack.length) {
    const p = stack.pop(); if (seen[p]) continue;
    const x = p % w, y = Math.floor(p / w); if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = p * 4; if (!match(i)) continue;
    seen[p] = 1; d[i] = fc.r; d[i+1] = fc.g; d[i+2] = fc.b; d[i+3] = 255;
    if (x+1 < w) stack.push(p+1); if (x-1 >= 0) stack.push(p-1);
    if (y+1 < h) stack.push(p+w); if (y-1 >= 0) stack.push(p-w);
  }
  ctx.putImageData(id, 0, 0);
  try { S.strokes.push(ctx.getImageData(0,0,w,h)); } catch(e){}
}

/* ================================================================
   CHAT
================================================================ */
function setupChat() {
  if($('btn-chat-send')) $('btn-chat-send').addEventListener('click', sendGuess);
  if(chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendGuess(); });
}
function sendGuess() {
  const val = chatInput.value.trim(); if (!val) return; chatInput.value = '';
  if (S.isDrawer || S.guessedIds.has(S.myId)) { addChat('normal', S.playerName, val); return; }
  if (S.currentWord && val.toLowerCase() === S.currentWord.toLowerCase()) {
    const pts = Math.max(10, Math.round(S.timeLeft / S.drawTime * 100));
    S.players[0].score += pts; S.players[0].guessed = true; S.guessedIds.add(S.myId);
    addChat('correct', S.playerName, `🎉 Guessed it! (+${pts} pts)`); buildLeaderboard();
  } else addChat('normal', S.playerName, val);
}
function addChat(type, name, text) {
  if(!chatMessages) return;
  const div = document.createElement('div'); div.className = 'chat-msg ' + type;
  div.innerHTML = type === 'system' ? `<span class="msg-text">${escHtml(text)}</span>` : `<span class="msg-name">${escHtml(name)}:</span> <span class="msg-text">${escHtml(text)}</span>`;
  chatMessages.appendChild(div); chatMessages.scrollTop = chatMessages.scrollHeight;
}
function setupMuteBtn() {
  if(btnMute) btnMute.addEventListener('click', () => { S.isMuted = !S.isMuted; showToast(S.isMuted ? '🔇 Sound muted' : '🔊 Sound on', 't-info'); });
}
function showToast(msg, type = 't-info') {
  const tc = $('toast-container'); if(!tc) return;
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; tc.prepend(t);
  setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 380); }, 4500);
}
function escHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

if($('av-dots')) setAvatar(0);
