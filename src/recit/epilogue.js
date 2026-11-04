// Epilogue : 07 h 10, le toit de la tour Meridian. Le bilan honnete.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { surface, textured } from './assets.js';
import { MERIDIAN } from './city.js';

const Y = MERIDIAN.h;
const L = (x, y, z) => [x, y + Y, z];

export function createEpilogue(ctx) {
  const group = new THREE.Group();
  group.position.set(0, Y + 0.25, 0);
  ctx.scene.add(group);
  const k = new Kit();
  k.box(MERIDIAN.w - 0.3, 0.24, MERIDIAN.d - 0.3, 0x7f8289, { p: [0, -0.12, 0] });
  k.box(MERIDIAN.w, 0.3, 0.3, 0x1b1f28, { p: [0, 0.15, MERIDIAN.d / 2] });
  k.box(MERIDIAN.w, 0.3, 0.3, 0x1b1f28, { p: [0, 0.15, -MERIDIAN.d / 2] });
  k.box(0.3, 0.3, MERIDIAN.d, 0x1b1f28, { p: [MERIDIAN.w / 2, 0.15, 0] });
  k.box(0.3, 0.3, MERIDIAN.d, 0x1b1f28, { p: [-MERIDIAN.w / 2, 0.15, 0] });
  k.box(3.2, 2.4, 3.2, 0x20242e, { p: [-9, 1.2, -8] });
  k.box(2.2, 1.7, 4.2, 0x20242e, { p: [10, 0.85, -7] });
  group.add(textured(k, surface('concrete_floor_worn_001', { normalScale: 0.8 }), 3));

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
    lights: [{ p: [-1, 3.6, 7.2], color: 0xc8d6ff, i: 9, d: 16 }],
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
