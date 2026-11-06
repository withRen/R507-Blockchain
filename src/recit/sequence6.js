// Sequence 6 : 06 h 00, la salle du conseil. Comparaison des mecanismes de consensus.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { COLORS, plate } from './stage.js';
import { curve } from './timeline.js';
import { MERIDIAN } from './city.js';

const F = MERIDIAN.floorY;
const L = (x, y, z) => [x, y + F, z];
const MONO = '"IBM Plex Mono", Menlo, monospace';
const SHARES = [40, 25, 15, 12, 8];

export function createSequence6(ctx) {
  const holo = new THREE.Group();
  holo.position.set(-2.4, 0.8, 8.1);
  holo.visible = false;
  ctx.office.group.add(holo);
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.45,
    metalness: 0.15,
    envMapIntensity: 0.75,
    emissive: new THREE.Color(0x182038),
    emissiveIntensity: 0.15,
    transparent: true
  });

  const makeGroup = (x, build, title, colorCss, ringColor) => {
    const g = new THREE.Group();
    g.position.x = x;

    // Socle projecteur metallique sur la table pour chaque mecanisme
    const baseKit = new Kit();
    baseKit.box(1.06, 0.025, 0.32, 0x3b4252, { p: [0, 0.012, 0] });
    const baseMesh = flat(baseKit);
    const glowLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.98, 0.008, 0.24),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(ringColor).multiplyScalar(1.1), transparent: true })
    );
    glowLine.position.y = 0.027;

    const k = new Kit();
    build(k);
    const geo = k.geometry();
    const m = new THREE.Mesh(geo, mat.clone());
    m.position.y = 0.03;
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 28),
      new THREE.LineBasicMaterial({ color: new THREE.Color(ringColor).multiplyScalar(1.2), transparent: true })
    );
    edges.position.y = 0.03;
    g.add(baseMesh, glowLine, m, edges);

    const label = plate(1.18, 0.22, 472, 88);
    const c = label.ctx;
    c.fillStyle = 'rgba(8, 12, 24, 0.82)';
    c.fillRect(0, 0, 472, 88);
    c.strokeStyle = colorCss;
    c.lineWidth = 2;
    c.strokeRect(3, 3, 466, 82);
    c.fillStyle = colorCss;
    c.font = `600 33px ${MONO}`;
    c.textAlign = 'center';
    c.fillText(title, 236, 56);
    label.tex.needsUpdate = true;
    label.mesh.position.y = 0.99;
    label.mesh.rotation.y = Math.PI;
    g.add(label.mesh);
    holo.add(g);
    return { g, m, edges, glowLine, baseMesh, label };
  };

  const w = 0.13;
  const pow = makeGroup(
    1.25,
    (k) =>
      SHARES.forEach((s, i) => {
        const h = s * 0.019;
        const x = (i - 2) * 0.19;
        k.box(w, h, w, COLORS.effort, { p: [x, h / 2, 0] });
        k.box(w * 1.12, 0.02, w * 1.12, 0xffc978, { p: [x, h + 0.01, 0] });
      }),
    'TRAVAIL · PoW',
    '#ffb860',
    COLORS.effort
  );
  const pos = makeGroup(
    0,
    (k) =>
      SHARES.forEach((s, i) => {
        const n = Math.round(s / 3.4);
        const x = (i - 2) * 0.19;
        for (let j = 0; j < n; j++) {
          k.add(new THREE.CylinderGeometry(0.065, 0.065, 0.048, 12), COLORS.stake, { p: [x, 0.028 + j * 0.065, 0] });
        }
      }),
    'ENJEU · PoS',
    '#67e0e4',
    COLORS.stake
  );
  const poa = makeGroup(
    -1.25,
    (k) =>
      [0, 1, 2, 3, 4].forEach((i) => {
        const x = (i - 2) * 0.19;
        const h = i < 3 ? 0.62 : 0.09;
        const col = i < 3 ? COLORS.authority : COLORS.dim;
        k.box(w, h, w, col, { p: [x, h / 2, 0] });
        if (i < 3) k.add(new THREE.CylinderGeometry(0.055, 0.07, 0.04, 6), 0xd4c4ff, { p: [x, h + 0.02, 0] });
      }),
    'AUTORITÉ · PoA',
    '#c3b0ff',
    COLORS.authority
  );

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
    name: 'Comparaison des consensus',
    lights: [{ p: [-2.4, 3.2, 3.6], color: 0xdbe3ff, i: 3.5, d: 14 }, { p: [-2.4, 2.6, 7], color: 0xc8d4ff, i: 2.2, d: 10 }],
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
      { from: 0.4, to: 0.51, label: 'PoS', title: 'Preuve d’enjeu', def: 'Une mise bloquée donne une chance d’être tiré au sort, et un tricheur la perd. Avantage : très peu d’énergie. Limite : le capital pèse lourd.' },
      { from: 0.54, to: 0.68, label: 'PoA', title: 'Preuve d’autorité', def: 'Des signataires autorisés se relaient. Avantage : rapide et sobre. Limite : il faut leur faire confiance.' },
      { from: 0.94, to: 1, label: 'Note d’audit', title: 'Pas de meilleur absolu', def: 'Chacun échange de la sécurité, de la vitesse, de l’énergie et de la décentralisation. Aucun n’est le meilleur partout.' }
    ],
    leave() { holo.visible = false; },
    update(t, time) {
      holo.visible = true;
      const o = curve([[0.2, 0], [0.26, 1]], t);
      holo.scale.setScalar(0.95);
      [pow, pos, poa].forEach((p) => {
        p.m.material.opacity = o * 0.92;
        p.edges.material.opacity = o * 0.78;
        p.glowLine.material.opacity = o;
        p.baseMesh.visible = o > 0.1;
        p.label.mesh.material.opacity = o;
        p.g.visible = o > 0.01;
      });
      // La preuve de travail est la seule qui s'agite en permanence
      pow.m.position.y = 0.03 + Math.sin(time * 42) * 0.006;
      pow.m.position.x = Math.cos(time * 37) * 0.004;
      pow.edges.position.y = pow.m.position.y;
      pow.edges.position.x = pow.m.position.x;
    }
  };
}
