import * as THREE from 'three';
import { createCity } from './city.js';
import { createOffice } from './office.js';
import { createServerRoom } from './serverroom.js';
import { createFigure, CAST } from './figure.js';
import { curve, sampleTrack, sampleCamera, smooth, clamp01 } from './timeline.js';
import * as P from './prologue.js';
import * as S1 from './sequence1.js';
import { createSequence2 } from './sequence2.js';
import { createSequence3 } from './sequence3.js';
import { createSequence4 } from './sequence4.js';
import { createSequence5 } from './sequence5.js';
import { createSequence6 } from './sequence6.js';
import { createSequence7 } from './sequence7.js';
import { createEpilogue } from './epilogue.js';
import { createDirector, buildScore } from './director.js';
import { hashBlock } from '../lib/blockchain.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);
const unaccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

Promise.race([
  Promise.all(['400 40px "Newsreader"', '500 20px "Roboto"', '500 16px "IBM Plex Mono"'].map((f) => document.fonts.load(f))),
  new Promise((r) => setTimeout(r, 2000))
]).finally(() => init());

async function init() {
  const canvas = document.querySelector('#scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.info.autoReset = false;
  let pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020306);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.12, 3200);
  const cityGroup = new THREE.Group();
  scene.add(cityGroup);
  const city = createCity(cityGroup);
  const office = createOffice(scene);
  const room = createServerRoom(scene);

  scene.add(new THREE.HemisphereLight(0xc4cede, 0x6a7080, 1.5));
  const moon = new THREE.DirectionalLight(0xc4d2ea, 0.7);
  moon.position.set(-0.5, 0.65, 1);
  scene.add(moon);

  // Un jeu de lumieres fixe, deplace d'un decor a l'autre. Si leur nombre changeait,
  // tous les materiaux seraient recompiles : c'est ce qui provoque les saccades.
  const rig = [0, 1, 2].map(() => {
    const l = new THREE.PointLight(0xffffff, 0, 16, 1.2);
    scene.add(l);
    return l;
  });
  const worldPos = new THREE.Vector3();
  function applyLights(seq) {
    rig.forEach((l, i) => {
      const def = seq.lights?.[i];
      l.intensity = def ? def.i * 0.4 : 0;
      if (!def) return;
      (seq.parent ?? scene).getWorldPosition(worldPos);
      l.position.set(worldPos.x + def.p[0], worldPos.y + def.p[1], worldPos.z + def.p[2]);
      l.color.setHex(def.color);
      l.distance = def.d;
    });
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------- Interface ----------
  const $ = (s) => document.querySelector(s);
  const stageUI = $('#stage-ui');
  const elSlug = $('#slug');
  const elSlugTime = elSlug.querySelector('b');
  const elSlugPlace = elSlug.querySelector('span');
  const elLine = $('#line');
  const elWho = elLine.querySelector('b');
  const elText = elLine.querySelector('span');
  const elTerm = $('#term');
  const elTermLabel = elTerm.querySelector('small');
  const elTermTitle = elTerm.querySelector('strong');
  const elTermDef = elTerm.querySelector('p');
  const elTitle = $('#title-card');
  const elFade = $('#fade');
  const bar = $('#progress i');
  let curLine = null;
  let curTerm = null;
  let curSlug = null;

  function hud(seq, t, override) {
    const sl = seq.SLUGS.find((s) => t >= s.from && t <= s.to) ?? null;
    if (sl !== curSlug) {
      curSlug = sl;
      if (sl) { elSlugTime.textContent = sl.time; elSlugPlace.textContent = sl.place; }
      elSlug.classList.toggle('on', !!sl);
    }
    const li = seq.LINES.find((l) => t >= l.from && t <= l.to) ?? null;
    if (li !== curLine) {
      curLine = li;
      if (li) {
        elWho.textContent = li.vo ? `${li.who}, voix off` : li.who;
        elText.textContent = li.text;
        elLine.classList.toggle('vo', !!li.vo);
      }
      elLine.classList.toggle('on', !!li);
    }
    const te = override ?? seq.TERMS.find((c) => t >= c.from && t <= c.to) ?? null;
    if (te !== curTerm) {
      curTerm = te;
      if (te) {
        elTermLabel.textContent = te.label;
        elTermTitle.textContent = te.title;
        elTermDef.textContent = te.def;
      }
      elTerm.classList.toggle('on', !!te);
    }
  }

  const ctx = {
    scene, camera, city, cityGroup, office, room,
    panel(html, cls = 'lab') {
      const el = document.createElement('section');
      el.className = cls;
      el.innerHTML = html;
      stageUI.append(el);
      return el;
    }
  };

  // ---------- Sequence 1 : le bloc, avec le vrai SHA-256 ----------
  // Avant le mini-jeu, le hash change tout seul sous les yeux du visiteur.
  // Ensuite, c'est a lui de retrouver la transaction qui donne l'empreinte cible.
  const lab = $('#lab');
  const outHash = $('#lab-hash');
  const outDiff = $('#lab-diff');
  const outNote = $('#lab-note');
  const outNonce = $('#lab-nonce');
  const hashOf = (data, nonce) => hashBlock({ index: 1, parent: S1.PARENT, data, nonce });
  const target = hashOf(S1.GAME.answer, S1.GAME.nonce);
  const NO_HASH = '—'.repeat(64);
  const game = { data: null, nonce: S1.GAME.nonce, token: 0 };
  let pickedLayer = null;
  let blockView = null; // ce que le bloc 3D affiche : recit, animation ou mini-jeu
  $('#lab-target').textContent = target;

  function paintBlock(data, nonce, hash, compareTo, solved = false) {
    room.drawLayer('data', data, pickedLayer === 'data');
    room.drawLayer('nonce', String(nonce), pickedLayer === 'nonce');
    room.drawLayer('parent', `${S1.PARENT}…`, pickedLayer === 'parent');
    room.drawHash(hash, compareTo, solved);
  }
  const gameHash = () => (game.data === null ? NO_HASH : hashOf(game.data, game.nonce));
  function paintGame() {
    const h = gameHash();
    const solved = h === target;
    paintBlock(game.data ?? '?', game.nonce, h, game.data === null ? null : target, solved);
    room.setSolved(solved);
  }
  function showResult() {
    const h = gameHash();
    const solved = h === target;
    paintGame();
    outHash.classList.toggle('win', solved);
    outDiff.classList.toggle('win', solved);
    lab.classList.toggle('win', solved);
    chips.forEach((c) => {
      const now = c.dataset.tx === game.data;
      c.classList.toggle('now', now && !solved);
      c.classList.toggle('good', now && solved);
    });
    outNonce.textContent = game.nonce.toLocaleString('fr-FR');
    if (game.data === null) {
      outHash.textContent = 'en attente d’une transaction';
      outDiff.textContent = '';
      return;
    }
    const diff = [...h].filter((ch, i) => ch !== target[i]).length;
    outHash.innerHTML = [...h].map((ch, i) => (ch !== target[i] ? `<mark>${ch}</mark>` : ch)).join('');
    outDiff.textContent = solved ? 'Identique : 0/64 différent' : `${diff}/64 différents`;
    if (solved) {
      outNote.textContent = 'Trouvé ! Même entrée, même hash. Un seul caractère change presque tout, et on ne peut pas remonter du hash aux données : on ne peut qu’essayer. Le minage repose là-dessus.';
    } else if (game.nonce !== S1.GAME.nonce) {
      outNote.textContent = `Le nonce compte aussi : pour comparer à la cible, remets-le à ${S1.GAME.nonce.toLocaleString('fr-FR')}.`;
    } else {
      outNote.textContent = 'Presque le même texte, et pourtant un hash sans rapport. Aucun indice ne te dit si tu chauffes : essaie encore.';
    }
  }
  // Les 64 caracteres se figent un a un, de gauche a droite
  function flipHash() {
    room.pulse();
    const token = ++game.token;
    if (reduceMotion || game.data === null) { showResult(); return; }
    const h = gameHash();
    const hex = '0123456789abcdef';
    const t0 = performance.now();
    const DURATION = 520;
    let n = 0;
    const run = (now) => {
      if (token !== game.token) return;
      const k = (now - t0) / DURATION;
      if (k >= 1) { showResult(); return; }
      const settled = Math.floor(k * 64);
      const shownHash = [...h].map((ch, i) => (i < settled ? ch : hex[Math.floor(Math.random() * 16)])).join('');
      outHash.textContent = shownHash;
      // La texture 3D est plus couteuse : une image sur trois suffit
      if (n++ % 3 === 0) room.drawHash(shownHash, null);
      requestAnimationFrame(run);
    };
    room.drawLayer('data', game.data, pickedLayer === 'data');
    room.drawLayer('nonce', String(game.nonce), pickedLayer === 'nonce');
    room.setSolved(false);
    requestAnimationFrame(run);
  }
  function dropTx(tx, chip) {
    game.data = tx;
    chip.classList.add('tried');
    flipHash();
  }
  const chips = S1.GAME.chips.map((tx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = tx;
    b.dataset.tx = tx;
    let drag = null;
    let dragged = false;
    b.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, y: e.clientY, ghost: null };
      dragged = false;
      b.setPointerCapture(e.pointerId);
    });
    b.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.ghost && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) {
        drag.ghost = document.createElement('div');
        drag.ghost.className = 'chip-ghost';
        drag.ghost.textContent = tx;
        stageUI.append(drag.ghost);
        dragged = true;
      }
      if (drag.ghost) {
        drag.ghost.style.left = `${e.clientX}px`;
        drag.ghost.style.top = `${e.clientY}px`;
      }
    });
    const endDrag = (e, cancelled) => {
      if (!drag) return;
      drag.ghost?.remove();
      if (drag.ghost && !cancelled) {
        // Lache hors du panneau, la transaction tombe dans le bloc
        const r = lab.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) dropTx(tx, b);
      }
      drag = null;
    };
    b.addEventListener('pointerup', (e) => endDrag(e, false));
    b.addEventListener('pointercancel', (e) => endDrag(e, true));
    b.addEventListener('click', () => {
      if (dragged) { dragged = false; return; }
      dropTx(tx, b);
    });
    $('#lab-chips').append(b);
    return b;
  });
  const stepNonce = (d) => { game.nonce = Math.max(0, game.nonce + d); flipHash(); };
  $('#lab-minus').addEventListener('click', () => stepNonce(-1));
  $('#lab-plus').addEventListener('click', () => stepNonce(1));
  showResult();

  function blockFor(t, time, labFrom) {
    if (t >= labFrom) {
      if (blockView !== 'game') { blockView = 'game'; showResult(); }
      return;
    }
    const demo = t >= 0.54 ? Math.floor(time / 1.8) % S1.DEMO.length : 0;
    const view = `demo${demo}`;
    if (view === blockView) return;
    const data = S1.DEMO[demo];
    const prev = blockView?.startsWith('demo') ? hashOf(S1.DEMO[Number(blockView.slice(4))], S1.GAME.nonce) : null;
    blockView = view;
    room.setSolved(false);
    paintBlock(data, S1.GAME.nonce, hashOf(data, S1.GAME.nonce), t >= 0.54 ? prev : null);
    if (t >= 0.54 && prev) room.pulse();
  }
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  // ---------- Les sequences ----------
  const prologue = {
    name: 'Prologue',
    lights: [{ p: [3.5, 3.2, -1.2], color: 0xe8eeff, i: 3.2, d: 16 }, { p: [-5.4, 3.2, -7.5], color: 0xe8eeff, i: 3.4, d: 16 }, { p: [-2.4, 3.2, 3.6], color: 0xdbe3ff, i: 3.6, d: 15 }],
    ...P,
    CAMERA: P.CAMERA,
    actorsDef: P.ACTORS,
    parent: office.group,
    groups: [cityGroup, office.group],
    insideAt: (t) => t > 0.24 && t < 0.895,
    fade: (t) => Math.max(smooth((t - 0.603) / 0.017) * (1 - smooth((t - 0.6205) / 0.018)), smooth((t - 0.992) / 0.008)),
    heroLevel: null,
    BEATS: [{ from: 0.978, to: 0.992, hold: 3 }], // la carte de titre, sans replique
    update(t) {
      office.group.visible = t > 0.2 && t < 0.92;
      // Camera tournee vers le fond de l'etage : la ville derriere elle n'est pas dessinee
      cityGroup.visible = !(t > 0.285 && t < 0.615);
      office.setLedgerChanged(t > P.SCENE.ledger);
      const open = curve(P.SCENE.lift, t);
      office.setLiftOpen(open);
      const start = 0.9;
      prologue.heroLevel = (i) => smooth((t - (i === 0 ? start : start + (((i * 5) % 14) / 14) * 0.05)) / 0.012);
      prologue.linkLevel = smooth((t - 0.925) / 0.03);
      elTitle.classList.toggle('on', t > 0.978 && t < 0.996);
    },
    leave() { elTitle.classList.remove('on'); }
  };
  const sequence1 = {
    name: 'Structure d’un bloc',
    lights: [{ p: [0, 4.8, 3.4], color: 0xc9d6ff, i: 3.8, d: 15 }, { p: [0, 1.1, 2.4], color: 0x6c84ff, i: 2.8, d: 9 }],
    ...S1,
    actorsDef: S1.ACTORS,
    parent: room.group,
    groups: [room.group],
    panelEl: $('#lab'),
    override: () => (sequence1.labOpen && pickedLayer ? S1.LAYER_INFO[pickedLayer] : null),
    onClick(e) {
      if (!sequence1.labOpen) return;
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(room.pickables)[0];
      pickedLayer = hit ? hit.object.userData.layer : null;
      paintGame();
    },
    update(t, time) {
      blockFor(t, time, S1.LAB.from);
      const f = S1.FOCUS.find((x) => t >= x.from && t <= x.to);
      room.setReveal({
        data: curve(S1.REVEAL.data, t),
        parent: curve(S1.REVEAL.parent, t),
        nonce: curve(S1.REVEAL.nonce, t),
        hash: curve(S1.REVEAL.hash, t),
        focus: pickedLayer ?? f?.key
      }, time);
    }
  };

  const sequences = [
    prologue,
    sequence1,
    createSequence2(ctx),
    createSequence3(ctx),
    createSequence4(ctx),
    createSequence5(ctx),
    createSequence6(ctx),
    createSequence7(ctx),
    createEpilogue(ctx)
  ];
  const COUNT = sequences.length;
  sequences.forEach((seq) => {
    seq.actors = {};
    Object.entries(seq.actorsDef ?? {}).forEach(([name, data]) => {
      const c = createFigure(CAST[name]);
      seq.parent.add(c.root);
      seq.actors[name] = { ...data, c, name, shadow: office.makeShadow(seq.parent) };
    });
  });
  const allGroups = new Set(sequences.flatMap((s) => s.groups));

  // Tous les shaders sont compiles avant le debut : plus de saccade en changeant de decor
  allGroups.forEach((g) => { g.visible = true; });
  sequences.forEach((s) => applyLights(s));
  const wait = new Promise((r) => setTimeout(r, 4000));
  await Promise.race([renderer.compileAsync(scene, camera).catch(() => {}), wait]);
  // Compiler ne suffit pas : geometries et textures partent vers la carte graphique au premier
  // dessin. On dessine donc tout une fois, hors ecran, pendant le chargement.
  const warmed = [];
  scene.traverse((o) => {
    warmed.push([o, o.visible, o.frustumCulled]);
    o.visible = true;
    o.frustumCulled = false;
  });
  const warmTarget = new THREE.WebGLRenderTarget(4, 4);
  renderer.setRenderTarget(warmTarget);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  warmTarget.dispose();
  warmed.forEach(([o, visible, culled]) => { o.visible = visible; o.frustumCulled = culled; });
  allGroups.forEach((g) => { g.visible = false; });
  document.querySelector('#loading')?.classList.add('off');

  // Navigation : une mini-chaine, un bloc par sequence
  const nav = $('#chain-nav');
  sequences.forEach((seq, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.title = seq.name;
    b.setAttribute('aria-label', `Aller à : ${seq.name}`);
    b.addEventListener('click', () => {
      const y = (i / COUNT) * scrollMax() + 2;
      director?.pause();
      window.scrollTo(0, y);
      shown = clamp01(y / Math.max(1, scrollMax()));
    });
    nav.append(b);
  });
  const navButtons = [...nav.querySelectorAll('button')];
  const navLabel = document.createElement('span');
  nav.append(navLabel);

  canvas.addEventListener('click', (e) => active?.onClick?.(e));

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  });

  const scrollMax = () => document.documentElement.scrollHeight - window.innerHeight;
  let shown = clamp01(window.scrollY / Math.max(1, scrollMax()));
  const forced = params.has('seq')
    ? (Number(params.get('seq')) + parseFloat(params.get('t') ?? '0.5')) / COUNT
    : params.has('t') ? parseFloat(params.get('t')) : null;
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const off = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const clock = new THREE.Clock();
  let active = null;
  // Le mode ?seq= ou ?t= fige l'image : pas de lecture automatique
  const director = forced === null
    ? createDirector({ score: buildScore(sequences), scrollMax, reduceMotion, count: COUNT })
    : null;

  function activate(seq) {
    if (active === seq) return;
    active?.leave?.();
    if (active) active.labOpen = false;
    // Tous les panneaux se referment au changement de sequence, y compris ceux
    // qu'une sequence ouvre elle-meme : la sequence active rouvre les siens juste apres
    stageUI.querySelectorAll('.lab.on').forEach((el) => el.classList.remove('on'));
    allGroups.forEach((g) => { g.visible = seq.groups.includes(g); });
    sequences.forEach((s) => {
      Object.values(s.actors).forEach((a) => {
        a.c.root.visible = s === seq;
        a.shadow.visible = s === seq;
      });
    });
    city.setNetwork(null);
    active = seq;
    seq.enter?.();
    applyLights(seq);
    // On charge la sequence courante et ses voisines, on decharge le reste
    const idx = sequences.indexOf(seq);
    curLine = curTerm = curSlug = undefined;
    navButtons.forEach((b, i) => {
      const idx = sequences.indexOf(seq);
      b.classList.toggle('now', i === idx);
      b.classList.toggle('done', i < idx);
    });
    navLabel.textContent = (idx > 0 && idx < 8 ? `Notion ${idx}/7 · ` : '') + seq.name;
  }

  function poseActors(actors, lines, t, time) {
    const li = lines.find((l) => t >= l.from && t <= l.to);
    const speaker = li && !li.vo ? unaccent(li.who) : null;
    Object.values(actors).forEach((a) => {
      // Un personnage n'existe dans la scene qu'a partir de son entree
      const present = t >= (a.from ?? 0);
      a.c.root.visible = present;
      a.shadow.visible = present;
      if (!present) return;
      const s = sampleTrack(a.track, t);
      a.c.root.position.set(s.x, 0, s.z);
      a.c.root.rotation.y = s.face;
      a.shadow.position.x = s.x;
      a.shadow.position.z = s.z;
      a.c.pose({
        walk: s.dist,
        moving: s.moving,
        armLx: curve(a.armLx, t),
        armRx: curve(a.armRx, t),
        elbowL: a.elbowL ? curve(a.elbowL, t) : undefined,
        elbowR: a.elbowR ? curve(a.elbowR, t) : undefined,
        headYaw: curve(a.headYaw, t),
        headPitch: curve(a.headPitch, t),
        talk: speaker === a.name ? 1 : 0,
        time
      });
    });
  }

  function placeCamera(seq, t, time) {
    camera.fov = sampleCamera(seq.CAMERA, t, pos, look);
    camera.updateProjectionMatrix();
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    const inside = seq.insideAt ? seq.insideAt(t) : !seq.outside;
    const amp = reduceMotion ? 0 : inside ? 0.07 : 1.6;
    camera.position.copy(pos);
    camera.lookAt(look);
    camera.getWorldQuaternion(quat);
    // Une camera tenue a la main : tres leger balancement, pour que l'image ne soit jamais figee
    const sway = reduceMotion ? 0 : inside ? 0.012 : 0.5;
    off.set(
      pointer.sx * amp + Math.sin(time * 0.37) * sway,
      -pointer.sy * amp * 0.6 + Math.sin(time * 0.53 + 1.3) * sway * 0.6,
      0
    ).applyQuaternion(quat);
    camera.position.add(off);
    camera.lookAt(look);
  }

  // ---------- Boucle ----------
  let mark = 0;
  let frames = 0;
  let lowerSince = 0;
  function step() {
    const dt = Math.min(clock.getDelta(), 0.06);
    const time = clock.elapsedTime;
    renderer.info.reset();
    // Une seule source a la fois : l'horloge de la lecture auto, sinon le defilement lisse
    const driven = director ? director.tick(dt, !!active?.labOpen, shown) : null;
    if (driven !== null) {
      shown = driven;
    } else {
      const goal = forced ?? clamp01(window.scrollY / Math.max(1, scrollMax()));
      shown += (goal - shown) * (reduceMotion || forced !== null ? 1 : 1 - Math.exp(-dt * 3.4));
    }

    const scaled = Math.min(shown * COUNT, COUNT - 1e-6);
    const idx = Math.floor(scaled);
    const seq = sequences[idx];
    const t = scaled - idx;
    activate(seq);

    placeCamera(seq, t, time);
    poseActors(seq.actors, seq.LINES, t, time);
    if (seq.LAB) {
      seq.labOpen = t >= seq.LAB.from && t <= seq.LAB.to;
      seq.panelEl?.classList.toggle('on', seq.labOpen);
    }
    seq.update?.(t, time, dt);
    room.tick(dt, time);
    if (cityGroup.visible) {
      const level = seq.heroLevel ?? (() => 0.9);
      const inside = seq.insideAt ? seq.insideAt(t) : !seq.outside && !seq.onBridge;
      city.update(time, camera, level, seq.linkLevel ?? (seq.cityLit ? 0.34 : 0), inside);
    }
    hud(seq, t, seq.override?.());

    const fade = seq.fade
      ? seq.fade(t)
      : Math.max(1 - smooth(t / 0.022), idx < COUNT - 1 ? smooth((t - 0.986) / 0.014) : 0);
    elFade.style.opacity = fade.toFixed(3);
    // Changer la resolution fige une image : on attend un passage au noir, ou 6 s au plus
    if (lowerSince && (fade > 0.5 || performance.now() - lowerSince > 6000)) {
      lowerSince = 0;
      pixelRatio = Math.max(0.8, pixelRatio - 0.2);
      renderer.setPixelRatio(pixelRatio);
      resize();
    }
    bar.style.transform = `scaleX(${shown.toFixed(4)})`;

    renderer.render(scene, camera);
    window.__recitStats = { calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, programs: renderer.info.programs.length };

    frames++;
    const now = performance.now();
    mark = mark || now;
    if (now - mark > 1500) {
      const fps = (frames * 1000) / (now - mark);
      window.__recitFps = fps;
      // Sous 45 images par seconde, la qualite baisse d'elle-meme, par paliers
      if (document.visibilityState === 'visible' && fps > 5 && fps < 45 && forced === null) {
        if (pixelRatio > 0.8 && !lowerSince) lowerSince = now;
      }
      mark = now;
      frames = 0;
    }
  }
  function frame() {
    step();
    requestAnimationFrame(frame);
  }
  // Mesure du temps reel d'une image (processeur et carte graphique) : ?bench dans l'adresse
  if (params.has('bench')) {
    const gl = renderer.getContext();
    const px = new Uint8Array(4);
    window.__bench = (n = 12) => {
      for (let i = 0; i < 3; i++) step();
      const t0 = performance.now();
      for (let i = 0; i < n; i++) {
        step();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      }
      return { ms: +((performance.now() - t0) / n).toFixed(1), dpr: pixelRatio, w: window.innerWidth, h: window.innerHeight, ...window.__recitStats };
    };
  }
  window.__recit = { renderer, scene, camera };
  document.body.classList.add('ready');
  frame();
}
