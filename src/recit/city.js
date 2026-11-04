// Le quartier d'affaires de nuit. Des centaines de tours pour tres peu de draw calls :
// les fenetres sont calculees dans le shader et le reflet sur l'asphalte est simule
// par une copie retournee de la ville, vue a travers un sol sombre semi-transparent.
import * as THREE from 'three';
import { rng, Kit } from './kit.js';

export const MERIDIAN = { x: 0, z: 0, w: 32, d: 28, h: 206, floorY: 172 };

const towerVertex = /* glsl */`
  attribute float aSeed;
  attribute float aDensity;
  attribute float aGlow;
  varying vec3 vW; varying vec3 vN; varying float vSeed; varying float vDensity; varying float vGlow; varying float vDepth;
  void main() {
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vN = normal;
    vSeed = aSeed; vDensity = aDensity; vGlow = aGlow;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;

const towerFragment = /* glsl */`
  uniform vec3 uFog; uniform float uFar; uniform float uMirror;
  varying vec3 vW; varying vec3 vN; varying float vSeed; varying float vDensity; varying float vGlow; varying float vDepth;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 n = normalize(vN);
    vec3 col;
    float heightY = abs(vW.y);
    if (abs(n.y) > 0.5) {
      col = vec3(0.004, 0.006, 0.011);
    } else {
      float along = abs(n.x) > 0.5 ? vW.z : vW.x;
      float side = abs(n.x) > 0.5 ? 1.0 : 0.0;
      vec2 cellSize = vec2(1.9, 3.7);
      vec2 p = vec2(along, heightY) / cellSize;
      vec2 id = floor(p);
      vec2 f = fract(p);
      float pane = smoothstep(0.05, 0.1, f.x) * smoothstep(0.95, 0.9, f.x) * smoothstep(0.2, 0.26, f.y) * smoothstep(0.86, 0.8, f.y);
      // Les bureaux s'allument par plateaux entiers, pas fenetre par fenetre
      vec2 bay = vec2(floor(id.x / 5.0), id.y);
      float r = hash(bay + vSeed * 91.0 + side * 13.0);
      float floorOn = step(0.3, hash(vec2(id.y, vSeed * 37.0)));
      float density = mix(vDensity, 0.82, vGlow);
      float lit = step(1.0 - density, r) * floorOn;
      vec3 warm = mix(vec3(0.95, 0.62, 0.3), vec3(1.0, 0.8, 0.54), hash(bay + 3.0));
      vec3 cool = vec3(0.56, 0.74, 1.0);
      vec3 win = mix(warm, cool, step(0.68, hash(bay * 1.7 + vSeed)));
      win = mix(win, vec3(0.34, 0.47, 1.0), vGlow * 0.92);
      float brightness = (0.42 + 0.7 * hash(id + 7.0)) * (1.0 + vGlow * 0.4);
      // Le 41e etage de Meridian reste allume : c'est la que tout commence
      if (vSeed < 0.0 && heightY > 171.6 && heightY < 175.4) { lit = 1.0; win = vec3(0.86, 0.92, 1.0); brightness = 1.0; }
      vec3 glass = mix(vec3(0.0035, 0.006, 0.012), vec3(0.008, 0.014, 0.027), clamp(heightY / 220.0, 0.0, 1.0));
      glass += 0.0035 * side * vec3(0.3, 0.45, 0.7);
      // Dalles horizontales discretes
      glass += vec3(0.006, 0.008, 0.012) * smoothstep(0.1, 0.0, f.y);
      col = mix(glass, win * brightness, lit * pane);
      // Au loin les fenetres se fondent en une valeur moyenne, sans scintillement
      float aa = clamp(fwidth(p.x) * 1.4 + fwidth(p.y) * 1.4, 0.0, 1.0);
      vec3 average = glass + win * density * 0.14 * (1.0 + vGlow);
      col = mix(col, average, aa);
    }
    float f = 1.0 - exp(-pow(vDepth / uFar, 2.0) * 3.2);
    col = mix(col, uFog, f);
    if (uMirror > 0.5) col *= 0.42;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

