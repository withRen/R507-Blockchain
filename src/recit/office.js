// Le 41e etage de la tour Meridian. La facade sud est vitree : depuis l'interieur,
// la tour n'est pas dessinee (faces arriere) et on voit la vraie ville en contrebas.
import * as THREE from 'three';
import { Kit, flat } from './kit.js';
import { MERIDIAN } from './city.js';

const metal = 0x565c66;

function ledgerCanvas() {
  const c = document.createElement('canvas');
  c.width = 1536;
  c.height = 920;
  return c;
}

const ROWS = [
  ['ATELIERS DUVAL', '1 204 500,00', '09:41:12', 'TX_OK · SIG_VALID'],
  ['BANQUE DU CANAL', '86 310 000,00', '10:02:55', 'TX_OK · SIG_VALID'],
  ['CLINIQUE SAINT-ROCH', '2 740 180,00', '14:18:03', 'TX_OK · SIG_VALID'],
  ['HALLES MARCHANDES', '612 900,00', '16:33:27', 'TX_OK · SIG_VALID'],
  ['LEMOINE LOGISTIQUE', '40 000 000,00', '17:06:40', 'TX_OK · SIG_VALID'],
  ['PORT AUTONOME', '19 455 200,00', '18:12:09', 'TX_OK · SIG_VALID'],
  ['TRANSPORTS ORTEGA', '3 118 750,00', '19:50:31', 'TX_OK · SIG_VALID']
];

// L'ecran d'Alice : une base centrale ordinaire. Pas de hash ni de noeuds ici, ils n'arrivent
// que plus tard dans l'histoire : c'est justement ce qui manque a ce registre.
function drawLedger(c, changed) {
  const x = c.getContext('2d');
  const w = c.width;
  const h = c.height;
  const FONT = '"IBM Plex Mono", Menlo, monospace';
  x.textAlign = 'left';
  x.fillStyle = '#060a14';
  x.fillRect(0, 0, w, h);
  x.fillStyle = '#0d1426';
  x.fillRect(0, 0, w, 96);
  x.fillStyle = '#eef2fb';
  x.font = `600 34px ${FONT}`;
  x.fillText('MERIDIAN CLEARING · REGISTRE CENTRAL', 44, 60);
  x.textAlign = 'right';
  x.fillStyle = '#8ea0c0';
  x.font = `400 24px ${FONT}`;
  x.fillText('23:47', w - 44, 58);
  x.textAlign = 'left';
  const colB = w * 0.48;
  const colC = w * 0.76;
  x.fillStyle = '#7f92b4';
  x.font = `600 22px ${FONT}`;
  x.fillText('COMPTE', 44, 146);
  x.fillText('SOLDE (JETONS)', colB, 146);
  x.fillText('MODIFIÉ', colC, 146);
  const rowH = (h - 240) / ROWS.length;
  ROWS.forEach((r, i) => {
    const y = 206 + i * rowH;
    const hit = changed && r[0].startsWith('LEMOINE');
    if (hit) {
      x.fillStyle = 'rgba(180, 18, 28, 0.38)';
      x.fillRect(24, y - rowH * 0.62, w - 48, rowH * 0.92);
      x.fillStyle = '#ff2a38';
      x.fillRect(24, y - rowH * 0.62, 10, rowH * 0.92);
    }
    x.fillStyle = hit ? '#ffd2d2' : '#d6deef';
    x.font = `400 28px ${FONT}`;
    x.fillText(r[0], 52, y);
    x.fillText(hit ? '0,00' : r[1], colB, y);
    x.fillText(hit ? '23:12:04' : r[2], colC, y);
  });
}

// Plaque murale de la societe
function plaqueCanvas() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#060a16';
  x.fillRect(0, 0, 1024, 256);
  x.fillStyle = '#ffffff';
  x.font = '700 62px "Roboto", sans-serif';
  x.textAlign = 'center';
  x.letterSpacing = '10px';
  x.fillText('MERIDIAN CLEARING', 512, 128);
  x.fillStyle = '#8ea0c0';
  x.font = '400 26px "Roboto", sans-serif';
  x.letterSpacing = '6px';
  x.fillText('41e ÉTAGE · AUDIT INTERNE', 512, 186);
  return c;
}

