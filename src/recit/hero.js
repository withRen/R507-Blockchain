// Écran d'entrée : trois personnages du récit en pose dynamique, rendus dans leur propre petit canvas.
// Le rendu ne tourne que tant que l'écran d'entrée est visible.
import * as THREE from 'three';
import { createFigure, CAST } from './figure.js';

export function createHero(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);
  camera.position.set(0, 1.12, 5.6);
  camera.lookAt(0, 0.92, 0);

  scene.add(new THREE.HemisphereLight(0xfff0d0, 0x2a2018, 1.5));
  const key = new THREE.DirectionalLight(0xffe2b0, 1.6);
  key.position.set(-2.5, 3.5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fb4ff, 1.1);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  // Chacun garde sa place et son humeur : l'un explique, l'autre doute, la troisième écoute
  const cast = [
    { id: 'julien', x: -1.05, yaw: 0.5, mood: { gest: 1, look: 0.35, arm: 0.5 } },
    { id: 'lea', x: 0, yaw: -0.12, mood: { gest: 0.4, look: 0.5, arm: 0.2 } },
    { id: 'ines', x: 1.0, yaw: -0.5, mood: { gest: 0.8, look: 0.3, arm: 0.35 } }
  ].map((c, i) => {
    const fig = createFigure(CAST[c.id]);
    fig.root.position.x = c.x;
    fig.root.position.z = i === 1 ? 0.25 : 0;
    scene.add(fig.root);
    return { ...c, fig, phase: i * 1.7 };
  });

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Les trois personnages doivent toujours tenir en largeur : on recule si le cadre est étroit
    camera.position.z = Math.max(4.3, 5.4 / camera.aspect);
    camera.lookAt(0, 0.92, 0);
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);

  let raf = 0;
  const clock = new THREE.Clock();
  const frame = () => {
    const t = clock.getElapsedTime();
    cast.forEach((c) => {
      const p = t + c.phase;
      c.fig.root.rotation.y = c.yaw + Math.sin(p * 0.5) * 0.12;
      c.fig.pose({
        armLx: c.mood.arm + Math.sin(p * 1.3) * 0.28 * c.mood.gest,
        armRx: 0.15 + Math.max(0, Math.sin(p * 0.9 + 1)) * 0.9 * c.mood.gest,
        armRz: Math.max(0, Math.sin(p * 0.9 + 1)) * 0.25,
        elbowL: 0.35 + Math.sin(p * 1.1) * 0.18,
        elbowR: 0.4 + Math.max(0, Math.sin(p * 0.9 + 1)) * 0.5,
        headYaw: Math.sin(p * 0.45) * c.mood.look,
        headPitch: Math.sin(p * 0.7) * 0.06,
        lean: Math.sin(p * 0.6) * 0.03,
        talk: 1,
        time: p
      });
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  return {
    start() { resize(); cancelAnimationFrame(raf); clock.start(); frame(); },
    stop() { cancelAnimationFrame(raf); }
  };
}
