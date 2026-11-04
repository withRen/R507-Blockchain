// La salle des serveurs et le premier bloc, en verre, avec ses champs lisibles.
// Le hash n'est pas une couche du bloc : il en sort, parce qu'il est calcule a partir
// de son contenu et n'y est pas stocke.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { textured } from './assets.js';
import { closedRoom, metalSurface, rackFaces } from './stage.js';

const FIELD = {
  parent: { label: 'HASH DU BLOC PARENT', color: '#b9c3d8', tint: 0x7f8ba3 },
  nonce: { label: 'NONCE', color: '#ffb54d', tint: 0xe89a2c },
  data: { label: 'DONNÉES · TRANSACTIONS', color: '#9db0ff', tint: 0x5b74ff }
};

function plate(w, h, cw, ch) {
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

export function createServerRoom(scene) {
  const group = new THREE.Group();
  group.position.set(0, 60, 0);
  group.visible = false;
  scene.add(group);

  const W = 11;
  const D = 13;
  const CEIL = 5.4;
  closedRoom(group, { W, D, CEIL, wall: 0x3e4148, floor: 0x5c6068, ceil: 0x25272c, floorTex: 'large_grey_tiles', wallTex: 'grey_plaster', tileFloor: 1.2, tileWall: 3, floorRough: 0.55, floorNormal: 0.35, floorOpacity: 0.78, wallNormal: 0.3 });
  const k = new Kit();
  // Baies de serveurs, en rangees de part et d'autre
  const faces = [];
  [-8.4, -5.6, 5.6, 8.4].forEach((x) => {
    for (let i = 0; i < 9; i++) {
      const z = -10 + i * 2.5;
      k.box(1.1, 3.5, 2.3, 0x4a4f58, { p: [x, 1.75, z] });
      faces.push({ p: [x < 0 ? x + 0.565 : x - 0.565, 1.75, z], r: x < 0 ? Math.PI / 2 : -Math.PI / 2 });
    }
  });
  rackFaces(group, faces);
  // Reflet des baies dans le sol poli
  rackFaces(group, faces.map((f) => ({ p: [f.p[0], -f.p[1], f.p[2]], r: f.r, flip: true })), { gain: 0.8 });
  // Chemins de cables au plafond et porte du fond
  const hw = new Kit();
  [-7, 7].forEach((x) => {
    hw.box(1.3, 0.1, D * 2 - 0.4, 0x3a3e46, { p: [x, CEIL - 0.45, 0] });
    for (let z = -11; z <= 11; z += 2.75) hw.box(0.05, 0.42, 0.05, 0x3a3e46, { p: [x - 0.6, CEIL - 0.21, z] });
    for (let z = -11; z <= 11; z += 2.75) hw.box(0.05, 0.42, 0.05, 0x3a3e46, { p: [x + 0.6, CEIL - 0.21, z] });
  });
  hw.box(1.9, 2.5, 0.08, 0x5a5e66, { p: [0, 1.25, -D + 0.14] });
  hw.box(2.2, 0.14, 0.14, 0x4a4e56, { p: [0, 2.57, -D + 0.14] });
  group.add(textured(hw, metalSurface(), 1.3));
  // Socle du bloc
  k.add(new THREE.CylinderGeometry(1.95, 2.1, 0.28, 48), 0x5b606a, { p: [0, 0.14, 0] });
  group.add(textured(k, metalSurface(), 1.3));

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.98, 0.018, 8, 80), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 0.9, 3) }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.29;
  group.add(ring);
  const ringMirror = ring.clone();
  ringMirror.position.y = -0.29;
  group.add(ringMirror);

  const strips = new Kit();
  [-7, 7].forEach((x) => strips.box(0.14, 0.03, 22, 0xffffff, { p: [x, CEIL - 0.02, 0] }));
  group.add(strips.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(0.9, 0.96, 1.1) }), { cast: false }));

  // ---------- Le bloc ----------
  const block = new THREE.Group();
  block.position.set(0, 2.05, 0);
  group.add(block);
  const SW = 3.3;
  const SH = 0.68;
  const SD = 1.9;
  const geo = new THREE.BoxGeometry(SW, SH, SD);
  const edgeGeo = new THREE.EdgesGeometry(geo);
  const layers = {};
  const homeY = { parent: 0.82, nonce: 0, data: -0.82 };
  Object.entries(FIELD).forEach(([key, f]) => {
    const g = new THREE.Group();
    g.position.y = homeY[key];
    const glass = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: f.tint, transparent: true, opacity: 0.16, roughness: 0.75, depthWrite: false }));
    glass.userData.layer = key;
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: new THREE.Color(f.tint).multiplyScalar(2.2), transparent: true }));
    const face = plate(SW - 0.1, SH - 0.06, 1024, 196);
    face.mesh.position.z = SD / 2 + 0.012;
    g.add(glass, edges, face.mesh);
    block.add(g);
    layers[key] = { g, glass, edges, face, f, value: '', key };
  });

  const drawLayer = (key, value, active) => {
    const L = layers[key];
    const { ctx, canvas, tex } = L.face;
    L.value = value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (active) {
      ctx.fillStyle = 'rgba(160,180,255,0.14)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = L.f.color;
    ctx.font = '500 30px "IBM Plex Mono", Menlo, monospace';
    ctx.fillText(L.f.label, 34, 56);
    ctx.fillStyle = '#f4f6fb';
    ctx.font = '500 58px "IBM Plex Mono", Menlo, monospace';
    let size = 58;
    while (ctx.measureText(value).width > 950 && size > 24) {
      size -= 2;
      ctx.font = `500 ${size}px "IBM Plex Mono", Menlo, monospace`;
    }
    ctx.fillText(value, 34, 142);
    tex.needsUpdate = true;
  };

  // Le hash du bloc, au-dessus, relie au contenu par un faisceau
  const hashPlate = plate(4.9, 0.72, 1536, 226);
  hashPlate.mesh.position.set(0, 4.32, 0.9);
  group.add(hashPlate.mesh);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 2.6, 1.4), transparent: true }));
  group.add(beam);
  const drawHash = (hash, previous) => {
    const { ctx, canvas, tex } = hashPlate;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(6,16,14,0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#62d6a0';
    ctx.font = '500 27px "IBM Plex Mono", Menlo, monospace';
    ctx.fillText('HASH DU BLOC · SHA-256 · CALCULÉ À PARTIR DU CONTENU', 34, 52);
    ctx.font = '500 39px "IBM Plex Mono", Menlo, monospace';
    const lineChars = 32;
    [...hash].forEach((ch, i) => {
      const row = i < lineChars ? 0 : 1;
      const col = i % lineChars;
      ctx.fillStyle = previous && previous[i] !== ch ? '#ff7a6e' : '#e9f7f0';
      ctx.fillText(ch, 34 + col * 45, 116 + row * 62);
    });
    tex.needsUpdate = true;
  };

  // Hauteur d'apparition et opacite de chaque partie, selon le recit
  function setReveal(levels, time) {
    Object.entries(layers).forEach(([key, L]) => {
      const v = levels[key] ?? 0;
      L.g.visible = v > 0.003;
      L.g.position.y = homeY[key] + (1 - v) * 0.45 + Math.sin(time * 0.8 + homeY[key]) * 0.012;
      L.glass.material.opacity = 0.16 * v + (levels.focus === key ? 0.14 : 0);
      L.edges.material.opacity = v;
      L.face.mesh.material.opacity = v;
    });
    const h = levels.hash ?? 0;
    hashPlate.mesh.visible = h > 0.003;
    hashPlate.mesh.material.opacity = h;
    beam.visible = h > 0.003;
    beam.material.opacity = h;
    const y0 = block.position.y + 1.2;
    const y1 = hashPlate.mesh.position.y - 0.36;
    beam.position.set(0, (y0 + y1) / 2, 0.45);
    beam.scale.y = y1 - y0;
    block.rotation.y = Math.sin(time * 0.18) * 0.035;
  }

  // Tremblement bref quand le contenu change
  let shake = 0;
  const pulse = () => { shake = 1; };
  function tick(dt, time) {
    shake = Math.max(0, shake - dt * 2.4);
    block.position.x = Math.sin(time * 58) * 0.022 * shake;
    ring.material.color.setRGB(0.7 + shake * 2.5, 0.9 - shake * 0.5, 3 - shake * 2.2);
  }

  const pickables = Object.values(layers).map((L) => L.glass);
  return { group, drawLayer, drawHash, setReveal, pulse, tick, pickables };
}
