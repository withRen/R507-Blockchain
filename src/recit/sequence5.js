// Sequence 5 : 05 h 20, l'entrepot du port. Validation et minage.
// La hauteur des essais suit la vraie loi : chaque zero de plus est 16 fois plus rare.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { closedRoom, COLORS, glassBlock, plate, rackFaces } from './stage.js';
import { curve } from './timeline.js';
import { createMiner, hashBlock, meetsDifficulty } from '../lib/blockchain.js';

const Y = 20;
const L = (x, y, z) => [x + 200, y + Y, z];
const MONO = '"IBM Plex Mono", Menlo, monospace';
const TRIES = 340;
const UNIT = 0.62;

const rand = (i, c) => { const s = Math.sin(i * 127.1 + c * 311.7) * 43758.5453; return s - Math.floor(s); };

export function createSequence5(ctx) {
  const group = new THREE.Group();
  group.position.set(200, Y, 0);
  ctx.scene.add(group);
  closedRoom(group, {
    W: 18, D: 16, CEIL: 8.4,
    wall: 0x948d84, floor: 0x8a857e, ceil: 0x3f3b36,
    strips: [-9, 9], stripLen: 28, stripColor: [1.3, 0.95, 0.68]
  });

  // Rangees de machines ASIC, charpente metallique de l'entrepot, gaines d'extraction thermique et socles
  const m = new Kit();
  const fronts = [];
  [-14.5, -11.5, 11.5, 14.5].forEach((x) => {
    // Collecteur d'air chaud au-dessus de chaque rangee d'ASIC
    m.box(1.6, 0.65, 27.5, 0x4b4844, { p: [x, 4.9, 0] });
    for (let i = 0; i < 9; i++) {
      const z = -13 + i * 3.25;
      m.box(2, 3.8, 2.9, 0x6a655e, { p: [x, 1.9, z] });
      // Conduit d'extraction vertical reliant la baie au collecteur
      m.box(0.75, 0.85, 0.75, 0x524e49, { p: [x, 4.2, z] });
      fronts.push({ p: [x < 0 ? x + 1.015 : x - 1.015, 1.9, z], r: x < 0 ? Math.PI / 2 : -Math.PI / 2 });
    }
  });

  // Fermes de charpente metallique sous la toiture (8,4 m) et poteaux H
  for (const z of [-12, -6, 0, 6, 12]) {
    m.box(35.6, 0.26, 0.22, 0x3d3a37, { p: [0, 8.12, z] });
    m.box(35.6, 0.16, 0.18, 0x3d3a37, { p: [0, 7.35, z] });
    for (let x = -15; x <= 15; x += 5) {
      m.box(0.14, 0.78, 0.14, 0x47433f, { p: [x, 7.73, z] });
    }
    m.box(0.32, 8.4, 0.32, 0x423e3a, { p: [-17.75, 4.2, z] });
    m.box(0.32, 8.4, 0.32, 0x423e3a, { p: [17.75, 4.2, z] });
  }

  // Socle du bloc candidat et plateforme metallique sous la matrice des 340 essais
  m.box(3.5, 0.12, 1.5, 0x4a4640, { p: [-1.6, 0.06, -2] });
  m.box(7.8, 0.08, 1.6, 0x3d3a36, { p: [4.0, 0.04, -1.55] });
  // Poteaux gradués portant la barre de cible
  m.box(0.09, 3.8, 0.09, 0x59544e, { p: [0.3, 1.9, -2] });
  m.box(0.09, 3.8, 0.09, 0x59544e, { p: [7.7, 1.9, -2] });
  // Encadrement suspendu du grand ecran de hachage
  m.box(6.76, 1.24, 0.08, 0x33302c, { p: [0, 6.5, -4.06] });
  m.box(0.08, 1.9, 0.08, 0x3d3a36, { p: [-2.6, 7.45, -4.06] });
  m.box(0.08, 1.9, 0.08, 0x3d3a36, { p: [2.6, 7.45, -4.06] });

  rackFaces(group, fronts, { accent: '#ff9d32', second: '#66e0a4', w: 2.9, h: 3.8, gain: 1.7 });
  group.add(flat(m));

          
  // Le bloc candidat
  const cand = glassBlock({ w: 3.2, h: 2.1, d: 1.2, tint: COLORS.effort });
  cand.group.position.set(-1.6, 2.6, -2);
  group.add(cand.group);

  // Les essais : chacun saute a la hauteur que son hash lui donne
  const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), new THREE.MeshBasicMaterial({ color: 0xffffff }), TRIES);
  cubes.frustumCulled = false;
  cubes.setColorAt(0, new THREE.Color());
  group.add(cubes);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(7.35, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 2.6, 1.4) }));
  bar.position.set(4, 0, -2);
  group.add(bar);
  const barLabel = plate(2.6, 0.44, 780, 132);
  barLabel.mesh.position.set(6.2, 0, -1.98);
  group.add(barLabel.mesh);

  // Ecran du hash en cours
  const screen = plate(6.6, 1.1, 1500, 250);
  screen.mesh.position.set(0, 6.5, -4);
  group.add(screen.mesh);
  const drawScreen = (nonce, hash, ok) => {
    const { ctx: x, canvas, tex } = screen;
    x.clearRect(0, 0, canvas.width, canvas.height);
    x.fillStyle = 'rgba(12, 9, 6, 0.9)';
    x.fillRect(0, 0, canvas.width, canvas.height);
    x.strokeStyle = ok ? 'rgba(123, 240, 184, 0.65)' : 'rgba(255, 184, 96, 0.45)';
    x.lineWidth = 3;
    x.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    x.fillStyle = '#ffb860';
    x.font = `600 34px ${MONO}`;
    x.fillText(`NONCE  ${nonce.toLocaleString('fr-FR')}`, 36, 58);
    x.textAlign = 'right';
    x.fillStyle = ok ? '#7bf0b8' : '#b89f82';
    x.font = `500 26px ${MONO}`;
    x.fillText(ok ? 'CIBLE ATTEINTE · BLOC VALIDE' : 'RECHERCHE SHA-256 EN COURS', canvas.width - 36, 56);
    x.textAlign = 'left';
    x.fillStyle = ok ? '#7bf0b8' : '#efe6d7';
    x.font = `500 39px ${MONO}`;
    x.fillText(hash.slice(0, 32), 36, 132);
    x.fillText(hash.slice(32), 36, 192);
    tex.needsUpdate = true;
  };

  // ---------- Panneau : le vrai mineur ----------
  const panel = ctx.panel(`
    <h2>À vous : prenez la machine</h2>
    <label for="m-diff">Difficulté : <span id="m-diff-out"></span></label>
    <input id="m-diff" type="range" min="2" max="5" value="3">
    <button id="m-go" type="button">Miner ce bloc</button>
    <div class="stats"><div><small>Essais</small><output id="m-count">0</output></div><div><small>Temps</small><output id="m-time">0,0 s</output></div></div>
    <p id="m-state" class="lab-state" aria-live="polite">Votre navigateur va calculer de vrais SHA-256.</p>
    <button id="m-verify" type="button" class="ghost" disabled>Vérifier comme un nœud (un seul hash)</button>`);
  const $ = (s) => panel.querySelector(s);
  const fr = (n) => n.toLocaleString('fr-FR');
  const showDiff = () => { $('#m-diff-out').textContent = `${$('#m-diff').value} zéros, 1 chance sur ${fr(16 ** Number($('#m-diff').value))}`; setBar(Number($('#m-diff').value)); };
  function setBar(z) {
    bar.position.y = z * UNIT;
    barLabel.mesh.position.y = z * UNIT + 0.28;
    const { ctx: x, canvas, tex } = barLabel;
    x.clearRect(0, 0, canvas.width, canvas.height);
    x.fillStyle = '#7bf0b8';
    x.font = `500 44px ${MONO}`;
    x.textAlign = 'right';
    x.fillText(`CIBLE : ${z} ZÉROS EN TÊTE`, canvas.width - 8, 86);
    tex.needsUpdate = true;
  }
  let miner = null;
  let foundBlock = null;
  let difficulty = 3;
  let mining = false;
  let minedLevel = 0;
  $('#m-diff').addEventListener('input', () => { difficulty = Number($('#m-diff').value); showDiff(); });
  $('#m-go').addEventListener('click', () => {
    if (mining) return;
    foundBlock = { index: 42, parent: '00000a91f3', data: `Alice → Bob : 5 jetons · ${Date.now()}`, nonce: 0 };
    miner = createMiner(foundBlock, difficulty);
    const start = performance.now();
    mining = true;
    minedLevel = 0;
    $('#m-go').disabled = true;
    $('#m-diff').disabled = true;
    $('#m-verify').disabled = true;
    $('#m-state').textContent = 'Aucun raccourci : on change le nonce et on recommence.';
    const tick = () => {
      const done = miner.step(1200);
      $('#m-count').textContent = fr(miner.attempts);
      $('#m-time').textContent = `${((performance.now() - start) / 1000).toFixed(1).replace('.', ',')} s`;
      drawScreen(foundBlock.nonce, miner.lastHash, done);
      if (!done) { requestAnimationFrame(tick); return; }
      mining = false;
      minedLevel = 1;
      $('#m-go').disabled = false;
      $('#m-diff').disabled = false;
      $('#m-verify').disabled = false;
      $('#m-go').textContent = 'Recommencer';
      const lost = miner.attempts - 1;
      $('#m-state').textContent = `Trouvé. Les ${fr(lost)} autres essais ont été jetés, avec l’énergie qu’ils ont coûtée.`;
    };
    requestAnimationFrame(tick);
  });
  $('#m-verify').addEventListener('click', () => {
    const h = hashBlock(foundBlock);
    $('#m-state').textContent = `Un seul calcul : ${h.slice(0, 16)}… commence bien par ${difficulty} zéros (${meetsDifficulty(h, difficulty) ? 'valide' : 'invalide'}). Trouver a demandé ${fr(miner.attempts)} essais.`;
  });
  showDiff();
  drawScreen(0, '—'.repeat(64), false);

  const drawCand = (found) => {
    const { ctx: x, canvas, tex } = cand.face;
    x.clearRect(0, 0, canvas.width, canvas.height);
    x.fillStyle = 'rgba(14, 10, 7, 0.88)';
    x.fillRect(0, 0, canvas.width, canvas.height);
    x.strokeStyle = found ? 'rgba(123, 240, 184, 0.6)' : 'rgba(255, 184, 96, 0.5)';
    x.lineWidth = 3;
    x.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    x.fillStyle = found ? '#7bf0b8' : '#ffb860';
    x.font = `600 38px ${MONO}`;
    x.fillText(found ? 'BLOC VALIDE' : 'BLOC CANDIDAT', 34, 62);
    x.fillStyle = '#f2ece2';
    x.font = `500 36px ${MONO}`;
    ['Récompense → Théo', 'Alice → Bob : 5 jetons', 'Clara → Théo : 12 jetons', 'Frais → Théo'].forEach((s, i) => x.fillText(s, 34, 138 + i * 66));
    tex.needsUpdate = true;
  };
  drawCand(false);
  let candState = null;

  const pos = new THREE.Object3D();
  const col = new THREE.Color();
  const low = new THREE.Color(0x75695a);
  const mid = new THREE.Color(0.85, 0.55, 0.2);
  const win = new THREE.Color(0.3, 0.95, 0.6);

  return {
    name: 'Validation et minage',
    lights: [{ p: [0, 7, 4], color: 0xffc98d, i: 4.5, d: 24 }, { p: [-9, 6, -6], color: 0xffb478, i: 2.8, d: 18 }, { p: [9, 6, -6], color: 0xffb478, i: 2.8, d: 18 }],
    groups: [group],
    panelEl: panel,
    LAB: { from: 0.68, to: 0.92 },
    parent: group,
    actorsDef: {
      theo: {
        track: [{ t: 0, x: 7, z: 3.4, face: -2 }, { t: 0.1, x: 7, z: 0.6, face: -0.9 }, { t: 1, x: 7, z: 0.6, face: -0.9 }],
        armRx: [[0.2, 0], [0.24, 0.5], [0.5, 0.5], [0.54, 0]],
        elbowR: [[0.2, 0.18], [0.24, 1.1], [0.5, 1.1], [0.54, 0.18]]
      },
      alice: { track: [{ t: 0, x: -7, z: 9, face: 2.7 }, { t: 0.1, x: -6.3, z: 0.4, face: 0.9 }, { t: 1, x: -6.3, z: 0.4, face: 0.9 }] },
      ines: { track: [{ t: 0, x: -9, z: 8.5, face: 2.7 }, { t: 0.12, x: -7.8, z: 1, face: 0.8 }, { t: 1, x: -7.8, z: 1, face: 0.8 }] }
    },
    CAMERA: [
      { t: 0, pos: L(-3, 2.4, 15), look: L(0, 2, 0), fov: 42 },
      { t: 0.14, pos: L(-0.5, 2.3, 12), look: L(-0.5, 1.9, 0), fov: 42 },
      { t: 0.3, pos: L(-1.6, 2.7, 5.4), look: L(-1.6, 2.5, -2), fov: 38 },
      { t: 0.44, pos: L(3.6, 2.5, 7.4), look: L(3.6, 2.2, -2), fov: 38 },
      { t: 0.6, pos: L(1, 3.6, 8.4), look: L(0, 3.8, -3), fov: 42 },
      { t: 0.7, pos: L(-1.9, 3.45, 10), look: L(-1.9, 3.3, -2), fov: 42 },
      { t: 0.92, pos: L(-1.9, 3.45, 10), look: L(-1.9, 3.3, -2), fov: 42 },
      { t: 1, pos: L(-1, 2.4, 11), look: L(0, 2, 0), fov: 42 }
    ],
    SLUGS: [{ from: 0.005, to: 1, time: '05 h 20', place: 'Entrepôt du port, ferme de minage' }],
    LINES: [
      { from: 0.03, to: 0.13, who: 'Inès', text: 'Deux métiers. La validation : tous les nœuds vérifient les signatures et que les fonds n’ont pas déjà été dépensés.' },
      { from: 0.14, to: 0.26, who: 'Inès', text: 'Le minage : gagner le droit de proposer le bloc suivant. C’est le travail de Théo Marchetti.' },
      { from: 0.27, to: 0.38, who: 'Théo', text: 'Je prends les transactions en attente, je fais un bloc candidat. Si je gagne, je touche une récompense et les frais.' },
      { from: 0.39, to: 0.5, who: 'Alice', text: 'Et vos machines, elles résolvent quoi ?' },
      { from: 0.5, to: 0.6, who: 'Théo', text: 'Rien. Je change le nonce, je recalcule le hash, je recommence, jusqu’à passer sous la cible. C’est une loterie.' },
      { from: 0.6, to: 0.68, who: 'Inès', text: 'Trouver prend des milliards d’essais. Vérifier ne prend qu’un hash. Voilà ce qui coûte si cher à Mallory : refaire ce travail.' },
      { from: 0.93, to: 1, who: 'Alice', text: 'Et tout ça consomme combien ?' }
    ],
    TERMS: [
      { from: 0.04, to: 0.13, label: 'Notion', title: 'Validation', def: 'La vérification d’une transaction ou d’un bloc. Tous les nœuds la font, pas seulement les mineurs.' },
      { from: 0.27, to: 0.38, label: 'Bitcoin', title: 'Récompense et frais', def: 'Le mineur gagnant reçoit de nouveaux bitcoins et les frais des transactions. Sans cela, personne ne paierait l’électricité.' },
      { from: 0.5, to: 0.6, label: 'Notion', title: 'Preuve de travail (PoW)', def: 'Chercher un nonce qui donne un hash assez petit. La seule méthode est d’essayer, encore et encore.' },
      { from: 0.6, to: 0.68, label: 'Notion', title: 'Difficulté', def: 'Plus elle est élevée, plus il faut d’essais. Sur Bitcoin, elle s’ajuste pour garder environ un bloc toutes les 10 minutes.' },
      { from: 0.93, to: 1, label: 'Note d’audit', title: 'Le revers', def: 'Environ 138 TWh par an pour Bitcoin selon Cambridge, soit environ 0,5 % de l’électricité mondiale. Tout ce qui ne franchit pas la cible est jeté.' }
    ],
    update(t, time) {
      const speed = mining ? 3.2 : 1;
      const reveal = curve([[0.26, 0], [0.31, 1]], t);
      cand.setOpacity(reveal);
      const found = minedLevel > 0;
      if (found !== candState) { candState = found; drawCand(found); cand.setTint(found ? COLORS.ok : COLORS.effort); }
      const on = t > 0.42;
      cubes.visible = on;
      bar.visible = on;
      barLabel.mesh.visible = on;
      screen.mesh.visible = t > 0.48;
      if (on) {
        const zLevel = bar.position.y;
        for (let i = 0; i < TRIES; i++) {
          const phase = (time * speed * (0.55 + rand(i, 0.3) * 0.5) + rand(i, 1.1)) % 1;
          const cycle = Math.floor(time * speed * (0.55 + rand(i, 0.3) * 0.5) + rand(i, 1.1));
          const h = (-Math.log(Math.max(1e-9, rand(i, cycle))) / Math.log(16)) * UNIT;
          const y = 0.08 + h * Math.sin(Math.PI * phase);
          pos.position.set(0.5 + (i % 34) * 0.21 + (Math.floor(i / 34) % 2) * 0.1, y, -2 + Math.floor(i / 34) * 0.1);
          const crossed = h >= zLevel && y >= zLevel * 0.8;
          pos.scale.setScalar(crossed ? 2 : 1);
          pos.updateMatrix();
          cubes.setMatrixAt(i, pos.matrix);
          col.copy(h >= zLevel ? win : h > zLevel * 0.5 ? mid : low);
          cubes.setColorAt(i, col);
        }
        cubes.instanceMatrix.needsUpdate = true;
        cubes.instanceColor.needsUpdate = true;
      }
    }
  };
}
