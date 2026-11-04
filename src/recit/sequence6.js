// Sequence 6 : 06 h 00, la salle du conseil. Comparaison des mecanismes de consensus.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { COLORS, plate } from './stage.js';
import { curve } from './timeline.js';
import { MERIDIAN } from './city.js';

const F = MERIDIAN.floorY;
const L = (x, y, z) => [x, y + F, z];
const MONO = '"IBM Plex Mono", Menlo, monospace';
const SHARES = [40, 25, 15, 12, 8];

export function createSequence6(ctx) {
  const holo = new THREE.Group();
  holo.position.set(-2.4, 0.84, 8.1);
  holo.visible = false;
  ctx.office.group.add(holo);
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(1.2, 1.2, 1.2), transparent: true });

  const makeGroup = (x, build, title, colorCss) => {
    const g = new THREE.Group();
    g.position.x = x;
    const k = new Kit();
    build(k);
    const m = new THREE.Mesh(k.geometry(), mat.clone());
    g.add(m);
    const label = plate(1.14, 0.2, 456, 80);
    const c = label.ctx;
    c.fillStyle = colorCss;
    c.font = `500 34px ${MONO}`;
    c.textAlign = 'center';
    c.fillText(title, 228, 54);
    label.tex.needsUpdate = true;
    label.mesh.position.y = 0.96;
    label.mesh.rotation.y = Math.PI;
    g.add(label.mesh);
    holo.add(g);
    return { g, m, label };
  };
  const w = 0.13;
  const pow = makeGroup(1.25, (k) => SHARES.forEach((s, i) => k.box(w, s * 0.019, w, COLORS.effort, { p: [(i - 2) * 0.19, s * 0.0095, 0] })), 'TRAVAIL · PoW', '#ffb860');
  const pos = makeGroup(0, (k) => SHARES.forEach((s, i) => {
    const n = Math.round(s / 3.4);
    for (let j = 0; j < n; j++) k.add(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 14), COLORS.stake, { p: [(i - 2) * 0.19, 0.03 + j * 0.065, 0] });
  }), 'ENJEU · PoS', '#67e0e4');
  const poa = makeGroup(-1.25, (k) => [0, 1, 2, 3, 4].forEach((i) => k.box(w, i < 3 ? 0.62 : 0.09, w, i < 3 ? COLORS.authority : COLORS.dim, { p: [(i - 2) * 0.19, i < 3 ? 0.31 : 0.045, 0] })), 'AUTORITÉ · PoA', '#c3b0ff');

  const panel = ctx.panel(`
    <h2>À vous : produisez 100 blocs</h2>
    <p class="lab-hint">Cinq participants, A à E. A pèse 40 %, B 25 %, C 15 %, D 12 % et E 8 %.</p>
    <button id="k-go" type="button">Produire 100 blocs avec chaque méthode</button>
    <div id="k-out" class="bars" aria-live="polite"></div>
    <table class="compare"><thead><tr><th></th><th>PoW</th><th>PoS</th><th>PoA</th></tr></thead><tbody>
    <tr><th>Ressource</th><td>Calcul</td><td>Mise</td><td>Identité</td></tr>
    <tr><th>Énergie</th><td>Élevée</td><td>Faible</td><td>Faible</td></tr>
    <tr><th>Ouvert</th><td>Oui</td><td>Oui</td><td>Non</td></tr>
    <tr><th>Tricher coûte</th><td>L’électricité</td><td>La mise</td><td>L’autorisation</td></tr>
    <tr><th>Limite</th><td>Énergie</td><td>Poids du capital</td><td>Confiance</td></tr>
    </tbody></table>`);
  const pick = (weights) => {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; }
    return weights.length - 1;
  };
  panel.querySelector('#k-go').addEventListener('click', () => {
    const wins = { pow: [0, 0, 0, 0, 0], pos: [0, 0, 0, 0, 0], poa: [0, 0, 0, 0, 0] };
    const stake = [...SHARES];
    for (let k = 0; k < 100; k++) {
      const a = pick(SHARES);
      const b = pick(stake);
      stake[b] += 2; // la recompense est reinvestie
      wins.pow[a]++;
      wins.pos[b]++;
      wins.poa[k % 3]++;
    }
    const row = (title, arr, cls) => `<div class="bar-row"><b>${title}</b>${arr.map((n, i) => `<span class="${cls}" style="--h:${n}" title="${'ABCDE'[i]} : ${n} blocs"><i></i><em>${'ABCDE'[i]}</em><small>${n}</small></span>`).join('')}</div>`;
    panel.querySelector('#k-out').innerHTML = row('PoW', wins.pow, 'c-pow') + row('PoS', wins.pos, 'c-pos') + row('PoA', wins.poa, 'c-poa')
      + `<p class="lab-state">A a écrit ${wins.pow[0]} blocs en PoW et ${wins.pos[0]} en PoS, parce qu’il réinvestit ses gains. En PoA, D et E n’écrivent jamais.</p>`;
  });

  return {
    name: 'Consensus',
    groups: [ctx.office.group, ctx.cityGroup],
    cityLit: true,
    panelEl: panel,
    LAB: { from: 0.68, to: 0.93 },
    parent: ctx.office.group,
    actorsDef: {
      theo: { track: [{ t: 0, x: -5.2, z: 6.6, face: 1.2 }, { t: 1, x: -5.2, z: 6.6, face: 1.2 }] },
      clara: { track: [{ t: 0, x: -3.3, z: 6.35, face: 0.3 }, { t: 1, x: -3.3, z: 6.35, face: 0.3 }] },
      helene: { track: [{ t: 0, x: -1.5, z: 6.35, face: -0.3 }, { t: 1, x: -1.5, z: 6.35, face: -0.3 }] },
      ines: { track: [{ t: 0, x: 0.45, z: 6.6, face: -1.2 }, { t: 1, x: 0.45, z: 6.6, face: -1.2 }] }
    },
    CAMERA: [
      { t: 0, pos: L(-2.3, 2.1, 0.8), look: L(-2.4, 1.35, 8), fov: 40 },
      { t: 0.14, pos: L(-2.35, 2, 2), look: L(-2.4, 1.3, 8), fov: 40 },
      { t: 0.24, pos: L(-1.1, 1.7, 5.1), look: L(-1.1, 1.3, 8.1), fov: 40 },
      { t: 0.36, pos: L(-1.1, 1.7, 5.1), look: L(-1.1, 1.3, 8.1), fov: 40 },
      { t: 0.4, pos: L(-2.4, 1.7, 5.1), look: L(-2.4, 1.3, 8.1), fov: 40 },
      { t: 0.5, pos: L(-2.4, 1.7, 5.1), look: L(-2.4, 1.3, 8.1), fov: 40 },
      { t: 0.54, pos: L(-3.65, 1.7, 5.1), look: L(-3.65, 1.3, 8.1), fov: 40 },
      { t: 0.63, pos: L(-3.65, 1.7, 5.1), look: L(-3.65, 1.3, 8.1), fov: 40 },
      { t: 0.72, pos: L(-1, 2.2, 1.6), look: L(-1, 1.25, 8.1), fov: 40 },
      { t: 0.93, pos: L(-1, 2.2, 1.6), look: L(-1, 1.25, 8.1), fov: 40 },
      { t: 1, pos: L(-2.4, 2.1, 0.6), look: L(-2.4, 1.3, 8.1), fov: 40 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '06 h 00', place: 'Tour Meridian, salle du conseil' }],
    LINES: [
      { from: 0.03, to: 0.12, who: 'Hélène', text: 'Cette facture d’électricité, c’est intenable. Il y a forcément une autre façon de décider qui écrit.' },
      { from: 0.13, to: 0.22, who: 'Inès', text: 'C’est la question du consensus : comment des inconnus s’accordent sur le prochain bloc, sans arbitre.' },
      { from: 0.24, to: 0.37, who: 'Théo', text: 'Preuve de travail, comme Bitcoin : ouverte à tous, éprouvée. On paie en électricité, et un tricheur perd la sienne.' },
      { from: 0.39, to: 0.51, who: 'Clara', text: 'Preuve d’enjeu, comme Ethereum depuis 2022 : on bloque une mise, un validateur est tiré au sort. Presque pas d’énergie.' },
      { from: 0.53, to: 0.63, who: 'Hélène', text: 'Preuve d’autorité : des signataires connus, à tour de rôle. Rapide et sobre, et il y a un responsable.' },
      { from: 0.63, to: 0.68, who: 'Inès', text: 'Un petit groupe de confiance qui écrit seul… on sort à peine de chez Meridian.' },
      { from: 0.94, to: 1, who: 'Inès', text: 'Et personne ici ne tranche : ce sont les nœuds qui appliquent les règles. Pendant ce temps, Mallory appelle Bob.' }
    ],
    TERMS: [
      { from: 0.13, to: 0.22, label: 'Glossaire', title: 'Consensus', def: 'Mécanisme par lequel les participants d’un réseau décentralisé s’accordent sur les transactions et les blocs retenus comme valides.' },
      { from: 0.25, to: 0.37, label: 'PoW', title: 'Preuve de travail', def: 'Avantage : ouverte et très éprouvée. Limite : énergie, et concentration chez ceux qui ont les machines.' },
      { from: 0.4, to: 0.51, label: 'PoS', title: 'Preuve d’enjeu', def: 'Une mise en garantie (32 ETH sur Ethereum), un tirage toutes les 12 secondes. Un tricheur perd sa mise : le slashing. Limite : le capital pèse lourd.' },
      { from: 0.54, to: 0.68, label: 'PoA', title: 'Preuve d’autorité', def: 'Des signataires autorisés se relaient, surtout sur des réseaux privés ou de test. Limite : il faut leur faire confiance.' },
      { from: 0.94, to: 1, label: 'Note d’audit', title: 'Pas de meilleur absolu', def: 'Chaque mécanisme échange de la sécurité, de la vitesse, de l’énergie et de la décentralisation. Ce qui change, c’est ce que la triche fait perdre.' }
    ],
    leave() { holo.visible = false; },
    update(t, time) {
      holo.visible = true;
      const o = curve([[0.2, 0], [0.26, 1]], t);
      holo.scale.setScalar(0.95);
      [pow, pos, poa].forEach((p) => {
        p.m.material.opacity = o;
        p.label.mesh.material.opacity = o;
        p.g.visible = o > 0.01;
      });
      // La preuve de travail est la seule qui s'agite en permanence
      pow.m.position.y = Math.sin(time * 42) * 0.006;
      pow.m.position.x = Math.cos(time * 37) * 0.004;
    }
  };
}
