// Les portraits des personnages : des bustes de face dessines en code, pixel par pixel
// (grille de 24 x 24), affiches dans la boite de dialogue. Aucune image externe.
// Clara, Theo et Helene portent la couleur du mecanisme de consensus qu'ils defendent.
const R = (x, y, w, h, fill, more = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${more}/>`;

// Chaque coiffure a une partie derriere la tete et une partie devant
const HAIR = {
  short: { back: () => '', front: (c) => R(7, 4, 10, 3, c) + R(6, 5, 1, 4, c) + R(17, 5, 1, 4, c) },
  bob: { back: (c) => R(5, 6, 14, 10, c), front: (c) => R(6, 4, 12, 3, c) + R(7, 7, 4, 1, c) },
  long: { back: (c) => R(5, 6, 14, 15, c), front: (c) => R(6, 4, 12, 3, c) },
  bun: { back: (c) => R(10, 1, 4, 3, c), front: (c) => R(7, 4, 10, 3, c) + R(6, 5, 1, 5, c) + R(17, 5, 1, 5, c) },
  curly: { back: (c) => R(5, 4, 14, 6, c), front: (c) => R(6, 3, 12, 4, c) + R(8, 2, 3, 1, c) + R(13, 2, 3, 1, c) },
  bald: { back: () => '', front: (c) => R(6, 8, 1, 4, c) + R(17, 8, 1, 4, c) }
};

// Peaux, cheveux et tenues repris des modeles 3D de figure.js : meme personnage, memes couleurs
const CAST = {
  lea: { skin: '#e0b69e', hair: '#181315', style: 'bob', cloth: '#2a303d', shirt: '#cfd3db', scarf: '#3f6fd8' },
  julien: { skin: '#c99a7c', hair: '#74767c', style: 'short', cloth: '#1b2743', shirt: '#e6e6e6', tie: '#5a6474' },
  maxime: { skin: '#dcb7a1', hair: '#120d0d', style: 'short', cloth: '#5e1519', shirt: '#21181a', badge: '#d4af6a' },
  ines: { skin: '#b98563', hair: '#0f0b0a', style: 'long', cloth: '#31363a', shirt: '#8d939c', glasses: true, badge: '#00e5ff' },
  gaspard: { skin: '#a98670', hair: '#7c8087', style: 'short', cloth: '#15161d', shirt: '#f1f1f1', tie: '#7a1620' },
  theo: { skin: '#b98a68', hair: '#2a1f19', style: 'curly', cloth: '#8a5a2b', shirt: '#8a837a', beard: true },
  clara: { skin: '#e2c0a2', hair: '#0e0c0c', style: 'bun', cloth: '#12767b', shirt: '#dde6e6' },
  helene: { skin: '#dab69e', hair: '#9c9fa6', style: 'short', cloth: '#4f4688', shirt: '#e6e4ee' }
};
const UNKNOWN = { skin: '#8a93a3', hair: '#59616f', style: 'short', cloth: '#36415f', shirt: '#8a93a3' };

const key = (who) => who.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function portrait(who) {
  const p = CAST[key(who)] ?? UNKNOWN;
  const hair = HAIR[p.style];
  const dark = '#1a1a22';
  return `<svg viewBox="0 0 24 24" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">`
    + hair.back(p.hair)
    // Epaules, cou et col
    + R(3, 19, 18, 5, p.cloth) + R(2, 21, 20, 3, p.cloth)
    + R(10, 16, 4, 4, p.skin) + R(10, 16, 4, 1, 'rgba(0,0,0,0.2)')
    + R(10, 19, 4, 5, p.shirt)
    + (p.tie ? R(11.5, 19, 1, 5, p.tie) : '')
    + (p.scarf ? R(8, 18, 8, 2, p.scarf) + R(13, 20, 2, 4, p.scarf) : '')
    + (p.badge ? R(16, 21, 2, 2, p.badge) : '')
    // Tete
    + R(7, 6, 10, 11, p.skin) + R(6, 10, 1, 3, p.skin) + R(17, 10, 1, 3, p.skin)
    + R(9, 9.6, 2, 0.6, p.hair) + R(13, 9.6, 2, 0.6, p.hair)
    + R(9, 11, 2, 2, dark) + R(13, 11, 2, 2, dark) + R(9.4, 11.3, 0.6, 0.6, '#ffffff') + R(13.4, 11.3, 0.6, 0.6, '#ffffff')
    + R(11.5, 12, 1, 2, 'rgba(0,0,0,0.14)')
    + (p.beard ? R(7, 14, 10, 3, p.hair) : '')
    + (p.moustache ? R(9.5, 13.8, 5, 0.9, p.hair) : '')
    + R(10, 14.8, 4, 0.8, '#7a3b3b', ' class="mouth"')
    + hair.front(p.hair)
    + (p.glasses
      ? `<g fill="none" stroke="#cfd6e6" stroke-width="0.5"><rect x="8.3" y="10.3" width="3.4" height="3.4"/><rect x="12.3" y="10.3" width="3.4" height="3.4"/></g>`
      : '')
    + '</svg>';
}
