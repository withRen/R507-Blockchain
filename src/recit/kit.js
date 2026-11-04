// Boite a outils de modelisation : on assemble des formes simples en un seul
// maillage colore par sommet, ce qui limite fortement le nombre de draw calls.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function gradient() {
  const data = new Uint8Array([120, 120, 120, 255, 190, 190, 190, 255, 255, 255, 255, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}
const GRADIENT = gradient();

// Rendu "maquette de papier" : quelques paliers de lumiere, couleurs franches
export const toon = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: GRADIENT });
export const toonTint = (opts = {}) => new THREE.MeshToonMaterial({ gradientMap: GRADIENT, ...opts });

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();

export class Kit {
  constructor() { this.parts = []; }

  // flat : facettes franches (decor) ; sinon surfaces lisses (personnages)
  add(geometry, hex, { p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], flat = false } = {}) {
    let g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    tmpP.set(...p);
    tmpQ.setFromEuler(tmpE.set(...r));
    tmpS.set(...(typeof s === 'number' ? [s, s, s] : s));
    g.applyMatrix4(tmpM.compose(tmpP, tmpQ, tmpS));
    if (flat) g.computeVertexNormals();
    g.deleteAttribute('uv');
    const c = new THREE.Color(hex);
    const n = g.attributes.position.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.parts.push(g);
    return this;
  }

  // Les objets assez grands ont une arete biseautee, qui accroche la lumiere
  box(w, h, d, hex, opts) {
    const min = Math.min(w, h, d);
    if (min >= 0.05) return this.add(new RoundedBoxGeometry(w, h, d, 1, Math.min(0.018, min * 0.22)), hex, opts);
    return this.add(new THREE.BoxGeometry(w, h, d), hex, { flat: true, ...opts });
  }

  geometry() { return mergeGeometries(this.parts, false); }

  mesh(material = toon, { cast = true, receive = false } = {}) {
    const m = new THREE.Mesh(this.geometry(), material);
    m.castShadow = cast;
    m.receiveShadow = receive;
    return m;
  }
}

// Toit a deux pentes : un prisme triangulaire extrude
export function prism(width, height, depth) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  return g;
}

// Generateur pseudo-aleatoire : le village est identique a chaque visite
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
