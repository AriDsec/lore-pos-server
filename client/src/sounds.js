// ─────────────────────────────────────────────
// SISTEMA DE SONIDOS — Web Audio API
// Sin archivos externos, funciona offline
// ─────────────────────────────────────────────

let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Tono simple: frecuencia, duración, tipo de onda, volumen
function playTone(freq, duration, type = 'sine', volume = 0.4, delay = 0) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 🔔 Pedido nuevo en cocina — 3 tonos ascendentes urgentes
export function sonidoPedidoNuevo() {
  playTone(440, 0.15, 'square', 0.3, 0.0);
  playTone(550, 0.15, 'square', 0.3, 0.18);
  playTone(660, 0.25, 'square', 0.35, 0.36);
}

// ✅ Pedido listo — 2 tonos suaves descendentes (para meseras)
export function sonidoPedidoListo() {
  playTone(880, 0.2, 'sine', 0.35, 0.0);
  playTone(660, 0.3, 'sine', 0.3, 0.25);
}

// 💰 Cuenta cobrada — ding agradable
export function sonidoCobro() {
  playTone(523, 0.1, 'sine', 0.3, 0.0);
  playTone(659, 0.1, 'sine', 0.3, 0.12);
  playTone(784, 0.3, 'sine', 0.35, 0.24);
}

// ⚠️ Error / advertencia — tono bajo
export function sonidoError() {
  playTone(200, 0.15, 'sawtooth', 0.25, 0.0);
  playTone(150, 0.25, 'sawtooth', 0.2, 0.18);
}
