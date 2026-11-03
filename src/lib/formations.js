import * as THREE from 'three';

// ============================================================
// Les "formations" : chaque etape du recit place les N petites
// infos (cubes) quelque part. Le moteur interpole d'une formation
// a la suivante pendant le defilement.
// Coordonnees : un "plateau" d'environ 13 x 8 unites centre sur 0.
// ============================================================

export const N = 1800;

const hex = (h) => new THREE.Color(h);
export const PALETTE = {
  primary: hex(0x3346d3),
  ok: hex(0x1e9e6a),
  invalid: hex(0xe0473e),
  mining: hex(0xe89a2c),
  stake: hex(0x1a9aa0),
  authority: hex(0x7357d6),
  ink2: hex(0x4a4854),
  grey: hex(0xbdb6a8),
  dust: hex(0xdcd6cb)
};

// Generateur pseudo-aleatoire reproductible (memes positions a chaque chargement)
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(507);
export const SEEDS = Array.from({ length: N }, () => ({
  a: rand(), b: rand(), c: rand(),
  dir: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize()
}));

// Bruit de fond : les infos non utilisees flottent en poussiere derriere la scene
const DUST = SEEDS.map((s) => new THREE.Vector3((s.a - 0.5) * 30, (s.b - 0.5) * 16, -4 - s.c * 12));

function hash2(i, k) {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 0x27d4eb2f, 0xc2b2ae35);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  return (h >>> 0) / 4294967296;
}

// Grille de nx * ny * nz cubes, centree
function grid(nx, ny, nz, step) {
  const out = [];
  for (let y = 0; y < ny; y++)
    for (let z = 0; z < nz; z++)
      for (let x = 0; x < nx; x++)
        out.push(new THREE.Vector3((x - (nx - 1) / 2) * step, (y - (ny - 1) / 2) * step, (z - (nz - 1) / 2) * step));
  return out;
}

// Une formation = positions, couleurs et tailles cibles (+ animation optionnelle)
function makeFormation(name, opts) {
  const f = {
    name,
    pos: new Float32Array(N * 3),
    col: new Float32Array(N * 3),
    size: new Float32Array(N),
    dust: new Uint8Array(N),
    logo: opts.logo,
    // Inclinaison du plateau : de trois quarts pour donner du relief, de face pour le logo
    tilt: opts.tilt || new THREE.Vector2(0.22, -0.32),
    bg: new THREE.Color(opts.bg),
    animate: opts.animate || null
  };
  for (let i = 0; i < N; i++) setDust(f, i);
  return f;
}
function set(f, i, p, color, size) {
  f.pos[i * 3] = p.x; f.pos[i * 3 + 1] = p.y; f.pos[i * 3 + 2] = p.z;
  f.col[i * 3] = color.r; f.col[i * 3 + 1] = color.g; f.col[i * 3 + 2] = color.b;
  f.size[i] = size;
  f.dust[i] = 0;
}
function setDust(f, i) {
  const p = DUST[i];
  f.pos[i * 3] = p.x; f.pos[i * 3 + 1] = p.y; f.pos[i * 3 + 2] = p.z;
  f.col[i * 3] = PALETTE.dust.r; f.col[i * 3 + 1] = PALETTE.dust.g; f.col[i * 3 + 2] = PALETTE.dust.b;
  f.size[i] = 0.035 + SEEDS[i].a * 0.03;
  f.dust[i] = 1;
}

// Etats du logo en fil de fer
const LOGO_CENTER = { pos: new THREE.Vector3(0, 0, 0), scale: 1.55, opacity: 1 };
const LOGO_CORNER = { pos: new THREE.Vector3(4.9, 2.7, -3), scale: 0.45, opacity: 0.35 };
const LOGO_GONE = { pos: new THREE.Vector3(0, 0, 0), scale: 2.6, opacity: 0 };

export const logoSpin = (t) => Math.sin(t * 0.35) * 0.55;

// Positions de reference partagees avec main.js (liens, etiquettes)
export const LAYOUT = {
  chainX: (b) => (b - 2) * 2.5,
  meshNodes: [],
  meshEdges: [],
  lotteryBarY: 0.7,
  consensusX: [-4.3, 0, 4.3],
  raceY: { honest: 1.4, secret: -1.4 }
};

