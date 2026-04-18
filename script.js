/* ================================================================
   PICAZO — script.js
   Cleaned & Stable Architecture
================================================================ */

'use strict';

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
];

function drawAvatar(canvas, def, size = 96) {
  const c = canvas.getContext('2d');
  const W = size, H = size;
  c.clearRect(0, 0, W, H);
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, def.accent + '33');
  bg.addColorStop(1, def.accent + '18');
  c.fillStyle = bg;
  c.beginPath(); 
  if(c.roundRect) c.roundRect(0, 0, W, H, W * 0.2); else c.rect(0, 0, W, H);
  c.fill();

  const cx = W / 2, cy = H / 2, headR = W * 0.22, headY = H * 0.4;
  c.fillStyle = def.accent; c.beginPath(); c.ellipse(cx, H * 0.88, W * 0.28, H * 0.22, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = def.skin; c.fillRect(cx - W * 0.065, headY + headR * 0.8, W * 0.13, H * 0.1);

  c.fillStyle = def.hCol;
  if (def.style.includes('long')) { c.beginPath(); c.ellipse(cx, headY + headR * 0.6, headR * 1.15, headR * 1.5, 0, 0, Math.PI * 2); c.fill(); }

  c.fillStyle = def.skin; c.beginPath(); c.ellipse(cx, headY, headR, headR * 1.1, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx - headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx + headR * 0.92, headY + headR * 0.05, headR * 0.2, headR * 0.25, 0, 0, Math.PI * 2); c.fill();

  c.fillStyle = def.hCol;
  c.beginPath(); c.ellipse(cx, headY - headR * 0.65, headR * 1.0, headR * 0.55, 0, Math.PI, Math.PI * 2); c.fill();

  const eyeY = headY - headR * 0.08, eyeOffX = headR * 0.42;
  [-1,1].forEach(side => {
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(cx + side * eyeOffX, eyeY, headR * 0.2, headR * 0.24, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = def.hCol; c.beginPath(); c.arc(cx + side * eyeOffX, eyeY + 1, headR * 0.13, 0, Math.PI * 2); c.fill();
  });
}

let S = {
  avatarIdx: 0, playerName: '', totalRounds: 5, drawTime: 90, botCount: 4,
  players: [], myId: 'me', drawerIdx: 0, round: 1, currentWord: '', revealedIdx: [], guessedIds: new Set(),
  timeLeft: 90, timerInterval: null, wsTimerInterval: null,
  isDrawing: false, tool: 'pencil', color: '#000000', brushSize: 3, strokes: [], shapeStart: null, snapBeforeShape: null, isDrawer: false,
  isMuted: false, ctxTarget: null, dpr: window.devicePixelRatio || 1
};

const $ = id => document.getElementById(id);
const CIRC = 2 * Math.PI * 25; 

const screenLobby = $('screen-lobby'), screenGame = $('screen-game');
const avDots = $('av-dots'), avCanvas = $('av-canvas'), avFrame = $('av-frame');

function buildAvDots() {
  avDots.innerHTML = AVATAR_DEFS.map((_, i) => `<button class="av-dot ${i === S.avatarIdx ? 'active' : ''}" onclick="setAvatar(${i})"></button>`).join('');
}

function setAvatar(i) {
  S.avatarIdx = ((i % AVATAR_DEFS.length) + AVATAR_DEFS.length) % AVATAR_DEFS.length;
  drawAvatar(avCanvas, AVATAR_DEFS[S.avatarIdx], 96);
  avDots.querySelectorAll('.av-dot').forEach((d, j) => d.classList.toggle('active', j === S.avatarIdx));
  avFrame.classList.add('glow'); setTimeout(() => avFrame.classList.remove('glow'), 700);
}

$('btn-av-prev').onclick = () => setAvatar(S.avatarIdx - 1);
$('btn-av-next').onclick = () => setAvatar(S.avatarIdx + 1);
window.onkeydown = e => {
  if (!screenLobby.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') setAvatar(S.avatarIdx - 1);
  if (e.key === 'ArrowRight') setAvatar(S.avatarIdx + 1);
};

$('btn-play').onclick = () => {
  const name = $('inp-name').value.trim();
  if (!name) { $('inp-name').classList.add('shake'); setTimeout(() => $('inp-name').classList.remove('shake'), 500); return; }
  S.playerName = name; S.totalRounds = +$('sel-rounds').value; S.drawTime = +$('sel-time').value; S.botCount = +$('sel-bots').value;
  screenLobby.style.opacity = '0'; setTimeout(() => { screenLobby.style.display = 'none'; screenGame.classList.add('active'); initGame(); }, 420);
};

function initGame() {
  buildPlayers(); buildColorPalette(); setupToolbar(); setupChat(); setupMuteBtn(); setupContextMenu(); setupVoteBanner(); initCanvas();
  $('overlay-waiting').classList.add('hidden');
  addChat('system', '', '🎨 Welcome to Picazo! Game is starting…');
  S.round = 1; S.drawerIdx = 0; S.isDrawer = true; updateRoundBadge(); buildLeaderboard(); startWordSelection();
}

function buildPlayers() {
  S.players = [{ id: S.myId, name: S.playerName, avatarDef: AVATAR_DEFS[S.avatarIdx], score: 0, isSelf: true, guessed: false }];
  for (let i = 1; i < S.botCount; i++) S.players.push({ id: 'bot_' + i, name: 'Bot ' + i, avatarDef: AVATAR_DEFS[i % AVATAR_DEFS.length], score: 0, isSelf: false, guessed: false });
}

function buildLeaderboard() {
  $('player-list').innerHTML = [...S.players].sort((a, b) => b.score - a.score).map((p, rank) => {
    const rClass = rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : '';
    const rSym = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : (rank + 1);
    const c = document.createElement('canvas'); c.width = 32; c.height = 32; drawAvatar(c, p.avatarDef, 32);
    return `<li class="player-item ${p.id === S.players[S.drawerIdx]?.id ? 'is-drawing' : ''} ${p.guessed ? 'guessed' : ''}" onclick="if(!${p.isSelf}) openContextMenu(event, S.players.find(x=>x.id==='${p.id}'))">
      <div class="pi-rank ${rClass}">${rSym}</div>
      <div class="pi-av"><img src="${c.toDataURL()}" style="width:100%;height:100%"></div>
      <div class="pi-info"><div class="pi-name">${p.isSelf ? '⭐ ' : ''}${escHtml(p.name)}</div><div class="pi-score">${p.score} pts</div></div>
      ${p.id === S.players[S.drawerIdx]?.id ? '<span class="pi-badge drawing">✏️</span>' : (p.guessed ? '<span class="pi-badge guessed">✅</span>' : '')}
    </li>`;
  }).join('');
}

function updateRoundBadge() { $('round-badge').textContent = `Round ${S.round}/${S.totalRounds}`; }

function startWordSelection() {
  S.players.forEach(p => p.guessed = false); S.guessedIds.clear(); buildLeaderboard();
  $('overlay-word-select').classList.remove('hidden');
  const choices = WORD_BANK.sort(() => Math.random() - 0.5).slice(0, 3);
  $('ws-cards').innerHTML = choices.map(w => `<div class="ws-card" onclick="if(S.isDrawer) chooseWord('${w.w}')"><span class="ws-emoji">${w.e}</span><div class="ws-word">${S.isDrawer ? w.w : '???'}</div></div>`).join('');
  let t = 15; $('ws-timer').textContent = t; 
  clearInterval(S.wsTimerInterval);
  S.wsTimerInterval = setInterval(() => {
    t--; $('ws-timer').textContent = t;
    if (t <= 0) { clearInterval(S.wsTimerInterval); chooseWord(choices[0].w); }
  }, 1000);
  if (!S.isDrawer) setTimeout(() => chooseWord(choices[0].w), 4000);
}

function chooseWord(word) {
  clearInterval(S.wsTimerInterval); $('overlay-word-select').classList.add('hidden');
  S.currentWord = word; S.revealedIdx = []; renderWordBlanks(); startRoundTimer();
  addChat('system', '', `${S.players[S.drawerIdx].name} is now drawing! 🖊️`);
  scheduleBotGuesses();
}

function renderWordBlanks() {
  if (!S.currentWord) return;
  $('word-display').innerHTML = S.currentWord.split('').map((ch, i) => ch === ' ' ? '<div style="width:12px"></div>' : `<div class="wb-group"><div class="wb-char ${S.revealedIdx.includes(i) && !S.isDrawer ? 'reveal' : ''}">${S.isDrawer || S.revealedIdx.includes(i) ? ch.toUpperCase() : ''}</div><div class="wb-line" style="width:${Math.max(18, Math.floor(96 / S.currentWord.length))}px"></div></div>`).join('');
  $('word-meta').textContent = S.isDrawer ? `You are drawing — ${S.currentWord.length} letters` : `${S.currentWord.length} letters`;
}

function startRoundTimer() {
  S.timeLeft = S.drawTime; clearInterval(S.timerInterval); updateTimerUI();
  S.timerInterval = setInterval(() => {
    S.timeLeft--; updateTimerUI();
    if (S.timeLeft <= 0) { clearInterval(S.timerInterval); endRound(false); }
  }, 1000);
}

function updateTimerUI() {
  $('timer-num').textContent = S.timeLeft; $('t-fg').style.strokeDashoffset = CIRC * (1 - (S.timeLeft / S.drawTime));
  $('timer-num').className = 'timer-num' + (S.timeLeft <= 30 ? ' warn' : '');
  $('t-fg').className = 't-fg' + (S.timeLeft <= 30 ? ' warn' : '');
}

function endRound(allGuessed = false) {
  clearInterval(S.timerInterval); clearInterval(S.wsTimerInterval);
  addChat('system', '', `⏰ Round over! The word was: "${S.currentWord}"`);
  if (S.guessedIds.size > 0) S.players[S.drawerIdx].score += Math.min(S.guessedIds.size * 30, 150);
  
  $('re-title').textContent = allGuessed ? 'Everyone guessed it!' : 'Round Over!';
  $('re-word-val').textContent = S.currentWord;
  $('re-scores').innerHTML = [...S.players].sort((a,b)=>b.score-a.score).map((p,i)=>`<div class="re-score-row"><span>${i===0?'🥇':''} ${escHtml(p.name)}</span><span>${p.score} pts</span></div>`).join('');
  $('overlay-round-end').classList.remove('hidden');

  let cd = 5; $('re-countdown').textContent = cd;
  const cdInt = setInterval(() => {
    cd--; $('re-countdown').textContent = cd;
    if (cd <= 0) { clearInterval(cdInt); $('overlay-round-end').classList.add('hidden'); nextRound(); }
  }, 1000);
}

function nextRound() {
  S.round++; if (S.round > S.totalRounds) { endGame(); return; }
  S.drawerIdx = (S.drawerIdx + 1) % S.players.length; S.isDrawer = S.players[S.drawerIdx].id === S.myId;
  updateRoundBadge(); ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); S.strokes = [];
  buildLeaderboard(); startWordSelection();
}

function endGame() {
  clearInterval(S.timerInterval); const winner = [...S.players].sort((a, b) => b.score - a.score)[0];
  $('overlay-round-end').classList.remove('hidden');
  $('re-title').textContent = 'Game Over!'; $('re-word-val').textContent = winner.name + ' wins!'; 
  if($('re-next')) $('re-next').style.display = 'none';
}

function scheduleBotGuesses() {
  S.players.filter(p => !p.isSelf && p.id !== S.players[S.drawerIdx]?.id).forEach((bot, idx) => {
    setTimeout(() => {
      if (!S.currentWord || bot.guessed) return;
      if (S.timeLeft / S.drawTime < 0.5 && Math.random() < 0.4) {
        bot.score += 50; bot.guessed = true; S.guessedIds.add(bot.id);
        addChat('correct', bot.name, `🎉 Guessed it!`); buildLeaderboard();
        if (S.players.filter(p => p.id !== S.players[S.drawerIdx]?.id).every(p => p.guessed)) { clearInterval(S.timerInterval); setTimeout(() => endRound(true), 1000); }
      } else addChat('normal', bot.name, 'is it a dog?');
    }, 8000 + idx * 3000 + Math.random() * 6000);
  });
}

function initCanvas() {
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  gameCanvas.onpointerdown = e => { if (S.isDrawer) { gameCanvas.setPointerCapture(e.pointerId); S.isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); applyBrushStyle(); }};
  gameCanvas.onpointermove = e => { if (S.isDrawer && S.isDrawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }};
  gameCanvas.onpointerup = e => { if (S.isDrawer) { gameCanvas.releasePointerCapture(e.pointerId); S.isDrawing = false; ctx.closePath(); S.strokes.push(ctx.getImageData(0,0,gameCanvas.width,gameCanvas.height)); }};
}

