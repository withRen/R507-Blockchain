// Personnages adultes : proportions reelles, silhouettes sobres, sans traits de visage.
// 9 articulations (hanches, genoux, epaules, coudes, tete), chacune un seul maillage.
import * as THREE from 'three';
import { Kit } from './kit.js';
import { surface, textured } from './assets.js';

const skinMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.52, metalness: 0, envMapIntensity: 0.55 });
const cloth = (kit) => textured(kit, surface('poly_wool_herringbone', { map: false, normalScale: 0.75, roughness: 1, envMapIntensity: 0.45 }), 0.2);

const sphere = new THREE.SphereGeometry(1, 20, 16);
const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14);
const cone = (a, b, h) => new THREE.CylinderGeometry(a, b, h, 22, 1);

export function createFigure(spec) {
  const {
    skin = 0xd9ab8e, hair = 0x201814, jacket = 0x1b2130, shirt = 0xcfd3db, trousers = 0x161a24, shoes = 0x0b0b0e,
    height = 1, shoulders = 1, seed = 0.3, style = {}
  } = spec;
  const H = height;
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const hipY = 0.88 * H;
  const torsoH = 0.54 * H;
  const sw = 0.195 * shoulders;

  // Buste
  const torso = new Kit();
  torso.add(cone(sw * 0.98, sw * 0.8, torsoH), jacket, { p: [0, hipY + torsoH / 2, 0], s: [1, 1, 0.62] });
  torso.add(sphere, jacket, { p: [0, hipY + torsoH - 0.015, 0], s: [sw * 1.02, 0.058, sw * 0.6] });
  torso.add(sphere, trousers, { p: [0, hipY, 0], s: [sw * 0.84, 0.1, sw * 0.58] });
  // Col et chemise
  torso.add(new THREE.ConeGeometry(0.065, 0.2, 3), shirt, { p: [0, hipY + torsoH - 0.09, sw * 0.585], r: [Math.PI, 0, 0], s: [1, 1, 0.12] });
  style.torso?.(torso, { hipY, torsoH, sw, H });
  body.add(cloth(torso));

  // Tete
  const head = new THREE.Group();
  head.position.set(0, hipY + torsoH, 0);
  const hk = new Kit();
  hk.add(new THREE.CylinderGeometry(0.052, 0.062, 0.1, 12), skin, { p: [0, 0.045, 0] });
  hk.add(sphere, skin, { p: [0, 0.175, 0.008], s: [0.092, 0.118, 0.104] });
  hk.add(sphere, skin, { p: [0, 0.158, 0.105], s: [0.016, 0.026, 0.02] });
  style.head?.(hk, { hair });
  head.add(new THREE.Mesh(hk.geometry(), skinMaterial));
  body.add(head);

  // Bras a deux segments
  const arm = (sign) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(sign * (sw + 0.025), hipY + torsoH - 0.025, 0);
    const upper = new Kit();
    upper.add(cap(0.044, 0.245 * H), style.sleeve ?? jacket, { p: [0, -0.15 * H, 0] });
    shoulder.add(cloth(upper));
    const elbow = new THREE.Group();
    elbow.position.y = -0.3 * H;
    const fore = new Kit();
    fore.add(cap(0.037, 0.23 * H), style.sleeve ?? jacket, { p: [0, -0.135 * H, 0] });
    fore.add(sphere, skin, { p: [0, -0.3 * H, 0], s: [0.038, 0.058, 0.03] });
    style.hand?.(fore, { sign, H });
    elbow.add(cloth(fore));
    shoulder.add(elbow);
    body.add(shoulder);
    return { shoulder, elbow };
  };
  const L = arm(1);
  const R = arm(-1);

  // Jambes a deux segments
  const leg = (sign) => {
    const hip = new THREE.Group();
    hip.position.set(sign * sw * 0.44, hipY, 0);
    const thigh = new Kit();
    thigh.add(cap(0.066, 0.34 * H), trousers, { p: [0, -0.2 * H, 0] });
    hip.add(cloth(thigh));
    const knee = new THREE.Group();
    knee.position.y = -0.41 * H;
    const shin = new Kit();
    shin.add(cap(0.05, 0.34 * H), trousers, { p: [0, -0.2 * H, 0] });
    shin.add(sphere, shoes, { p: [0, -0.43 * H, 0.05], s: [0.05, 0.036, 0.122] });
    knee.add(cloth(shin));
    hip.add(knee);
    root.add(hip);
    return { hip, knee };
  };
  const LL = leg(1);
  const RL = leg(-1);

  function pose({
    walk = 0, moving = 0, armLx = 0, armLz = 0, armRx = 0, armRz = 0, elbowL = 0.18, elbowR = 0.18,
    headYaw = 0, headPitch = 0, lean = 0, talk = 0, time = 0
  }) {
    const ph = walk * 4.3;
    const sL = Math.sin(ph) * moving;
    const sR = -sL;
    LL.hip.rotation.x = -sL * 0.5;
    RL.hip.rotation.x = -sR * 0.5;
    LL.knee.rotation.x = Math.max(0, Math.cos(ph)) * 0.75 * moving + 0.02;
    RL.knee.rotation.x = Math.max(0, -Math.cos(ph)) * 0.75 * moving + 0.02;
    const breathe = Math.sin(time * 1.25 + seed * 9);
    body.position.y = Math.abs(Math.cos(ph)) * 0.022 * moving + breathe * 0.002;
    body.rotation.x = lean + moving * 0.035;
    body.rotation.y = Math.sin(ph) * 0.05 * moving;

    const gest = talk * Math.sin(time * 2.7 + seed * 5) * 0.11;
    L.shoulder.rotation.x = sL * 0.38 - armLx;
    L.shoulder.rotation.z = 0.075 + armLz + breathe * 0.005;
    L.elbow.rotation.x = -elbowL - moving * 0.25;
    R.shoulder.rotation.x = sR * 0.38 - armRx - gest;
    R.shoulder.rotation.z = -0.075 - armRz - breathe * 0.005;
    R.elbow.rotation.x = -elbowR - moving * 0.25 - Math.max(0, gest) * 1.6;

    head.rotation.y = headYaw + talk * Math.sin(time * 1.1 + seed * 7) * 0.05;
    head.rotation.x = headPitch + talk * Math.sin(time * 3.1 + seed) * 0.022;
  }

  return { root, head, pose };
}