export function buildFormations(logoSamples) {
  const F = {};
  const v = new THREE.Vector3();

  // ---------- Logo (ouverture, "ou est la piece ?", fin) ----------
  const logoFormation = (name, bg) => {
    const f = makeFormation(name, { logo: LOGO_CENTER, bg, tilt: new THREE.Vector2(0, 0) });
    f.loose = true;
    for (let i = 0; i < N; i++) set(f, i, logoSamples[i].clone().multiplyScalar(LOGO_CENTER.scale), PALETTE.primary, 0.04 + SEEDS[i].b * 0.03);
    // Les infos tournent avec la piece
    f.animate = (i, p, t, o) => {
      const a = logoSpin(t);
      const x = o.x, z = o.z;
      o.x = x * Math.cos(a) + z * Math.sin(a);
      o.z = -x * Math.sin(a) + z * Math.cos(a);
    };
    return f;
  };
  F.logo = logoFormation('logo', 0xf5f3ee);
  F.logoCenter = logoFormation('logoCenter', 0xeef1f7);
  F.outro = logoFormation('outro', 0xf5f3ee);

  // ---------- 1. Un bloc : trois couches de petites infos ----------
  {
    const f = makeFormation('block', { logo: LOGO_CORNER, bg: 0xf1f2f8 });
    const colors = [PALETTE.primary, PALETTE.ink2, PALETTE.mining];
    const slabY = [1.2, 0, -1.2];
    for (let i = 0; i < 600; i++) {
      const k = Math.floor(i / 200);
      const j = i % 200;
      v.set(((j % 10) - 4.5) * 0.34, slabY[k] + (Math.floor(j / 100) - 0.5) * 0.3, ((Math.floor(j / 10) % 10) - 4.5) * 0.22);
      set(f, i, v, colors[k], 0.25);
    }
    f.animate = (i, p, t, o, fx) => {
      if (i >= 600) return;
      const k = Math.floor(i / 200);
      o.y += Math.sin(t * 0.9) * 0.08 * (k - 1);
      // Quand on modifie le texte du bloc, toutes les infos "tremblent"
      if (fx.pulse > 0.01) {
        o.x += Math.sin(t * 40 + i) * 0.05 * fx.pulse;
        o.y += Math.cos(t * 37 + i) * 0.05 * fx.pulse;
      }
    };
    F.block = f;
  }

  // ---------- 2 et 3. La chaine, puis la chaine falsifiee ----------
  const chainCells = grid(5, 5, 5, 0.27);
  const chainFormation = (name, bg) => {
    const f = makeFormation(name, { logo: LOGO_CORNER, bg });
    for (let i = 0; i < 625; i++) {
      const b = Math.floor(i / 125);
      v.copy(chainCells[i % 125]).add(new THREE.Vector3(LAYOUT.chainX(b), 0, 0));
      set(f, i, v, PALETTE.primary, 0.2);
    }
    return f;
  };
  F.chain = chainFormation('chain', 0xf3f1ec);
  F.chain.animate = (i, p, t, o) => {
    if (i >= 625) return;
    o.y += Math.sin(t * 1.2 - Math.floor(i / 125) * 0.7) * 0.08;
  };
  F.tamper = chainFormation('tamper', 0xf8eeec);
  // Le bloc 3 est modifie : lui et tous les suivants deviennent rouges, en cascade
  F.tamper.animate = (i, p, t, o) => {
    if (i >= 625) return;
    const b = Math.floor(i / 125);
    if (b < 2) return;
    const reach = (p - 0.15) / 0.15;
    if (reach >= b - 2) {
      o.r = PALETTE.invalid.r; o.g = PALETTE.invalid.g; o.b = PALETTE.invalid.b;
      o.x += Math.sin(t * 22 + b) * 0.04;
    }
    if (b === 2 && p > 0.1) o.y += 0.25;
  };

  // ---------- 4. Le maillage : la piece eclate en reseau ----------
  {
    const f = makeFormation('mesh', { logo: LOGO_GONE, bg: 0xedf1f6 });
    const NODES = 14;
    for (let n = 0; n < NODES; n++) {
      const y = 1 - (n / (NODES - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = n * Math.PI * (3 - Math.sqrt(5));
      LAYOUT.meshNodes.push(new THREE.Vector3(Math.cos(th) * r * 4.6, y * 2.9, Math.sin(th) * r * 2.6));
    }
    LAYOUT.meshNodes.forEach((a, i) => {
      LAYOUT.meshNodes
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((x) => x.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          if (!LAYOUT.meshEdges.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) LAYOUT.meshEdges.push([i, j]);
        });
    });
    // Chaque noeud = un petit paquet de 125 infos : sa copie du registre
    const cells = grid(5, 5, 5, 0.13);
    for (let i = 0; i < NODES * 125; i++) {
      const n = Math.floor(i / 125);
      v.copy(cells[i % 125]).add(LAYOUT.meshNodes[n]);
      set(f, i, v, (i % 125) >= 100 ? PALETTE.ok : PALETTE.primary, 0.1);
    }
    // Le reste : des messages qui circulent sur les liaisons
    for (let i = NODES * 125; i < N; i++) set(f, i, LAYOUT.meshNodes[0], PALETTE.mining, 0.09);
    f.animate = (i, p, t, o) => {
      if (i >= NODES * 125) {
        const [a, b] = LAYOUT.meshEdges[i % LAYOUT.meshEdges.length];
        const k = (t * 0.35 + SEEDS[i].a) % 1;
        o.x = THREE.MathUtils.lerp(LAYOUT.meshNodes[a].x, LAYOUT.meshNodes[b].x, k);
        o.y = THREE.MathUtils.lerp(LAYOUT.meshNodes[a].y, LAYOUT.meshNodes[b].y, k);
        o.z = THREE.MathUtils.lerp(LAYOUT.meshNodes[a].z, LAYOUT.meshNodes[b].z, k);
      }
      const ang = t * 0.12;
      const x = o.x, z = o.z;
      o.x = x * Math.cos(ang) + z * Math.sin(ang);
      o.z = -x * Math.sin(ang) + z * Math.cos(ang);
    };
    F.mesh = f;
  }

  // ---------- 5. Le minage : une loterie d'essais ----------
  {
    const f = makeFormation('lottery', { logo: LOGO_GONE, bg: 0xf7f0e3 });
    const cells = grid(4, 4, 4, 0.36);
    const center = new THREE.Vector3(-4.2, 0, 0);
    for (let i = 0; i < 64; i++) set(f, i, cells[i].clone().add(center), PALETTE.mining, 0.28);
    for (let i = 64; i < 964; i++) {
      const s = SEEDS[i];
      set(f, i, new THREE.Vector3(-1.9 + s.a * 7.6, -2, (s.b - 0.5) * 1.6), PALETTE.grey, 0.09);
    }
    f.animate = (i, p, t, o, fx) => {
      if (i < 64) {
        // Le bloc a miner tourne sur lui-meme ; vert quand un essai gagne
        const a = t * (fx.mining ? 2.5 : 0.5);
        const dx = o.x - center.x, dz = o.z - center.z;
        o.x = center.x + dx * Math.cos(a) + dz * Math.sin(a);
        o.z = center.z - dx * Math.sin(a) + dz * Math.cos(a);
        if (fx.mined > 0) {
          const c = PALETTE.mining.clone().lerp(PALETTE.ok, fx.mined);
          o.r = c.r; o.g = c.g; o.b = c.b;
        }
        return;
      }
      if (i >= 964) return;
      // Chaque info "saute" : la hauteur atteinte suit la meme loi que les zeros
      // en tete d'une empreinte (1 chance sur 16 de monter d'un cran)
      const speed = (0.5 + SEEDS[i].c * 0.5) * (fx.mining ? 3 : 1);
      const phase = t * speed + SEEDS[i].a * 10;
      const cycle = Math.floor(phase);
      const k = phase - cycle;
      const level = Math.min(4.2, -Math.log(Math.max(hash2(i, cycle), 1e-9)) / Math.log(16));
      o.y = -2 + level * 0.9 * 4 * k * (1 - k);
      const c = level >= 3 ? PALETTE.ok : level >= 2 ? PALETTE.mining : PALETTE.grey;
      o.r = c.r; o.g = c.g; o.b = c.b;
      if (level >= 3) o.s = 0.16;
    };
    F.lottery = f;
  }

  // ---------- 6. Trois facons de decider ----------
  {
    const f = makeFormation('consensus', { logo: LOGO_GONE, bg: 0xf2f0f7 });
    const shares = [40, 25, 15, 12, 8];
    let i = 0;
    const base = -1.8;
    // Travail : colonnes de "machines", hauteur = puissance de calcul
    shares.forEach((share, c) => {
      const layers = Math.round((share / 40) * 12);
      for (let l = 0; l < layers; l++)
        for (let q = 0; q < 4; q++) {
          v.set(LAYOUT.consensusX[0] + (c - 2) * 0.62 + ((q % 2) - 0.5) * 0.24, base + l * 0.25, ((q >> 1) - 0.5) * 0.24);
          set(f, i++, v, PALETTE.mining, 0.21);
        }
    });
    const powEnd = i;
    // Enjeu : piles de jetons, hauteur = mise
    shares.forEach((share, c) => {
      const layers = Math.round((share / 40) * 12);
      for (let l = 0; l < layers; l++)
        for (let q = 0; q < 8; q++) {
          const a = (q / 8) * Math.PI * 2;
          v.set(LAYOUT.consensusX[1] + (c - 2) * 0.62 + Math.cos(a) * 0.2, base + l * 0.13, Math.sin(a) * 0.2);
          set(f, i++, v, PALETTE.stake, 0.12);
        }
    });
    const posEnd = i;
    // Autorite : trois piliers approuves, deux exclus
    for (let c = 0; c < 5; c++) {
      const allowed = c < 3;
      const layers = allowed ? 12 : 2;
      for (let l = 0; l < layers; l++)
        for (let q = 0; q < 4; q++) {
          v.set(LAYOUT.consensusX[2] + (c - 2) * 0.62 + ((q % 2) - 0.5) * 0.24, base + l * 0.25, ((q >> 1) - 0.5) * 0.24);
          set(f, i++, v, allowed ? PALETTE.authority : PALETTE.grey, 0.21);
        }
    }
    f.animate = (j, p, t, o, fx) => {
      if (j < powEnd) o.x += Math.sin(t * 45 + j) * 0.015; // les machines vibrent
      const group = j < powEnd ? 0 : j < posEnd ? 1 : 2;
      const w = fx.winners;
      if (w && j < i && w.t > 0) {
        const x0 = LAYOUT.consensusX[group] + (w.list[group] - 2) * 0.62;
        if (Math.abs(f.pos[j * 3] - x0) < 0.3) o.y += Math.sin(Math.min(1, w.t) * Math.PI) * 0.5;
      }
    };
    F.consensus = f;
  }

  // ---------- 7a. Les confirmations s'empilent ----------
  {
    const f = makeFormation('confirm', { logo: LOGO_GONE, bg: 0xeef4f0 });
    const cells = grid(4, 4, 4, 0.26);
    for (let i = 0; i < 7 * 64; i++) {
      const b = Math.floor(i / 64);
      v.copy(cells[i % 64]).add(new THREE.Vector3((b - 3) * 1.65, 0, 0));
      set(f, i, v, b === 0 ? PALETTE.primary : PALETTE.ok, 0.2);
    }
    f.animate = (i, p, t, o) => {
      if (i >= 7 * 64) return;
      const b = Math.floor(i / 64);
      if (b === 0) {
        if (p > 0.2) { o.r = PALETTE.ok.r; o.g = PALETTE.ok.g; o.b = PALETTE.ok.b; }
        return;
      }
      const appear = THREE.MathUtils.clamp((p - (0.12 + b * 0.1)) / 0.08, 0, 1);
      o.y += (1 - appear) * 4;
      o.s *= appear;
    };
    F.confirm = f;
  }

  // ---------- 7b. La course : la chaine secrete rattrape la vraie ----------
  {
    const f = makeFormation('race', { logo: LOGO_GONE, bg: 0xf8eeec });
    const cells = grid(4, 4, 4, 0.22);
    const { honest, secret } = LAYOUT.raceY;
    let i = 0;
    for (let k = 0; k < 64; k++) set(f, i++, cells[k].clone().add(new THREE.Vector3(-5.6, 0, 0)), PALETTE.ok, 0.17);
    for (let b = 0; b < 4; b++)
      for (let k = 0; k < 64; k++) set(f, i++, cells[k].clone().add(new THREE.Vector3(-3.8 + b * 1.4, honest, 0)), PALETTE.ok, 0.17);
    const secretStart = i;
    for (let b = 0; b < 6; b++)
      for (let k = 0; k < 64; k++) set(f, i++, cells[k].clone().add(new THREE.Vector3(-3.8 + b * 1.4, secret, 0)), PALETTE.invalid, 0.17);
    const end = i;
    f.animate = (j, p, t, o) => {
      if (j < 64 || j >= end) return;
      const reorg = THREE.MathUtils.smoothstep(p, 0.7, 0.85);
      if (j < secretStart) {
        // La vraie chaine est abandonnee
        o.z -= reorg * 2.5;
        o.y -= reorg * 0.6;
        const c = PALETTE.ok.clone().lerp(PALETTE.grey, reorg);
        o.r = c.r; o.g = c.g; o.b = c.b;
        return;
      }
      const b = Math.floor((j - secretStart) / 64);
      const appear = THREE.MathUtils.clamp((p - (0.08 + b * 0.09)) / 0.06, 0, 1);
      o.s *= appear;
      o.y += (1 - appear) * -2 + reorg * (honest - secret);
      const c = PALETTE.invalid.clone().lerp(PALETTE.ok, reorg);
      o.r = c.r; o.g = c.g; o.b = c.b;
    };
    F.race = f;
  }

  // Poussiere : toutes les infos "libres" derivent lentement
  Object.values(F).forEach((f) => {
    const own = f.animate;
    f.animate = (i, p, t, o, fx) => {
      if (f.dust[i]) {
        o.x += Math.sin(t * 0.15 + SEEDS[i].a * 6) * 0.4;
        o.y += Math.cos(t * 0.12 + SEEDS[i].b * 6) * 0.3;
        return;
      }
      own?.(i, p, t, o, fx);
    };
  });

  return F;
}
