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

// Camera : un seul plan-sequence, sans coupe
export function sampleCamera(keys, t, outPos, outLook) {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const k = smoother((t - a.t) / (b.t - a.t));
  outPos.set(a.pos[0] + (b.pos[0] - a.pos[0]) * k, a.pos[1] + (b.pos[1] - a.pos[1]) * k, a.pos[2] + (b.pos[2] - a.pos[2]) * k);
  outLook.set(a.look[0] + (b.look[0] - a.look[0]) * k, a.look[1] + (b.look[1] - a.look[1]) * k, a.look[2] + (b.look[2] - a.look[2]) * k);
  return THREE.MathUtils.lerp(a.fov, b.fov, k);
}