// ---------- La distribution ----------
export const CAST = {
  // Alice Vasseur : auditrice. Long manteau anthracite, echarpe bleue, cheveux attaches
  alice: {
    seed: 0.41, height: 0.97, shoulders: 0.88, skin: 0xe2b99f, hair: 0x2f1d15, jacket: 0x262b36, trousers: 0x14161d, shirt: 0xcfd3db,
    style: {
      torso(k, { hipY, torsoH, sw }) {
        k.add(new THREE.CylinderGeometry(sw * 0.82, sw * 1.2, 0.56, 22), 0x262b36, { p: [0, hipY - 0.21, 0], s: [1, 1, 0.68] });
        k.add(new THREE.TorusGeometry(sw * 0.42, 0.036, 8, 20), 0x4259e6, { p: [0, hipY + torsoH + 0.01, 0], r: [Math.PI / 2, 0, 0] });
        k.add(sphere, 0x4259e6, { p: [0.05, hipY + torsoH - 0.13, sw * 0.6], s: [0.042, 0.11, 0.018] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.2, -0.016], s: [0.099, 0.112, 0.106] });
        k.add(sphere, hair, { p: [0, 0.17, -0.115], s: [0.055, 0.055, 0.05] });
      }
    }
  },
  // Bob Lemoine : dirigeant. Grand, costume marine ouvert, cheveux gris courts
  bob: {
    seed: 0.77, height: 1.06, shoulders: 1.16, skin: 0xc99a7c, hair: 0x74767c, jacket: 0x1b2743, trousers: 0x172036, shirt: 0xe6e6e6,
    style: {
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.208, -0.016], s: [0.097, 0.092, 0.102] });
      }
    }
  },
  // Ines Haddad : ingenieure. Veste graphite, badge lumineux, lunettes fines
  ines: {
    seed: 0.13, height: 0.94, shoulders: 0.82, skin: 0xb98563, hair: 0x0f0b0a, jacket: 0x31363a, trousers: 0x191b1f, shirt: 0x8d939c,
    style: {
      torso(k, { hipY, torsoH, sw }) {
        k.box(0.012, 0.22, 0.012, 0x8ba0ff, { p: [0, hipY + torsoH - 0.15, sw * 0.62] });
        k.box(0.052, 0.072, 0.012, 0xcfd9ff, { p: [0, hipY + torsoH - 0.29, sw * 0.63] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.2, -0.018], s: [0.1, 0.11, 0.108] });
        k.add(sphere, hair, { p: [0, 0.13, -0.052], s: [0.095, 0.092, 0.07] });
        const ring = new THREE.TorusGeometry(0.03, 0.005, 6, 16);
        k.add(ring, 0x0a0a0c, { p: [0.038, 0.186, 0.103] });
        k.add(ring, 0x0a0a0c, { p: [-0.038, 0.186, 0.103] });
      }
    }
  },
  // Mallory Kern : directrice des operations. Long manteau rouge sombre, haut col
  mallory: {
    seed: 0.62, height: 1.0, shoulders: 0.9, skin: 0xdcb7a1, hair: 0x120d0d, jacket: 0x5e1519, trousers: 0x151014, shirt: 0x21181a,
    style: {
      torso(k, { hipY, torsoH, sw }) {
        k.add(new THREE.CylinderGeometry(sw * 0.84, sw * 1.28, 0.72, 22), 0x5e1519, { p: [0, hipY - 0.29, 0], s: [1, 1, 0.7] });
        k.add(new THREE.CylinderGeometry(sw * 0.5, sw * 0.6, 0.11, 16), 0x4a1014, { p: [0, hipY + torsoH + 0.02, 0] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.2, -0.02], s: [0.1, 0.112, 0.108] });
        k.add(sphere, hair, { p: [0, 0.115, -0.06], s: [0.098, 0.13, 0.066] });
      }
    }
  },
  // Theo Marchetti : exploitant de minage. Tablier de cuir orange
  theo: {
    seed: 0.53, height: 1.0, shoulders: 1.1, skin: 0xb98a68, hair: 0x2a1f19, jacket: 0x2e2b28, trousers: 0x201e1d, shirt: 0x8a837a,
    style: {
      torso(k, { hipY, torsoH, sw }) {
        k.add(new THREE.CylinderGeometry(sw * 0.72, sw * 1.05, torsoH * 1.5, 16, 1, false, -1.05, 2.1), 0xb06a20, { p: [0, hipY + torsoH * 0.2, 0.01], s: [1.06, 1, 0.78] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.205, -0.015], s: [0.097, 0.095, 0.102] });
        k.add(sphere, hair, { p: [0, 0.12, 0.05], s: [0.086, 0.07, 0.066] });
      }
    }
  },
  // Clara Nguyen : gerante de fonds. Tailleur turquoise sombre
  clara: {
    seed: 0.84, height: 0.96, shoulders: 0.88, skin: 0xe2c0a2, hair: 0x0e0c0c, jacket: 0x12545a, trousers: 0x13272a, shirt: 0xdde6e6,
    style: {
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.2, -0.016], s: [0.1, 0.11, 0.106] });
        k.add(sphere, hair, { p: [0, 0.12, -0.04], s: [0.102, 0.1, 0.08] });
      }
    }
  },
  // Helene Aubert : regulatrice. Tailleur violet gris, cheveux gris courts
  helene: {
    seed: 0.07, height: 0.98, shoulders: 0.92, skin: 0xdab69e, hair: 0x9c9fa6, jacket: 0x3c3560, trousers: 0x1e1b30, shirt: 0xe6e4ee,
    style: {
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.205, -0.018], s: [0.098, 0.1, 0.104] });
      }
    }
  },
  // Gaspard Roche : directeur general. Costume noir, cheveux argentes, attache-case
  gaspard: {
    seed: 0.29, height: 1.02, shoulders: 1, skin: 0xa98670, hair: 0x7c8087, jacket: 0x0d0e13, trousers: 0x0b0c10, shirt: 0xf1f1f1,
    style: {
      torso(k, { hipY, torsoH, sw }) {
        k.box(0.03, 0.2, 0.01, 0x7a1f1f, { p: [0, hipY + torsoH - 0.13, sw * 0.61] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.205, -0.018], s: [0.097, 0.098, 0.103] });
      },
      hand(k, { sign, H }) {
        if (sign < 0) {
          k.box(0.09, 0.3, 0.42, 0x1a1412, { p: [0, -0.52 * H, 0.02] });
          k.box(0.024, 0.04, 0.13, 0x8d8f92, { p: [0, -0.355 * H, 0.02] });
        }
      }
    }
  }
};
