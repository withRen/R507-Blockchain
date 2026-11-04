// Accessoires communs aux sequences : ecrans, blocs de verre, chaine reelle, salles.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { hashBlock } from '../lib/blockchain.js';
import { surface, textured } from './assets.js';

export const COLORS = { ok: 0x35c98a, bad: 0xff4f45, info: 0x5b74ff, effort: 0xe89a2c, stake: 0x1fb4ba, authority: 0x8f73ee, dim: 0x59616f };
const MONO = '"IBM Plex Mono", Menlo, monospace';

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

// Un bloc de verre, avec une face ou s'affiche son contenu
export function glassBlock({ w = 3, h = 1.9, d = 1.3, tint = COLORS.info } = {}) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const glass = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: tint, transparent: true, opacity: 0.2, roughness: 0.75, depthWrite: false }));
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(2.2), transparent: true }));
  const face = plate(w - 0.08, h - 0.08, 840, Math.round((840 * (h - 0.08)) / (w - 0.08)));
  face.mesh.position.z = d / 2 + 0.012;
  group.add(glass, edges, face.mesh);
  const api = {
    group, glass, edges, face,
    setTint(hex) {
      glass.material.color.setHex(hex);
      edges.material.color.setHex(hex).multiplyScalar(2.2);
    },
    setOpacity(o) {
      group.visible = o > 0.004;
      glass.material.opacity = 0.2 * o;
      edges.material.opacity = o;
      face.mesh.material.opacity = o;
    }
  };
  return api;
}

const shortHash = (h) => `${h.slice(0, 12)}…`;

export function drawChainFace(block, b, i, { parentOk = true, editedData = false, small = false } = {}) {
  const { ctx, canvas, tex } = block.face;
  const W = canvas.width;
  ctx.clearRect(0, 0, W, canvas.height);
  ctx.fillStyle = 'rgba(7,11,24,0.86)';
  ctx.fillRect(0, 0, W, canvas.height);
  const row = (label, value, y, color = '#eef1f8') => {
    ctx.fillStyle = '#8f9bb5';
    ctx.font = `500 ${small ? 34 : 29}px ${MONO}`;
    ctx.fillText(label, 34, y);
    ctx.fillStyle = color;
    ctx.font = `500 ${small ? 44 : 46}px ${MONO}`;
    let size = small ? 44 : 46;
    while (ctx.measureText(value).width > W - 68 && size > 20) { size -= 2; ctx.font = `500 ${size}px ${MONO}`; }
    ctx.fillText(value, 34, y + (small ? 50 : 44));
  };
  ctx.fillStyle = '#ffffff';
  ctx.font = `500 ${small ? 46 : 38}px ${MONO}`;
  ctx.fillText(`BLOC ${i + 1}`, 34, 62);
  row('HASH DU BLOC PARENT', shortHash(b.parent), 124, parentOk ? '#cdd6ea' : '#ff8b82');
  row('DONNÉES', b.data, small ? 240 : 270, editedData ? '#ffc56e' : '#eef1f8');
  row('HASH DU BLOC', shortHash(b.hash), small ? 368 : 416, '#6fe3ae');
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

// Un filament entre deux points, dont la couleur dit si le lien est bon
export function filament(a, b, hex = COLORS.ok) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, d.length(), 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(1.7), transparent: true }));
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return m;
}

// Salle fermee : sol, plafond et murs, plus bandeaux de plafond
export function closedRoom(group, { W, D, CEIL, wall = 0x8a8d93, floor = 0x8a8d93, ceil = 0x5a5d63, floorTex = 'concrete_floor_worn_001', wallTex = 'concrete_wall_006', tileFloor = 3, tileWall = 3, strips = [], stripLen, stripColor = [0.9, 0.96, 1.1] }) {
  const f = new Kit();
  f.box(W * 2, 0.1, D * 2, floor, { p: [0, -0.05, 0] });
  const k = new Kit();
  k.box(W * 2, 0.1, D * 2, ceil, { p: [0, CEIL + 0.05, 0] });
  k.box(0.2, CEIL, D * 2, wall, { p: [-W, CEIL / 2, 0] });
  k.box(0.2, CEIL, D * 2, wall, { p: [W, CEIL / 2, 0] });
  k.box(W * 2, CEIL, 0.2, wall, { p: [0, CEIL / 2, -D] });
  k.box(W * 2, CEIL, 0.2, wall, { p: [0, CEIL / 2, D] });
  group.add(textured(f, surface(floorTex, { normalScale: 0.8 }), tileFloor));
  group.add(textured(k, surface(wallTex, { normalScale: 0.8 }), tileWall));
  if (strips.length) {
    const s = new Kit();
    strips.forEach((x) => s.box(0.14, 0.03, stripLen ?? D * 1.7, 0xffffff, { p: [x, CEIL - 0.02, 0] }));
    group.add(s.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(...stripColor) }), { cast: false }));
  }
  return k;
}

export const metalSurface = () => surface('metal_plate_02', { metalness: 0.8, roughness: 0.9, normalScale: 0.4 });
