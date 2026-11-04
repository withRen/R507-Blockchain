// Le 41e etage de la tour Meridian. La facade sud est vitree : depuis l'interieur,
// la tour n'est pas dessinee (faces arriere) et on voit la vraie ville en contrebas.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { MERIDIAN } from './city.js';
import { place, surface, textured } from './assets.js';

const metal = 0x565c66;

function ledgerCanvas() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 620;
  return c;
}

const ROWS = [
  ['ATELIERS DUVAL', '1 204 500,00', '09:41:12'],
  ['BANQUE DU CANAL', '86 310 000,00', '10:02:55'],
  ['CLINIQUE SAINT-ROCH', '2 740 180,00', '14:18:03'],
  ['HALLES MARCHANDES', '612 900,00', '16:33:27'],
  ['LEMOINE LOGISTIQUE', '40 000 000,00', '17:06:40'],
  ['PORT AUTONOME', '19 455 200,00', '18:12:09'],
  ['TRANSPORTS ORTEGA', '3 118 750,00', '19:50:31']
];

function drawLedger(c, changed) {
  const x = c.getContext('2d');
  x.fillStyle = '#080c16';
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#111a2e';
  x.fillRect(0, 0, c.width, 74);
  x.fillStyle = '#d7deed';
  x.font = '600 28px "IBM Plex Mono", Menlo, monospace';
  x.fillText('MERIDIAN CLEARING', 34, 47);
  x.fillStyle = '#7c8aa6';
  x.font = '400 21px "IBM Plex Mono", Menlo, monospace';
  x.textAlign = 'right';
  x.fillText('REGISTRE CENTRAL · 23:47', c.width - 34, 46);
  x.textAlign = 'left';
  x.fillStyle = '#62718f';
  x.font = '500 20px "IBM Plex Mono", Menlo, monospace';
  x.fillText('COMPTE', 34, 118);
  x.fillText('SOLDE (JETONS)', 480, 118);
  x.fillText('MODIFIÉ', 820, 118);
  x.fillStyle = '#26324c';
  x.fillRect(34, 133, c.width - 68, 2);
  x.font = '400 24px "IBM Plex Mono", Menlo, monospace';
  ROWS.forEach((r, i) => {
    const y = 180 + i * 60;
    const hit = changed && r[0].startsWith('LEMOINE');
    if (hit) {
      x.fillStyle = '#4a0f12';
      x.fillRect(22, y - 37, c.width - 44, 56);
      x.fillStyle = '#ff5147';
      x.fillRect(22, y - 37, 7, 56);
    }
    x.fillStyle = hit ? '#ffd8d4' : '#b9c3d8';
    x.fillText(r[0], 42, y);
    x.fillText(hit ? '0,00' : r[1], 480, y);
    x.fillText(hit ? '23:12:04' : r[2], 820, y);
  });
}

