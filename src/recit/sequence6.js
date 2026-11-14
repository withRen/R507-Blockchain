// Sequence 6 : 06 h 00, la salle du conseil. Comparaison des mecanismes de consensus.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { COLORS, plate } from './stage.js';
import { curve } from './timeline.js';
import { MERIDIAN } from './city.js';
import { sfx } from './sfx.js';

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
        // Cinq signataires de meme poids : ils ecrivent a tour de role
        const h = 0.5;
        k.box(w, h, w, COLORS.authority, { p: [x, h / 2, 0] });
        k.add(new THREE.CylinderGeometry(0.055, 0.07, 0.04, 6), 0xd4c4ff, { p: [x, h + 0.02, 0] });
      }),
    'AUTORITÉ · PoA',
    '#c3b0ff',
    COLORS.authority
  );

  const panel = ctx.panel(`
    <h2>Produis 100 blocs</h2>
    <p class="lab-hint">Cinq participants, A à E. A pèse 40 %, B 25 %, C 15 %, D 12 % et E 8 %.</p>
    <button id="k-go" type="button" data-sfx="1">Produire 100 blocs avec chaque méthode</button>
    <div id="k-out" class="bars" aria-live="polite"></div>
    <table class="compare"><thead><tr><th></th><th>PoW</th><th>PoS</th><th>PoA</th></tr></thead><tbody>
    <tr><th>Énergie</th><td>Élevée</td><td>Faible</td><td>Faible</td></tr>
    <tr><th>Ouvert à tous</th><td>Oui</td><td>Oui</td><td>Non</td></tr>
    <tr><th>Tricher coûte</th><td>L’électricité</td><td>La mise</td><td>Corrompre la majorité</td></tr>
    </tbody></table>
    <p class="lab-out-label">Autorité : essaie de corrompre des signataires</p>
    <div id="k-sign" class="signers" role="group" aria-label="Signataires">${'ABCDE'.split('').map((s) => `<button type="button" aria-pressed="false" data-sfx="1">${s}</button>`).join('')}</div>
    <p id="k-bribe" class="lab-state" aria-live="polite">Les cinq signataires écrivent à tour de rôle. Clique pour en corrompre.</p>`);
  // Corrompre un signataire ne suffit pas : les autres refusent son faux bloc au tour suivant
  const signers = [...panel.querySelectorAll('#k-sign button')];
  signers.forEach((b) => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    const n = signers.filter((s) => s.getAttribute('aria-pressed') === 'true').length;
    sfx(n >= 3 && b.getAttribute('aria-pressed') === 'true' ? 'alarm' : 'click');
    panel.querySelector('#k-bribe').textContent = n === 0
      ? 'Les cinq signataires écrivent à tour de rôle. Clique pour en corrompre.'
      : n < 3
        ? `${n} signataire${n > 1 ? 's' : ''} corrompu${n > 1 ? 's' : ''} sur 5 : son faux bloc est refusé par les autres dès le tour suivant. Il en faut 3.`
        : `${n} sur 5 : la majorité est corrompue, le faux bloc passe. Mais il a fallu acheter ${n} acteurs connus, qui y risquent leur place : bien plus cher que de signer honnêtement.`;
  }));
  const pick = (weights) => {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; }
    return weights.length - 1;
  };
  panel.querySelector('#k-go').addEventListener('click', () => {
    sfx('whoosh');
    const wins = { pow: [0, 0, 0, 0, 0], pos: [0, 0, 0, 0, 0], poa: [0, 0, 0, 0, 0] };
    const stake = [...SHARES];
    for (let k = 0; k < 100; k++) {
      const a = pick(SHARES);
      const b = pick(stake);
      stake[b] += 2; // la recompense est reinvestie
      wins.pow[a]++;
      wins.pos[b]++;
      wins.poa[k % 5]++; // chacun son tour
    }
    const row = (title, arr, cls) => `<div class="bar-row"><b>${title}</b>${arr.map((n, i) => `<span class="${cls}" style="--h:${n}" title="${'ABCDE'[i]} : ${n} blocs"><i></i><em>${'ABCDE'[i]}</em><small>${n}</small></span>`).join('')}</div>`;
    panel.querySelector('#k-out').innerHTML = row('PoW', wins.pow, 'c-pow') + row('PoS', wins.pos, 'c-pos') + row('PoA', wins.poa, 'c-poa')
      + `<p class="lab-state">A a écrit ${wins.pow[0]} blocs en PoW et ${wins.pos[0]} en PoS, parce qu’il réinvestit ses gains. En PoA, chacun écrit à son tour : 20 blocs chacun.</p>`;
  });

  return {
    name: 'Comparaison des consensus',
    QUESTION: 'Peut-on décider autrement qu’en brûlant de l’énergie ?',
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
      { from: 0.03, to: 0.12, who: 'Hélène', text: 'Cette facture d’électricité est intenable. Il doit exister une autre façon de décider qui écrit.' },
      { from: 0.13, to: 0.22, who: 'Inès', text: 'C’est la question du consensus : comment se mettre d’accord sur le prochain bloc, sans arbitre.' },
      { from: 0.24, to: 0.37, who: 'Théo', text: 'Le travail : ouvert à tous, éprouvé. On paie en électricité, et un tricheur gaspille la sienne.' },
      { from: 0.39, to: 0.51, who: 'Clara', text: 'L’enjeu : on bloque une mise, et un validateur est tiré au sort. Presque pas d’énergie, et un tricheur perd sa mise.' },
      { from: 0.53, to: 0.63, who: 'Hélène', text: 'L’autorité : des signataires connus écrivent à tour de rôle. Comme ce n’est jamais le même, il faudrait tous les corrompre.' },
      { from: 0.63, to: 0.68, who: 'Inès', text: 'C’est le choix des réseaux où l’on se connaît : par exemple pour suivre une marchandise, du produit brut au produit fini.' },
      { from: 0.94, to: 1, who: 'Inès', text: 'Aucune règle n’est la meilleure partout. Pendant ce temps, Maxime appelle Julien.' }
    ],
    TERMS: [
      { from: 0.13, to: 0.22, label: 'Glossaire', title: 'Consensus', def: 'Mécanisme par lequel les participants d’un réseau décentralisé s’accordent sur les transactions et les blocs retenus comme valides.' },
      { from: 0.25, to: 0.37, label: 'PoW', title: 'Preuve de travail', def: 'Avantage : ouverte à tous et très éprouvée. Limite : l’énergie, et le poids de ceux qui ont les machines.' },
      { from: 0.4, to: 0.51, label: 'PoS', title: 'Preuve d’enjeu', def: 'Une mise bloquée donne une chance d’être tiré au sort, et un tricheur la perd. Avantage : très peu d’énergie. Limite : le capital pèse lourd.' },
      { from: 0.54, to: 0.68, label: 'PoA', title: 'Preuve d’autorité', def: 'Des signataires connus se relaient, et le rôle peut être délégué. Avantage : rapide et sobre. Limite : il faut que la majorité reste honnête, mais la corrompre coûte plus cher que jouer le jeu.' },
      { from: 0.94, to: 1, label: 'À retenir', title: 'Pas de meilleur absolu', def: 'Chaque mécanisme échange de la sécurité, de la vitesse, de l’énergie et de la décentralisation.' }
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