export function createOffice(scene) {
  const group = new THREE.Group();
  group.position.set(MERIDIAN.x, MERIDIAN.floorY, MERIDIAN.z);
  scene.add(group);

  const W = 15; // demi-largeur
  const D = 13; // demi-profondeur
  const CEIL = 3.6;

  // ---------- Sol : basalte sombre poli et tapis tisses ----------
  const fl = new Kit();
  fl.box(W * 2, 0.1, D * 2, 0x565c68, { p: [0, -0.05, 0] });
  // Tapis tisse sombre sous la grande table du conseil
  fl.box(6.4, 0.012, 3.6, 0x4a505b, { p: [-2.4, 0.006, 8.2] });
  fl.box(4.2, 0.012, 3.2, 0x4a505b, { p: [-12.2, 0.006, -6.8] });
  // Zone de moquette technique sous les rangées de bureaux
  fl.box(18, 0.008, 14, 0x4f5561, { p: [1.8, 0.005, -2.5] });

  // ---------- Murs : panneaux architecturaux sombres et claustra bois/carbone ----------
  const wl = new Kit();
  // Plafond sombre
  wl.box(W * 2, 0.1, D * 2, 0x222732, { p: [0, CEIL + 0.05, 0] });
  // Murs ouest et est en beton sombre
  wl.box(0.2, CEIL, D * 2, 0x3d434f, { p: [-W, CEIL / 2, 0] });
  wl.box(0.2, CEIL, D * 2, 0x3d434f, { p: [W, CEIL / 2, 0] });
  // Mur nord principal
  wl.box(W * 2, CEIL, 0.2, 0x2e333d, { p: [0, CEIL / 2, -D] });

  // Claustra mural acoustique a lattes verticales sur le mur nord 
  const woodLouvers = new Kit();
  for (let x = -14.2; x <= 14.2; x += 0.32) {
    if (Math.abs(x - -7.8) < 1.8) continue; // Passage ascenseur
    woodLouvers.box(0.045, CEIL - 0.2, 0.04, 0x181513, { p: [x, CEIL / 2, -D + 0.14] });
  }

  // Piliers architecturaux avec saignees lumineuses
  for (const z of [-8, -2, 4, 10]) {
    wl.box(0.38, CEIL, 0.42, 0x3d434f, { p: [-W + 0.22, CEIL / 2, z] });
    wl.box(0.38, CEIL, 0.42, 0x3d434f, { p: [W - 0.22, CEIL / 2, z] });
  }

  // Portes et encadrements metalliques
  const mt = new Kit();
  mt.box(2.6, 2.8, 0.1, 0x6e7480, { p: [-3.4, 1.4, -D + 0.12] });
  mt.box(2.6, 2.8, 0.1, 0x6e7480, { p: [-12.2, 1.4, -D + 0.12] });
  mt.box(2.84, 0.14, 0.18, 0x484d56, { p: [-3.4, 2.86, -D + 0.14] });
  mt.box(2.84, 0.14, 0.18, 0x484d56, { p: [-12.2, 2.86, -D + 0.14] });
  mt.box(0.025, 2.8, 0.12, 0x181a20, { p: [-3.4, 1.4, -D + 0.13] });
  mt.box(0.025, 2.8, 0.12, 0x181a20, { p: [-12.2, 1.4, -D + 0.13] });

  // Cloison vitree du bureau ouest
  for (let i = 0; i < 6; i++) mt.box(0.06, CEIL, 0.06, 0x1f232b, { p: [-9.4, CEIL / 2, -9.9 + i * 1.36] });
  mt.box(0.08, 0.08, 7, 0x1f232b, { p: [-9.4, CEIL - 0.04, -6.5] });
  mt.box(0.08, 0.08, 7, 0x1f232b, { p: [-9.4, 0.04, -6.5] });
  mt.box(0.08, 0.75, 1, 0x1f232b, { p: [-13.4, 0.375, -6.8] });
  mt.box(0.08, 0.75, 1, 0x1f232b, { p: [-11, 0.375, -6.8] });

  // Table du conseil
  mt.box(0.16, 0.73, 0.86, 0x1f232b, { p: [-3.9, 0.365, 8.1] });
  mt.box(0.16, 0.73, 0.86, 0x1f232b, { p: [-0.9, 0.365, 8.1] });
  mt.box(3.1, 0.06, 0.24, 0x1f232b, { p: [-2.4, 0.52, 8.1] });
  mt.box(1.45, 0.026, 0.36, 0x2a2f3a, { p: [-2.4, 0.79, 8.1] });
  mt.box(3.6, 0.05, 0.18, 0x1c2028, { p: [-2.4, 2.85, 8.1] });
  mt.box(0.02, 0.75, 0.02, 0x323844, { p: [-3.8, 3.22, 8.1] });
  mt.box(0.02, 0.75, 0.02, 0x323844, { p: [-1.0, 3.22, 8.1] });

  // Baie vitree sud
  for (let i = 0; i <= 10; i++) mt.box(0.08, CEIL, 0.16, 0x22262e, { p: [-W + i * 3, CEIL / 2, D] });
  mt.box(W * 2, 0.09, 0.18, 0x22262e, { p: [0, 0.045, D] });
  mt.box(W * 2, 0.09, 0.18, 0x22262e, { p: [0, CEIL - 0.045, D] });
  mt.box(W * 2, 0.045, 0.14, 0x22262e, { p: [0, 1.05, D] });

  // Plateaux en noyer sombre verni
  const wd = new Kit();
  wd.box(2.65, 0.08, 1.18, 0xa69280, { p: [-12.2, 0.75, -6.8] });
  wd.box(4.1, 0.075, 1.24, 0xa69280, { p: [-2.4, 0.75, 8.1] });
  wd.box(0.55, 0.82, 3.4, 0x948270, { p: [-14.55, 0.41, 4.2] });

  group.add(
    flat(fl),
    flat(wl),
    flat(woodLouvers),
    flat(mt),
    flat(wd)
  );

  // Plaque murale de la corporation Meridian sur le mur nord
  const plaqueTex = new THREE.CanvasTexture(plaqueCanvas());
  plaqueTex.colorSpace = THREE.SRGBColorSpace;
  const plaqueMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.3),
    new THREE.MeshBasicMaterial({ map: plaqueTex, transparent: true })
  );
  plaqueMesh.position.set(2.4, 2.7, -D + 0.16);
  group.add(plaqueMesh);

  const deskSpots = [];
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      deskSpots.push([-5 + col * 4.5, -6.5 + row * 4]);
    }
  }
  
        
  // Bureaux et sieges : quelques volumes simples
  const furniture = new Kit();
  deskSpots.forEach(([x, z]) => {
    furniture.box(2.2, 0.06, 1.05, 0x4a505b, { p: [x, 0.98, z] });
    furniture.box(0.06, 0.95, 0.9, 0x2e323a, { p: [x - 1.02, 0.475, z] });
    furniture.box(0.06, 0.95, 0.9, 0x2e323a, { p: [x + 1.02, 0.475, z] });
  });
  [[-3.7, 9.35, 1], [-2.4, 9.35, 1], [-1.1, 9.35, 1], [-12.2, -8.05, -1]].forEach(([x, z, back]) => {
    furniture.box(0.62, 0.1, 0.6, 0x23262c, { p: [x, 0.5, z] });
    furniture.box(0.62, 0.7, 0.1, 0x23262c, { p: [x, 0.85, z + back * 0.27] });
    furniture.box(0.1, 0.45, 0.1, 0x16181d, { p: [x, 0.225, z] });
  });
  group.add(flat(furniture));

  // Ecrans secondaires sur les autres bureaux
  const screens = new Kit();
  deskSpots.forEach(([x, z], i) => {
    screens.box(0.42, 0.012, 0.15, 0x161922, { p: [x - 0.1, 1.025, z - 0.02] });
    screens.box(0.07, 0.012, 0.11, 0x1e222e, { p: [x + 0.24, 1.025, z - 0.02] });
    if (x === 4 && z === -2.5) return; // Bureau d'Alice traite a part
    const tone = i % 3 === 0 ? 0x092648 : i % 2 === 0 ? 0x061836 : 0x08101e;
    screens.box(0.96, 0.56, 0.025, 0x0c0e14, { p: [x - 0.1, 1.33, z - 0.29] });
    screens.box(0.91, 0.51, 0.028, tone, { p: [x - 0.1, 1.33, z - 0.275] });
    screens.box(0.07, 0.28, 0.05, 0x181c24, { p: [x - 0.1, 1.1, z - 0.31] });
    screens.box(0.26, 0.015, 0.18, 0x181c24, { p: [x - 0.1, 1.02, z - 0.3] });
  });
  group.add(screens.mesh(new THREE.MeshBasicMaterial({ vertexColors: true }), { cast: false }));

  // Bandeaux lumineux plafonniers doux
  const strips = new Kit();
  strips.box(5, 0.03, 0.14, 0xffffff, { p: [-2.4, CEIL - 0.02, 7.2] });
  strips.box(3.4, 0.018, 0.12, 0xe8f0ff, { p: [-2.4, 2.82, 8.1] });
  strips.box(1.32, 0.01, 0.24, 0x6c8cff, { p: [-2.4, 0.805, 8.1] });
  for (let i = 0; i < 4; i++) {
    strips.box(0.14, 0.03, 19, 0xffffff, { p: [-6.8 + i * 4.5, CEIL - 0.02, -1] });
  }
  const stripMat = new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(0.85, 0.9, 0.98) });
  group.add(strips.mesh(stripMat, { cast: false }));

  // ---------- LE POSTE D'ALICE ----------
  // Son ecran
  const canvas = ledgerCanvas();
  drawLedger(canvas, false);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mon = new THREE.Mesh(
    new THREE.PlaneGeometry(1.35, 0.8),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
  );
  mon.position.set(4, 1.44, -2.76);
  group.add(mon);

  const monBack = new Kit();
  monBack.box(1.4, 0.84, 0.032, 0x0c0e14, { p: [4, 1.44, -2.78] });
  monBack.box(0.08, 0.26, 0.05, 0x1b202c, { p: [4, 1.05, -2.8] });
  monBack.box(0.36, 0.018, 0.24, 0x1b202c, { p: [4, 1.02, -2.78] });
  group.add(monBack.mesh(new THREE.MeshBasicMaterial({ vertexColors: true }), { cast: false }));

  let changed = false;
  const setLedgerChanged = (v) => {
    if (v === changed) return;
    changed = v;
    drawLedger(canvas, v);
    tex.needsUpdate = true;
  };

  // L'ascenseur de Gaspard
  const lift = new THREE.Group();
  lift.position.set(-7.8, 0, -D);
  group.add(lift);
  const frame = new Kit();
  frame.box(0.24, 2.92, 0.36, metal, { p: [-1.3, 1.46, 0.05] });
  frame.box(0.24, 2.92, 0.36, metal, { p: [1.3, 1.46, 0.05] });
  frame.box(2.84, 0.22, 0.36, metal, { p: [0, 2.91, 0.05] });
  frame.box(0.12, 0.28, 0.03, 0x282d38, { p: [1.58, 1.32, 0.12] });
  lift.add(flat(frame));

  const doorMat = new THREE.MeshLambertMaterial({ color: 0x5a606c });
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 0.06), doorMat);
  const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 0.06), doorMat);
  doorL.position.set(-1.8, 1.4, 0.14);
  doorR.position.set(1.8, 1.4, 0.14);
  lift.add(doorL, doorR);

  const setLiftOpen = (v) => {
    doorL.position.x = -0.6 - v * 1.2;
    doorR.position.x = 0.6 + v * 1.2;
  };

  const cutout = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.8), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.78, 0.55, 0.32) }));
  cutout.position.set(0, 1.4, 0.115);
  lift.add(cutout);

  // Verres de la baie et cloison
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x3b5278,
    transparent: true,
    opacity: 0.085,
    roughness: 0.52,
    metalness: 0.04,
    envMapIntensity: 0.6,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, CEIL), glassMat);
  glass.position.set(0, CEIL / 2, D);
  const partitionGlass = new THREE.Mesh(new THREE.PlaneGeometry(7, CEIL), glassMat);
  partitionGlass.rotation.y = Math.PI / 2;
  partitionGlass.position.set(-9.4, CEIL / 2, -6.5);
  group.add(glass, partitionGlass);

  // Ombres de contact au sol
  const sc = document.createElement('canvas');
  sc.width = sc.height = 128;
  const sx = sc.getContext('2d');
  const grad = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.76)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.32)');
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

  return { group, setLedgerChanged, setLiftOpen, makeShadow };
}
