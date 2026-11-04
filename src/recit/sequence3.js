// Sequence 3 : 04 h 15, le bureau de Mallory. Immutabilite et detection de falsification.
// Le decor reprend l'etage vitre : on est dans la tour Kern, en face.
import * as THREE from 'three';
import { COLORS, createChain, drawChainFace, filament, glassBlock } from './stage.js';
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
  const honest = chain.blocks.map((b) => b.hash);
  const original = chain.blocks[2].data;

  const panel = ctx.panel(`
    <h2>À vous : falsifiez le bloc 3</h2>
    <label for="f-data">Données du bloc 3 dans la copie de Mallory</label>
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
      ? `Le hash du bloc 3 devient ${hashBlock(chain.blocks[2]).slice(0, 10)}…, mais le bloc 4 attend ${honest[2].slice(0, 10)}…. Les 13 autres nœuds gardent leur copie et rejettent celle de Mallory.`
      : 'Les 14 nœuds ont la même chaîne. Le premier carré est la copie de Mallory. Remplacez 5 par 500.';
  }
  $('#f-data').addEventListener('input', (e) => { forced = e.target.value; apply(forced); renderPanel(); });
  $('#f-reset').addEventListener('click', () => { forced = original; $('#f-data').value = original; apply(original); renderPanel(); });
  apply(original);
  renderPanel();

  let wasTampered = null;

  return {
    name: 'Falsification',
    groups: [ctx.office.group, ctx.cityGroup],
    cityLit: true,
    panelEl: panel,
    LAB: { from: 0.68, to: 0.92 },
    parent: ctx.office.group,
    actorsDef: {
      mallory: {
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
    SLUGS: [{ from: 0.005, to: 1, time: '04 h 15', place: 'Tour Kern, bureau de Mallory Kern' }],
    LINES: [
      { from: 0.03, to: 0.14, who: 'Inès', vo: true, text: 'Mallory Kern dirige les opérations d’un fonds. Elle tient une copie de la chaîne, comme tout le monde.' },
      { from: 0.15, to: 0.26, who: 'Inès', vo: true, text: 'Dans le bloc 3, Bob lui a versé 5 jetons. Elle veut en faire 500.' },
      { from: 0.27, to: 0.4, who: 'Inès', vo: true, text: 'Le contenu change, donc le hash du bloc 3 change. Le bloc 4 attendait l’ancien.' },
      { from: 0.41, to: 0.52, who: 'Mallory', text: 'On m’avait dit qu’une blockchain était infalsifiable.' },
      { from: 0.53, to: 0.66, who: 'Inès', vo: true, text: 'Faux. On peut modifier une copie. Mais les autres nœuds recalculent les hashes, voient l’incohérence et l’ignorent.' },
      { from: 0.93, to: 1, who: 'Mallory', text: 'Il suffit donc de corriger tous les hashes, partout.' }
    ],
    TERMS: [
      { from: 0.28, to: 0.4, label: 'Notion', title: 'Détection de falsification', def: 'Une modification rend les empreintes incohérentes. N’importe quel nœud le voit en recalculant, gratuitement et sans contrôleur central.' },
      { from: 0.42, to: 0.66, label: 'Glossaire', title: 'Immutabilité', def: 'Propriété pratique selon laquelle une donnée validée est très difficile à modifier sans rendre la falsification détectable et sans refaire accepter la modification par le réseau ; cela ne signifie pas qu’elle est physiquement impossible à changer.' },
      { from: 0.93, to: 1, label: 'Note d’audit', title: 'Le revers', def: 'Ce qui est écrit reste écrit : une erreur, un vol, une donnée personnelle (droit à l’effacement, CNIL). Après The DAO en 2016, Ethereum n’a pu revenir en arrière qu’en se scindant.' }
    ],
    enter() { holo.visible = true; },
    leave() { holo.visible = false; },
    update(t) {
      holo.visible = true;
      const tamperedByScroll = t > 0.3 && t < 0.68;
      if (t < 0.68) {
        if (wasTampered !== tamperedByScroll) { apply(tamperedByScroll ? 'Bob → Mallory : 500 jetons' : original); wasTampered = tamperedByScroll; }
      } else if (wasTampered !== 'lab') {
        apply(forced ?? original);
        renderPanel();
        wasTampered = 'lab';
      }
      const o = curve([[0.14, 0], [0.22, 1]], t);
      // La cascade progresse d'un maillon a l'autre
      const bad = chain.blocks[2].hash !== honest[2];
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
