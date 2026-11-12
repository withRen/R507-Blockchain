// Musique de fond : une piste par sequence, enchainees en fondu.
// Les fichiers ne sont pas dans le depot : ils se deposent dans public/audio/ (voir LISEZMOI.md).
// Le son est coupe au depart : un navigateur ne joue rien avant un clic du visiteur.
const NAMES = ['prologue', 'sequence-1', 'sequence-2', 'sequence-3', 'sequence-4', 'sequence-5', 'sequence-6', 'sequence-7', 'epilogue'];
const FADE = 1.5; // duree du fondu, en secondes
const VOLUME = 0.5;

export function createMusic(button) {
  const players = new Map();
  const missing = new Set();
  let on = false;
  let current = -1;

  const paint = () => {
    button.setAttribute('aria-pressed', String(on));
    button.textContent = !on ? 'Son ♪ coupé' : missing.has(current) ? 'Son ♪ piste absente' : 'Son ♪ activé';
  };
  const player = (i) => {
    if (!players.has(i)) {
      const a = new Audio(`${import.meta.env.BASE_URL}audio/${NAMES[i]}.mp3`);
      a.loop = true;
      a.volume = 0;
      // Piste non deposee : la sequence reste simplement silencieuse
      a.addEventListener('error', () => { missing.add(i); paint(); });
      players.set(i, a);
    }
    return players.get(i);
  };
  const fade = (a, to) => {
    cancelAnimationFrame(a.raf);
    let last = performance.now();
    const run = (now) => {
      const d = ((now - last) / 1000 / FADE) * VOLUME;
      last = now;
      const v = to > a.volume ? Math.min(to, a.volume + d) : Math.max(to, a.volume - d);
      a.volume = v;
      if (v !== to) a.raf = requestAnimationFrame(run);
      else if (to === 0) a.pause();
    };
    a.raf = requestAnimationFrame(run);
  };
  const apply = () => {
    if (on && current >= 0) player(current);
    players.forEach((a, i) => {
      const target = on && i === current ? VOLUME : 0;
      if (target > 0) a.play().catch(() => {});
      fade(a, target);
    });
    paint();
  };

  button.addEventListener('click', () => { on = !on; apply(); });
  paint();
  return {
    setSequence(i) {
      if (i === current) return;
      current = i;
      apply();
    }
  };
}
