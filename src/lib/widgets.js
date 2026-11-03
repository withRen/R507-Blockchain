import { hashBlock, createMiner, attackerSuccessProbability } from './blockchain.js';

// Etat partage entre les petites experiences HTML et la scene 3D
export const fx = {
  pulse: 0, // chapitre 1 : le bloc tremble quand on le modifie
  mining: false, // chapitre 5 : les essais s'accelerent
  mined: 0, // chapitre 5 : le bloc passe au vert
  winners: null // chapitre 6 : qui vient de gagner
};

const $ = (s) => document.querySelector(s);
const fr = (n) => n.toLocaleString('fr-FR');

// --- Chapitre 1 : changer une lettre change toute l'empreinte ---
function hashWidget() {
  const input = $('#w-hash-input');
  const out = $('#w-hash-out');
  const note = $('#w-hash-note');
  const block = { index: 1, parent: '0007a3f1c9e2', data: '', nonce: 0 };
  let previous = null;
  const refresh = () => {
    block.data = input.value;
    const h = hashBlock(block);
    out.innerHTML = [...h].map((ch, i) => (previous && previous[i] !== ch ? `<mark>${ch}</mark>` : ch)).join('');
    if (previous && previous !== h) {
      let n = 0;
      for (let i = 0; i < 64; i++) if (h[i] !== previous[i]) n++;
      note.textContent = `${n} caractères sur 64 ont changé.`;
      fx.pulse = 1;
    }
    previous = h;
  };
  input.addEventListener('input', refresh);
  refresh();
}

// --- Chapitre 5 : miner pour de vrai (dans le navigateur) ---
function miningWidget() {
  const button = $('#w-mine');
  const count = $('#w-mine-count');
  const time = $('#w-mine-time');
  const note = $('#w-mine-note');
  const diff = $('#w-mine-diff');
  const diffOut = $('#w-mine-diff-out');
  const showDiff = () => { diffOut.textContent = `1 chance sur ${fr(16 ** Number(diff.value))}`; };
  diff.addEventListener('input', showDiff);
  showDiff();

  button.addEventListener('click', () => {
    if (fx.mining) return;
    const data = { index: 42, parent: '00000a91f3', data: `Alice → Bob : 5 · ${Date.now()}`, nonce: 0 };
    const miner = createMiner(data, Number(diff.value));
    const start = performance.now();
    fx.mining = true;
    fx.mined = 0;
    button.disabled = true;
    diff.disabled = true;
    note.textContent = 'Le mineur essaie des numéros au hasard…';
    const tick = () => {
      const done = miner.step(1500);
      count.textContent = fr(miner.attempts);
      time.textContent = `${((performance.now() - start) / 1000).toFixed(1).replace('.', ',')} s`;
      if (!done) return requestAnimationFrame(tick);
      fx.mining = false;
      fx.mined = 1;
      button.disabled = false;
      diff.disabled = false;
      button.textContent = 'Recommencer';
      const wasted = ((miner.attempts - 1) / miner.attempts) * 100;
      note.textContent = `Trouvé ! Les ${fr(miner.attempts - 1)} autres essais (${wasted.toFixed(1).replace('.', ',')} %) ont consommé de l’énergie pour rien.`;
    };
    requestAnimationFrame(tick);
  });
}

// --- Chapitre 6 : produire 100 blocs avec chaque methode ---
function consensusWidget() {
  const button = $('#w-consensus');
  const result = $('#w-consensus-result');
  const shares = [40, 25, 15, 12, 8];
  const pick = (w) => {
    const total = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
    return w.length - 1;
  };
  button.addEventListener('click', () => {
    const wins = { pow: [0, 0, 0, 0, 0], pos: [0, 0, 0, 0, 0], poa: [0, 0, 0, 0, 0] };
    const stake = [...shares];
    let last = [0, 0, 0];
    for (let k = 0; k < 100; k++) {
      const a = pick(shares);
      const b = pick(stake);
      stake[b] += 2; // la recompense est reinvestie : les gros grossissent
      const c = k % 3;
      wins.pow[a]++; wins.pos[b]++; wins.poa[c]++;
      last = [a, b, c];
    }
    fx.winners = { list: last, t: 0 };
    const bar = (arr, color) => arr
      .map((n, i) => `<span class="mini-bar" style="--w:${n}%;--c:${color}" title="${'ABCDE'[i]} : ${n} blocs"><i></i><b>${'ABCDE'[i]}</b></span>`)
      .join('');
    result.innerHTML = `
      <div><span class="mini-title">Travail</span>${bar(wins.pow, 'var(--mining)')}</div>
      <div><span class="mini-title">Enjeu</span>${bar(wins.pos, 'var(--stake)')}</div>
      <div><span class="mini-title">Autorité</span>${bar(wins.poa, 'var(--authority)')}</div>
      <p class="feedback">Sur 100 blocs, A en a créé ${wins.pow[0]} avec le travail et ${wins.pos[0]} avec l’enjeu (en réinvestissant ses gains). Avec l’autorité, seuls A, B et C écrivent.</p>`;
  });
}

// --- Chapitre 7 : les chances de reussite de Mallory ---
function oddsWidget() {
  const q = $('#w-odds-q');
  const z = $('#w-odds-z');
  const qOut = $('#w-odds-q-out');
  const zOut = $('#w-odds-z-out');
  const out = $('#w-odds-out');
  const refresh = () => {
    const qq = Number(q.value) / 100;
    const zz = Number(z.value);
    qOut.textContent = `${q.value} %`;
    zOut.textContent = `${zz} bloc${zz > 1 ? 's' : ''}`;
    // Formule du livre blanc de Bitcoin (section 11)
    const p = attackerSuccessProbability(qq, zz);
    out.textContent = p >= 0.995 ? '100 %' : p < 0.001 ? '< 0,1 %' : `${(p * 100).toFixed(p < 0.1 ? 1 : 0).replace('.', ',')} %`;
  };
  q.addEventListener('input', refresh);
  z.addEventListener('input', refresh);
  refresh();
}

export function initWidgets() {
  hashWidget();
  miningWidget();
  consensusWidget();
  oddsWidget();
}

export function tickFx(dt) {
  fx.pulse = Math.max(0, fx.pulse - dt * 1.5);
  if (fx.winners) fx.winners.t += dt * 1.2;
  if (!fx.mining && fx.mined > 0) fx.mined = Math.max(0, fx.mined - dt * 0.15);
}
