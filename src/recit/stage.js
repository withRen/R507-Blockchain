// Accessoires communs aux sequences : ecrans, blocs de verre et d'acier, chaine reelle, salles.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { hashBlock } from '../lib/blockchain.js';

export const COLORS = { ok: 0x35c98a, bad: 0xff4f45, info: 0x5b74ff, effort: 0xe89a2c, stake: 0x1fb4ba, authority: 0x8f73ee, dim: 0x59616f };
const MONO = '"IBM Plex Mono", Menlo, monospace';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';

export function plate(w, h, cw, ch) {
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })
  );
  return { canvas, tex, mesh, ctx: canvas.getContext('2d') };
}

// Un bloc de verre : un volume teinte, ses aretes et une face ou s'affiche son contenu
export function glassBlock({ w = 3, h = 1.9, d = 0.85, tint = COLORS.info } = {}) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const glass = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity: 0.14, depthWrite: false }));
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(1.6), transparent: true })
  );
  const face = plate(w - 0.08, h - 0.08, 840, Math.round((840 * (h - 0.08)) / (w - 0.08)));
  face.mesh.position.z = d / 2 + 0.016;
  group.add(glass, edges, face.mesh);
  return {
    group, glass, edges, face,
    setTint(hex) {
      glass.material.color.setHex(hex);
      edges.material.color.setHex(hex).multiplyScalar(1.6);
    },
    setOpacity(o) {
      group.visible = o > 0.004;
      glass.material.opacity = 0.14 * o;
      edges.material.opacity = o;
      face.mesh.material.opacity = o;
    }
  };
}

const shortHash = (h) => `${h.slice(0, 16)}…`;

export function drawChainFace(block, b, i, { parentOk = true, editedData = false } = {}) {
  const { ctx, canvas, tex } = block.face;
  const W = canvas.width;
  const H = canvas.height;
  const state = parentOk ? '#35c98a' : '#ff5a50';
  ctx.fillStyle = '#10141c';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = state;
  ctx.fillRect(0, 0, W, 8);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 42px ${SANS}`;
  ctx.fillText(`Bloc ${i + 1}`, 44, 76);
  ctx.textAlign = 'right';
  ctx.fillStyle = state;
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(parentOk ? 'Lien valide' : 'Lien rompu', W - 44, 74);
  ctx.textAlign = 'left';

  const row = (label, value, y, color) => {
    ctx.fillStyle = '#8a93a3';
    ctx.font = `400 26px ${SANS}`;
    ctx.fillText(label, 44, y);
    let size = 36;
    ctx.font = `500 ${size}px ${MONO}`;
    while (ctx.measureText(value).width > W - 88 && size > 18) {
      size -= 2;
      ctx.font = `500 ${size}px ${MONO}`;
    }
    ctx.fillStyle = color;
    ctx.fillText(value, 44, y + 46);
  };
  const step = (H - 110) / 3;
  row('Hash du bloc parent', shortHash(b.parent), 110 + step * 0.32, parentOk ? '#c9d2e2' : '#ff5a50');
  row('Données', b.data, 110 + step * 1.32, editedData ? '#ffb347' : '#ffffff');
  row('Hash du bloc', shortHash(b.hash), 110 + step * 2.32, state);

  tex.needsUpdate = true;
}

// Une petite chaine reelle : les hashes sont vraiment calcules
export const TXS = ['Alice → Bob : 5 jetons', 'Clara → Théo : 12 jetons', 'Bob → Mallory : 5 jetons', 'Théo → Alice : 3 jetons', 'Hélène → Clara : 8 jetons'];
export function createChain(txs = TXS) {
  const blocks = [];
  let parent = '0'.repeat(64);
  txs.forEach((data, i) => {
    const b = { index: i + 1, parent, data, nonce: 1000 + i * 37 };
    b.hash = hashBlock(b);
    parent = b.hash;
    blocks.push(b);
  });
  const original = blocks.map((b) => ({ ...b }));
  return {
    blocks,
    rehash() { blocks.forEach((b) => { b.hash = hashBlock(b); }); },
    linkOk: (i) => blocks[i + 1].parent === blocks[i].hash,
    reset() { original.forEach((o, i) => Object.assign(blocks[i], o)); },
    firstBroken() { for (let i = 0; i < blocks.length - 1; i++) if (blocks[i + 1].parent !== blocks[i].hash) return i; return -1; }
  };
}

// Le lien entre deux blocs : un simple trait
export function filament(a, b, hex = COLORS.ok) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, d.length(), 8),
    new THREE.MeshBasicMaterial({ color: hex, transparent: true, toneMapped: false })
  );
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return m;
}

// Salle fermee : sol, plafond, murs, plinthes et bandeaux lumineux carrosses
export function closedRoom(group, {
  W, D, CEIL,
  wall = 0x8a8d93, floor = 0x8a8d93, ceil = 0x5a5d63,
  strips = [], stripLen, stripColor = [0.9, 0.96, 1.1]
}) {
  const f = new Kit();
  f.box(W * 2, 0.1, D * 2, floor, { p: [0, -0.05, 0] });
  const k = new Kit();
  k.box(W * 2, 0.1, D * 2, ceil, { p: [0, CEIL + 0.05, 0] });
  k.box(0.2, CEIL, D * 2, wall, { p: [-W, CEIL / 2, 0] });
  k.box(0.2, CEIL, D * 2, wall, { p: [W, CEIL / 2, 0] });
  k.box(W * 2, CEIL, 0.2, wall, { p: [0, CEIL / 2, -D] });
  k.box(W * 2, CEIL, 0.2, wall, { p: [0, CEIL / 2, D] });
  group.add(
    flat(f),
    flat(k)
  );

  const plinth = new Kit();

  if (strips.length) {
    const s = new Kit();
    const len = stripLen ?? D * 1.7;
    strips.forEach((x) => {
      plinth.box(0.22, 0.04, len + 0.08, 0x2f343d, { p: [x, CEIL - 0.015, 0] });
      s.box(0.14, 0.03, len, 0xffffff, { p: [x, CEIL - 0.03, 0] });
    });
    group.add(s.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(...stripColor) }), { cast: false }));
  }
  if (plinth.parts.length) group.add(flat(plinth));
  return k;
}

// Face avant d'une baie : des unites sombres et quelques diodes
function rackTexture(accent, second) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#0b0d12';
  x.fillRect(0, 0, 256, 512);
  const pick = (i, j) => { const s = Math.sin(i * 12.9 + j * 78.2) * 43758.5; return s - Math.floor(s); };
  for (let u = 0; u < 10; u++) {
    const y = 10 + u * 50;
    x.fillStyle = '#1a1e26';
    x.fillRect(14, y, 228, 40);
    for (let l = 0; l < 4; l++) {
      if (pick(u, l) < 0.3) continue;
      x.fillStyle = pick(l, u + 3) > 0.7 ? second : accent;
      x.fillRect(30 + l * 18, y + 17, 10, 6);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function rackFaces(group, spots, { accent = '#7c93ff', second = '#62d6a0', w = 2.3, h = 3.5, gain = 1.55 } = {}) {
  const mesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: rackTexture(accent, second), color: new THREE.Color(gain, gain, gain), side: THREE.DoubleSide }),
    spots.length
  );
  const d = new THREE.Object3D();
  spots.forEach(({ p, r, flip }, i) => {
    d.position.set(...p);
    d.rotation.set(0, r, 0);
    d.scale.set(1, flip ? -1 : 1, 1);
    d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix);
  });
  mesh.computeBoundingSphere();
  group.add(mesh);
  return mesh;
}
