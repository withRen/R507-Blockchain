// Tout le film est une fonction du defilement : a une position t correspond un seul
// etat. Remonter la page rembobine donc l'histoire, sans aucun etat a restaurer.
import * as THREE from 'three';

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
export const smoother = (x) => { const t = clamp01(x); return t * t * t * (t * (t * 6 - 15) + 10); };

// Courbe numerique : [[t, valeur], ...]
export function curve(keys, t) {
  if (!keys || !keys.length) return 0;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [a, va] = keys[i - 1];
      const [b, vb] = keys[i];
      return va + (vb - va) * smooth((t - a) / (b - a));
    }
  }
  return keys[keys.length - 1][1];
}

const lerpAngle = (a, b, k) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
};

// Deplacement : [{ t, x, z, face, y }]. La phase de marche vient de la distance
// parcourue, pas du temps : les pas restent coherents quand on remonte.
export function sampleTrack(track, t) {
  let i = 0;
  while (i < track.length - 2 && t > track[i + 1].t) i++;
  const a = track[i];
  const b = track[Math.min(i + 1, track.length - 1)];
  const u = b === a ? 0 : clamp01((t - a.t) / (b.t - a.t));
  const k = smooth(u);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz);
  let dist = 0;
  for (let j = 0; j < i; j++) dist += Math.hypot(track[j + 1].x - track[j].x, track[j + 1].z - track[j].z);
  dist += len * k;
  const moving = len > 0.02 && t > a.t && t < b.t ? Math.pow(Math.sin(Math.PI * u), 0.4) : 0;

  const fa = a.face ?? 0;
  const fb = b.face ?? fa;
  let face;
  if (len > 0.02) {
    const dir = Math.atan2(dx, dz);
    face = u < 0.16 ? lerpAngle(fa, dir, smooth(u / 0.16)) : u > 0.84 ? lerpAngle(dir, fb, smooth((u - 0.84) / 0.16)) : dir;
  } else {
    face = lerpAngle(fa, fb, k);
  }
  return {
    x: a.x + dx * k,
    z: a.z + dz * k,
    y: (a.y ?? 0) + ((b.y ?? a.y ?? 0) - (a.y ?? 0)) * k,
    face,
    dist,
    moving
  };
}

// Camera : un seul plan-sequence, sans coupe. Interpolation monotone : la camera passe par
// chaque image-cle sans s'y arreter, ne depasse jamais sa cible et reste immobile entre
// deux images-cles identiques, ce qui garde les cadrages fixes des interactions.
const SLOPES = new WeakMap();
const camValues = (k) => [...k.pos, ...k.look, k.fov];
function cameraSlopes(keys) {
  let all = SLOPES.get(keys);
  if (all) return all;
  const n = keys.length;
  const values = keys.map(camValues);
  all = values.map(() => new Array(7).fill(0));
  for (let c = 0; c < 7; c++) {
    for (let i = 1; i < n - 1; i++) {
      const h0 = keys[i].t - keys[i - 1].t;
      const h1 = keys[i + 1].t - keys[i].t;
      if (h0 <= 0 || h1 <= 0) continue;
      const d0 = (values[i][c] - values[i - 1][c]) / h0;
      const d1 = (values[i + 1][c] - values[i][c]) / h1;
      if (d0 * d1 <= 0) continue;
      const w0 = 2 * h1 + h0;
      const w1 = h1 + 2 * h0;
      all[i][c] = (w0 + w1) / (w0 / d0 + w1 / d1);
    }
  }
  SLOPES.set(keys, all);
  return all;
}
const camOut = new Array(7);
export function sampleCamera(keys, t, outPos, outLook) {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const h = b.t - a.t;
  const u = h > 0 ? clamp01((t - a.t) / h) : 1;
  const slopes = cameraSlopes(keys);
  const va = camValues(a);
  const vb = camValues(b);
  const u2 = u * u;
  const u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;
  for (let c = 0; c < 7; c++) {
    camOut[c] = h00 * va[c] + h10 * h * slopes[i][c] + h01 * vb[c] + h11 * h * slopes[i + 1][c];
  }
  outPos.set(camOut[0], camOut[1], camOut[2]);
  outLook.set(camOut[3], camOut[4], camOut[5]);
  return camOut[6];
}
