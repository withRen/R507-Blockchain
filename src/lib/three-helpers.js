import * as THREE from 'three';

// Palette unique, partagee avec le CSS (voir :root dans style.css).
// Un meme sens = une meme couleur dans tout le parcours.
export const COLORS = {
  bg: 0xf5f3ee,
  ink: 0x17161c,
  neutral: 0xffffff,
  primary: 0x3346d3, // la blockchain, l'information
  ok: 0x1e9e6a, // valide, accepte
  invalid: 0xe0473e, // falsifie, refuse
  mining: 0xe89a2c, // effort, energie, minage
  stake: 0x1a9aa0, // preuve d'enjeu
  authority: 0x7357d6, // preuve d'autorite
  muted: 0xb9b5ab,
  ground: 0xebe7de
};

export const CSS = {
  ink: '#17161c',
  ink2: '#4a4854',
  muted: '#8a8794',
  primary: '#3346d3',
  ok: '#1e9e6a',
  invalid: '#e0473e',
  mining: '#c77a12'
};

const FONT = '"DM Sans", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

// Etiquette "pastille" toujours face camera (sprite + texture canvas).
// setText() redessine le canvas uniquement si le contenu a change.
export function makeLabel(text, opts = {}) {
  const {
    fontSize = 40,
    color = CSS.ink,
    background = '#ffffff',
    border = 'rgba(23, 22, 28, 0.22)',
    accent = null, // petite pastille de couleur a gauche
    mono = true,
    bold = false,
    worldHeight = 0.32,
    padding = 20
  } = opts;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, fog: false });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 10;

  const state = { color, border, background, accent };

  function draw(value) {
    const lines = String(value).split('\n');
    const font = `${bold ? 700 : 500} ${fontSize}px ${mono ? MONO : FONT}`;
    ctx.font = font;
    const dot = state.accent ? fontSize * 0.42 : 0;
    const gap = state.accent ? fontSize * 0.4 : 0;
    const widths = lines.map((l) => ctx.measureText(l).width);
    const lineHeight = fontSize * 1.3;
    const shadow = state.background ? 2 : 0;
    const width = Math.ceil(Math.max(...widths) + padding * 2 + dot + gap + shadow * 2);
    const height = Math.ceil(lines.length * lineHeight + padding * 1.1 + shadow * 2);
    // Le stockage GPU d'une texture est fixe : si le canvas change de taille,
    // il faut liberer l'ancienne texture pour qu'elle soit reallouee.
    if (width !== canvas.width || height !== canvas.height) {
      texture.dispose();
      canvas.width = width;
      canvas.height = height;
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    if (state.background) {
      ctx.save();
      ctx.fillStyle = state.background;
      roundRect(ctx, shadow, shadow, width - shadow * 2, height - shadow * 2, 2);
      ctx.fill();
      ctx.restore();
      if (state.border) {
        ctx.strokeStyle = state.border;
        ctx.lineWidth = 2;
        roundRect(ctx, shadow, shadow, width - shadow * 2, height - shadow * 2, 2);
        ctx.stroke();
      }
    }
    ctx.font = font;
    ctx.textBaseline = 'middle';
    const textX = shadow + padding + dot + gap;
    if (state.accent) {
      ctx.fillStyle = state.accent;
      // Petit carre de couleur : comme une case cochee dans un registre
      ctx.fillRect(shadow + padding, height / 2 - dot / 2, dot, dot);
    }
    ctx.fillStyle = state.color;
    lines.forEach((l, i) => {
      ctx.fillText(l, textX, shadow + padding * 0.55 + lineHeight * (i + 0.5));
    });
    texture.needsUpdate = true;
    // worldHeight = hauteur d'une ligne de texte dans la scene
    const unit = worldHeight / lineHeight;
    sprite.scale.set(width * unit, height * unit, 1);
  }

  draw(text);
  let lastKey = '';
  sprite.userData.setText = (value, style = {}) => {
    Object.assign(state, style);
    const key = `${value}|${state.color}|${state.border}|${state.background}|${state.accent}`;
    if (key === lastKey) return;
    lastKey = key;
    draw(value);
  };
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Lien "tube" entre deux points.
export function makeLink(from, to, color, radius = 0.045) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 12, 1, true),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 })
  );
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}
