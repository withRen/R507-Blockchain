// Bruitages des interactions, synthetises en direct avec Web Audio : aucun fichier.
// Le contexte audio n'est cree qu'au premier geste du visiteur (regle des navigateurs).
const MASTER = 0.2;

let ac = null;
let out = null;
const last = new Map();

function context() {
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
    out = ac.createGain();
    out.gain.value = MASTER;
    out.connect(ac.destination);
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

// Une note : oscillateur + enveloppe courte
function tone({ f = 880, to = null, type = 'sine', at = 0, dur = 0.08, vol = 0.5, attack = 0.004 }) {
  const t = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const SOUNDS = {
  // Clic d'interface : un tic sec et discret
  click: () => tone({ f: 1500, to: 900, dur: 0.045, vol: 0.35 }),
  // Frappe au clavier ou curseur qu'on fait glisser
  type: () => tone({ f: 2200, dur: 0.025, vol: 0.12, type: 'triangle' }),
  // Bonne reponse, lien retabli, bloc valide
  success: () => {
    tone({ f: 660, dur: 0.14, vol: 0.4 });
    tone({ f: 990, at: 0.09, dur: 0.22, vol: 0.4 });
  },
  // Mauvaise reponse, lien rompu, falsification
  error: () => {
    tone({ f: 220, to: 140, type: 'sawtooth', dur: 0.22, vol: 0.18 });
    tone({ f: 233, to: 150, type: 'square', dur: 0.22, vol: 0.06 });
  },
  // Alerte plus marquee : majorite corrompue
  alarm: () => {
    tone({ f: 520, type: 'square', dur: 0.12, vol: 0.12 });
    tone({ f: 390, type: 'square', at: 0.15, dur: 0.18, vol: 0.12 });
  },
  // Un nœud recoit la transaction
  ping: () => tone({ f: 1760, to: 2100, dur: 0.06, vol: 0.14 }),
  // Tour coupee / rallumee
  off: () => tone({ f: 600, to: 90, dur: 0.3, vol: 0.3, type: 'triangle' }),
  on: () => tone({ f: 120, to: 700, dur: 0.25, vol: 0.25, type: 'triangle' }),
  // Calcul en cours (minage)
  tick: () => tone({ f: 3000, dur: 0.015, vol: 0.06, type: 'square' }),
  // Bloc trouve par le mineur
  found: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone({ f, at: i * 0.07, dur: 0.25, vol: 0.32 }));
  },
  // Simulation lancee (consensus)
  whoosh: () => tone({ f: 200, to: 1200, dur: 0.28, vol: 0.18, type: 'triangle', attack: 0.05 })
};

// Joue un son ; `gap` evite qu'un meme son se repete trop vite (frappe, curseur, pings)
export function sfx(name, gap = 0) {
  const play = SOUNDS[name];
  if (!play || !context()) return;
  const now = performance.now();
  if (gap && now - (last.get(name) ?? -1e9) < gap) return;
  last.set(name, now);
  try { play(); } catch { /* audio indisponible : on reste silencieux */ }
}

// Sons communs a toute la page : clic sur un bouton, frappe dans un champ, curseur
export function installSfx(root = document) {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && !b.disabled && !b.dataset.sfx) sfx('click');
  }, true);
  root.addEventListener('input', (e) => {
    if (e.target.matches('input[type="text"], input[type="range"]')) sfx('type', 45);
  });
}
