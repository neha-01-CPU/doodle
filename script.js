/* ================================================================
   PICAZO — style.css
   Glassmorphism · Pure CSS Grid Mobile Split · Glass Toolbar
================================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue: #4a8fe8; --blue-light: #7db8f7; --blue-glow: rgba(74,143,232,0.30);
  --indigo: #5c6ef8; --indigo-glow: rgba(92,110,248,0.28);
  --green: #2ecc87; --red: #f0525e; --gold: #f4b942;
  --bg: #cfe0f7; --glass: rgba(255,255,255,0.52); --glass-s: rgba(255,255,255,0.76);
  --border: rgba(255,255,255,0.82); --shadow: 0 8px 32px rgba(60,110,200,0.18);
  --txt: #1a2540; --txt-mid: #4a5880; --txt-light: #8598bc;
  --radius: 20px; --radius-md: 14px; --radius-sm: 10px; --radius-pill: 100px;
  --transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --f-display: 'Righteous', cursive; --f-body: 'Nunito', sans-serif;
}

html, body { width: 100%; height: 100%; overflow: hidden; font-family: var(--f-body); background: linear-gradient(145deg, #b8d4f5 0%, #cce0fc 45%, #ddeeff 100%); color: var(--txt); -webkit-tap-highlight-color: transparent; }

.bg-blob { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; opacity: 0.5; }
.blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, #a0c8ff, transparent 70%); top: -150px; left: -150px; }
.blob-2 { width: 450px; height: 450px; background: radial-gradient(circle, #c0b0f8, transparent 70%); bottom: -100px; right: -100px; }

.glass { background: var(--glass); backdrop-filter: blur(20px); border: 1.5px solid var(--border); box-shadow: var(--shadow); }
.glass-strong { background: var(--glass-s); backdrop-filter: blur(28px); border: 1.5px solid var(--border); box-shadow: var(--shadow); }
.hidden { display: none !important; }

/* SCREENS */
.screen { position: fixed; inset: 0; z-index: 10; display: none; flex-direction: column; }
.screen.active { display: flex; align-items: center; justify-content: center; }

