// ─────────────────────────────────────────────
// SISTEMA DE SONIDOS + VIBRACIÓN — Web Audio API
// Sin archivos externos, funciona offline
// Vibración: Android sí, iOS limitado pero algo vibra
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

// Vibración — patrón en ms [vibrar, pausa, vibrar, ...]
function vibrar(patron) {
  try {
    if (navigator.vibrate) navigator.vibrate(patron);
  } catch (e) {
    // Silencioso si no está disponible
  }
}

// 🔔 Pedido nuevo en cocina — 3 tonos urgentes + vibración fuerte
export function sonidoPedidoNuevo() {
  playTone(440, 0.15, 'square', 0.3, 0.0);
  playTone(550, 0.15, 'square', 0.3, 0.18);
  playTone(660, 0.25, 'square', 0.35, 0.36);
  // Patrón urgente: 3 pulsos cortos
  vibrar([100, 80, 100, 80, 200]);
}

// ✅ Pedido listo — 2 tonos suaves + vibración doble (para meseras)
export function sonidoPedidoListo() {
  playTone(880, 0.2, 'sine', 0.35, 0.0);
  playTone(660, 0.3, 'sine', 0.3, 0.25);
  // Patrón: 2 pulsos largos — fácil de distinguir del nuevo pedido
  vibrar([300, 150, 300]);
}

// 💰 Cuenta cobrada — ding agradable + vibración suave
export function sonidoCobro() {
  playTone(523, 0.1, 'sine', 0.3, 0.0);
  playTone(659, 0.1, 'sine', 0.3, 0.12);
  playTone(784, 0.3, 'sine', 0.35, 0.24);
  // Un pulso corto y suave
  vibrar([150]);
}

// ⚠️ Error / advertencia
export function sonidoError() {
  playTone(200, 0.15, 'sawtooth', 0.25, 0.0);
  playTone(150, 0.25, 'sawtooth', 0.2, 0.18);
  vibrar([50, 50, 50]);
}
