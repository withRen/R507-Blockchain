// « BIEN JOUÉ » : l'effet de réussite, avec l'explication de ce que le visiteur vient de trouver.
// Un tampon plein écran façon télé (flash, confettis carrés), puis une carte qui explique.
import { sfx } from './sfx.js';

let el = null;
let timer = 0;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function build() {
  el = document.createElement('div');
  el.id = 'bravo';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML = `
    <div class="bravo-flash"></div>
    <div class="bravo-confetti" aria-hidden="true"></div>
    <div class="bravo-card">
      <p class="bravo-kicker"><span class="ms" aria-hidden="true">star</span>Épreuve réussie<span class="ms" aria-hidden="true">star</span></p>
      <h2 class="bravo-title" data-text="BIEN JOUÉ">BIEN JOUÉ</h2>
      <p class="bravo-what"></p>
      <p class="bravo-why"></p>
      <button type="button" class="bravo-ok"><span class="ms" aria-hidden="true">check</span>Continuer</button>
    </div>`;
  document.querySelector('#stage-ui').append(el);
  el.querySelector('.bravo-ok').addEventListener('click', hide);
  const box = el.querySelector('.bravo-confetti');
  const colors = ['#ffe9b8', '#ffe9b8', '#ffffff', '#ff3b2f', '#4de4ff', '#6dff9b', '#ffb454'];
  for (let i = 0; i < 46; i++) {
    const s = document.createElement('i');
    s.style.setProperty('--x', `${Math.round(Math.random() * 100)}%`);
    s.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 160)}px`);
    s.style.setProperty('--d', `${(1.6 + Math.random() * 1.8).toFixed(2)}s`);
    s.style.setProperty('--w', `${(Math.random() * 0.5).toFixed(2)}s`);
    s.style.setProperty('--s', `${6 + Math.round(Math.random() * 8)}px`);
    s.style.setProperty('--c', colors[i % colors.length]);
    box.append(s);
  }
}

export function hide() {
  clearTimeout(timer);
  el?.classList.remove('on');
}

// what : ce qu'il a trouvé (une ligne) ; why : pourquoi c'est important pour la blockchain
export function bravo({ what, why, sound = true, ms = 9000 } = {}) {
  if (!el) build();
  el.querySelector('.bravo-what').textContent = what ?? '';
  el.querySelector('.bravo-why').textContent = why ?? '';
  // Redémarre les animations si l'effet est déjà passé une fois
  el.classList.remove('on');
  void el.offsetWidth;
  el.classList.add('on');
  if (sound) sfx('found', 400);
  clearTimeout(timer);
  if (!reduce) timer = setTimeout(hide, ms);
}
