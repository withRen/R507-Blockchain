// Personnages adultes construits en code. 9 articulations (hanches, genoux, epaules, coudes,
// tete), chacune en un seul maillage : 10 appels de dessin par personnage.
import * as THREE from 'three';
import { Kit } from './kit.js';

// Un peu plus claire que le decor, pour bien detacher les personnages
const skinMaterial = new THREE.MeshLambertMaterial({ vertexColors: true, color: new THREE.Color(1.7, 1.7, 1.7) });
const cloth = (kit) => new THREE.Mesh(kit.geometry(), skinMaterial);

const sphere = new THREE.SphereGeometry(1, 20, 14);
const medSphere = new THREE.SphereGeometry(1, 12, 9);
const small = new THREE.SphereGeometry(1, 8, 6);
const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 3, 12);
const cone = (a, b, h) => new THREE.CylinderGeometry(a, b, h, 20, 1);

export function createFigure(spec) {
  const {
    skin = 0xd9ab8e,
    hair = 0x201814,
    eyes = 0x3b4d63,
    jacket = 0x1b2130,
    shirt = 0xcfd3db,
    trousers = 0x161a24,
    shoes = 0x0b0b0e,
    belt = 0x151210,
    buckle = 0xb8bec9,
    height = 1,
    shoulders = 1,
    seed = 0.3,
    style = {}
  } = spec;
  const H = height;
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const hipY = 0.88 * H;
  const torsoH = 0.54 * H;
  const sw = 0.195 * shoulders;

  // ---------- Buste : veste taillee, chemise, ceinture en cuir et boucle metallique ----------
  const torso = new Kit();
  const torsoLeather = torso;
  const torsoMetal = torso;

  // Volume thoracique et taille cintrée
  torso.add(cone(sw * 0.99, sw * 0.78, torsoH * 0.62), jacket, { p: [0, hipY + torsoH * 0.69, 0], s: [1, 1, 0.63] });
  torso.add(cone(sw * 0.78, sw * 0.84, torsoH * 0.42), jacket, { p: [0, hipY + torsoH * 0.21, 0], s: [1, 1, 0.61] });
  // Epaules structurées et bassin
  torso.add(sphere, jacket, { p: [0, hipY + torsoH - 0.014, 0], s: [sw * 1.04, 0.062, sw * 0.62] });
  torso.add(medSphere, jacket, { p: [sw * 0.92, hipY + torsoH - 0.03, 0], s: [0.052, 0.048, 0.056] });
  torso.add(medSphere, jacket, { p: [-sw * 0.92, hipY + torsoH - 0.03, 0], s: [0.052, 0.048, 0.056] });
  torso.add(sphere, trousers, { p: [0, hipY - 0.01, 0], s: [sw * 0.85, 0.105, sw * 0.59] });

  // Pans avant de la veste, col montant et revers crantés
  const lapel = new THREE.Color(jacket).multiplyScalar(1.32).getHex();
  const jacketDark = new THREE.Color(jacket).multiplyScalar(0.76).getHex();
  torso.box(sw * 0.52, torsoH * 0.88, 0.018, jacket, { p: [sw * 0.44, hipY + torsoH * 0.46, sw * 0.54], r: [0, 0.12, 0] });
  torso.box(sw * 0.52, torsoH * 0.88, 0.018, jacket, { p: [-sw * 0.44, hipY + torsoH * 0.46, sw * 0.54], r: [0, -0.12, 0] });
  // Plastron de chemise et col
  torso.add(new THREE.ConeGeometry(0.072, 0.24, 4), shirt, { p: [0, hipY + torsoH - 0.095, sw * 0.565], r: [Math.PI, Math.PI / 4, 0], s: [1, 1, 0.18] });
  torso.box(0.055, 0.045, 0.015, shirt, { p: [0.032, hipY + torsoH - 0.01, sw * 0.45], r: [0.2, 0.3, -0.35] });
  torso.box(0.055, 0.045, 0.015, shirt, { p: [-0.032, hipY + torsoH - 0.01, sw * 0.45], r: [0.2, -0.3, 0.35] });
  // Revers de veste
  torso.box(0.038, 0.25, 0.014, lapel, { p: [0.054, hipY + torsoH - 0.135, sw * 0.595], r: [0, 0.08, 0.28] });
  torso.box(0.038, 0.25, 0.014, lapel, { p: [-0.054, hipY + torsoH - 0.135, sw * 0.595], r: [0, -0.08, -0.28] });
  // Col de veste autour de la nuque
  torso.add(new THREE.CylinderGeometry(0.068, 0.076, 0.045, 16, 1, false, Math.PI * 0.25, Math.PI * 1.5), lapel, { p: [0, hipY + torsoH + 0.008, -0.006] });
  // Rabats de poches laterales
  torso.box(0.065, 0.022, 0.01, lapel, { p: [sw * 0.56, hipY + 0.11, sw * 0.52], r: [0, 0.22, 0] });
  torso.box(0.065, 0.022, 0.01, lapel, { p: [-sw * 0.56, hipY + 0.11, sw * 0.52], r: [0, -0.22, 0] });
  torso.box(0.014, torsoH * 0.52, 0.008, jacketDark, { p: [0, hipY + torsoH * 0.32, -sw * 0.58] });

  // Ceinture en cuir et boucle metallique
  torsoLeather.add(new THREE.CylinderGeometry(sw * 0.845, sw * 0.845, 0.034, 24), belt, { p: [0, hipY + 0.024, 0], s: [1, 1, 0.62] });
  torsoMetal.box(0.036, 0.038, 0.012, buckle, { p: [0, hipY + 0.024, sw * 0.53] });
  torsoMetal.box(0.01, 0.01, 0.008, buckle, { p: [-0.022, hipY + torsoH * 0.38, sw * 0.59] });
  torsoMetal.box(0.01, 0.01, 0.008, buckle, { p: [-0.022, hipY + torsoH * 0.24, sw * 0.59] });

  style.torso?.(torso, { hipY, torsoH, sw, H, leather: torsoLeather, metal: torsoMetal });
  body.add(cloth(torso));

  // ---------- Tete : peau, yeux humides avec iris, cheveux et accessoires ----------
  const head = new THREE.Group();
  head.position.set(0, hipY + torsoH, 0);
  const hk = new Kit();
  const hairKit = hk;
  const eyeKit = hk;
  const headMetal = hk;

  const skinDark = new THREE.Color(skin).multiplyScalar(0.76).getHex();
  const skinWarm = new THREE.Color(skin).lerp(new THREE.Color(0xc46b5e), 0.22).getHex();
  const lipUpper = new THREE.Color(skin).lerp(new THREE.Color(0x8f4642), 0.38).getHex();
  const lipLower = new THREE.Color(skin).lerp(new THREE.Color(0xa6554e), 0.32).getHex();

  // Cou anatomique et base de la gorge
  hk.add(new THREE.CylinderGeometry(0.05, 0.062, 0.105, 16), skin, { p: [0, 0.046, -0.004] });
  hk.add(small, skinDark, { p: [0, 0.088, 0.026], s: [0.048, 0.025, 0.048] });
  // Crane, pommettes, machoire et menton
  hk.add(sphere, skin, { p: [0, 0.178, 0.006], s: [0.091, 0.116, 0.103] });
  hk.add(medSphere, skin, { p: [0, 0.116, 0.024], s: [0.068, 0.068, 0.075] });
  hk.add(small, skin, { p: [0, 0.082, 0.066], s: [0.026, 0.022, 0.028] }); // Menton
  hk.add(small, skinWarm, { p: [0.052, 0.152, 0.068], s: [0.028, 0.024, 0.026] }); // Pommette G
  hk.add(small, skinWarm, { p: [-0.052, 0.152, 0.068], s: [0.028, 0.024, 0.026] }); // Pommette D

  // Nez sculpté : arête, pointe et ailes
  hk.box(0.016, 0.042, 0.024, skin, { p: [0, 0.174, 0.098], r: [-0.22, 0, 0] });
  hk.add(small, skinWarm, { p: [0, 0.156, 0.111], s: [0.013, 0.012, 0.015] });
  hk.add(small, skin, { p: [0.011, 0.154, 0.103], s: [0.008, 0.008, 0.01] });
  hk.add(small, skin, { p: [-0.011, 0.154, 0.103], s: [0.008, 0.008, 0.01] });

  // Oreilles sculptees (pavillon, lobe)
  hk.add(small, skin, { p: [0.092, 0.168, -0.004], r: [0, -0.18, 0.08], s: [0.012, 0.031, 0.021] });
  hk.add(small, skinDark, { p: [0.089, 0.168, -0.002], s: [0.007, 0.018, 0.011] });
  hk.add(small, skin, { p: [-0.092, 0.168, -0.004], r: [0, 0.18, -0.08], s: [0.012, 0.031, 0.021] });
  hk.add(small, skinDark, { p: [-0.089, 0.168, -0.002], s: [0.007, 0.018, 0.011] });

  // Arcades sourcilières et paupières
  hk.add(small, skin, { p: [0.036, 0.2, 0.093], r: [0, -0.15, -0.05], s: [0.028, 0.008, 0.013] });
  hk.add(small, skin, { p: [-0.036, 0.2, 0.093], r: [0, 0.15, 0.05], s: [0.028, 0.008, 0.013] });
  hk.add(small, skinDark, { p: [0.036, 0.19, 0.095], s: [0.016, 0.005, 0.009] });
  hk.add(small, skinDark, { p: [-0.036, 0.19, 0.095], s: [0.016, 0.005, 0.009] });

  // Bouche : lèvre supérieure et lèvre inférieure
  hk.add(small, lipUpper, { p: [0, 0.131, 0.093], s: [0.023, 0.0045, 0.009] });
  hk.add(small, lipLower, { p: [0, 0.124, 0.092], s: [0.021, 0.0055, 0.009] });

  // Yeux : sclère blanche, iris coloré et pupille
  [1, -1].forEach((sgn) => {
    const ex = sgn * 0.035;
    eyeKit.add(small, 0xf2f4f8, { p: [ex, 0.185, 0.092], s: [0.0135, 0.0085, 0.009] });
    eyeKit.add(small, eyes, { p: [ex, 0.185, 0.0975], s: [0.0072, 0.0072, 0.004] });
    eyeKit.add(small, 0x07090d, { p: [ex, 0.185, 0.0998], s: [0.0038, 0.0038, 0.0025] });
  });

  // Sourcils dans le maillage capillaire
  const browHex = new THREE.Color(hair).multiplyScalar(0.85).getHex();
  hairKit.add(small, browHex, { p: [0.036, 0.203, 0.096], r: [0, -0.15, -0.06], s: [0.026, 0.0045, 0.008] });
  hairKit.add(small, browHex, { p: [-0.036, 0.203, 0.096], r: [0, 0.15, 0.06], s: [0.026, 0.0045, 0.008] });

  style.head?.(hairKit, { hair, skinKit: hk, metalKit: headMetal });
  head.add(new THREE.Mesh(hk.geometry(), skinMaterial));
  body.add(head);

  // ---------- Bras a deux segments : manche, poignet de chemise, montre et main sculptee ----------
  const arm = (sign) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(sign * (sw + 0.025), hipY + torsoH - 0.025, 0);
    const upper = new Kit();
    upper.add(cap(0.045, 0.245 * H), style.sleeve ?? jacket, { p: [0, -0.15 * H, 0] });
    shoulder.add(cloth(upper));

    const elbow = new THREE.Group();
    elbow.position.y = -0.3 * H;
    const fore = new Kit();
    const foreSkin = fore;
    const foreLeather = fore;
    const foreMetal = fore;

    fore.add(cap(0.037, 0.22 * H), style.sleeve ?? jacket, { p: [0, -0.128 * H, 0] });
    // Poignet de chemise qui depasse de la veste
    fore.add(new THREE.CylinderGeometry(0.032, 0.031, 0.026, 14), shirt, { p: [0, -0.248 * H, 0] });

    // Montre-bracelet au poignet gauche
    if (sign > 0) {
      foreLeather.add(new THREE.CylinderGeometry(0.0335, 0.0335, 0.014, 16), belt, { p: [0, -0.256 * H, 0] });
      foreMetal.add(new THREE.CylinderGeometry(0.014, 0.014, 0.006, 14), buckle, { p: [sign * 0.031, -0.256 * H, 0], r: [0, 0, Math.PI / 2] });
    }

    // Main sculptée : paume, pouce et doigts légèrement fléchis
    const wy = -0.295 * H;
    foreSkin.box(0.026, 0.056, 0.044, skin, { p: [0, wy, 0.004] }); // Paume
    foreSkin.add(cap(0.0085, 0.028), skin, { p: [0, wy - 0.012, 0.028], r: [0.45, 0, 0] }); // Pouce
    foreSkin.box(0.024, 0.04, 0.042, skin, { p: [-sign * 0.003, wy - 0.042, 0.004], r: [0, 0, sign * 0.15] }); // Doigts

    style.hand?.(fore, { sign, H, leather: foreLeather, metal: foreMetal, skin: foreSkin });
    elbow.add(cloth(fore));
    shoulder.add(elbow);
    body.add(shoulder);
    return { shoulder, elbow };
  };
  const L = arm(1);
  const R = arm(-1);

  // ---------- Jambes a deux segments : pantalon taille et chaussure en cuir ----------
  const leg = (sign) => {
    const hip = new THREE.Group();
    hip.position.set(sign * sw * 0.44, hipY, 0);
    const thigh = new Kit();
    thigh.add(cap(0.066, 0.34 * H), trousers, { p: [0, -0.2 * H, 0] });
    hip.add(cloth(thigh));

    const knee = new THREE.Group();
    knee.position.y = -0.41 * H;
    const shin = new Kit();
    shin.add(cap(0.05, 0.335 * H), trousers, { p: [0, -0.195 * H, 0] });
    // Ourlet du pantalon
    shin.add(new THREE.CylinderGeometry(0.048, 0.051, 0.028, 16), trousers, { p: [0, -0.38 * H, 0] });

    // Chaussure sculptee en cuir : semelle, talon, empeigne et bout
    const shoeKit = shin;
    const sy = -0.43 * H;
    const soleColor = new THREE.Color(shoes).multiplyScalar(0.55).getHex();
    shoeKit.box(0.082, 0.016, 0.21, soleColor, { p: [0, sy - 0.022, 0.042] }); // Semelle
    shoeKit.box(0.078, 0.022, 0.065, soleColor, { p: [0, sy - 0.018, -0.028] }); // Talon
    shoeKit.add(medSphere, shoes, { p: [0, sy, 0.012], s: [0.044, 0.036, 0.072] }); // Quartier cheville
    shoeKit.add(medSphere, shoes, { p: [0, sy - 0.006, 0.075], s: [0.042, 0.028, 0.078] }); // Empeigne et bout

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
  // Alice Vasseur : auditrice. Long manteau anthracite, echarpe bleue, carre net
  alice: {
    seed: 0.41, height: 0.98, shoulders: 0.88, skin: 0xe0b69e, hair: 0x181315, eyes: 0x4a6b8c, jacket: 0x1d222d, trousers: 0x12141a, shirt: 0xcfd3db,
    style: {
      torso(k, { hipY, torsoH, sw }) {
        k.add(new THREE.CylinderGeometry(0.076, 0.088, 0.078, 16, 1, false, Math.PI * 0.15, Math.PI * 1.7), 0x161a22, { p: [0, hipY + torsoH + 0.025, -0.008] });
        k.add(new THREE.CylinderGeometry(sw * 0.78, sw * 1.08, 0.58, 20), 0x1e232e, { p: [0, hipY - 0.22, 0], s: [1, 1, 0.66] });
        k.box(0.062, 0.26, 0.018, 0x283870, { p: [0.038, hipY + torsoH - 0.12, sw * 0.6], r: [0, 0, -0.06] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.208, -0.012], s: [0.096, 0.108, 0.104] });
        k.box(0.086, 0.088, 0.034, hair, { p: [0, 0.138, -0.086], r: [0.36, 0, 0] });
        k.add(medSphere, hair, { p: [0.062, 0.185, 0.036], r: [0.15, 0, -0.22], s: [0.046, 0.082, 0.062] });
        k.add(medSphere, hair, { p: [-0.066, 0.178, 0.04], r: [0.15, 0, 0.25], s: [0.044, 0.088, 0.064] });
      }
    }
  },
  // Bob Lemoine : dirigeant. Grand, costume marine ouvert, cravate ardoise, cheveux gris courts
  bob: {
    seed: 0.77, height: 1.06, shoulders: 1.16, skin: 0xc99a7c, hair: 0x74767c, eyes: 0x4e6478, jacket: 0x1b2743, trousers: 0x172036, shirt: 0xe6e6e6,
    style: {
      torso(k, { hipY, torsoH, sw, metal }) {
        // Cravate bleu ardoise et pince de cravate en argent
        k.box(0.034, 0.24, 0.012, 0x2c426e, { p: [0, hipY + torsoH - 0.15, sw * 0.585] });
        k.box(0.038, 0.034, 0.015, 0x233559, { p: [0, hipY + torsoH - 0.04, sw * 0.58] });
        metal.box(0.036, 0.006, 0.016, 0xd8dfe8, { p: [0, hipY + torsoH - 0.16, sw * 0.592] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.208, -0.014], s: [0.097, 0.094, 0.103] });
        k.add(medSphere, hair, { p: [0, 0.252, 0.024], s: [0.076, 0.034, 0.072] });
        k.box(0.014, 0.045, 0.022, hair, { p: [0.088, 0.185, 0.018] });
        k.box(0.014, 0.045, 0.022, hair, { p: [-0.088, 0.185, 0.018] });
      }
    }
  },
  // Ines Haddad : ingenieure. Veste graphite, cordon et badge lumineux, lunettes fines en metal
  ines: {
    seed: 0.13, height: 0.94, shoulders: 0.82, skin: 0xb98563, hair: 0x0f0b0a, eyes: 0x3b2618, jacket: 0x31363a, trousers: 0x191b1f, shirt: 0x8d939c,
    style: {
      torso(k, { hipY, torsoH, sw, metal }) {
        // Cordon tour de cou et porte-badge technique
        k.box(0.012, 0.21, 0.012, 0x5c73d6, { p: [0.024, hipY + torsoH - 0.13, sw * 0.6], r: [0, 0, 0.12] });
        k.box(0.012, 0.21, 0.012, 0x5c73d6, { p: [-0.024, hipY + torsoH - 0.13, sw * 0.6], r: [0, 0, -0.12] });
        metal.box(0.018, 0.016, 0.014, 0xc8d0de, { p: [0, hipY + torsoH - 0.235, sw * 0.62] });
        k.box(0.056, 0.078, 0.012, 0x1e2433, { p: [0, hipY + torsoH - 0.285, sw * 0.625] });
        k.box(0.048, 0.064, 0.014, 0xd8e2ff, { p: [0, hipY + torsoH - 0.285, sw * 0.63] });
      },
      head(k, { hair, metalKit }) {
        k.add(sphere, hair, { p: [0, 0.202, -0.016], s: [0.101, 0.112, 0.109] });
        k.add(sphere, hair, { p: [0, 0.132, -0.048], s: [0.097, 0.094, 0.074] });
        k.add(medSphere, hair, { p: [0.075, 0.155, 0.025], s: [0.032, 0.075, 0.055] });
        k.add(medSphere, hair, { p: [-0.075, 0.155, 0.025], s: [0.032, 0.075, 0.055] });
        // Monture de lunettes metallique fine + pont et branches
        const ring = new THREE.TorusGeometry(0.024, 0.0026, 5, 14);
        metalKit.add(ring, 0xc4ccd9, { p: [0.037, 0.186, 0.104] });
        metalKit.add(ring, 0xc4ccd9, { p: [-0.037, 0.186, 0.104] });
        metalKit.box(0.026, 0.003, 0.003, 0xc4ccd9, { p: [0, 0.188, 0.104] });
        metalKit.box(0.0025, 0.003, 0.095, 0xc4ccd9, { p: [0.062, 0.186, 0.055] });
        metalKit.box(0.0025, 0.003, 0.095, 0xc4ccd9, { p: [-0.062, 0.186, 0.055] });
      }
    }
  },
  // Mallory Kern : directrice des operations. Long manteau rouge bordeaux, haut col structure, double boutonnage or
  mallory: {
    seed: 0.62, height: 1.0, shoulders: 0.9, skin: 0xdcb7a1, hair: 0x120d0d, eyes: 0x3b593f, jacket: 0x5e1519, trousers: 0x151014, shirt: 0x21181a, buckle: 0xd4af6a,
    style: {
      torso(k, { hipY, torsoH, sw, leather, metal }) {
        k.add(new THREE.CylinderGeometry(sw * 0.84, sw * 1.28, 0.72, 26), 0x5e1519, { p: [0, hipY - 0.29, 0], s: [1, 1, 0.7] });
        k.add(new THREE.CylinderGeometry(sw * 0.5, sw * 0.62, 0.115, 18), 0x4a1014, { p: [0, hipY + torsoH + 0.022, 0] });
        leather.add(new THREE.CylinderGeometry(sw * 0.85, sw * 0.85, 0.042, 24), 0x2b0a0d, { p: [0, hipY + 0.05, 0], s: [1, 1, 0.65] });
        // Double boutonnage dore
        [0.14, 0.26, 0.38].forEach((dy) => {
          metal.add(small, 0xd4af6a, { p: [0.048, hipY + dy, sw * 0.58], s: [0.008, 0.008, 0.005] });
          metal.add(small, 0xd4af6a, { p: [-0.048, hipY + dy, sw * 0.58], s: [0.008, 0.008, 0.005] });
        });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.202, -0.018], s: [0.1, 0.112, 0.108] });
        k.add(sphere, hair, { p: [0, 0.112, -0.058], s: [0.098, 0.135, 0.068] });
        k.add(medSphere, hair, { p: [0.078, 0.135, 0.012], s: [0.028, 0.095, 0.048] });
        k.add(medSphere, hair, { p: [-0.078, 0.135, 0.012], s: [0.028, 0.095, 0.048] });
      }
    }
  },
  // Theo Marchetti : exploitant de minage. Tablier de cuir cognac veritable, bretelles et barbe
  theo: {
    seed: 0.53, height: 1.0, shoulders: 1.1, skin: 0xb98a68, hair: 0x2a1f19, eyes: 0x4a3520, jacket: 0x2e2b28, trousers: 0x201e1d, shirt: 0x8a837a, belt: 0x5c3412, buckle: 0xc99b49,
    style: {
      torso(k, { hipY, torsoH, sw, leather, metal }) {
        // Tablier d'atelier en vrai materiau cuir (et non laine)
        leather.add(
          new THREE.CylinderGeometry(sw * 0.73, sw * 1.04, torsoH * 1.48, 22, 1, false, -1.08, 2.16),
          0xa85f1c,
          { p: [0, hipY + torsoH * 0.18, 0.012], s: [1.05, 1, 0.77] }
        );
        // Poche pectorale en cuir et bretelles
        leather.box(0.11, 0.095, 0.018, 0x8a4b12, { p: [0, hipY + torsoH * 0.55, sw * 0.62] });
        leather.box(0.026, 0.18, 0.014, 0x6e3a0c, { p: [0.058, hipY + torsoH * 0.82, sw * 0.56], r: [-0.25, 0, -0.1] });
        leather.box(0.026, 0.18, 0.014, 0x6e3a0c, { p: [-0.058, hipY + torsoH * 0.82, sw * 0.56], r: [-0.25, 0, 0.1] });
        metal.box(0.016, 0.016, 0.012, 0xd4a24c, { p: [0.054, hipY + torsoH * 0.72, sw * 0.61] });
        metal.box(0.016, 0.016, 0.012, 0xd4a24c, { p: [-0.054, hipY + torsoH * 0.72, sw * 0.61] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.206, -0.014], s: [0.098, 0.096, 0.104] });
        k.add(medSphere, hair, { p: [0, 0.248, 0.025], s: [0.082, 0.038, 0.075] });
        // Barbe complete et moustache sculptees
        k.add(medSphere, hair, { p: [0, 0.114, 0.046], s: [0.076, 0.062, 0.068] });
        k.add(small, hair, { p: [0, 0.138, 0.094], s: [0.028, 0.008, 0.012] });
      }
    }
  },
  // Clara Nguyen : gerante de fonds. Tailleur turquoise sombre cintre
  clara: {
    seed: 0.84, height: 0.96, shoulders: 0.88, skin: 0xe2c0a2, hair: 0x0e0c0c, eyes: 0x261c16, jacket: 0x12545a, trousers: 0x13272a, shirt: 0xdde6e6,
    style: {
      torso(k, { hipY, torsoH, sw, metal }) {
        metal.add(small, 0xe0c878, { p: [0, hipY + torsoH - 0.06, sw * 0.56], s: [0.008, 0.008, 0.006] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.202, -0.015], s: [0.1, 0.11, 0.106] });
        k.add(sphere, hair, { p: [0, 0.122, -0.042], s: [0.102, 0.1, 0.082] });
        k.add(medSphere, hair, { p: [0.072, 0.148, 0.022], s: [0.028, 0.082, 0.052] });
        k.add(medSphere, hair, { p: [-0.072, 0.148, 0.022], s: [0.028, 0.082, 0.052] });
      }
    }
  },
  // Helene Aubert : regulatrice. Tailleur violet gris, broche en argent, cheveux gris courts
  helene: {
    seed: 0.07, height: 0.98, shoulders: 0.92, skin: 0xdab69e, hair: 0x9c9fa6, eyes: 0x52657a, jacket: 0x3c3560, trousers: 0x1e1b30, shirt: 0xe6e4ee,
    style: {
      torso(k, { hipY, torsoH, sw, metal }) {
        metal.box(0.022, 0.008, 0.008, 0xd8dfe8, { p: [-0.058, hipY + torsoH - 0.1, sw * 0.61], r: [0, 0, -0.3] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.206, -0.016], s: [0.099, 0.102, 0.105] });
        k.add(medSphere, hair, { p: [0, 0.246, 0.018], s: [0.082, 0.036, 0.078] });
        k.add(medSphere, hair, { p: [0, 0.155, -0.086], s: [0.068, 0.052, 0.044] });
      }
    }
  },
  // Gaspard Roche : directeur general. Costume noir sur mesure, cravate bordeaux, attache-case en cuir et acier
  gaspard: {
    seed: 0.29, height: 1.02, shoulders: 1, skin: 0xa98670, hair: 0x7c8087, eyes: 0x424c58, jacket: 0x0d0e13, trousers: 0x0b0c10, shirt: 0xf1f1f1, buckle: 0xd4af6a,
    style: {
      torso(k, { hipY, torsoH, sw, metal }) {
        // Cravate bordeaux, pince doree et pochette blanche
        k.box(0.032, 0.22, 0.012, 0x7a1f1f, { p: [0, hipY + torsoH - 0.135, sw * 0.6] });
        k.box(0.036, 0.032, 0.015, 0x5e1616, { p: [0, hipY + torsoH - 0.038, sw * 0.59] });
        k.box(0.042, 0.014, 0.008, 0xf4f6fa, { p: [-0.068, hipY + torsoH - 0.12, sw * 0.57], r: [0, -0.15, 0.08] });
        metal.box(0.032, 0.005, 0.015, 0xd4af6a, { p: [0, hipY + torsoH - 0.145, sw * 0.608] });
      },
      head(k, { hair }) {
        k.add(sphere, hair, { p: [0, 0.206, -0.018], s: [0.097, 0.098, 0.104] });
        k.add(medSphere, hair, { p: [0, 0.25, 0.01], s: [0.078, 0.034, 0.08] });
      },
      hand(k, { sign, H, leather, metal }) {
        if (sign < 0) {
          // Attache-case executif en cuir graine et renforts metalliques
          leather.box(0.088, 0.3, 0.42, 0x1c1411, { p: [0, -0.52 * H, 0.02] });
          leather.box(0.022, 0.042, 0.13, 0x1c1411, { p: [0, -0.348 * H, 0.02] });
          metal.box(0.092, 0.012, 0.424, 0xb8bec9, { p: [0, -0.372 * H, 0.02] });
          metal.box(0.094, 0.026, 0.032, 0xd4af6a, { p: [0, -0.375 * H, 0.12] });
          metal.box(0.094, 0.026, 0.032, 0xd4af6a, { p: [0, -0.375 * H, -0.08] });
        }
      }
    }
  }
};
