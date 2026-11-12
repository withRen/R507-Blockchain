// Sequence 3 : 04 h 15, le bureau de Maxime. Immutabilite et detection de falsification.
// Le decor reprend l'etage vitre : on est dans la tour Kern, en face.
import * as THREE from 'three';
import { COLORS, createChain, drawChainFace, filament, glassBlock, plate } from './stage.js';
import { curve } from './timeline.js';
import { MERIDIAN } from './city.js';
import { hashBlock } from '../lib/blockchain.js';

const F = MERIDIAN.floorY;
const L = (x, y, z) => [x, y + F, z];
const NODES = 14;

export function createSequence3(ctx) {
  const holo = new THREE.Group();
  holo.position.set(-2.4, 2.05, 8.15);
  holo.scale.setScalar(0.27);
  holo.visible = false;
  ctx.office.group.add(holo);
  const chain = createChain();
  const blocks = chain.blocks.map((b, i) => {
    const g = glassBlock({ w: 3.05, h: 2.1, d: 0.85 });
    g.group.position.set((i - 2) * -3.9, 0, 0);
    g.group.rotation.y = Math.PI;
    holo.add(g.group);
    return g;
  });
  const links = [0, 1, 2, 3].map((i) => {
    const m = filament(new THREE.Vector3((i - 2) * -3.9 - 1.53, 0, 0), new THREE.Vector3((i - 1) * -3.9 + 1.53, 0, 0));
    holo.add(m);
    return m;
  });
  // Les 14 copies du reseau, cote a cote au-dessus de la chaine : la premiere est celle de Maxime
  const copies = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.34, 0.24, 0.1),
    new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false }),
    NODES * 5
  );
  const dummy = new THREE.Object3D();
  for (let c = 0; c < NODES; c++) {
    for (let j = 0; j < 5; j++) {
      dummy.position.set(-((c % 7) - 3) * 2.4 - (j - 2) * 0.4, c < 7 ? 2.3 : 1.85, 0);
      dummy.updateMatrix();
      copies.setMatrixAt(c * 5 + j, dummy.matrix);
    }
  }
  copies.frustumCulled = false;
  holo.add(copies);
  const copyColor = new THREE.Color();
  let copiesBad = null;
  const paintCopies = (bad) => {
    for (let c = 0; c < NODES; c++) {
      for (let j = 0; j < 5; j++) copies.setColorAt(c * 5 + j, copyColor.setHex(bad && c === 0 && j >= 2 ? COLORS.bad : COLORS.ok));
    }
    copies.instanceColor.needsUpdate = true;
  };
  const copiesLabel = plate(13, 0.42, 1950, 63);
  copiesLabel.ctx.fillStyle = '#c9d2e2';
  copiesLabel.ctx.font = '600 40px "IBM Plex Mono", Menlo, monospace';
  copiesLabel.ctx.fillText('LES 14 COPIES DU RÉSEAU · LA PREMIÈRE EST CELLE DE MAXIME', 8, 46);
  copiesLabel.tex.needsUpdate = true;
  copiesLabel.mesh.position.set(1.6, 2.78, 0);
  copiesLabel.mesh.rotation.y = Math.PI;
  holo.add(copiesLabel.mesh);

  const honest = chain.blocks.map((b) => b.hash);
  const original = chain.blocks[2].data;

  const panel = ctx.panel(`
    <h2>Falsifie le bloc 3</h2>
    <label for="f-data">Données du bloc 3 dans la copie de Maxime</label>
    <input id="f-data" type="text" value="${original}" spellcheck="false" autocomplete="off">
    <div class="nodes" id="f-nodes" aria-hidden="true">${'<i></i>'.repeat(NODES)}</div>
    <p id="f-state" class="lab-state" aria-live="polite"></p>
    <button id="f-reset" type="button" class="ghost">Remettre le bloc d’origine</button>`);
  const $ = (s) => panel.querySelector(s);
  const dots = [...panel.querySelectorAll('.nodes i')];
  let forced = null;

  function apply(text) {
    chain.blocks[2].data = text;
    chain.rehash();
    const tampered = chain.blocks[2].hash !== honest[2];
    chain.blocks.forEach((b, i) => drawChainFace(blocks[i], b, i, { parentOk: i === 0 || chain.linkOk(i - 1), editedData: tampered && i === 2, small: false }));
    return tampered;
  }
  function renderPanel() {
    const tampered = chain.blocks[2].hash !== honest[2];
    dots.forEach((d, i) => { d.className = !tampered ? 'ok' : i === 0 ? 'bad' : 'ok'; });
    $('#f-state').textContent = tampered
      ? `Le hash du bloc 3 devient ${hashBlock(chain.blocks[2]).slice(0, 10)}…, mais le bloc 4 attend ${honest[2].slice(0, 10)}…. Les 13 autres nœuds gardent leur copie et rejettent celle de Maxime.`
      : 'Les 14 nœuds ont la même chaîne. Le premier carré est la copie de Maxime. Remplace 5 par 500.';
  }
  $('#f-data').addEventListener('input', (e) => { forced = e.target.value; apply(forced); renderPanel(); });
  $('#f-reset').addEventListener('click', () => { forced = original; $('#f-data').value = original; apply(original); renderPanel(); });
  apply(original);
  renderPanel();

  let wasTampered = null;

  return {
    name: 'Immutabilité et falsification',
    QUESTION: 'Et si quelqu’un modifie sa copie ?',
    lights: [{ p: [-2.4, 3.2, 3.6], color: 0xdbe3ff, i: 3.5, d: 14 }, { p: [-5.4, 3.2, 7], color: 0xe8eeff, i: 2.2, d: 12 }],
    groups: [ctx.office.group, ctx.cityGroup],
    cityLit: true,
    panelEl: panel,
    LAB: { from: 0.68, to: 0.92 },
    parent: ctx.office.group,
    actorsDef: {
      maxime: {
        track: [
          { t: 0, x: -7, z: 6.4, face: 1.5 },
          { t: 0.14, x: -4.3, z: 6.75, face: 0.75 },
          { t: 1, x: -4.3, z: 6.75, face: 0.75 }
        ],
        armLx: [[0.25, 0], [0.28, 0.75], [0.38, 0.75], [0.41, 0]],
        elbowL: [[0.25, 0.18], [0.28, 0.65], [0.38, 0.65], [0.41, 0.18]],
        headPitch: [[0.2, 0], [0.25, -0.1], [0.6, -0.1]]
      }
    },
    CAMERA: [
      { t: 0, pos: L(-5.2, 1.95, 1.1), look: L(-3.2, 1.45, 8), fov: 38 },
      { t: 0.15, pos: L(-3.8, 1.95, 2.4), look: L(-2.8, 1.65, 8.1), fov: 38 },
      { t: 0.27, pos: L(-2.4, 2.05, 5.3), look: L(-2.4, 2.05, 8.15), fov: 38 },
      { t: 0.42, pos: L(-2.3, 2.05, 5.05), look: L(-2.3, 2.05, 8.15), fov: 38 },
      { t: 0.68, pos: L(-3.4, 2.1, 4.55), look: L(-3.4, 2.05, 8.15), fov: 44 },
      { t: 0.92, pos: L(-3.4, 2.1, 4.55), look: L(-3.4, 2.05, 8.15), fov: 44 },
      { t: 1, pos: L(-2.8, 1.95, 3.1), look: L(-2.6, 1.65, 8), fov: 38 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '04 h 15', place: 'Tour Kern, bureau de Maxime Kern' }],
    LINES: [
      { from: 0.03, to: 0.14, who: 'Inès', vo: true, text: 'Maxime Kern dirige un fonds. Il garde une copie de la chaîne, comme chaque tour de la ville.' },
      { from: 0.15, to: 0.26, who: 'Inès', vo: true, text: 'Dans le bloc 3, Julien lui a versé 5 jetons. Il veut en faire 500.' },
      { from: 0.27, to: 0.4, who: 'Inès', vo: true, text: 'Le contenu change, donc le hash change. Le bloc 4 attendait l’ancien : sa copie devient incohérente.' },
      { from: 0.53, to: 0.66, who: 'Inès', vo: true, text: 'Les autres nœuds recalculent, voient l’incohérence et rejettent sa copie. Ils gardent la leur.' },
      { from: 0.93, to: 1, who: 'Maxime', text: 'Il suffirait donc de corriger toutes les copies.' }
    ],
    TERMS: [
      { from: 0.42, to: 0.66, label: 'Glossaire', title: 'Immutabilité', def: 'Propriété pratique selon laquelle une donnée validée est très difficile à modifier sans rendre la falsification détectable et sans refaire accepter la modification par le réseau ; cela ne signifie pas qu’elle est physiquement impossible à changer.' },
      { from: 0.93, to: 1, label: 'À retenir', title: 'Une falsification se voit', def: 'Les autres nœuds la rejettent. Le revers : ce qui est écrit reste écrit, erreurs comprises.' }
    ],
    enter() { holo.visible = true; },
    leave() { holo.visible = false; },
    update(t) {
      holo.visible = true;
      const tamperedByScroll = t > 0.3 && t < 0.68;
      if (t < 0.68) {
        if (wasTampered !== tamperedByScroll) { apply(tamperedByScroll ? 'Julien → Maxime : 500 jetons' : original); wasTampered = tamperedByScroll; }
      } else if (wasTampered !== 'lab') {
        apply(forced ?? original);
        renderPanel();
        wasTampered = 'lab';
      }
      const o = curve([[0.14, 0], [0.22, 1]], t);
      // La cascade progresse d'un maillon a l'autre
      const bad = chain.blocks[2].hash !== honest[2];
      if (bad !== copiesBad) { copiesBad = bad; paintCopies(bad); }
      copies.material.opacity = o;
      copiesLabel.mesh.material.opacity = o;
      blocks.forEach((g, i) => {
        g.setOpacity(o);
        let col = COLORS.info;
        if (bad && t >= 0.68 && i >= 2) col = COLORS.bad;
        if (bad && t < 0.68) {
          const reach = 0.3 + (i - 2) * 0.03;
          if (i >= 2 && t > reach) col = COLORS.bad;
        }
        g.setTint(col);
      });
      links.forEach((m, i) => {
        m.material.opacity = o;
        m.material.color.setHex(i === 1 ? COLORS.ok : COLORS.ok);
        const broken = bad && i >= 2 && (t >= 0.68 || t > 0.31 + (i - 2) * 0.03);
        m.material.color.setHex(broken ? COLORS.bad : COLORS.ok).multiplyScalar(1.7);
      });
    }
  };
}