function sky(fog) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uFog: { value: fog } },
    vertexShader: /* glsl */`varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      varying vec3 vP; uniform vec3 uFog;
      float n(vec2 p){ return fract(sin(dot(p, vec2(12.98, 78.23))) * 43758.54); }
      void main(){
        float h = max(vP.y, 0.0);
        vec3 c = mix(uFog, vec3(0.006, 0.0115, 0.028), smoothstep(0.0, 0.2, h));
        c = mix(c, vec3(0.0012, 0.0024, 0.0065), smoothstep(0.14, 0.62, h));
        // Halo de la ville, a peine chaud, au ras de l'horizon
        c += vec3(0.011, 0.0075, 0.007) * exp(-h * 18.0);
        vec2 g = floor(vP.xz / max(vP.y, 0.08) * 90.0);
        c += vec3(0.25, 0.3, 0.4) * step(0.9988, n(g)) * smoothstep(0.25, 0.55, h) * 0.5;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  return new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), mat);
}

export function createCity(scene) {
  const fog = new THREE.Color(0.012, 0.021, 0.044);
  scene.background = fog.clone();
  const skyMesh = sky(fog);
  scene.add(skyMesh);

  const SP = 46;
  const R = 19;
  const r = rng(2026);
  const list = [];
  for (let i = -R; i <= R; i++) {
    for (let j = -R; j <= R; j++) {
      if (i === 0 && j === 0) continue;
      const d = Math.hypot(i, j);
      if (d > R + 0.4) continue;
      if (r() < 0.05) continue;
      const falloff = Math.max(0, 1 - d / 10);
      const h = 28 + r() * 44 + falloff * falloff * (70 + r() * 90);
      list.push({
        x: i * SP + (r() - 0.5) * 5,
        z: j * SP + (r() - 0.5) * 5,
        w: 20 + r() * 15,
        d: 20 + r() * 15,
        h: Math.min(h, 150),
        step: r() < 0.42,
        hero: -1
      });
    }
  }

  // Les 14 noeuds du futur reseau, dont Meridian au centre
  const heroCells = [[-3, -2], [2, -3], [4, 1], [-5, 1], [-2, 3], [3, 4], [6, -2], [-6, -3], [0, -5], [-4, 5], [1, 6], [6, 4], [-7, 3]];
  heroCells.forEach(([i, j], k) => {
    const found = list.find((t) => Math.round(t.x / SP) === i && Math.round(t.z / SP) === j);
    const t = found ?? { x: i * SP, z: j * SP, w: 26, d: 26, step: false };
    Object.assign(t, { h: 136 + ((k * 37) % 41), hero: k + 1, w: 28, d: 28, step: false });
    if (!found) list.push(t);
  });
  list.push({ ...MERIDIAN, step: false, hero: 0 });

  // Une tour = un ou deux volumes (socle + retrait)
  const blocks = [];
  list.forEach((t) => {
    if (t.step) {
      blocks.push({ ...t, h: t.h * 0.58, y: 0 });
      blocks.push({ ...t, w: t.w * 0.68, d: t.d * 0.68, y: t.h * 0.58, h: t.h * 0.42 });
    } else {
      blocks.push({ ...t, y: 0 });
    }
  });

  const box = new THREE.BoxGeometry(1, 1, 1);
  box.translate(0, 0.5, 0);
  const geometry = box.clone();
  const count = blocks.length;
  const seeds = new Float32Array(count);
  const dens = new Float32Array(count);
  const glow = new Float32Array(count);
  const heroOf = [];
  const d = new THREE.Object3D();
  const matrices = new Float32Array(count * 16);
  blocks.forEach((b, i) => {
    d.position.set(b.x, b.y, b.z);
    d.scale.set(b.w, b.h, b.d);
    d.updateMatrix();
    d.matrix.toArray(matrices, i * 16);
    seeds[i] = b.hero === 0 ? -0.5 : r();
    dens[i] = 0.1 + r() * 0.3;
    heroOf[i] = b.hero;
  });
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
  geometry.setAttribute('aDensity', new THREE.InstancedBufferAttribute(dens, 1));
  const glowAttr = new THREE.InstancedBufferAttribute(glow, 1);
  glowAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('aGlow', glowAttr);

  const make = (mirror) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: towerVertex,
      fragmentShader: towerFragment,
      side: mirror ? THREE.BackSide : THREE.FrontSide,
      uniforms: { uFog: { value: fog }, uFar: { value: 1050 }, uMirror: { value: mirror ? 1 : 0 } }
    });
    const m = new THREE.InstancedMesh(geometry, mat, count);
    m.instanceMatrix.array.set(matrices);
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false;
    return m;
  };
  const towers = make(false);
  scene.add(towers);
  const mirror = new THREE.Group();
  mirror.scale.y = -1;
  mirror.add(make(true));
  scene.add(mirror);

  // L'asphalte mouille : presque noir, on devine le reflet de la ville dessous
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1480, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uFog: { value: fog } },
      vertexShader: /* glsl */`varying float vD; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: /* glsl */`uniform vec3 uFog; varying float vD;
        void main(){ float f = 1.0 - exp(-pow(vD / 1050.0, 2.0) * 3.2);
          gl_FragColor = vec4(mix(vec3(0.0022, 0.0032, 0.0058), uFog, f), mix(0.76, 1.0, f));
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Lampadaires et circulation
  const dot = new THREE.BoxGeometry(1, 1, 1);
  const lamps = [];
  for (let i = -R; i < R; i++) {
    for (let j = -R; j < R; j++) {
      if (Math.hypot(i, j) > R) continue;
      lamps.push([i * SP + SP / 2 - 3, j * SP], [i * SP, j * SP + SP / 2 - 3]);
    }
  }
  const lampMesh = new THREE.InstancedMesh(dot, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.15, 0.6, 0.26), fog: false }), lamps.length);
  lamps.forEach(([x, z], i) => {
    d.position.set(x, 6, z);
    d.scale.setScalar(0.5);
    d.updateMatrix();
    lampMesh.setMatrixAt(i, d.matrix);
  });
  lampMesh.frustumCulled = false;
  scene.add(lampMesh);

  const CARS = 260;
  const cars = new THREE.InstancedMesh(dot, new THREE.MeshBasicMaterial({ fog: false }), CARS);
  cars.frustumCulled = false;
  const carData = [];
  const col = new THREE.Color();
  for (let i = 0; i < CARS; i++) {
    const road = Math.round((r() - 0.5) * 22) * SP + SP / 2;
    const dir = r() < 0.5 ? 1 : -1;
    const alongX = r() < 0.5;
    const head = dir > 0 === alongX;
    carData.push({ road: road + dir * 2.6, dir, alongX, speed: 20 + r() * 26, off: r() * 1200 });
    col.setRGB(...(head ? [2.6, 2.3, 1.8] : [2.1, 0.13, 0.08]));
    cars.setColorAt(i, col);
  }
  scene.add(cars);

  // Le reseau : des liens entre les 14 tours, qui se revelent peu a peu
  const heroes = list.filter((t) => t.hero >= 0).sort((a, b) => a.hero - b.hero);
  const heroPos = heroes.map((t) => new THREE.Vector3(t.x, t.h + 1, t.z));
  const edges = [];
  heroPos.forEach((p, i) => {
    const near = heroPos.map((q, j) => ({ j, dd: q.distanceTo(p) })).filter((o) => o.j !== i).sort((a, b) => a.dd - b.dd).slice(0, 3);
    near.forEach(({ j }) => { if (!edges.some(([a, b]) => (a === j && b === i) || (a === i && b === j))) edges.push([i, j]); });
  });
  const linkPts = [];
  edges.forEach(([a, b]) => linkPts.push(heroPos[a], heroPos[b]));
  const links = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(linkPts),
    new THREE.LineBasicMaterial({ color: new THREE.Color(0.32, 0.44, 1.5), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
  );
  links.frustumCulled = false;
  scene.add(links);
  const frame = new Kit();
  frame.box(1, 1, 0.03, 0xffffff, { p: [0, 0, 0.5] });
  frame.box(1, 1, 0.03, 0xffffff, { p: [0, 0, -0.5] });
  frame.box(0.03, 1, 1, 0xffffff, { p: [0.5, 0, 0] });
  frame.box(0.03, 1, 1, 0xffffff, { p: [-0.5, 0, 0] });
  const crowns = new THREE.InstancedMesh(frame.geometry(), new THREE.MeshBasicMaterial({ fog: false }), heroes.length);
  crowns.frustumCulled = false;
  heroes.forEach((t, i) => {
    d.position.set(t.x, t.h + 0.2, t.z);
    d.scale.set(t.w + 0.5, 0.4, t.d + 0.5);
    d.updateMatrix();
    crowns.setMatrixAt(i, d.matrix);
    crowns.setColorAt(i, col.setRGB(0, 0, 0));
  });
  scene.add(crowns);

  // Le nom sur la facade, pour reconnaitre la tour de loin
  const nameC = document.createElement('canvas');
  nameC.width = 1024; nameC.height = 170;
  const nx = nameC.getContext('2d');
  nx.fillStyle = '#f2f5ff';
  nx.font = '500 118px "Inter", Helvetica, Arial, sans-serif';
  nx.textAlign = 'center';
  nx.textBaseline = 'middle';
  nx.letterSpacing = '26px';
  nx.fillText('MERIDIAN', 512, 92);
  const nameTex = new THREE.CanvasTexture(nameC);
  nameTex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(27, 4.5), new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, depthWrite: false, fog: false, color: new THREE.Color(1.5, 1.55, 1.7) }));
  sign.position.set(0, MERIDIAN.h - 7, MERIDIAN.d / 2 + 0.15);
  scene.add(sign);

  const PULSES = 34;
  const pulses = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.1, 1.4, 3.4), fog: false }), PULSES);
  pulses.frustumCulled = false;
  scene.add(pulses);

  const v = new THREE.Vector3();
  let net = null;
  const projected = new THREE.Vector3();
  function pickHero(cx, cy, camera, radius) {
    let best = -1;
    let bestD = radius;
    heroPos.forEach((p, i) => {
      projected.copy(p).project(camera);
      if (projected.z > 1) return;
      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist < bestD) { bestD = dist; best = i; }
    });
    return best;
  }
  function update(time, camera, heroLevels /* (index) => 0..1 */, linkLevel) {
    skyMesh.position.copy(camera.position);
    for (let i = 0; i < CARS; i++) {
      const c = carData[i];
      const s = ((c.off + time * c.speed * c.dir) % 1200 + 1200) % 1200 - 600;
      d.position.set(c.alongX ? s : c.road, 0.7, c.alongX ? c.road : s);
      d.scale.set(c.alongX ? 2.4 : 1.15, 0.6, c.alongX ? 1.15 : 2.4);
      d.updateMatrix();
      cars.setMatrixAt(i, d.matrix);
    }
    cars.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < count; i++) {
      if (heroOf[i] >= 0) glow[i] = heroLevels(heroOf[i]);
    }
    glowAttr.needsUpdate = true;
    heroes.forEach((t, i) => {
      const g = heroLevels(i);
      crowns.setColorAt(i, col.setRGB(0.55 * g, 0.75 * g, 2.6 * g));
    });
    crowns.instanceColor.needsUpdate = true;

    links.material.opacity = linkLevel * 0.72;
    pulses.visible = linkLevel > 0.02;
    if (net?.active) {
      // Une vraie propagation : l'impulsion suit le graphe, noeud apres noeud
      pulses.visible = true;
      let n = 0;
      edges.forEach(([a, b]) => {
        [[a, b], [b, a]].forEach(([from, to]) => {
          if (n >= PULSES) return;
          if (net.depth[from] < 0 || net.depth[to] !== net.depth[from] + 1 || net.cut.has(from) || net.cut.has(to)) return;
          const u = (net.elapsed - net.depth[from] * net.step) / net.step;
          if (u < 0 || u > 1) return;
          d.position.lerpVectors(heroPos[from], heroPos[to], u);
          d.scale.setScalar(2.4);
          d.updateMatrix();
          pulses.setMatrixAt(n++, d.matrix);
        });
      });
      d.scale.setScalar(0.0001);
      d.updateMatrix();
      for (; n < PULSES; n++) pulses.setMatrixAt(n, d.matrix);
      pulses.instanceMatrix.needsUpdate = true;
    } else if (pulses.visible) {
      for (let i = 0; i < PULSES; i++) {
        const [a, b] = edges[i % edges.length];
        const u = (time * 0.32 + i * 0.37) % 1;
        v.lerpVectors(heroPos[a], heroPos[b], u);
        d.position.copy(v);
        d.scale.setScalar(0.72 * linkLevel);
        d.updateMatrix();
        pulses.setMatrixAt(i, d.matrix);
      }
      pulses.instanceMatrix.needsUpdate = true;
    }
  }

  return {
    update,
    pickHero,
    setNetwork(state) { net = state; },
    graph: () => ({ count: heroes.length, edges })
  };
}
