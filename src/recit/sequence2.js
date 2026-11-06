// Sequence 2 : 03 h 40, la passerelle vitree. Chainage cryptographique.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { COLORS, createChain, drawChainFace, filament, glassBlock } from './stage.js';
import { curve } from './timeline.js';

const Y = 168;
const L = (x, y, z) => [x, y + Y, z];
const SPACING = 3.95;
const X = (i) => (i - 2) * SPACING;

export function createSequence2(ctx) {
  const group = new THREE.Group();
  group.position.set(0, Y, 60);
  ctx.scene.add(group);

  // Dalle de la passerelle en dalles de pierre sombre et bordures
  const fl = new Kit();
  fl.box(36, 0.22, 7.6, 0x828792, { p: [0, -0.11, 0] });
  fl.box(36, 0.14, 0.36, 0x484d58, { p: [0, 0.07, -3.62] });
  fl.box(36, 0.14, 0.36, 0x484d58, { p: [0, 0.07, 3.62] });
  group.add(
    flat(fl)
  );

  // Charpente metallique de la passerelle : portiques, traverses, garde-corps et socles des 5 blocs
  const steel = new Kit();
  const H = 3.8;
  for (let i = 0; i <= 12; i++) {
    const x = -18 + i * 3;
    steel.box(0.1, H, 0.12, 0x2e3442, { p: [x, H / 2, -3.68] });
    steel.box(0.1, H, 0.12, 0x2e3442, { p: [x, H / 2, 3.68] });
    steel.box(0.1, 0.1, 7.5, 0x2e3442, { p: [x, H - 0.05, 0] });
  }
  steel.box(36, 0.12, 0.14, 0x262b36, { p: [0, H, -3.68] });
  steel.box(36, 0.12, 0.14, 0x262b36, { p: [0, H, 3.68] });
  steel.box(36, 0.05, 0.08, 0x485264, { p: [0, 1.05, -3.55] });
  steel.box(36, 0.05, 0.08, 0x485264, { p: [0, 1.05, 3.55] });
  // Socles au sol sous chacun des 5 blocs de la chaine
  for (let i = 0; i < 5; i++) {
    steel.box(2.8, 0.07, 0.85, 0x282f3c, { p: [X(i), 0.035, -0.9] });
  }
  group.add(flat(steel));

  
  // Garde-corps vitres et lignes de guidage au sol
  const bridgeGlass = new THREE.MeshBasicMaterial({ color: 0x3d5a80, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
  [-3.55, 3.55].forEach((z) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(36, 1), bridgeGlass);
    panel.position.set(0, 0.55, z);
    group.add(panel);
  });
  const lineKit = new Kit();
  lineKit.box(36, 0.015, 0.04, 0x5b74ff, { p: [0, 0.012, 3.48] });
  lineKit.box(36, 0.015, 0.04, 0x5b74ff, { p: [0, 0.012, -3.48] });
  group.add(lineKit.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }), { cast: false }));

  const chain = createChain();
  const blocks = chain.blocks.map((b, i) => {
    const g = glassBlock({ w: 3.05, h: 2.1, d: 0.85 });
    g.group.position.set(X(i), 1.95, -0.9);
    group.add(g.group);
    return g;
  });
  const links = [0, 1, 2, 3].map((i) => {
    const m = filament(new THREE.Vector3(X(i) + 1.53, 1.95, -0.9), new THREE.Vector3(X(i + 1) - 1.53, 1.95, -0.9));
    group.add(m);
    return m;
  });

  // ---------- Panneau ----------
  const panel = ctx.panel(`
    <h2>À vous : modifiez le bloc 2</h2>
    <label for="c-data">Données du bloc 2</label>
    <input id="c-data" type="text" value="${chain.blocks[1].data}" spellcheck="false" autocomplete="off">
    <p id="c-state" class="lab-state" aria-live="polite"></p>
    <button id="c-fix" type="button">Recopier le nouveau hash dans le bloc suivant</button>
    <button id="c-reset" type="button" class="ghost">Tout remettre</button>`);
  const $ = (s) => panel.querySelector(s);
  const edited = new Set();
  function render() {
    chain.rehash();
    chain.blocks.forEach((b, i) => drawChainFace(blocks[i], b, i, { parentOk: i === 0 || chain.linkOk(i - 1), editedData: edited.has(i) }));
    let bad = chain.firstBroken();
    links.forEach((m, i) => m.material.color.setHex(chain.linkOk(i) ? COLORS.ok : COLORS.bad).multiplyScalar(1.7));
    blocks.forEach((g, i) => g.setTint(i > 0 && !chain.linkOk(i - 1) ? COLORS.bad : COLORS.info));
    const st = $('#c-state');
    const fix = $('#c-fix');
    if (bad >= 0) {
      st.textContent = `Le lien entre les blocs ${bad + 1} et ${bad + 2} est rompu : le bloc ${bad + 2} contient l’ancien hash.`;
      fix.disabled = false;
    } else if (edited.size) {
      st.textContent = 'Tous les liens sont rétablis, mais tous les hashes suivants ont dû être recalculés. Sans coût, rien n’empêche de le faire.';
      fix.disabled = true;
    } else {
      st.textContent = 'Chaque bloc contient le hash de son parent. Changez une seule lettre.';
      fix.disabled = true;
    }
  }
  $('#c-data').addEventListener('input', (e) => { chain.blocks[1].data = e.target.value; edited.add(1); render(); });
  $('#c-fix').addEventListener('click', () => {
    const i = chain.firstBroken();
    if (i >= 0) { chain.blocks[i + 1].parent = chain.blocks[i].hash; render(); }
  });
  $('#c-reset').addEventListener('click', () => { chain.reset(); edited.clear(); $('#c-data').value = chain.blocks[1].data; render(); });
  render();

  const REVEAL = [0.08, 0.13, 0.18, 0.23, 0.28];

  return {
    name: 'Chaînage cryptographique',
    lights: [{ p: [0, 4.2, 3.2], color: 0x9bc2ff, i: 1.6, d: 15 }, { p: [-6, 3.8, 3.6], color: 0x7aa5e8, i: 1.1, d: 14 }],
    groups: [group, ctx.cityGroup],
    cityLit: true,
    onBridge: true,
    panelEl: panel,
    LAB: { from: 0.62, to: 0.91 },
    actorsDef: {
      ines: { track: [{ t: 0, x: -8.8, z: 1.4, face: 1.5 }, { t: 0.2, x: -5.8, z: 1.4, face: 1.3 }, { t: 1, x: -5.8, z: 1.4, face: 0.9 }], armLx: [[0.34, 0], [0.37, 0.6], [0.56, 0.6], [0.6, 0]], elbowL: [[0.34, 0.18], [0.37, 0.5], [0.56, 0.5], [0.6, 0.18]] },
      alice: { track: [{ t: 0, x: -10.2, z: 2, face: 1.5 }, { t: 0.22, x: -7.1, z: 2, face: 1.2 }, { t: 1, x: -7.1, z: 2, face: 1.05 }] }
    },
    parent: group,
    CAMERA: [
      { t: 0, pos: L(-11, 1.9, 74), look: L(-3, 1.9, 58.5), fov: 40 },
      { t: 0.3, pos: L(-3, 2.4, 71.5), look: L(-0.8, 1.9, 59), fov: 44 },
      { t: 0.4, pos: L(-1.4, 2.2, 66.3), look: L(-1.4, 2, 59), fov: 40 },
      { t: 0.56, pos: L(1, 2.2, 66.3), look: L(1, 2, 59), fov: 40 },
      { t: 0.65, pos: L(-3.2, 2.5, 73), look: L(-3.2, 1.9, 59), fov: 40 },
      { t: 0.92, pos: L(-3.2, 2.5, 73), look: L(-3.2, 1.9, 59), fov: 40 },
      { t: 1, pos: L(0, 3.4, 77), look: L(0, 2, 59), fov: 40 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '03 h 40', place: 'Passerelle vitrée, tour Meridian' }],
    LINES: [
      { from: 0.03, to: 0.1, who: 'Inès', text: 'Ce qui l’empêche, c’est le bloc suivant. Une blockchain ne se lit que dans l’ordre.' },
      { from: 0.11, to: 0.2, who: 'Inès', text: 'Chaque bloc contient le hash de son parent. C’est ce lien qui donne son nom à la chaîne.' },
      { from: 0.21, to: 0.3, who: 'Alice', text: 'Autrement dit, un numéro de page ?' },
      { from: 0.31, to: 0.43, who: 'Inès', text: 'Non. Un numéro ne dépend pas du contenu. Ici, le lien est l’empreinte de tout le bloc précédent.' },
      { from: 0.44, to: 0.54, who: 'Inès', text: 'Comme ce bloc contient lui-même le hash du précédent, chaque maillon dépend de toute l’histoire.' },
      { from: 0.55, to: 0.61, who: 'Inès', text: 'Dans Bitcoin, cette chaîne remonte sans interruption au tout premier bloc.' },
      { from: 0.93, to: 1, who: 'Inès', text: 'Quelqu’un s’intéresse beaucoup à cette chaîne. Au fonds Kern, une lumière vient de s’allumer.' }
    ],
    TERMS: [
      { from: 0.12, to: 0.2, label: 'Notion', title: 'Chaînage cryptographique', def: 'Chaque bloc contient le hash de son parent. Toute modification d’un bloc change son hash, et le lien avec le bloc suivant ne correspond plus.' },
      { from: 0.32, to: 0.43, label: 'Glossaire', title: 'Empreinte cryptographique', def: 'Elle est très sensible à une modification : une seule lettre change, et le hash n’a plus rien à voir.' },
      { from: 0.92, to: 1, label: 'Note d’audit', title: 'Le chaînage ne suffit pas', def: 'Vous venez de tout recalculer en quelques clics. Ce qui rend cela coûteux en vrai, c’est le travail exigé pour chaque bloc : la séquence 5.' }
    ],
    update(t) {
      blocks.forEach((g, i) => g.setOpacity(curve([[REVEAL[i], 0], [REVEAL[i] + 0.05, 1]], t)));
      links.forEach((m, i) => { const o = curve([[REVEAL[i + 1] + 0.03, 0], [REVEAL[i + 1] + 0.07, 1]], t); m.visible = o > 0.01; m.material.opacity = o; });
    }
  };
}
