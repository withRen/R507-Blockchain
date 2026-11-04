// Assets gratuits de Poly Haven (licence CC0) : matieres PBR, modeles et eclairage HDRI.
// Liste complete et liens dans docs/ASSETS.md.
//
// Rien n'est charge au demarrage : chaque decor charge ses matieres et ses modeles
// quand sa sequence approche, et libere la memoire graphique quand elle est loin.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const base = import.meta.env.BASE_URL;
const images = new THREE.ImageLoader();
const gltf = new GLTFLoader();
const cache = new Map();
let renderer3d = null;
let warmup = () => {};
// Prepare a l'avance ce qui serait sinon envoye au processeur graphique en pleine scene
export function setWarmup(renderer, fn) { renderer3d = renderer; warmup = fn; }

// La texture existe tout de suite, vide : le materiau n'a pas a etre recompile
// quand l'image arrive.
function lazyTexture(path, srgb) {
  const t = new THREE.Texture();
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.userData.path = path;
  return t;
}
function fetchTexture(t) {
  if (t.userData.loading) return;
  t.userData.loading = true;
  images.load(`${base}${t.userData.path}`, (img) => {
    t.image = img;
    t.needsUpdate = true;
    renderer3d?.initTexture(t);
  });
}

export function surface(name, { map = true, normalScale = 1, metalness = 0, roughness = 1, envMapIntensity = 1 } = {}) {
  const key = `${name}|${map}|${normalScale}|${metalness}|${roughness}|${envMapIntensity}`;
  if (cache.has(key)) return cache.get(key);
  const m = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness,
    roughness,
    envMapIntensity,
    normalMap: lazyTexture(`pbr/${name}/nor.jpg`),
    roughnessMap: lazyTexture(`pbr/${name}/rough.jpg`),
    normalScale: new THREE.Vector2(normalScale, normalScale)
  });
  if (map) {
    m.map = lazyTexture(`pbr/${name}/diff.jpg`, true);
    m.color.setScalar(0.42);
  }
  m.userData.textures = [m.map, m.normalMap, m.roughnessMap].filter(Boolean);
  cache.set(key, m);
  return m;
}

// Coordonnees de texture projetees selon la face : la matiere garde la meme echelle
// partout, en metres, quelle que soit la taille de la boite.
export function boxUV(geometry, size = 1) {
  const pos = geometry.attributes.position;
  const nor = geometry.attributes.normal;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const nz = Math.abs(nor.getZ(i));
    let u;
    let v;
    if (ny >= nx && ny >= nz) { u = pos.getX(i); v = pos.getZ(i); }
    else if (nx >= nz) { u = pos.getZ(i); v = pos.getY(i); }
    else { u = pos.getX(i); v = pos.getY(i); }
    uv[i * 2] = u / size;
    uv[i * 2 + 1] = v / size;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geometry;
}

export function textured(kit, material, size = 1) {
  return new THREE.Mesh(boxUV(kit.geometry(), size), material);
}

// ---------- Modeles ----------
// Un modele repete devient des InstancedMesh : un seul appel de dessin par piece,
// quel que soit le nombre d'exemplaires.
const requests = new Map(); // decor -> [{ name, spots, meshes, loaded }]
const models = new Map(); // nom -> { promise, users, geometries, materials }

export function place(parent, name, spots) {
  if (!requests.has(parent)) requests.set(parent, []);
  requests.get(parent).push({ name, spots, meshes: [], state: 'idle' });
}

function loadModel(name) {
  let m = models.get(name);
  if (!m) {
    m = { users: 0 };
    m.promise = gltf.loadAsync(`${base}models/${name}/${name}.gltf`).then((g) => {
      g.scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(g.scene);
      const parts = [];
      g.scene.traverse((o) => { if (o.isMesh) parts.push({ geometry: o.geometry, material: o.material, matrix: o.matrixWorld.clone() }); });
      return { parts, bottom: box.min.y };
    });
    models.set(name, m);
  }
  return m;
}

const tmpM = new THREE.Matrix4();
const tmpO = new THREE.Object3D();
function instantiate(req, parent) {
  if (req.state !== 'idle') return;
  req.state = 'loading';
  const model = loadModel(req.name);
  model.users++;
  model.promise.then(({ parts, bottom }) => {
    if (req.state !== 'loading') return;
    parts.forEach((part) => {
      const inst = new THREE.InstancedMesh(part.geometry, part.material, req.spots.length);
      req.spots.forEach(({ p = [0, 0, 0], r = 0, s = 1 }, i) => {
        const sc = typeof s === 'number' ? [s, s, s] : s;
        tmpO.position.set(p[0], p[1] - bottom * sc[1], p[2]);
        tmpO.rotation.set(0, r, 0);
        tmpO.scale.set(...sc);
        tmpO.updateMatrix();
        tmpM.multiplyMatrices(tmpO.matrix, part.matrix);
        inst.setMatrixAt(i, tmpM);
      });
      inst.computeBoundingSphere();
      parent.add(inst);
      req.meshes.push(inst);
      warmup(inst);
    });
    req.state = 'ready';
  }).catch((e) => console.warn(`Modèle non chargé : ${req.name}`, e));
}

function release(req) {
  if (req.state === 'idle') return;
  req.meshes.forEach((m) => { m.removeFromParent(); m.dispose(); });
  req.meshes = [];
  req.state = 'idle';
  const model = models.get(req.name);
  if (model && --model.users <= 0) {
    // Plus personne ne s'en sert : on libere la memoire graphique
    model.promise.then(({ parts }) => {
      const textures = new Set();
      parts.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
        Object.values(material).forEach((v) => { if (v && v.isTexture) textures.add(v); });
      });
      textures.forEach((t) => t.dispose());
    });
    models.delete(req.name);
  }
}

const materialsIn = (group) => {
  const out = new Set();
  group.traverse((o) => { if (o.material?.userData?.textures) out.add(o.material); });
  return out;
};

// Appele quand on change de sequence : charge ce qui va servir, decharge le reste
export function syncAssets(allGroups, needed) {
  const keep = new Set();
  needed.forEach((g) => materialsIn(g).forEach((m) => keep.add(m)));
  allGroups.forEach((g) => {
    const reqs = requests.get(g) ?? [];
    if (needed.has(g)) reqs.forEach((r) => instantiate(r, g));
    else reqs.forEach(release);
  });
  cache.forEach((m) => {
    m.userData.textures.forEach((t) => {
      if (keep.has(m)) {
        if (t.image) renderer3d?.initTexture(t);
        else fetchTexture(t);
      }
      else if (t.image) t.dispose();
    });
  });
}

// Eclairage d'une vraie nuit urbaine, pour les reflets
export function loadEnvironment(renderer, scene) {
  return new Promise((resolve) => {
    new HDRLoader().load(`${base}hdri/modern_buildings_night_1k.hdr`, (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromEquirectangular(hdr).texture;
      scene.environmentIntensity = 0.1;
      hdr.dispose();
      pm.dispose();
      resolve();
    }, undefined, () => resolve());
  });
}
