// Lecture automatique : une seule horloge de progression.
// Pendant la lecture, c'est elle qui donne la position du film. La page ne fait que suivre,
// pour la barre de defilement et la navigation, sans jamais revenir influencer le film.
const CRUISE = 0.04; // part de sequence parcourue par seconde entre deux repliques
const ACCEL = 2.4; // reactivite de la vitesse : elle change toujours en douceur
const BRAKE = 0.02; // deceleration avant une interaction, en sequence par seconde au carre
const CREEP = 0.002; // vitesse minimale d'approche, pour finir par arriver
const SEEK = 7; // Espace : l'essentiel du trajet se fait en 0,4 s environ
const GESTURE_GAP = 300; // ms sans molette ni toucher : le geste du visiteur est termine
const TRANSITION = 1.5; // temps d'apparition et de lecture, en plus de la pause de 2 a 5 s

export const holdFor = (chars) => Math.min(5, Math.max(2, 1.5 + chars / 45));

// Le film en zones : une replique se traverse lentement, le temps de la lire, et la camera
// continue d'avancer pendant ce temps. Entre deux zones, on avance a vitesse de croisiere.
export function buildScore(sequences) {
  const count = sequences.length;
  const zones = [];
  const stops = [];
  sequences.forEach((seq, idx) => {
    const at = (t) => (idx + t) / count;
    (seq.LINES ?? []).forEach((l) => {
      const mid = (l.from + l.to) / 2;
      const term = seq.TERMS?.find((c) => mid >= c.from && mid <= c.to);
      const chars = Math.max(l.text.length, term ? term.def.length * 0.6 : 0);
      const duration = holdFor(chars) + TRANSITION;
      zones.push({ from: at(l.from), to: at(l.to), speed: (l.to - l.from) / duration, duration });
    });
    (seq.BEATS ?? []).forEach((b) => {
      zones.push({ from: at(b.from), to: at(b.to), speed: (b.to - b.from) / b.hold, duration: b.hold });
    });
    if (seq.LAB) stops.push(at(seq.labStop ?? Math.min(seq.LAB.from + 0.06, seq.LAB.to - 0.01)));
  });
  zones.sort((a, b) => a.from - b.from);
  stops.sort((a, b) => a - b);
  // Espace vise le debut de la prochaine replique, ou la prochaine interaction
  const marks = [
    ...zones.map((z) => ({ pos: z.from + 0.002 / count, zone: z })),
    ...stops.map((pos) => ({ pos, stop: true }))
  ].sort((a, b) => a.pos - b.pos);
  return { zones, stops, marks };
}

export function createDirector({ score, scrollMax, reduceMotion, count }) {
  const { zones, stops, marks } = score;
  const hint = document.querySelector('#hint');
  const btnAuto = document.querySelector('#auto');
  const btnNext = document.querySelector('#continue');
  const max = () => Math.max(1, scrollMax());
  const px = (n) => n / max();

  let started = false;
  let on = false;
  let phase = 'idle'; // idle, cruise, seek, wait, done
  let p = window.scrollY / max();
  let v = 0; // vitesse courante, en sequence par seconde
  let seekTo = null;
  let rem = 0; // mouvement reduit : temps restant sur la replique
  let lastY = window.scrollY;
  let lastGesture = 0;
  let inGesture = false; // le geste qui a lance la lecture ne doit pas la remettre en pause

  const follow = () => {
    const y = Math.round(p * max());
    if (y === Math.round(lastY)) return;
    window.scrollTo(0, y);
    lastY = window.scrollY;
  };
  const nextMark = (from) => marks.find((m) => m.pos > from + px(2));
  const zoneAt = (pos) => zones.find((z) => pos >= z.from && pos <= z.to);
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
    seekTo = null;
    v = 0;
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
  const land = (mark) => {
    p = mark.pos;
    seekTo = null;
    if (!on) { phase = 'idle'; v = 0; return; }
    if (mark.stop) { phase = 'wait'; v = 0; return; }
    phase = 'cruise';
    v = mark.zone.speed;
    rem = mark.zone.duration;
  };
  const skip = () => {
    if (!started) start();
    const from = seekTo ? seekTo.pos : p;
    const mark = nextMark(from);
    if (!mark) return;
    if (reduceMotion) { land(mark); follow(); return; }
    seekTo = mark;
    phase = 'seek';
  };

  // Molette, toucher, touches de defilement : le visiteur reprend la main
  const onGesture = () => {
    const now = performance.now();
    if (!started) { start(); inGesture = true; }
    else if (on && !(inGesture && now - lastGesture < GESTURE_GAP)) pause();
    else if (phase === 'seek') { seekTo = null; phase = 'idle'; }
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

  function cruise(dt) {
    const stop = stops.find((s) => s > p + px(1));
    const zone = zoneAt(p);
    if (reduceMotion) {
      // Pas de mouvement : on reste sur place le temps de lire, puis on saute
      rem -= dt;
      if (rem <= 0) {
        const mark = nextMark(p);
        if (mark) land(mark); else phase = 'done';
      }
      return;
    }
    const target = zone ? zone.speed : CRUISE;
    v += (target - v) * (1 - Math.exp(-dt * ACCEL));
    // On ralentit avant d'entrer dans une replique, pour lui laisser tout son temps de lecture
    const ahead = zones.find((z) => z.from > p);
    if (ahead) {
      const dist = (ahead.from - p) * count;
      v = Math.min(v, Math.sqrt(ahead.speed * ahead.speed + 2 * BRAKE * dist));
    }
    if (stop !== undefined) {
      // Freinage regulier jusqu'a l'interaction
      const dist = (stop - p) * count;
      v = Math.min(v, Math.max(CREEP, Math.sqrt(2 * BRAKE * dist)));
    }
    p += (v * dt) / count;
    if (stop !== undefined && p >= stop) {
      p = stop;
      v = 0;
      phase = 'wait';
    } else if (stop === undefined && p >= 1) {
      p = 1;
      v = 0;
      phase = 'done';
    }
  }

  return {
    pause,
    // Renvoie la position du film quand la lecture la pilote, sinon null
    tick(dt, labOpen, shown) {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 6) {
        // Defilement venu d'ailleurs : ascenseur, navigation, bouton de l'epilogue
        lastY = y;
        p = y / max();
        seekTo = null;
        v = 0;
        if (started && on && !inGesture) pause();
        else phase = 'idle';
      }
      if (inGesture && performance.now() - lastGesture > GESTURE_GAP) inGesture = false;

      if (phase === 'idle' && on && !inGesture) {
        // La lecture reprend exactement la ou se trouve l'image, sans saut
        p = shown;
        v = 0;
        if (reduceMotion) {
          const zone = zoneAt(p);
          rem = zone ? zone.duration : 0;
        }
        phase = labOpen ? 'wait' : 'cruise';
      }
      if (phase === 'seek') {
        p += (seekTo.pos - p) * (1 - Math.exp(-dt * SEEK));
        if (Math.abs(seekTo.pos - p) < px(2)) land(seekTo);
      } else if (phase === 'cruise') {
        cruise(dt);
      }
      const driving = phase !== 'idle';
      if (driving) follow();

      const hasNext = !!nextMark(y / max());
      const showNext = started && hasNext && (on ? phase === 'wait' : labOpen);
      btnNext.classList.toggle('on', showNext);
      hint.classList.toggle('off', showNext);
      return driving ? p : null;
    }
  };
}
