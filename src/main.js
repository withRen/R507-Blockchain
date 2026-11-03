import * as THREE from 'three';
import { createBitcoinLogo } from './lib/logo.js';
import { buildFormations, logoSpin, LAYOUT, N, SEEDS, PALETTE } from './lib/formations.js';
import { makeLabel, makeLink, CSS } from './lib/three-helpers.js';
import { initWidgets, tickFx, fx } from './lib/widgets.js';
import { writeLedgerHeads } from './lib/ledger.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Les etiquettes 3D sont dessinees dans des canvas : on attend les polices.
Promise.race([
  Promise.all(['500 40px "DM Sans"', '700 40px "DM Sans"'].map((f) => document.fonts.load(f))),
  new Promise((r) => setTimeout(r, 2500))
]).finally(init);

function init() {
  initWidgets();
  writeLedgerHeads();

  // Les textes apparaissent en douceur quand ils entrent a l'ecran
  const reveal = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.entry').forEach((c) => reveal.observe(c));

  // ---------- Rendu ----------
  const canvas = document.querySelector('#webgl-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f3ee);
  scene.fog = new THREE.Fog(0xf5f3ee, 18, 34);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.4, 16);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xe6e0d4, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(5, 8, 10);
  scene.add(key);

  // Le "plateau" : tout le decor 3D, recadre selon la taille de l'ecran
  const stage = new THREE.Group();
  scene.add(stage);

  // ---------- Logo en fil de fer ----------
  const logo = createBitcoinLogo(0x3346d3);
  stage.add(logo.group);
  const formations = buildFormations(logo.samplePoints(N));

  // ---------- Les petites infos (cubes instancies) ----------
  const cubes = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0 }),
    N
  );
  cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  cubes.setColorAt(0, new THREE.Color());
  cubes.instanceColor.setUsage(THREE.DynamicDrawUsage);
  cubes.frustumCulled = false;
  stage.add(cubes);

  // ---------- Elements propres a certaines etapes ----------
  const extras = [];
  const extra = (formation, object, opacity = 1) => {
    stage.add(object);
    const mats = [];
    object.traverse((o) => { if (o.material) { o.material.transparent = true; mats.push(o.material); } });
    extras.push({ formation: [].concat(formation), object, mats, opacity });
    return object;
  };

  // Liens entre les blocs de la chaine
  const linkY = new THREE.Vector3(0, 0, 0);
  const okLinks = new THREE.Group();
  const badLinks = new THREE.Group();
  for (let b = 0; b < 4; b++) {
    const from = new THREE.Vector3(LAYOUT.chainX(b) + 0.7, 0, 0).add(linkY);
    const to = new THREE.Vector3(LAYOUT.chainX(b + 1) - 0.7, 0, 0).add(linkY);
    (b < 2 ? okLinks : badLinks).add(makeLink(from, to, PALETTE.primary, 0.05));
  }
  extra(['chain', 'tamper'], okLinks);
  extra(['chain', 'tamper'], badLinks);

  // Liaisons du maillage (elles tournent avec le reseau)
  const meshLines = new THREE.Group();
  {
    const pts = [];
    LAYOUT.meshEdges.forEach(([a, b]) => pts.push(LAYOUT.meshNodes[a], LAYOUT.meshNodes[b]));
    meshLines.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x8f97c9 })));
  }
  extra('mesh', meshLines, 0.8);

  // Barre a franchir du minage
  const bar = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: PALETTE.mining }));
  bar.position.set(1.9, LAYOUT.lotteryBarY, 0);
  extra('lottery', bar);

  // Etiquettes
  const label = (formation, text, pos, opts = {}) => {
    const s = makeLabel(text, { fontSize: 34, worldHeight: 0.3, ...opts });
    s.position.copy(pos);
    extra(formation, s);
    return s;
  };
  label('block', 'Données', new THREE.Vector3(3.2, 1.2, 0), { accent: CSS.primary });
  label('block', 'Lien vers le bloc d’avant', new THREE.Vector3(3.9, 0, 0), { accent: CSS.ink2 });
  label('block', 'Nonce', new THREE.Vector3(3, -1.2, 0), { accent: CSS.mining });
  label('tamper', 'Modifié !', new THREE.Vector3(LAYOUT.chainX(2), 1.55, 0), { accent: CSS.invalid, color: CSS.invalid, bold: true });
  label('chain', 'Bloc 1', new THREE.Vector3(LAYOUT.chainX(0), 1.2, 0));
  label('chain', 'Bloc 5', new THREE.Vector3(LAYOUT.chainX(4), 1.2, 0));
  label('lottery', 'Barre à franchir', new THREE.Vector3(6.6, LAYOUT.lotteryBarY + 0.4, 0), { accent: CSS.mining });
  label('lottery', 'Le bloc à valider', new THREE.Vector3(-4.2, 1.4, 0));
  label('consensus', 'Travail', new THREE.Vector3(LAYOUT.consensusX[0], 1.9, 0), { accent: CSS.mining, bold: true });
  label('consensus', 'Enjeu', new THREE.Vector3(LAYOUT.consensusX[1], 1.9, 0), { accent: '#1a9aa0', bold: true });
  label('consensus', 'Autorité', new THREE.Vector3(LAYOUT.consensusX[2], 1.9, 0), { accent: '#7357d6', bold: true });
  label('confirm', 'Paiement d’Alice', new THREE.Vector3(-4.95, -0.95, 0), { accent: CSS.primary });
  const confLabel = label('confirm', '', new THREE.Vector3(0, 1.3, 0), { accent: CSS.ok, bold: true });
  label('race', 'La vraie chaîne', new THREE.Vector3(-2.2, LAYOUT.raceY.honest + 0.75, 0), { accent: CSS.ok });
  label('race', 'La chaîne secrète de Mallory', new THREE.Vector3(-1.4, LAYOUT.raceY.secret - 0.75, 0), { accent: CSS.invalid });

  // Fond anime : les lignes d'un registre, qui defilent lentement avec la page
  const RULE_GAP = 0.9;
  const rules = new THREE.Group();
  {
    const pts = [];
    for (let k = 0; k < 40; k++) {
      const y = (k - 20) * RULE_GAP;
      pts.push(new THREE.Vector3(-40, y, 0), new THREE.Vector3(40, y, 0));
    }
    // La marge verticale des cahiers de comptes
    pts.push(new THREE.Vector3(-9.5, -20, 0), new THREE.Vector3(-9.5, 20, 0));
    rules.add(new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x17161c, transparent: true, opacity: 0.06, depthWrite: false })
    ));
    rules.position.z = -12;
    scene.add(rules);
  }
  const DARK = new THREE.Color(0x131218);
  // ---------- Etapes du recit ----------
  const stops = [...document.querySelectorAll('[data-formation]')].map((el) => ({ el, name: el.dataset.formation, dark: el.dataset.tone === 'dark', right: !!el.closest('[data-side="right"]'), center: 0 }));
  // Position horizontale de la scene selon le cote du texte (calculee dans layout)
  const stageX = { textLeft: 0, textRight: 0 };
  const firstCenter = {};
  function measure() {
    stops.forEach((s) => {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + window.scrollY;
      s.bottom = s.top + r.height;
      s.center = s.top + r.height / 2;
    });
    Object.keys(firstCenter).forEach((k) => delete firstCenter[k]);
    stops.forEach((s) => { if (!(s.name in firstCenter)) firstCenter[s.name] = s.center; });
  }

  // Recadrage : sur ordinateur la scene occupe la droite, sur mobile le haut
  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const viewW = viewH * camera.aspect;
    if (w > 860) {
      const textRight = Math.min(w * 0.46, 560);
      const usableW = ((w - textRight) / w) * viewW;
      // Texte a gauche : scene au centre de la partie droite, et inversement
      stageX.textLeft = ((textRight + w) / 2 / w - 0.5) * viewW;
      stageX.textRight = ((w - textRight) / 2 / w - 0.5) * viewW;
      stage.position.set(stageX.textLeft, 0, 0);
      stage.scale.setScalar(Math.min(usableW / 15, (viewH * 0.82) / 8.5));
    } else {
      // Sur mobile la scene reste en haut, quel que soit le cote du texte
      stageX.textLeft = stageX.textRight = 0;
      stage.position.set(0, viewH * 0.22, 0);
      stage.scale.setScalar(Math.min((viewW * 0.96) / 14, (viewH * 0.42) / 8.5));
    }
    measure();
  }
  window.addEventListener('resize', layout);
  window.addEventListener('load', measure);
  layout();

  // ---------- Navigation et progression ----------
  const navLinks = [...document.querySelectorAll('.chain-nav a')];
  const chapters = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
  const chainLabel = document.querySelector('#chain-label');
  let lastActive = -2;

  // Pointeur : legere parallaxe
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  });

  // ---------- Boucle ----------
  let smoothY = window.scrollY;
  const o = { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, s: 0, l: 0 };
  const q = { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, s: 0, l: 0 };
  const m = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const color = new THREE.Color();
  const bgA = new THREE.Color();
  const clock = new THREE.Clock();
  let lastConf = -1;
  let lastBg = '';

  const read = (f, i, p, t, out) => {
    out.x = f.pos[i * 3]; out.y = f.pos[i * 3 + 1]; out.z = f.pos[i * 3 + 2];
    out.r = f.col[i * 3]; out.g = f.col[i * 3 + 1]; out.b = f.col[i * 3 + 2];
    out.s = f.size[i];
    // Les infos "libres" (poussiere, logo) tournent ; celles des blocs restent alignees
    out.l = f.dust[i] || f.loose ? 1 : 0;
    f.animate?.(i, p, t, out, fx);
  };
  const ease = (x) => x * x * (3 - 2 * x);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    tickFx(dt);

    const vh = window.innerHeight;
    // Defilement lisse, sauf grand saut (lien direct vers un chapitre)
    const jump = Math.abs(window.scrollY - smoothY) > vh * 2;
    smoothY += (window.scrollY - smoothY) * (reduceMotion || jump ? 1 : Math.min(1, dt * 1.8));
    const yc = smoothY + vh / 2;

    // Etape courante (k) et suivante (k+1), et l'avancement entre les deux
    let k = 0;
    while (k < stops.length - 2 && yc >= stops[k + 1].center) k++;
    const A = stops[k];
    const B = stops[Math.min(k + 1, stops.length - 1)];
    const raw = B === A ? 0 : THREE.MathUtils.clamp((yc - A.center) / (B.center - A.center), 0, 1);
    // La transition s'etale sur presque tout l'espace entre deux cartes
    const blend = THREE.MathUtils.smoothstep(raw, 0.12, 0.88);
    const fA = formations[A.name];
    const fB = formations[B.name];
    // Avancement "dans" une etape (cascade, confirmations, course)
    const local = (name) => THREE.MathUtils.clamp((yc - (firstCenter[name] - 0.65 * vh)) / (1.3 * vh), 0, 1);
    const pA = local(A.name);
    const pB = local(B.name);
    const weight = (name) => (A.name === name ? 1 - blend : 0) + (B.name === name ? blend : 0);

    // Particules : interpolation decalee dans le temps + petit tourbillon
    for (let i = 0; i < N; i++) {
      read(fA, i, pA, t, o);
      if (fA !== fB && blend > 0) {
        read(fB, i, pB, t, q);
        const d = SEEDS[i].a * 0.3;
        const b = ease(THREE.MathUtils.clamp((blend - d) / 0.7, 0, 1));
        const swirl = reduceMotion ? 0 : Math.sin(b * Math.PI) * 0.9;
        o.x += (q.x - o.x) * b + SEEDS[i].dir.x * swirl;
        o.y += (q.y - o.y) * b + SEEDS[i].dir.y * swirl;
        o.z += (q.z - o.z) * b + SEEDS[i].dir.z * swirl;
        o.r += (q.r - o.r) * b; o.g += (q.g - o.g) * b; o.b += (q.b - o.b) * b;
        o.s += (q.s - o.s) * b;
        o.l += (q.l - o.l) * b;
      }
      pos.set(o.x, o.y, o.z);
      euler.set((SEEDS[i].b * 3 + t * 0.2 * SEEDS[i].c) * o.l, SEEDS[i].c * 3 * o.l, 0);
      quat.setFromEuler(euler);
      scl.setScalar(Math.max(o.s, 0.0001));
      m.compose(pos, quat, scl);
      cubes.setMatrixAt(i, m);
      color.setRGB(o.r, o.g, o.b);
      cubes.setColorAt(i, color);
    }
    cubes.instanceMatrix.needsUpdate = true;
    cubes.instanceColor.needsUpdate = true;

    // Logo : position, taille, opacite et rotation selon l'etape
    const lA = fA.logo;
    const lB = fB.logo;
    // Quand le texte passe a droite, la scene glisse a gauche et se retourne
    const sideA = A.right ? -1 : 1;
    const sideB = B.right ? -1 : 1;
    const side = THREE.MathUtils.lerp(sideA, sideB, blend);
    stage.position.x = THREE.MathUtils.lerp(A.right ? stageX.textRight : stageX.textLeft, B.right ? stageX.textRight : stageX.textLeft, blend);
    logo.group.position.lerpVectors(lA.pos, lB.pos, blend);
    logo.group.position.x *= side;
    logo.group.scale.setScalar(THREE.MathUtils.lerp(lA.scale, lB.scale, blend));
    logo.group.rotation.y = logoSpin(t);
    logo.setOpacity(THREE.MathUtils.lerp(lA.opacity, lB.opacity, blend));

    stage.rotation.x = THREE.MathUtils.lerp(fA.tilt.x, fB.tilt.x, blend);
    stage.rotation.y = THREE.MathUtils.lerp(fA.tilt.y, fB.tilt.y, blend) * side;

    // Elements propres aux etapes : ils apparaissent avec leur etape
    extras.forEach((e) => {
      const w = e.formation.reduce((s, n) => s + weight(n), 0);
      e.object.visible = w > 0.01;
      e.mats.forEach((mat) => { mat.opacity = w * e.opacity; });
    });
    // Dans la chaine falsifiee, les liens apres le bloc modifie deviennent rouges
    const tamperP = weight('tamper') > 0 ? local('tamper') : 0;
    badLinks.children.forEach((l, i) => {
      const broken = weight('tamper') > 0.5 && tamperP > 0.15 + (i + 0.5) * 0.15;
      l.material.color.copy(broken ? PALETTE.invalid : PALETTE.primary);
      if (broken) l.material.opacity *= 0.55 + Math.sin(t * 8) * 0.35;
    });
    meshLines.rotation.y = t * 0.12;
    // Compteur de confirmations
    const conf = Math.max(0, Math.min(6, Math.floor((local('confirm') - 0.12) / 0.1)));
    if (conf !== lastConf) {
      lastConf = conf;
      confLabel.userData.setText(`${conf} confirmation${conf > 1 ? 's' : ''}`);
    }

    // Fond : la teinte suit le chapitre ; "Le revers" fait basculer la page dans le sombre
    // Le sombre de "Le revers" suit le defilement reel (pas l'animation lissee),
    // et bascule a la frontiere entre deux sections, loin des textes :
    // le texte et le fond changent donc toujours ensemble.
    const yReal = window.scrollY + vh / 2;
    const edge = vh * 0.12;
    let darkness = 0;
    stops.forEach((s) => {
      if (!s.dark) return;
      const inside = THREE.MathUtils.smoothstep(yReal, s.top - edge, s.top + edge) * (1 - THREE.MathUtils.smoothstep(yReal, s.bottom - edge, s.bottom + edge));
      darkness = Math.max(darkness, inside);
    });
    bgA.copy(fA.bg).lerp(fB.bg, blend).lerp(DARK, darkness);
    scene.background.copy(bgA);
    scene.fog.color.copy(bgA);
    // Les fondus haut/bas de la page reprennent la couleur du fond
    const bgCss = `#${bgA.getHexString(THREE.SRGBColorSpace)}`;
    if (bgCss !== lastBg) {
      lastBg = bgCss;
      document.documentElement.style.setProperty('--scene-bg', bgCss);
    }
    document.body.classList.toggle('is-dark', darkness > 0.5);
    rules.children[0].material.color.set(darkness > 0.5 ? 0xffffff : 0x17161c);
    rules.children[0].material.opacity = darkness > 0.5 ? 0.05 : 0.06;
    rules.position.y = ((smoothY / vh) * 1.5) % RULE_GAP;

    // Camera : parallaxe douce
    pointer.sx += (pointer.x - pointer.sx) * 0.04;
    pointer.sy += (pointer.y - pointer.sy) * 0.04;
    camera.position.x = pointer.sx * 0.8;
    camera.position.y = 0.4 - pointer.sy * 0.5;
    camera.lookAt(0, 0, 0);

    // La mini-chaine de navigation : blocs valides, bloc en cours
    let active = -1;
    chapters.forEach((c, i) => { if (c && c.getBoundingClientRect().top < vh * 0.5) active = i; });
    if (active !== lastActive) {
      lastActive = active;
      navLinks.forEach((a, i) => {
        a.classList.toggle('active', i === active);
        a.classList.toggle('done', i < active);
      });
      chainLabel.textContent = active < 0 ? 'Genèse' : `Bloc ${active + 1} / 7 · ${chapters[active].dataset.title}`;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  document.body.classList.add('ready');
  frame();
}
