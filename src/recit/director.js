// Lecture automatique. Elle ne fait que deplacer le defilement : la position de la page
// reste la seule source de verite pour le film, la barre de progression et la navigation.
const RATE = 0.04; // part de sequence parcourue par seconde entre deux repliques
const GESTURE_GAP = 300; // ms sans molette ni toucher : le geste du visiteur est termine

export const holdFor = (chars) => Math.min(5, Math.max(2, 1.5 + chars / 45));

// Les arrets de la lecture : chaque replique, puis chaque interaction, sur tout le film
export function buildBeats(sequences) {
  const count = sequences.length;
  const beats = [];
  sequences.forEach((seq, idx) => {
    (seq.LINES ?? []).forEach((l) => {
      const t = l.from + (l.to - l.from) * 0.55;
      const term = seq.TERMS?.find((c) => t >= c.from && t <= c.to);
      const chars = Math.max(l.text.length, term ? term.def.length * 0.6 : 0);
      beats.push({ pos: (idx + t) / count, hold: holdFor(chars) });
    });
    (seq.BEATS ?? []).forEach((b) => beats.push({ pos: (idx + b.t) / count, hold: b.hold }));
    if (seq.LAB) {
      const t = seq.labStop ?? Math.min(seq.LAB.from + 0.06, seq.LAB.to - 0.01);
      beats.push({ pos: (idx + t) / count, wait: true });
    }
  });
  return beats.sort((a, b) => a.pos - b.pos);
}

export function createDirector({ beats, scrollMax, reduceMotion, count }) {
  const hint = document.querySelector('#hint');
  const btnAuto = document.querySelector('#auto');
  const btnNext = document.querySelector('#continue');
  const max = () => Math.max(1, scrollMax());

  let started = false;
  let on = false;
  let phase = 'idle'; // idle, travel, hold, wait, done
  let idx = 0;
  let rem = 0;
  let p = window.scrollY / max();
  let lastY = window.scrollY;
  let lastGesture = 0;
  let inGesture = false; // le geste qui a lance la lecture ne doit pas la remettre en pause

  const scrollToP = () => {
    window.scrollTo(0, p * max());
    lastY = window.scrollY;
  };
  // La page arrondit le defilement au pixel : on compare avec une marge de 2 pixels,
  // sinon Espace retomberait sur la replique en cours.
  const nextIndex = (from, strict) => {
    const eps = 2 / max();
    return beats.findIndex((b) => (strict ? b.pos > from + eps : b.pos >= from - eps));
  };
  const arrive = (i) => {
    idx = i;
    p = beats[i].pos;
    phase = beats[i].wait ? 'wait' : 'hold';
    rem = beats[i].hold ?? 0;
    scrollToP();
  };
  const paintUI = () => {
    btnAuto.classList.toggle('on', started);
    btnAuto.setAttribute('aria-pressed', String(on));
    btnAuto.textContent = on ? 'Lecture auto ❚❚' : 'Lecture auto ▶';
    hint.textContent = started ? 'Espace : passer · A : lecture auto' : 'Fais défiler ou appuie sur Espace pour commencer';
    hint.classList.toggle('started', started);
  };
  const start = () => {
    started = true;
    on = true;
    phase = 'idle';
    paintUI();
  };
  const pause = () => {
    on = false;
    phase = 'idle';
    inGesture = false;
    paintUI();
  };
  const toggle = () => {
    if (!started) { start(); return; }
    if (on) { pause(); return; }
    on = true;
    phase = 'idle';
    paintUI();
  };
  const skip = () => {
    if (!started) start();
    p = window.scrollY / max();
    const i = nextIndex(p, true);
    if (i < 0) return;
    if (on) { arrive(i); return; }
    p = beats[i].pos;
    scrollToP();
  };

  // Molette, toucher, touches de defilement : le visiteur reprend la main
  const onGesture = () => {
    const now = performance.now();
    if (!started) { start(); inGesture = true; }
    else if (on && !(inGesture && now - lastGesture < GESTURE_GAP)) pause();
    lastGesture = now;
  };
  window.addEventListener('wheel', onGesture, { passive: true });
  window.addEventListener('touchmove', onGesture, { passive: true });
  window.addEventListener('keydown', (e) => {
    const inField = e.target instanceof Element && e.target.matches('input, textarea, select, button, a, [contenteditable]');
    if (e.code === 'Space' && !inField) {
      e.preventDefault();
      if (!e.repeat) skip();
      return;
    }
    if (e.code === 'KeyA' && !inField && !e.metaKey && !e.ctrlKey && !e.altKey) { toggle(); return; }
    if (!inField && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.code)) onGesture();
  });
  btnAuto.addEventListener('click', toggle);
  btnNext.addEventListener('click', skip);
  // Un clic a la souris ne doit pas garder le focus : Espace rappuierait sur le bouton
  document.addEventListener('click', (e) => {
    const el = document.activeElement;
    if (e.detail > 0 && el instanceof HTMLElement && el.matches('button, a, input[type="range"]')) el.blur();
  });
  paintUI();

  return {
    pause,
    tick(dt, labOpen) {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 6) {
        // Defilement venu d'ailleurs : ascenseur, navigation, bouton de l'epilogue
        lastY = y;
        p = y / max();
        if (started && on && !inGesture) pause();
        else phase = 'idle';
      }
      if (inGesture && performance.now() - lastGesture > GESTURE_GAP) inGesture = false;

      if (on && !inGesture) {
        if (phase === 'idle') {
          p = y / max();
          const i = nextIndex(p, false);
          if (labOpen) { phase = 'wait'; idx = i; }
          else if (i < 0) phase = 'done';
          else { idx = i; phase = 'travel'; }
        }
        if (phase === 'travel') {
          const b = beats[idx];
          p = reduceMotion ? b.pos : Math.min(b.pos, p + (RATE * dt) / count);
          if (p >= b.pos - 1e-9) arrive(idx);
          else scrollToP();
        } else if (phase === 'hold') {
          rem -= dt;
          if (rem <= 0) {
            const i = idx + 1;
            if (i >= beats.length) phase = 'done';
            else { idx = i; phase = 'travel'; }
          }
        }
      }

      const hasNext = nextIndex(y / max(), true) >= 0;
      const showNext = started && hasNext && (labOpen || (on && phase === 'wait'));
      btnNext.classList.toggle('on', showNext);
      hint.classList.toggle('off', showNext);
    }
  };
}
