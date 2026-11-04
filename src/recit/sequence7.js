// Sequence 7 : 06 h 40, le parking de la tour Kern. Cycle de vie d'une transaction, puis attaque.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { place, textured } from './assets.js';
import { surface } from './assets.js';
import { closedRoom, COLORS, metalSurface, plate, rackFaces } from './stage.js';
import { curve, smooth } from './timeline.js';
import { attackerSuccessProbability } from '../lib/blockchain.js';

const OX = -200;
const OY = 2;
const L = (x, y, z) => [x + OX, y + OY, z];
const MONO = '"IBM Plex Mono", Menlo, monospace';
const STEPS = ['Création', 'Signature', 'Propagation', 'Validation', 'Mempool', 'Inclusion dans un bloc', 'Confirmations'];

function cube(tint) {
  const g = new THREE.BoxGeometry(0.92, 0.92, 0.92);
  const glass = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: tint, transparent: true, opacity: 0.32, roughness: 0.7, depthWrite: false }));
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(2.3), transparent: true }));
  const group = new THREE.Group();
  group.add(glass, edge);
  return {
    group,
    set(hex, o) {
      group.visible = o > 0.01;
      glass.material.color.setHex(hex);
      glass.material.opacity = 0.32 * o;
      edge.material.color.setHex(hex).multiplyScalar(2.3);
      edge.material.opacity = o;
    }
  };
}

