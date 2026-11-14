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
// Le gabarit unique du bloc : memes proportions dans toutes les sequences
export const BLOCK = { w: 3.05, h: 2.1, d: 0.85 };

export function glassBlock({ w = BLOCK.w, h = BLOCK.h, d = BLOCK.d, tint = COLORS.info } = {}) {
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
    // L'etat du bloc se lit sur ses aretes : le verre garde toujours la meme teinte
    setTint(hex) {
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
const PHOSPHOR = '#ffe9b8';
const PH_DIM = '#a8946a';
const DISPLAY = '"VT323", "IBM Plex Mono", monospace';

// Fond d'ecran a tube : noir chaud, lignes de balayage, vignette, coins en equerre
export function crtBackdrop(ctx, W, H, accent = PHOSPHOR) {
  ctx.fillStyle = '#080603';
  ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  v.addColorStop(0, 'rgba(255, 214, 140, 0.05)');
  v.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.5);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  const L = 34;
  const m = 14;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y);
    ctx.stroke();
  });
}

export function drawChainFace(block, b, i, { parentOk = true, editedData = false } = {}) {
  const { ctx, canvas, tex } = block.face;
  const W = canvas.width;
  const H = canvas.height;
  const state = parentOk ? '#4fe3a1' : '#ff6b60';
  crtBackdrop(ctx, W, H, parentOk ? PHOSPHOR : '#ff6b60');

  // Bandeau d'en-tete en video inverse, comme un menu de magnetoscope
  ctx.fillStyle = PHOSPHOR;
  ctx.fillRect(34, 34, W - 68, 70);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0c0905';
  ctx.font = `400 62px ${DISPLAY}`;
  ctx.fillText(`BLOC ${String(i + 1).padStart(2, '0')}`, 54, 88);
  ctx.textAlign = 'right';
  ctx.font = `600 26px ${MONO}`;
  ctx.fillStyle = parentOk ? '#0c0905' : '#9c1b12';
  ctx.fillText(`${parentOk ? '● LIEN VALIDE' : '✕ LIEN ROMPU'}`, W - 54, 83);
  ctx.textAlign = 'left';

  const row = (label, value, y, color) => {
    ctx.fillStyle = PH_DIM;
    ctx.font = `500 22px ${MONO}`;
    ctx.fillText(`> ${label.toUpperCase()}`, 54, y);
    let size = 38;
    ctx.font = `400 ${size * 1.2}px ${DISPLAY}`;
    while (ctx.measureText(value).width > W - 108 && size > 18) {
      size -= 2;
      ctx.font = `400 ${size * 1.2}px ${DISPLAY}`;
    }
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.fillText(value, 54, y + 44);
    ctx.shadowBlur = 0;
  };
  // Les memes champs, dans le meme ordre que le bloc de la sequence 1
  const top = 150;
  const step = (H - top - 40) / 4;
  row('Hash du bloc parent', shortHash(b.parent), top + step * 0.35, parentOk ? PHOSPHOR : '#ff6b60');
  row('Nonce', String(b.nonce), top + step * 1.35, '#f2a93b');
  row('Données', b.data, top + step * 2.35, editedData ? '#ff6b60' : '#ffffff');
  row('Hash du bloc', shortHash(b.hash), top + step * 3.35, state);

  tex.needsUpdate = true;
}

// Une petite chaine reelle : les hashes sont vraiment calcules
export const TXS = ['Léa → Julien : 5 jetons', 'Clara → Théo : 12 jetons', 'Julien → Maxime : 5 jetons', 'Théo → Léa : 3 jetons', 'Hélène → Clara : 8 jetons'];
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