function resizeCanvas() {
  const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
  if (!W) return; S.dpr = window.devicePixelRatio || 1;
  const snap = gameCanvas.width ? ctx.getImageData(0, 0, gameCanvas.width, gameCanvas.height) : null;
  gameCanvas.width = W * S.dpr; gameCanvas.height = H * S.dpr; gameCanvas.style.width = W + 'px'; gameCanvas.style.height = H + 'px';
  ctx.scale(S.dpr, S.dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (snap) { const t = document.createElement('canvas'); t.width = snap.width; t.height = snap.height; t.getContext('2d').putImageData(snap, 0, 0); ctx.drawImage(t, 0, 0, W, H); }
}

function applyBrushStyle() {
  ctx.strokeStyle = S.tool === 'eraser' ? '#ffffff' : S.color;
  ctx.lineWidth = S.tool === 'eraser' ? S.brushSize * 3 : S.brushSize;
  ctx.globalCompositeOperation = S.tool === 'eraser' ? 'destination-out' : 'source-over';
}

function setupToolbar() {
  ['pencil','rect','fill','eraser'].forEach(t => $('tool-' + t).onclick = () => { S.tool = t; document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active')); $('tool-' + t).classList.add('active'); });
  $('tool-clear').onclick = () => { ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); S.strokes = []; };
  $('tool-undo').onclick = () => { if (S.strokes.length) { S.strokes.pop(); ctx.putImageData(S.strokes[S.strokes.length - 1] || new ImageData(1,1), 0, 0); }};
  
  $('btn-color-popup').onclick = e => { e.stopPropagation(); $('popup-color').classList.toggle('hidden'); $('popup-size').classList.add('hidden'); };
  $('btn-size-popup').onclick = e => { e.stopPropagation(); $('popup-size').classList.toggle('hidden'); $('popup-color').classList.add('hidden'); };
  document.onclick = e => { if (!$('popup-color').contains(e.target) && !$('btn-color-popup').contains(e.target)) $('popup-color').classList.add('hidden'); if (!$('popup-size').contains(e.target) && !$('btn-size-popup').contains(e.target)) $('popup-size').classList.add('hidden'); };
  $('size-slider').oninput = e => { S.brushSize = +e.target.value; $('size-val-txt').textContent = S.brushSize + 'px'; };
}

function buildColorPalette() {
  $('color-palette').innerHTML = COLORS.map(h => `<div class="c-swatch ${h===S.color?'active':''}" style="background:${h}" onclick="pickColor('${h}')"></div>`).join('');
  $('color-picker').oninput = e => pickColor(e.target.value);
}

function pickColor(hex) {
  S.color = hex; $('color-indicator').style.background = hex; $('color-picker').value = hex;
  document.querySelectorAll('.c-swatch').forEach(s => s.classList.toggle('active', s.style.background === hex));
}

function setupChat() {
  $('btn-chat-send').onclick = sendGuess;
  $('chat-input').onkeydown = e => { if (e.key === 'Enter') sendGuess(); };
}

function sendGuess() {
  const val = $('chat-input').value.trim(); if (!val) return; $('chat-input').value = '';
  if (S.isDrawer || S.guessedIds.has(S.myId)) { addChat('normal', S.playerName, val); return; }
  if (val.toLowerCase() === S.currentWord.toLowerCase()) {
    S.players[0].score += 100; S.players[0].guessed = true; S.guessedIds.add(S.myId);
    addChat('correct', S.playerName, `🎉 Guessed it!`); buildLeaderboard();
  } else addChat('normal', S.playerName, val);
}

function addChat(type, name, text) {
  $('chat-messages').innerHTML += `<div class="chat-msg ${type}">${name ? `<b>${escHtml(name)}:</b> ` : ''}<span>${escHtml(text)}</span></div>`;
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
}

function setupMuteBtn() {
  $('btn-mute').onclick = () => { S.isMuted = !S.isMuted; $('mute-icon').style.opacity = S.isMuted ? 0.5 : 1; };
}

function showToast(msg, type = 't-info') {
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg;
  $('toast-container').prepend(t); setTimeout(() => t.remove(), 4000);
}

function setupContextMenu() {
  document.onclick = e => { if (!$('context-menu').contains(e.target)) $('context-menu').classList.add('hidden'); };
  $('ctx-kick').onclick = () => $('vote-banner').classList.remove('hidden');
  $('ctx-close').onclick = () => $('context-menu').classList.add('hidden');
}

function openContextMenu(e, player) {
  e.stopPropagation(); S.ctxTarget = player; $('ctx-name').textContent = player.name;
  $('context-menu').classList.remove('hidden'); $('context-menu').style.left = e.clientX + 'px'; $('context-menu').style.top = e.clientY + 'px';
}

function setupVoteBanner() {
  $('btn-vote-yes').onclick = () => $('vote-banner').classList.add('hidden');
  $('btn-vote-no').onclick = () => $('vote-banner').classList.add('hidden');
}

function escHtml(str) { return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]); }

buildAvDots(); setAvatar(0);