export function createSequence7(ctx) {
  const group = new THREE.Group();
  group.position.set(OX, OY, 0);
  ctx.scene.add(group);
  closedRoom(group, { W: 17, D: 14, CEIL: 4.2, wall: 0x8d9097, floor: 0x7d8087, ceil: 0x4a4c52, tileFloor: 4, tileWall: 4.2, strips: [-10, 0, 10], stripLen: 24, stripColor: [0.72, 0.8, 0.9] });
  const k = new Kit();
  for (const x of [-14.5, 14.5]) for (let z = -9; z <= 9; z += 6) k.box(0.9, 4.2, 0.9, 0x8d9097, { p: [x, 2.1, z] });
  for (let x = -14; x <= 14; x += 7) k.box(0.9, 4.2, 0.9, 0x8d9097, { p: [x, 2.1, -9] });
  group.add(textured(k, surface('concrete_wall_006', { normalScale: 0.8 }), 4));
  place(group, 'rollershutter_door', [{ p: [-8.5, 0, -13.75] }, { p: [-3.2, 0, -13.75] }]);
  place(group, 'utility_box_01', [{ p: [2.8, 0, -13.5] }, { p: [4, 0, -13.5] }]);
  place(group, 'worn_metal_rack', [{ p: [-16, 0, 2], r: Math.PI / 2, s: 1.15 }, { p: [-16, 0, 5], r: Math.PI / 2, s: 1.15 }]);
  place(group, 'plastic_crate_01', [{ p: [12.6, 0, 3.4], r: 0.4, s: 1.6 }, { p: [13.2, 0, 4.1], r: 1, s: 1.6 }]);
  // Marquage au sol
  const lines = new Kit();
  for (let i = -6; i <= 6; i++) lines.box(0.07, 0.01, 5, 0x6d7482, { p: [i * 2.6, 0.012, 9.2] });
  group.add(lines.mesh(new THREE.MeshBasicMaterial({ vertexColors: true }), { cast: false }));
  // Les machines cachees de Mallory, au fond, en rouge
  const rack = new Kit();
  const fronts = [];
  for (let i = 0; i < 6; i++) {
    const z = -7.5 + i * 2.2;
    rack.box(1.2, 3.4, 1.9, 0x5c5759, { p: [15.6, 1.7, z] });
    fronts.push({ p: [14.985, 1.7, z], r: -Math.PI / 2 });
  }
  group.add(textured(rack, metalSurface(), 1.3));
  rackFaces(group, fronts, { accent: '#ff463c', second: '#ff8a5c', w: 1.9, h: 3.4, gain: 1.9 });

  // ---------- Hologramme : chaine publique et chaine secrete ----------
  const X0 = -7.4;
  const SP = 1.45;
  // Fond sombre derriere l'hologramme, pour le lire d'un coup d'oeil
  const backing = new THREE.Mesh(new THREE.PlaneGeometry(21, 3.9), new THREE.MeshBasicMaterial({ color: 0x05070c, transparent: true, opacity: 0.72, depthWrite: false }));
  backing.position.set(-0.5, 2.05, -3.7);
  group.add(backing);
  const pub = Array.from({ length: 11 }, (_, i) => { const c = cube(COLORS.ok); c.group.position.set(X0 + i * SP, 2.85, -3); group.add(c.group); return c; });
  const sec = Array.from({ length: 11 }, (_, i) => { const c = cube(COLORS.bad); c.group.position.set(X0 + i * SP, 1.2, -3); group.add(c.group); return c; });

  const rowLabel = (text, color, y) => {
    const p = plate(6.4, 0.42, 1520, 100);
    p.ctx.fillStyle = color;
    p.ctx.font = `500 62px ${MONO}`;
    p.ctx.fillText(text, 6, 74);
    p.tex.needsUpdate = true;
    p.mesh.position.set(X0 + 2.7, y, -2.5);
    group.add(p.mesh);
    return p;
  };
  const lblPub = rowLabel('CHAÎNE PUBLIQUE', '#7bf0b8', 3.56);
  const lblSec = rowLabel('CHAÎNE SECRÈTE DE MALLORY', '#ff8b82', 0.5);

  const counter = plate(2.8, 0.52, 840, 156);
  counter.mesh.position.set(5.2, 3.72, -2.5);
  group.add(counter.mesh);
  let lastCount = -1;
  const drawCounter = (n) => {
    if (n === lastCount) return;
    lastCount = n;
    const c = counter.ctx;
    c.clearRect(0, 0, 840, 156);
    c.fillStyle = '#eef1f8';
    c.font = `500 58px ${MONO}`;
    c.textAlign = 'right';
    c.fillText(`${n} confirmation${n > 1 ? 's' : ''}`, 830, 96);
    counter.tex.needsUpdate = true;
  };

  // Le mempool : des transactions qui attendent, et celle d'Alice en bleu
  const tiles = new Kit();
  const r = (i, m) => { const s = Math.sin(i * 12.9 + m * 78.2) * 43758.5; return s - Math.floor(s); };
  const TILE_POS = [];
  for (let i = 0; i < 22; i++) {
    const p = [-1.2 + r(i, 1) * 6, 0.8 + r(i, 2) * 2.6, -1.4 + r(i, 3) * 0.8];
    TILE_POS.push(p);
    tiles.box(0.42, 0.24, 0.02, 0x8591a8, { p });
  }
  const tilesMesh = tiles.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true }), { cast: false });
  group.add(tilesMesh);
  const aliceTx = plate(1.8, 0.5, 720, 200);
  const a = aliceTx.ctx;
  a.fillStyle = 'rgba(40,58,190,0.95)';
  a.fillRect(0, 0, 720, 200);
  a.fillStyle = '#ffffff';
  a.font = `500 44px ${MONO}`;
  a.fillText('Alice → Bob : 5', 34, 76);
  a.font = `500 30px ${MONO}`;
  a.fillStyle = '#c9d4ff';
  a.fillText('signé par sa clé privée', 34, 146);
  aliceTx.tex.needsUpdate = true;
  group.add(aliceTx.mesh);

  // ---------- Etapes du cycle de vie ----------
  const stepsEl = ctx.panel(`<h2>Le voyage du paiement d’Alice</h2><ol class="steps">${STEPS.map((s) => `<li>${s}</li>`).join('')}</ol>`, 'lab steps-panel');
  const stepItems = [...stepsEl.querySelectorAll('li')];
  let lastStep = -2;

  // ---------- Panneau : la decision de Bob ----------
  const panel = ctx.panel(`
    <h2>À vous : décidez pour Bob</h2>
    <label for="o-q">Puissance de Mallory : <span id="o-q-out"></span></label>
    <input id="o-q" type="range" min="5" max="60" value="30">
    <label for="o-z">Blocs attendus par Bob : <span id="o-z-out"></span></label>
    <input id="o-z" type="range" min="1" max="12" value="6">
    <p class="lab-out-label">Chances de réussite de Mallory</p>
    <output id="o-out" class="big-num"></output>
    <p id="o-state" class="lab-state" aria-live="polite"></p>`);
  const $ = (s) => panel.querySelector(s);
  const refresh = () => {
    const q = Number($('#o-q').value) / 100;
    const z = Number($('#o-z').value);
    $('#o-q-out').textContent = `${$('#o-q').value} %`;
    $('#o-z-out').textContent = `${z}`;
    const p = attackerSuccessProbability(q, z);
    $('#o-out').textContent = p >= 0.995 ? '100 %' : p < 0.001 ? '< 0,1 %' : `${(p * 100).toFixed(p < 0.1 ? 1 : 0).replace('.', ',')} %`;
    $('#o-state').textContent = q >= 0.5
      ? 'Avec la majorité de la puissance, elle finit toujours par rattraper la chaîne publique.'
      : 'Pas de seuil magique à 51 % : le risque baisse à chaque bloc attendu, et monte avec la puissance de Mallory. Formule du livre blanc de Bitcoin, section 11.';
  };
  $('#o-q').addEventListener('input', refresh);
  $('#o-z').addEventListener('input', refresh);
  refresh();

  return {
    name: 'Attaque',
    lights: [{ p: [-1, 3.8, 3.5], color: 0xc9d6ff, i: 9, d: 26 }, { p: [12, 2.8, -3], color: 0xff5b4c, i: 7, d: 16 }, { p: [-10, 3.8, 3], color: 0xc9d6ff, i: 5, d: 18 }],
    groups: [group],
    panelEl: panel,
    LAB: { from: 0.8, to: 0.94 },
    parent: group,
    actorsDef: {
      alice: { track: [{ t: 0, x: -6.5, z: 2.8, face: 2.9 }, { t: 0.4, x: -6.5, z: 2.8, face: 2.9 }, { t: 0.44, x: 3.6, z: 2.8, face: -1 }, { t: 1, x: 3.6, z: 2.8, face: -1 }] },
      ines: { track: [{ t: 0, x: -8, z: 3, face: 2.7 }, { t: 1, x: -8, z: 3, face: 2.7 }] },
      bob: { track: [{ t: 0.3, x: 10, z: 8, face: -2.6 }, { t: 0.4, x: 5.2, z: 3, face: 1.1 }, { t: 1, x: 5.2, z: 3, face: -2 }] },
      mallory: { track: [{ t: 0.3, x: 13, z: -1, face: -1.4 }, { t: 0.46, x: 10.6, z: -2.2, face: -1.25 }, { t: 1, x: 10.6, z: -2.2, face: -1.25 }] }
    },
    CAMERA: [
      { t: 0, pos: L(-5.1, 2.2, 13), look: L(-5.1, 2.1, -3), fov: 42 },
      { t: 0.28, pos: L(-5.1, 2.2, 12), look: L(-5.1, 2.1, -3), fov: 42 },
      { t: 0.4, pos: L(0.6, 2.3, 10.5), look: L(0.6, 2, -3), fov: 50 },
      { t: 0.78, pos: L(0.6, 2.4, 10.5), look: L(0.6, 1.95, -3), fov: 50 },
      { t: 0.84, pos: L(-4.4, 2.4, 11), look: L(-4.4, 2, -3), fov: 50 },
      { t: 0.94, pos: L(-4.4, 2.4, 11), look: L(-4.4, 2, -3), fov: 50 },
      { t: 1, pos: L(5, 2, 7), look: L(10.5, 1.5, -2.2), fov: 36 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '06 h 40', place: 'Parking de la tour Kern' }],
    LINES: [
      { from: 0.02, to: 0.09, who: 'Inès', text: 'Reprenons le paiement d’Alice. Elle le crée, puis le signe avec sa clé privée : ça prouve qu’il vient d’elle, sans révéler la clé.' },
      { from: 0.095, to: 0.16, who: 'Inès', text: 'Il se propage de nœud en nœud. Chacun vérifie la signature et que les fonds n’ont pas déjà été dépensés.' },
      { from: 0.165, to: 0.23, who: 'Inès', text: 'Valide, il attend dans le mempool. Les mineurs prennent d’abord ce qui paie le plus de frais.' },
      { from: 0.235, to: 0.3, who: 'Inès', text: 'Il entre dans un bloc : première confirmation. Chaque bloc ajouté par-dessus en ajoute une autre.' },
      { from: 0.31, to: 0.39, who: 'Bob', text: 'Mallory m’achète ma flotte de camions pour 500 jetons. Le paiement apparaît déjà. Je livre.' },
      { from: 0.4, to: 0.47, who: 'Alice', text: 'Attendez. Regardez d’abord ce qu’il y a sous vos pieds.' },
      { from: 0.48, to: 0.56, who: 'Inès', vo: true, text: 'Au sous-sol, Mallory mine en secret une autre histoire, où ces 500 jetons lui reviennent : une double dépense.' },
      { from: 0.565, to: 0.655, who: 'Inès', vo: true, text: 'Si Bob livre trop tôt : elle dévoile une chaîne qui représente plus de travail. Les nœuds basculent, et son paiement disparaît.' },
      { from: 0.67, to: 0.785, who: 'Inès', vo: true, text: 'Si Bob attend six confirmations : la chaîne publique, plus puissante, prend de l’avance. Mallory abandonne et perd l’électricité dépensée.' },
      { from: 0.945, to: 1, who: 'Mallory', text: 'Tant de calcul, pour rien.' }
    ],
    TERMS: [
      { from: 0.03, to: 0.09, label: 'Notion', title: 'Clé privée et signature', def: 'La clé privée signe la transaction : tout le monde peut vérifier la signature, personne ne peut la refaire sans la clé.' },
      { from: 0.17, to: 0.23, label: 'Notion', title: 'Mempool', def: 'La liste des transactions valides en attente. Y figurer ne veut pas dire que le paiement est acquis.' },
      { from: 0.24, to: 0.39, label: 'Notion', title: 'Confirmation', def: 'Le bloc de la transaction compte pour 1, chaque bloc au-dessus ajoute 1. Plus il y en a, plus l’annulation est improbable.' },
      { from: 0.485, to: 0.56, label: 'Notion', title: 'Double dépense', def: 'Dépenser deux fois les mêmes fonds. Seule une version de l’histoire sera retenue par le réseau.' },
      { from: 0.57, to: 0.655, label: 'Notion', title: 'Réorganisation', def: 'Les nœuds suivent la chaîne qui représente le plus de travail cumulé. S’ils changent de branche, les blocs de l’autre branche sont abandonnés.' },
      { from: 0.945, to: 1, label: 'Note d’audit', title: 'Les limites de l’attaque', def: 'Elle n’annule que ses propres paiements récents, sans créer de monnaie ni voler n’importe qui. Ethereum Classic et Bitcoin Gold ont subi de vraies attaques de ce type.' }
    ],
    update(t, time) {
      // Cycle de vie : panneau d'etapes et trajet de la transaction d'Alice
      const stepTimes = [0.02, 0.05, 0.095, 0.13, 0.165, 0.235, 0.27];
      let step = -1;
      stepTimes.forEach((s, i) => { if (t >= s) step = i; });
      const stepsOn = t < 0.305;
      stepsEl.classList.toggle('on', stepsOn);
      if (step !== lastStep) {
        lastStep = step;
        stepItems.forEach((el, i) => { el.className = i < step ? 'done' : i === step ? 'now' : ''; });
      }
      const mp = curve([[0.15, 0], [0.18, 1], [0.27, 1], [0.3, 0]], t);
      tilesMesh.visible = mp > 0.01;
      tilesMesh.material.opacity = mp;
      tilesMesh.position.y = Math.sin(time * 0.4) * 0.03;

      const txO = curve([[0.03, 0], [0.05, 1], [0.235, 1], [0.255, 0]], t);
      aliceTx.mesh.visible = txO > 0.01;
      aliceTx.mesh.material.opacity = txO;
      const toBlock = smooth((t - 0.21) / 0.04);
      aliceTx.mesh.position.set(1.4 + toBlock * (X0 + 3 * SP - 1.4), 2 + toBlock * 0.85, -1 - toBlock * 2);

      // Chaine publique et chaine secrete
      let nPub = 3 + Math.floor(curve([[0.235, 1], [0.3, 4.9]], t));
      let nSec = 0;
      let forkAt = 8;
      let reorg = 0;
      let abandon = 0;
      if (t >= 0.305 && t < 0.66) {
        // Paiement de Mallory : le bloc 5 de la chaine publique. Elle mine depuis le bloc 4.
        forkAt = 4;
        nPub = 5 + Math.floor(curve([[0.36, 0], [0.56, 1.9]], t));
        nSec = Math.floor(curve([[0.46, 0], [0.62, 4.9]], t));
        reorg = smooth((t - 0.62) / 0.03);
      } else if (t >= 0.66) {
        forkAt = 4;
        nPub = 5 + Math.floor(curve([[0.665, 0], [0.78, 5.9]], t));
        nSec = Math.floor(curve([[0.665, 0], [0.76, 2.9]], t));
        abandon = smooth((t - 0.78) / 0.03);
      }
      const payment = t >= 0.305 ? 4 : 3;
      pub.forEach((c, i) => {
        const shown = i < nPub ? 1 : 0;
        let color = COLORS.ok;
        if (i === payment) color = COLORS.info;
        if (reorg > 0 && i >= forkAt) color = COLORS.dim;
        c.set(color, shown * (reorg > 0 && i >= forkAt ? 1 - reorg * 0.7 : 1));
      });
      sec.forEach((c, i) => {
        const on = i >= forkAt && i < forkAt + nSec;
        const col = reorg > 0.5 ? COLORS.ok : COLORS.bad;
        c.set(col, on ? 1 - abandon * 0.9 : 0);
      });
      lblSec.mesh.material.opacity = t > 0.46 ? 1 - abandon * 0.8 : 0;
      lblPub.mesh.material.opacity = t > 0.2 ? 1 : 0;
      lblSec.mesh.visible = t > 0.46;
      lblPub.mesh.visible = t > 0.2;
      const conf = t >= 0.66 ? nPub - 4 : t >= 0.305 ? nPub - 4 : Math.max(0, nPub - 3);
      counter.mesh.visible = t > 0.235;
      drawCounter(reorg > 0.5 ? 0 : conf);
    }
  };
}
