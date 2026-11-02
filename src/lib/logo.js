import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

// Le symbole ₿ dessine a la main : un "B" a deux panses + quatre petites barres.
function bitcoinShapes() {
  const b = new THREE.Shape();
  b.moveTo(-0.62, -1);
  b.lineTo(0.22, -1);
  b.bezierCurveTo(0.92, -1, 0.95, -0.06, 0.32, 0.02);
  b.bezierCurveTo(0.8, 0.1, 0.8, 1, 0.14, 1);
  b.lineTo(-0.62, 1);
  b.lineTo(-0.62, -1);

  const bottomHole = new THREE.Path();
  bottomHole.moveTo(-0.3, -0.74);
  bottomHole.lineTo(0.18, -0.74);
  bottomHole.bezierCurveTo(0.56, -0.74, 0.56, -0.16, 0.18, -0.16);
  bottomHole.lineTo(-0.3, -0.16);
  bottomHole.lineTo(-0.3, -0.74);

  const topHole = new THREE.Path();
  topHole.moveTo(-0.3, 0.22);
  topHole.lineTo(0.1, 0.22);
  topHole.bezierCurveTo(0.44, 0.22, 0.44, 0.74, 0.1, 0.74);
  topHole.lineTo(-0.3, 0.74);
  topHole.lineTo(-0.3, 0.22);
  b.holes.push(bottomHole, topHole);

  const bar = (x, y0, y1) => {
    const s = new THREE.Shape();
    s.moveTo(x, y0);
    s.lineTo(x + 0.15, y0);
    s.lineTo(x + 0.15, y1);
    s.lineTo(x, y1);
    s.lineTo(x, y0);
    return s;
  };
  return [b, bar(-0.36, 1, 1.32), bar(0.02, 1, 1.32), bar(-0.36, -1.32, -1), bar(0.02, -1.32, -1)];
}

// Construit le logo en fil de fer et renvoie aussi des points pris a sa surface,
// sur lesquels viendront se poser les particules ("petites infos").
export function createBitcoinLogo(color) {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1, depthWrite: false });
  const faint = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.18, depthWrite: false });

  // Le symbole, extrude puis reduit a ses aretes
  const symbolGeometry = new THREE.ExtrudeGeometry(bitcoinShapes(), {
    depth: 0.32,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 14
  });
  symbolGeometry.translate(0, 0, -0.16);
  const symbol = new THREE.Group();
  symbol.rotation.z = -0.24; // le ₿ est penche, comme sur le logo officiel
  symbol.add(new THREE.LineSegments(new THREE.EdgesGeometry(symbolGeometry, 25), material));
  group.add(symbol);

  // La piece : deux bords, une tranche et une face en maillage triangulaire
  const rimGeometry = new THREE.CylinderGeometry(2, 2, 0.34, 72, 1, true);
  rimGeometry.rotateX(Math.PI / 2);
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(rimGeometry, 1), material));
  const inner = new THREE.EdgesGeometry(new THREE.RingGeometry(1.72, 1.74, 72), 1);
  group.add(new THREE.LineSegments(inner, material));
  const face = new THREE.WireframeGeometry(new THREE.CircleGeometry(1.95, 36, 0, Math.PI * 2));
  const faceFront = new THREE.LineSegments(face, faint);
  faceFront.position.z = 0.17;
  group.add(faceFront);
  const tick = new THREE.BufferGeometry();
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    ticks.push(Math.cos(a) * 1.8, Math.sin(a) * 1.8, 0.17, Math.cos(a) * 1.92, Math.sin(a) * 1.92, 0.17);
  }
  tick.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
  group.add(new THREE.LineSegments(tick, material));

  // Points de surface : 70 % sur le symbole, 30 % sur la tranche de la piece
  const symbolMesh = new THREE.Mesh(symbolGeometry);
  symbolMesh.rotation.z = -0.24;
  symbolMesh.updateMatrixWorld();
  const rimMesh = new THREE.Mesh(rimGeometry);
  const symbolSampler = new MeshSurfaceSampler(symbolMesh).build();
  const rimSampler = new MeshSurfaceSampler(rimMesh).build();
  const tmp = new THREE.Vector3();

  function samplePoints(count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      if (i % 10 < 7) {
        symbolSampler.sample(tmp);
        tmp.applyMatrix4(symbolMesh.matrixWorld);
      } else {
        rimSampler.sample(tmp);
      }
      pts.push(tmp.clone());
    }
    return pts;
  }

  return {
    group,
    samplePoints,
    setOpacity(o) {
      material.opacity = o;
      faint.opacity = o * 0.18;
      group.visible = o > 0.01;
    }
  };
}
