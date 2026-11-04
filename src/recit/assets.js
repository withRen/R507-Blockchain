// Assets gratuits de Poly Haven (licence CC0) : matieres PBR, modeles et eclairage HDRI.
// Liste complete et liens dans docs/ASSETS.md.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const base = import.meta.env.BASE_URL;
const textures = new THREE.TextureLoader();
const gltf = new GLTFLoader();
const cache = new Map();

function tex(path, srgb) {
  const t = textures.load(`${base}${path}`);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 6;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Une matiere PBR complete. Les couleurs de sommet servent de teinte.
export function surface(name, { map = true, normalScale = 1, metalness = 0, roughness = 1, envMapIntensity = 1 } = {}) {
  const key = `${name}|${map}|${normalScale}|${metalness}|${roughness}|${envMapIntensity}`;
  if (cache.has(key)) return cache.get(key);
  const m = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness,
    roughness,
    envMapIntensity,
    normalMap: tex(`pbr/${name}/nor.jpg`),
    roughnessMap: tex(`pbr/${name}/rough.jpg`),
    normalScale: new THREE.Vector2(normalScale, normalScale)
  });
  if (map) { m.map = tex(`pbr/${name}/diff.jpg`, true); m.color.setScalar(0.42); }
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
  const m = new THREE.Mesh(boxUV(kit.geometry(), size), material);
  return m;
}

// Modeles : charges une fois, puis clones. Le bas de l'objet est pose sur la position donnee.
const models = new Map();
function loadModel(name) {
  if (!models.has(name)) {
    models.set(name, gltf.loadAsync(`${base}models/${name}/${name}.gltf`).then((g) => {
      const box = new THREE.Box3().setFromObject(g.scene);
      g.scene.userData.bottom = box.min.y;
      return g.scene;
    }));
  }
  return models.get(name);
}

export function place(parent, name, spots) {
  loadModel(name).then((scene) => {
    spots.forEach(({ p = [0, 0, 0], r = 0, s = 1 }) => {
      const c = scene.clone(true);
      const sc = typeof s === 'number' ? [s, s, s] : s;
      c.scale.set(...sc);
      c.rotation.y = r;
      c.position.set(p[0], p[1] - scene.userData.bottom * sc[1], p[2]);
      parent.add(c);
    });
  }).catch((e) => console.warn(`Modèle non chargé : ${name}`, e));
}

// Eclairage d'une vraie nuit urbaine, pour les reflets
export function loadEnvironment(renderer, scene) {
  new HDRLoader().load(`${base}hdri/modern_buildings_night_1k.hdr`, (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromEquirectangular(hdr).texture;
    scene.environmentIntensity = 0.1;
    hdr.dispose();
    pm.dispose();
  });
}
