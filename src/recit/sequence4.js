// Sequence 4 : 04 h 50, au-dessus de la ville. Reseau et decentralisation.
// Les impulsions suivent reellement le graphe : plus un noeud est loin, plus elle arrive tard.
import * as THREE from 'three';
import { curve } from './timeline.js';

export function createSequence4(ctx) {
  const graph = ctx.city.graph();
  const N = graph.count;
  const cut = new Set();
  let source = 0;
  let waveStart = -100;
  let depth = [];
  const STEP = 0.75;

  function bfs() {
    depth = new Array(N).fill(-1);
    if (cut.has(source)) return;
    depth[source] = 0;
    const q = [source];
    while (q.length) {
      const a = q.shift();
      graph.edges.forEach(([u, v]) => {
        const b = u === a ? v : v === a ? u : -1;
        if (b >= 0 && !cut.has(b) && depth[b] < 0) { depth[b] = depth[a] + 1; q.push(b); }
      });
    }
  }

  const panel = ctx.panel(`
    <h2>À vous : testez le réseau</h2>
    <p class="lab-hint">Cliquez sur une tour pour la couper, puis émettez une transaction.</p>
    <button id="n-send" type="button">Émettre une transaction depuis une tour au hasard</button>
    <p class="lab-out-label">Nœuds qui l’ont reçue</p>
    <output id="n-count" class="big-num">0 / 14</output>
    <p id="n-state" class="lab-state" aria-live="polite">Aucun nœud n’est au centre : chacun garde sa copie et ne parle qu’à quelques voisins.</p>
    <button id="n-meridian" type="button" class="ghost">Couper la tour Meridian</button>
    <button id="n-reset" type="button" class="ghost">Tout rallumer</button>`);
  const $ = (s) => panel.querySelector(s);
  let now = 0;
  const send = () => {
    const alive = [];
    for (let i = 0; i < N; i++) if (!cut.has(i)) alive.push(i);
    source = alive[Math.floor(Math.random() * alive.length)] ?? 0;
    bfs();
    waveStart = now;
  };
  $('#n-send').addEventListener('click', send);
  const syncMeridian = () => { $('#n-meridian').textContent = cut.has(0) ? 'Rallumer la tour Meridian' : 'Couper la tour Meridian'; };
  const toggle = (i) => {
    if (cut.has(i)) cut.delete(i); else cut.add(i);
    syncMeridian();
    bfs();
    $('#n-state').textContent = cut.size
      ? `${cut.size} nœud${cut.size > 1 ? 's' : ''} coupé${cut.size > 1 ? 's' : ''}. Les autres continuent : ils ont chacun leur copie, et un nœud revenu récupère les blocs manqués.`
      : 'Tous les nœuds sont allumés.';
  };
  $('#n-meridian').addEventListener('click', () => toggle(0));
  $('#n-reset').addEventListener('click', () => { cut.clear(); syncMeridian(); bfs(); $('#n-state').textContent = 'Tous les nœuds sont allumés.'; });

  const seq = {
    name: 'Réseau et décentralisation',
    lights: [],
    groups: [ctx.cityGroup],
    cityLit: true,
    panelEl: panel,
    LAB: { from: 0.64, to: 0.92 },
    outside: true,
    actorsDef: {},
    CAMERA: [
      { t: 0, pos: [70, 205, 120], look: [10, 150, -20], fov: 42 },
      { t: 0.15, pos: [160, 300, 340], look: [0, 100, -30], fov: 42 },
      { t: 0.4, pos: [0, 430, 470], look: [0, 90, -20], fov: 42 },
      { t: 0.62, pos: [-120, 470, 470], look: [0, 80, 0], fov: 42 },
      { t: 0.92, pos: [-120, 470, 470], look: [0, 80, 0], fov: 42 },
      { t: 1, pos: [-260, 360, 430], look: [0, 90, 0], fov: 42 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '04 h 50', place: 'Au-dessus du quartier d’affaires' }],
    LINES: [
      { from: 0.03, to: 0.13, who: 'Alice', vo: false, text: 'Et si elle corrige tous les hashes ?' },
      { from: 0.14, to: 0.26, who: 'Inès', vo: true, text: 'Il faudrait corriger chaque copie. Chaque tour éclairée est un nœud : elle garde le registre et vérifie chaque bloc.' },
      { from: 0.27, to: 0.38, who: 'Inès', vo: true, text: 'Une transaction se propage de voisin en voisin. Personne ne la reçoit au même instant.' },
      { from: 0.39, to: 0.5, who: 'Alice', text: 'Et si Meridian tombe ?' },
      { from: 0.5, to: 0.62, who: 'Inès', vo: true, text: 'Regardez : elle s’éteint et le réseau continue. Bitcoin n’a ni siège ni serveur central.' },
      { from: 0.93, to: 1, who: 'Alice', text: 'Si tout le monde a le registre, qui écrit le prochain bloc ?' }
    ],
    TERMS: [
      { from: 0.14, to: 0.26, label: 'Notion', title: 'Nœud', def: 'Un ordinateur qui garde une copie du registre, vérifie chaque bloc et relaie les transactions. Bitcoin en compte des milliers, ici 14.' },
      { from: 0.27, to: 0.38, label: 'Notion', title: 'Propagation', def: 'Chaque nœud transmet ce qu’il reçoit à ses voisins, de proche en proche. Tous ne voient donc pas le même état au même instant.' },
      { from: 0.5, to: 0.62, label: 'Notion', title: 'Décentralisation', def: 'Des copies distribuées et aucun centre unique : retirer un nœud ne retire pas le registre.' },
      { from: 0.93, to: 1, label: 'Note d’audit', title: 'Le revers', def: 'Cette redondance coûte cher, et la production des blocs se concentre en pratique dans quelques grands groupes de mineurs.' }
    ],
    onClick(e) {
      if (!seq.labOpen) return;
      const i = ctx.city.pickHero(e.clientX, e.clientY, ctx.camera, 46);
      if (i >= 0) toggle(i);
    },
    update(t, time) {
      now = time;
      // Sequence racontee : une propagation, puis Meridian s'eteint
      if (t < 0.64) {
        const wantCut = t > 0.5;
        if (wantCut !== cut.has(0)) { if (wantCut) cut.add(0); else cut.delete(0); syncMeridian(); }
        const cycle = (t > 0.26) ? 1 : 0;
        if (cycle) {
          source = wantCut ? 5 : 3;
          bfs();
          waveStart = time - ((time % 5.5));
        } else {
          waveStart = -100;
        }
      } else if (t > 0.64 && seq.wasStory) {
        cut.clear();
        syncMeridian();
        waveStart = -100;
      }
      seq.wasStory = t < 0.64;
      const elapsed = time - waveStart;
      let reached = 0;
      depth.forEach((d) => { if (d >= 0 && elapsed >= d * STEP) reached++; });
      if (waveStart > -99) $('#n-count').textContent = `${reached} / ${N - cut.size}`;
      ctx.city.setNetwork({ depth, elapsed, step: STEP, cut, active: waveStart > -99 && elapsed < 12 });
      seq.heroLevel = (i) => (cut.has(i) ? 0 : waveStart > -99 && elapsed < 12 ? (depth[i] >= 0 && elapsed >= depth[i] * STEP ? 1 : 0.32) : 0.9);
      seq.linkLevel = curve([[0.02, 0.15], [0.12, 0.55]], t);
    }
  };
  return seq;
}
