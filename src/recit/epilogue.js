// Epilogue : 07 h 10, le toit de la tour Meridian. Le bilan honnete.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { MERIDIAN } from './city.js';

const Y = MERIDIAN.h;
const L = (x, y, z) => [x, y + Y, z];

export function createEpilogue(ctx) {
  const group = new THREE.Group();
  group.position.set(0, Y + 0.25, 0);
  ctx.scene.add(group);

  const W = MERIDIAN.w;
  const D = MERIDIAN.d;

  // Dalle de toit en beton patine, acroteres peripheriques et edicule d'acces
  const k = new Kit();
  k.box(W - 0.3, 0.24, D - 0.3, 0x888c96, { p: [0, -0.12, 0] });
  k.box(W, 0.42, 0.36, 0x454a56, { p: [0, 0.21, D / 2] });
  k.box(W, 0.42, 0.36, 0x454a56, { p: [0, 0.21, -D / 2] });
  k.box(0.36, 0.42, D, 0x454a56, { p: [W / 2, 0.21, 0] });
  k.box(0.36, 0.42, D, 0x454a56, { p: [-W / 2, 0.21, 0] });
  // Dalles de circulation pietonne vers le belvedere sud
  for (let z = -5; z <= 11; z += 1.6) {
    k.box(3.8, 0.03, 1.25, 0x9ea3ae, { p: [0.4, 0.015, z] });
  }
  // Edicule technique d'ascenseur et socle des groupes froids CVC
  k.box(3.6, 2.7, 3.4, 0x565c68, { p: [-9, 1.35, -8] });
  k.box(3.85, 0.16, 3.65, 0x3b404a, { p: [-9, 2.75, -8] });
  k.box(2.8, 0.22, 4.6, 0x4e535e, { p: [10, 0.11, -7] });
  group.add(
    flat(k)
  );

  // Garde-corps peripheriques en acier brosse, groupes de climatisation, tuyauteries et mat d'antenne
  const mt = new Kit();
  const hw = W / 2 - 0.16;
  const hd = D / 2 - 0.16;
  mt.box(W - 0.2, 0.055, 0.065, 0x6e7687, { p: [0, 1.12, hd] });
  mt.box(W - 0.2, 0.055, 0.065, 0x6e7687, { p: [0, 1.12, -hd] });
  mt.box(0.065, 0.055, D - 0.2, 0x6e7687, { p: [hw, 1.12, 0] });
  mt.box(0.065, 0.055, D - 0.2, 0x6e7687, { p: [-hw, 1.12, 0] });
  for (let x = -15; x <= 15; x += 2.5) {
    mt.box(0.05, 0.72, 0.05, 0x4a505e, { p: [x, 0.76, hd] });
    mt.box(0.05, 0.72, 0.05, 0x4a505e, { p: [x, 0.76, -hd] });
  }
  for (let z = -12; z <= 12; z += 2.4) {
    mt.box(0.05, 0.72, 0.05, 0x4a505e, { p: [hw, 0.76, z] });
    mt.box(0.05, 0.72, 0.05, 0x4a505e, { p: [-hw, 0.76, z] });
  }
  // Groupes froids CVC a l'est et conduites calorifugees
  mt.box(2.4, 1.65, 4.2, 0x4c5260, { p: [10, 1.04, -7] });
  mt.add(new THREE.CylinderGeometry(0.68, 0.68, 0.14, 24), 0x282c34, { p: [10, 1.9, -8.1] });
  mt.add(new THREE.CylinderGeometry(0.68, 0.68, 0.14, 24), 0x282c34, { p: [10, 1.9, -5.9] });
  mt.box(16.8, 0.22, 0.22, 0x5c6372, { p: [0.5, 0.35, -7.8] });
  mt.box(16.8, 0.18, 0.18, 0x474d59, { p: [0.5, 0.35, -8.2] });
  // Mat de telecommunications sur l'edicule technique
  mt.add(new THREE.CylinderGeometry(0.09, 0.16, 5.2, 16), 0x626a7a, { p: [-9, 5.3, -8] });
  mt.box(1.4, 0.05, 0.05, 0x626a7a, { p: [-9, 6.8, -8] });
  mt.box(0.05, 0.05, 1.4, 0x626a7a, { p: [-9, 7.3, -8] });
  group.add(flat(mt));

  // Balise rouge d'aviation au sommet du mat et eclairage de balisage du toit
  const lightsKit = new Kit();
  lightsKit.add(new THREE.SphereGeometry(0.11, 12, 10), 0xff3b30, { p: [-9, 7.95, -8] });
  for (const x of [-6, -2, 2, 6]) {
    lightsKit.box(0.32, 0.04, 0.08, 0xffd2a6, { p: [x, 0.44, hd - 0.22] });
  }
  group.add(lightsKit.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(0.95, 0.85, 0.75) }), { cast: false }));

    
  const panel = ctx.panel(`
    <h2>Ce qu’il faut retenir</h2>
    <ol class="recap">
      <li><b>Bloc</b> : des données, le hash de son parent, un nonce et un hash qui résume le tout.</li>
      <li><b>Chaînage</b> : chaque bloc dépend de toute l’histoire qui le précède.</li>
      <li><b>Immutabilité</b> : modifier se détecte, et le faire accepter coûte très cher.</li>
      <li><b>Réseau</b> : des nœuds et des copies distribuées, sans centre unique.</li>
      <li><b>Minage</b> : trouver un nonce est long, vérifier est immédiat.</li>
      <li><b>Consensus</b> : PoW, PoS et PoA ont chacun leurs avantages et leurs limites.</li>
      <li><b>Transaction</b> : elle devient sûre peu à peu, au fil des confirmations.</li>
    </ol>
    <a class="lab-link" href="./sources.html">Sources et simplifications</a>
    <button id="e-top" type="button" class="ghost">Revoir depuis le début</button>`);
  panel.querySelector('#e-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'auto' }));

  return {
    name: 'Épilogue',
    lights: [
      { p: [-1, 3.6, 7.2], color: 0xc8d6ff, i: 3.6, d: 18 },
      { p: [6, 3.2, 11.5], color: 0xffb87a, i: 2.6, d: 16 },
      { p: [-8, 3.5, -5], color: 0x9ab4ff, i: 2.0, d: 14 }
    ],
    groups: [group, ctx.cityGroup],
    cityLit: true,
    outside: true,
    panelEl: panel,
    LAB: { from: 0.72, to: 1.01 },
    parent: group,
    actorsDef: {
      alice: { track: [{ t: 0, x: -1.3, z: 9.2, face: 2.9 }, { t: 0.06, x: -1.3, z: 9.6, face: 0.2 }, { t: 1, x: -1.3, z: 9.6, face: 0.2 }] },
      bob: { track: [{ t: 0, x: 0.2, z: 9.8, face: -0.5 }, { t: 1, x: 0.2, z: 9.8, face: -0.5 }] },
      ines: { track: [{ t: 0, x: 2.2, z: 11.6, face: 0.1 }, { t: 1, x: 2.2, z: 11.6, face: 0.1 }] }
    },
    CAMERA: [
      { t: 0, pos: L(-3.2, 4.6, 3.2), look: L(0.8, -0.4, 22), fov: 48 },
      { t: 0.5, pos: L(-3.1, 4.3, 4.3), look: L(0.8, -0.6, 22), fov: 48 },
      { t: 0.75, pos: L(-20, 10, 8), look: L(-52, -28, 60), fov: 48 },
      { t: 1, pos: L(-14, 16, 2), look: L(-64, -36, 70), fov: 48 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '07 h 10', place: 'Toit de la tour Meridian' }],
    LINES: [
      { from: 0.03, to: 0.15, who: 'Bob', text: 'Et mes quarante millions ?' },
      { from: 0.16, to: 0.31, who: 'Alice', text: 'Ils étaient dans l’ancien registre. Une blockchain ne protège que ce qu’on y a écrit.' },
      { from: 0.32, to: 0.5, who: 'Inès', text: 'Elle ne dit pas la vérité. Elle dit ce qui a été écrit et dans quel ordre, sans demander à personne de le garder.' },
      { from: 0.51, to: 0.7, who: 'Inès', text: 'Lente, chère, publique, sans recours si on perd sa clé. Si vous avez confiance en un Gaspard, une base de données coûte moins cher.' }
    ],
    TERMS: [],
    update() {}
  };
}