export function createOffice(scene) {
  const group = new THREE.Group();
  group.position.set(MERIDIAN.x, MERIDIAN.floorY, MERIDIAN.z);
  scene.add(group);

  const W = 15; // demi-largeur
  const D = 13; // demi-profondeur
  const CEIL = 3.6;
  const fl = new Kit();
  fl.box(W * 2, 0.1, D * 2, 0xa9adb5, { p: [0, -0.05, 0] });
  const wl = new Kit();
  wl.box(W * 2, 0.1, D * 2, 0x6d717a, { p: [0, CEIL + 0.05, 0] });
  wl.box(0.2, CEIL, D * 2, 0xa8aab0, { p: [-W, CEIL / 2, 0] });
  wl.box(0.2, CEIL, D * 2, 0xa8aab0, { p: [W, CEIL / 2, 0] });
  wl.box(W * 2, CEIL, 0.2, 0xa8aab0, { p: [0, CEIL / 2, -D] });
  const mt = new Kit();
  // Ligne de portes d'ascenseurs dans le mur nord
  mt.box(2.6, 2.8, 0.1, 0x9ea2aa, { p: [-3.4, 1.4, -D + 0.12] });
  mt.box(2.6, 2.8, 0.1, 0x9ea2aa, { p: [-12.2, 1.4, -D + 0.12] });
  // Cloison du bureau du directeur, a l'ouest
  mt.box(0.08, CEIL, 7, 0x4a5261, { p: [-9.4, CEIL / 2, -6.5] });
  for (let i = 0; i < 6; i++) mt.box(0.06, CEIL, 0.06, 0x20242c, { p: [-9.4, CEIL / 2, -9.9 + i * 1.36] });
  mt.box(0.08, 0.75, 1, 0x20242c, { p: [-13.4, 0.375, -6.8] });
  mt.box(0.08, 0.75, 1, 0x20242c, { p: [-11, 0.375, -6.8] });
  // Pieds de la table de reunion et montants de la baie vitree
  mt.box(0.12, 0.75, 0.8, 0x20242c, { p: [-3.9, 0.375, 8.1] });
  mt.box(0.12, 0.75, 0.8, 0x20242c, { p: [-0.9, 0.375, 8.1] });
  for (let i = 0; i <= 10; i++) mt.box(0.07, CEIL, 0.12, 0x2a2e36, { p: [-W + i * 3, CEIL / 2, D] });
  const wd = new Kit();
  wd.box(2.6, 0.08, 1.15, 0xc8b8a8, { p: [-12.2, 0.75, -6.8] });
  wd.box(3.8, 0.07, 1.1, 0xc8b8a8, { p: [-2.4, 0.75, 8.1] });
  group.add(
    textured(fl, surface('large_grey_tiles', { roughness: 0.8, normalScale: 0.7 }), 2.4),
    textured(wl, surface('grey_plaster', { normalScale: 0.5 }), 2.2),
    textured(mt, surface('metal_plate_02', { metalness: 0.75, roughness: 0.9, normalScale: 0.4 }), 1.6),
    textured(wd, surface('black_walnut_veneer_01', { roughness: 0.75, normalScale: 0.6 }), 1.6)
  );
  // Modeles : bureaux, fauteuils et plantes
  const deskSpots = [];
  for (let col = 0; col < 4; col++) for (let row = 0; row < 3; row++) deskSpots.push([-5 + col * 4.5, -6.5 + row * 4]);
  place(group, 'metal_office_desk', deskSpots.map(([x, z]) => ({ p: [x, 0, z], s: [1.15, 1.24, 1.05] })));
  place(group, 'modern_arm_chair_01', [
    { p: [-3.7, 0, 9.35], r: Math.PI },
    { p: [-2.4, 0, 9.35], r: Math.PI },
    { p: [-1.1, 0, 9.35], r: Math.PI },
    { p: [-12.2, 0, -8.05], r: 0 }
  ]);
  place(group, 'potted_plant_04', [
    { p: [-13.6, 0, 11.6], s: 4.6 },
    { p: [13.4, 0, 11.4], s: 5 },
    { p: [13.4, 0, -11.4], s: 4.6 },
    { p: [-9.9, 0, -2.2], s: 4 }
  ]);
  place(group, 'office_notepads', [{ p: [-1.6, 0.79, 8.1], s: 0.55 }]);
  place(group, 'classic_laptop', [{ p: [-3.1, 0.79, 8.05], r: Math.PI, s: 0.8 }]);

  // Bandeaux lumineux au plafond
  const strips = new Kit();
  strips.box(5, 0.03, 0.14, 0xffffff, { p: [-2.4, CEIL - 0.02, 7.2] });
  for (let i = 0; i < 4; i++) {
    strips.box(0.14, 0.03, 19, 0xffffff, { p: [-6.8 + i * 4.5, CEIL - 0.02, -1] });
  }
  const stripMat = new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(1.5, 1.55, 1.65) });
  const stripMesh = strips.mesh(stripMat, { cast: false });
  group.add(stripMesh);

  // Reflets des bandeaux sur le sol poli
  const glossKit = new Kit();
  for (let i = 0; i < 4; i++) glossKit.box(0.34, 0.002, 19, 0x4a5873, { p: [-6.8 + i * 4.5, 0.012, -1] });
  group.add(glossKit.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.06, depthWrite: false }), { cast: false }));

  // Ecrans eteints et ecrans de veille
  const screens = new Kit();
  deskSpots.forEach(([x, z], i) => {
    if (x === 4 && z === -2.5) return;
    const tone = i % 3 === 0 ? 0x18305f : 0x050810;
    screens.box(0.94, 0.56, 0.025, tone, { p: [x - 0.1, 1.33, z - 0.28] });
    screens.box(0.07, 0.26, 0.05, 0x0a0c10, { p: [x - 0.1, 1.1, z - 0.31] });
  });
  group.add(screens.mesh(new THREE.MeshBasicMaterial({ vertexColors: true }), { cast: false }));

  // L'ecran d'Alice : le registre central, lisible en gros plan
  const canvas = ledgerCanvas();
  drawLedger(canvas, false);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mon = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.7), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  mon.position.set(4, 1.42, -2.76);
  group.add(mon);
  const monBack = new Kit();
  monBack.box(1.19, 0.74, 0.03, 0x06070b, { p: [4, 1.42, -2.78] });
  monBack.box(0.08, 0.22, 0.05, 0x0a0c10, { p: [4, 1.05, -2.8] });
  group.add(monBack.mesh(new THREE.MeshBasicMaterial({ vertexColors: true }), { cast: false }));
  let changed = false;
  const setLedgerChanged = (v) => {
    if (v === changed) return;
    changed = v;
    drawLedger(canvas, v);
    tex.needsUpdate = true;
  };

  // L'ascenseur de Gaspard : une cabine eclairee derriere deux portes coulissantes
  const lift = new THREE.Group();
  lift.position.set(-7.8, 0, -D);
  group.add(lift);
  // Encadrement : le mur nord est ouvert autour de la cabine
  const frame = new Kit();
  frame.box(0.22, 2.9, 0.34, metal, { p: [-1.3, 1.45, 0.05] });
  frame.box(0.22, 2.9, 0.34, metal, { p: [1.3, 1.45, 0.05] });
  frame.box(2.82, 0.2, 0.34, metal, { p: [0, 2.9, 0.05] });
  lift.add(textured(frame, surface('metal_plate_02', { metalness: 0.75, roughness: 0.9, normalScale: 0.4 }), 1.6));
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x70757e, roughness: 0.32, metalness: 0.9 });
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 0.06), doorMat);
  const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 0.06), doorMat);
  doorL.position.set(-1.8, 1.4, 0.14);
  doorR.position.set(1.8, 1.4, 0.14);
  lift.add(doorL, doorR);
  const setLiftOpen = (v) => {
    // 1 : ouvert, 0 : ferme
    doorL.position.x = -0.6 - v * 1.2;
    doorR.position.x = 0.6 + v * 1.2;
  };
  // Fond eclaire de la cabine, derriere les portes
  const cutout = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.8), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.62, 0.43, 0.24) }));
  cutout.position.set(0, 1.4, 0.115);
  lift.add(cutout);

  // Lumieres de l'etage
  const a = new THREE.PointLight(0xe8eeff, 7, 18, 1.2);
  a.position.set(3.5, 3.2, -1.2);
  const b = new THREE.PointLight(0xe8eeff, 8, 18, 1.2);
  b.position.set(-5.4, 3.2, -7.5);
  const c = new THREE.PointLight(0xdbe3ff, 9, 15, 1.15);
  c.position.set(-2.4, 3.2, 3.6);
  const liftGlow = new THREE.PointLight(0xffcf95, 0, 6, 1.5);
  liftGlow.position.set(0, 2.1, 0.8);
  lift.add(liftGlow);
  group.add(a, b, c);

  // Verre de la baie : un voile tres leger
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 2, CEIL),
    new THREE.MeshBasicMaterial({ color: 0x25324a, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide })
  );
  glass.position.set(0, CEIL / 2, D);
  group.add(glass);

  // Ombres de contact sous les personnages
  const sc = document.createElement('canvas');
  sc.width = sc.height = 128;
  const sx = sc.getContext('2d');
  const grad = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.72)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  sx.fillStyle = grad;
  sx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(sc);
  const makeShadow = (parent = group) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.018;
    parent.add(m);
    return m;
  };

  return { group, setLedgerChanged, setLiftOpen, liftGlow, makeShadow };
}
