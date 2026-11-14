// Musique de fond : chaque sequence joue une piste de public/audio/ (voir LISEZMOI.md).
// Deux sequences qui partagent la meme piste la laissent continuer ; sinon, fondu enchaine.
// Le son est coupe au depart : l'ecran d'entree le lance, pendant le clic du visiteur.
// Musiques de Feldup (credits dans sources.html et docs/ASSETS.md).
const NAMES = [
  'investigation-discovery', // prologue
  'investigation-discovery', // 1. structure d'un bloc
  'investigation-discovery', // 2. chainage
  'investigation-discovery', // 3. falsification
  'investigation-discovery', // 4. reseau
  'unraveled', // 5. minage
  'unraveled', // 6. consensus
  'unraveled', // 7. transaction et attaque
  'unraveled' // epilogue
];
const TRACKS = [...new Set(NAMES)];
const FADE = 1.5; // duree du fondu, en secondes
const VOLUME = 0.4; // musique de fond : volume bas pour laisser la place aux dialogues

export function createMusic(button, onChange = () => {}) {
  const players = new Map();
  const missing = new Set();
  let on = false;
  let current = -1;

  const paint = () => {
    button.setAttribute('aria-pressed', String(on));
    button.textContent = !on ? 'Son ♪ coupé' : missing.has(track()) ? 'Son ♪ piste absente' : 'Son ♪ activé';
  };
  // Index de la piste jouee par la sequence en cours
  const track = () => (current >= 0 ? TRACKS.indexOf(NAMES[current]) : -1);
  const player = (i) => {
    if (!players.has(i)) {
      const a = new Audio(`${import.meta.env.BASE_URL}audio/${TRACKS[i]}.mp3`);
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
      // L'horodatage d'une image peut preceder performance.now() : jamais de pas negatif,
      // sinon le volume sort de [0, 1], le navigateur leve une erreur et le fondu s'arrete muet
      const d = Math.max(0, ((now - last) / 1000 / FADE) * VOLUME);
      last = now;
      const v = to > a.volume ? Math.min(to, a.volume + d) : Math.max(to, a.volume - d);
      a.volume = Math.min(1, Math.max(0, v));
      if (v !== to) a.raf = requestAnimationFrame(run);
      else if (to === 0) a.pause();
    };
    a.raf = requestAnimationFrame(run);
  };
  const apply = () => {
    if (on && track() >= 0) player(track());
    players.forEach((a, i) => {
      const target = on && i === track() ? VOLUME : 0;
      if (target > 0) a.play().catch(() => {});
      fade(a, target);
    });
    paint();
  };

  const set = (v) => { on = v; onChange(on); apply(); };
  button.addEventListener('click', () => set(!on));
  paint();
  onChange(on);
  return {
    // Appele pendant le clic de l'ecran d'entree : le navigateur laisse alors jouer la musique
    enable(v) { set(v); },
    setSequence(i) {
      if (i === current) return;
      current = i;
      apply();
    }
  };
}