/* LOBBY */
.lobby-card { border-radius: 28px; padding: 36px 32px 28px; width: 100%; max-width: 460px; display: flex; flex-direction: column; align-items: center; gap: 22px; z-index: 1; }
.logo-text { font-family: var(--f-display); font-size: 3rem; color: var(--indigo); }
.avatar-picker { display: flex; align-items: center; gap: 18px; }
.av-arrow { width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--blue); color: #fff; cursor: pointer; }
.av-frame { width: 96px; height: 96px; border-radius: 18px; border: 2.5px solid var(--border); background: #e8f0fc; overflow: hidden;}
.av-dots { display: flex; gap: 7px; margin-top: 4px; } .av-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--blue-glow); border: none; cursor: pointer; } .av-dot.active { background: var(--blue); transform: scale(1.3); }
.text-input, .select-input { width: 100%; padding: 13px; border-radius: var(--radius-md); border: 1.5px solid var(--border); background: rgba(255,255,255,0.6); outline: none; }
.settings-row { width: 100%; display: flex; gap: 10px; } .setting-group { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.btn-play { width: 100%; padding: 16px; border-radius: var(--radius-md); border: none; background: linear-gradient(135deg, var(--blue), var(--indigo)); color: #fff; font-family: var(--f-display); font-size: 1.15rem; cursor: pointer; }

/* MAIN GAME LAYOUT BASE */
#screen-game.active { padding: 8px; gap: 6px; }
.game-header { border-radius: var(--radius); padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; z-index: 5; gap: 10px; }
.hdr-timer-zone { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.timer-ring-wrap { position: relative; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; }
.timer-svg { position: absolute; inset: 0; transform: rotate(-90deg); width: 100%; height: 100%; }
.t-bg { fill: none; stroke: rgba(74,143,232,0.14); stroke-width: 4.5; } .t-fg { fill: none; stroke: var(--blue); stroke-width: 4.5; transition: stroke-dashoffset 1s linear; }
.timer-num { font-family: var(--f-display); font-size: 1rem; color: var(--blue); z-index: 1; }
.round-badge { font-size: 0.65rem; font-weight: 800; color: var(--txt-light); }
.hdr-word-zone { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.word-display { display: flex; gap: 5px; }
.wb-char { font-family: var(--f-display); font-size: 1.25rem; min-width: 16px; text-align: center; }
.wb-line { height: 2.5px; background: var(--blue); min-width: 16px; }
.icon-btn { width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid var(--border); background: rgba(255,255,255,0.48); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.icon-btn svg { width: 16px; height: 16px; }

/* PANELS */
.panel { border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden; padding: 10px; gap: 6px; }
.panel-title { font-size: 0.7rem; font-weight: 800; color: var(--txt-light); text-transform: uppercase; display: flex; align-items: center; gap: 6px; padding-bottom: 6px; border-bottom: 1.5px solid rgba(74,143,232,0.1); flex-shrink: 0; }

.player-list { list-style: none; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
.player-item { display: flex; align-items: center; gap: 8px; padding: 6px; border-radius: 10px; background: rgba(255,255,255,0.4); }
.pi-rank { font-size: 0.65rem; font-weight: 800; color: var(--txt-light); min-width: 12px; }
.pi-av { width: 28px; height: 28px; border-radius: 8px; overflow: hidden; border: 1.5px solid var(--border); flex-shrink: 0; }
.pi-info { flex: 1; min-width: 0; } .pi-name { font-size: 0.75rem; font-weight: 800; color: var(--txt); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .pi-score { font-size: 0.65rem; color: var(--txt-light); }

.chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 3px; font-size: 0.75rem; }
.chat-input-row { display: flex; gap: 6px; flex-shrink: 0; }
.chat-input { flex: 1; padding: 8px 12px; border-radius: var(--radius-pill); border: 1.5px solid var(--border); background: rgba(255,255,255,0.6); outline: none; font-size: 0.8rem; min-width: 0; }
.chat-send-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.canvas-wrap { flex: 1; border-radius: var(--radius); overflow: hidden; position: relative; border: 1.5px solid var(--border); background: #fff; min-height: 0; }
#game-canvas { display: block; width: 100%; height: 100%; touch-action: none; }

/* GLASS TOOLBAR */
.toolbar-dark { background: var(--glass-s); backdrop-filter: blur(28px); border: 1.5px solid var(--border); border-radius: var(--radius-pill); padding: 6px 12px; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: var(--shadow); position: relative; flex-shrink: 0; z-index: 30; }
.tool-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: transparent; color: var(--txt-mid); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: var(--transition); }
.tool-btn svg { width: 16px; height: 16px; pointer-events: none; }
.tool-btn.active { color: #fff; background: var(--blue); box-shadow: 0 4px 10px var(--blue-glow); }
.color-indicator-ring { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border); padding: 2px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.color-indicator { width: 100%; height: 100%; border-radius: 50%; background: #000; }

.tool-popup { position: absolute; bottom: calc(100% + 14px); left: 50%; transform: translateX(-50%); background: var(--glass-s); backdrop-filter: blur(28px); border: 1.5px solid var(--border); border-radius: 16px; padding: 12px; box-shadow: var(--shadow-deep); z-index: 100; }
.tool-popup.hidden { opacity: 0; pointer-events: none; transform: translateX(-50%) scale(0.85); }
.color-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px; }
.c-swatch { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
.c-swatch.active { border-color: #fff; transform: scale(1.1); box-shadow: 0 0 0 2px var(--blue); }
#color-picker { width: 100%; height: 26px; border: 2px solid var(--border); border-radius: 4px; }
.size-slider { width: 120px; accent-color: var(--blue); }

/* OVERLAYS */
.overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; background: rgba(200,220,255,0.7); backdrop-filter: blur(10px); }
.overlay.hidden { opacity: 0; pointer-events: none; }

/* ================================================================
   MOBILE — PORTRAIT (< 768px) PURE CSS GRID SPLIT
================================================================ */
@media (max-width: 767px) {
  #screen-game.active { display: flex; flex-direction: column; height: 100dvh; }
  
  /* The Magic CSS Grid - No JS Required! */
  .game-body { 
    display: grid;
    grid-template-columns: 1fr 1fr; 
    grid-template-rows: minmax(0, 1.35fr) minmax(0, 1fr); /* 55% Top, 45% Bottom */
    gap: 6px; 
    flex: 1; 
    min-height: 0;
  }
  
  /* Canvas sits on Top Row, spans both columns */
  .canvas-col { 
    grid-column: 1 / 3; 
    grid-row: 1; 
    min-height: 0; 
    display: flex; 
    flex-direction: column; 
    gap: 6px;
  }
  
  /* Leaderboard Bottom Left */
  .leaderboard-panel { 
    grid-column: 1; 
    grid-row: 2; 
    margin: 0; 
  }
  
  /* Chat Bottom Right */
  .chat-panel { 
    grid-column: 2; 
    grid-row: 2; 
    margin: 0; 
  }

  /* Make sure toolbar centers and slides */
  .toolbar-dark { 
    width: max-content; 
    margin: 0 auto; 
    overflow-x: auto; 
    -webkit-overflow-scrolling: touch; 
    scrollbar-width: none; 
    max-width: 100%; 
  }
}

/* ================================================================
   DESKTOP — LANDSCAPE (≥ 768px)
================================================================ */
@media (min-width: 768px) {
  .game-body { display: flex; flex-direction: row; }
  .leaderboard-panel { width: 220px; flex-shrink: 0; }
  .canvas-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .chat-panel { width: 260px; flex-shrink: 0; }
}
