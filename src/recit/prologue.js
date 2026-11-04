// Prologue : 23 h 47, tour Meridian. Tout est decrit en donnees.
// Les coordonnees des personnages et des plans interieurs sont locales au 41e etage.
import { MERIDIAN } from './city.js';

const PI = Math.PI;
const Y = MERIDIAN.floorY;
const L = (x, y, z) => [x, y + Y, z];

export const CAMERA = [
  // La ville, de loin
  { t: 0.0, pos: [-470, 262, 830], look: [0, 120, 0], fov: 24 },
  { t: 0.095, pos: [-300, 236, 560], look: [0, 138, 0], fov: 24 },
  // Approche de la facade de la tour Meridian
  { t: 0.19, pos: [34, 190, 118], look: [2, 175, 10], fov: 36 },
  // On traverse la baie vitree
  { t: 0.245, pos: L(5.2, 1.85, 16.5), look: L(4.3, 1.45, 0), fov: 40 },
  // Dans le dos d'Alice
  { t: 0.3, pos: L(2.7, 1.74, 1.7), look: L(4.3, 1.28, -3), fov: 40 },
  { t: 0.345, pos: L(3.05, 1.68, 0.9), look: L(4.3, 1.32, -3), fov: 38 },
  // L'ecran : la ligne qui a change
  { t: 0.39, pos: L(4.2, 1.5, -1.25), look: L(4, 1.4, -2.76), fov: 34 },
  { t: 0.47, pos: L(4.14, 1.42, -1.62), look: L(4.02, 1.31, -2.76), fov: 34 },
  // Elle rattrape Gaspard devant l'ascenseur
  { t: 0.51, pos: L(-3.2, 1.65, -5.9), look: L(-6.7, 1.35, -11), fov: 36 },
  { t: 0.605, pos: L(-3.7, 1.62, -6.9), look: L(-7, 1.42, -12), fov: 34 },
  { t: 0.62, pos: L(-3.7, 1.62, -6.9), look: L(-7, 1.42, -12), fov: 34 },
  // 02 h 30. Cut. La salle de reunion, face a la ville
  { t: 0.621, pos: L(-2.55, 2.0, 0.7), look: L(-2.3, 0.55, 13), fov: 38 },
  { t: 0.76, pos: L(-2.45, 1.92, 1.6), look: L(-2.3, 0.5, 13), fov: 38 },
  // Ines, face a la baie
  { t: 0.815, pos: L(-0.15, 1.72, 9.4), look: L(-2.5, 0.75, 15), fov: 36 },
  { t: 0.875, pos: L(-0.45, 1.68, 9.75), look: L(-2.55, 0.62, 15), fov: 34 },
  // On passe a travers la vitre : la ville, ses 14 tours
  { t: 0.915, pos: [14, 196, 44], look: [40, 136, 170], fov: 44 },
  { t: 1.0, pos: [-120, 260, -320], look: [10, 88, 40], fov: 42 }
];

const CUT = 0.6205;

export const ACTORS = {
  alice: {
    track: [
      { t: 0, x: 4.85, z: -1.95, face: -2.75 },
      { t: 0.43, x: 4.85, z: -1.95, face: -2.75 },
      { t: 0.54, x: -4.2, z: -9.7, face: -2.5 },
      { t: CUT, x: -4.2, z: -9.7, face: -2.5 },
      { t: CUT + 0.0005, x: -4.45, z: 6.2, face: 1.2 },
      { t: 0.77, x: -4.45, z: 6.2, face: 1.2 },
      { t: 1, x: -4.45, z: 6.2, face: 0.7 }
    ],
    armLx: [[0.38, 0], [0.4, 0.62], [0.43, 0.62], [0.45, 0], [0.545, 0], [0.56, 0.38], [0.6, 0.38], [0.615, 0]],
    armRx: [[0.34, 0], [0.36, 0.35], [0.43, 0.35], [0.45, 0]],
    elbowL: [[0.38, 0.18], [0.4, 1.2], [0.43, 1.2], [0.45, 0.18]],
    elbowR: [[0.34, 0.18], [0.36, 1.25], [0.43, 1.25], [0.45, 0.18]],
    headPitch: [[0.25, 0], [0.34, 0.12], [0.44, 0.12], [0.47, 0], [0.545, 0.03]]
  },
  bob: {
    track: [
      { t: 0, x: -30, z: 6, face: 0 },
      { t: CUT, x: -30, z: 6, face: 0 },
      { t: CUT + 0.0005, x: -0.45, z: 6.2, face: -1.2 },
      { t: 1, x: -0.45, z: 6.2, face: -1.2 }
    ],
    armLx: [[0.635, 0.05], [0.65, 0.35], [0.68, 0.35], [0.7, 0.05]],
    elbowL: [[0.635, 0.18], [0.65, 1.1], [0.68, 1.1], [0.7, 0.18]],
    headYaw: [[0.76, 0], [0.8, -0.85], [1, -0.85]]
  },
  ines: {
    track: [
      { t: 0, x: -30, z: 12, face: 0 },
      { t: CUT, x: -30, z: 12, face: 0 },
      { t: CUT + 0.0005, x: -1.8, z: 11.1, face: 0 },
      { t: 1, x: -1.8, z: 11.1, face: 0 }
    ],
    armLx: [[0.8, 0], [0.825, 0.14], [1, 0.14]],
    elbowL: [[0.8, 0.18], [0.825, 1.25], [1, 1.25]],
    armRx: [[0.8, 0], [0.825, 0.1], [1, 0.1]],
    elbowR: [[0.8, 0.18], [0.825, 1.12], [1, 1.12]]
  },
  gaspard: {
    track: [
      { t: 0, x: -12, z: -3.8, face: 1.5 },
      { t: 0.415, x: -12, z: -3.8, face: 1.5 },
      { t: 0.46, x: -8.9, z: -4.1, face: 1.5 },
      { t: 0.525, x: -7.8, z: -12.3, face: 0 },
      { t: 1, x: -7.8, z: -12.3, face: 0 }
    ],
    headYaw: [[0.54, 0], [0.56, 0.32], [1, 0.32]]
  }
};

export const SCENE = {
  ledger: 0.395,
  lift: [[0.46, 0], [0.515, 1], [0.585, 1], [0.613, 0]]
};

export const SLUGS = [
  { from: 0.008, to: 0.62, time: '23 h 47', place: 'Quartier d’affaires, tour Meridian' },
  { from: CUT, to: 0.885, time: '02 h 30', place: 'Tour Meridian, 41e étage' }
];

export const LINES = [
  { from: 0.02, to: 0.095, who: 'Inès', vo: true, text: 'Cette nuit-là, toute la ville payait grâce à un seul registre.' },
  { from: 0.115, to: 0.2, who: 'Inès', vo: true, text: 'Une seule base de données. Un seul administrateur. Personne n’y voyait de problème.' },
  { from: 0.27, to: 0.345, who: 'Inès', vo: true, text: 'Alice Vasseur, audit interne. La dernière encore à son poste.' },
  { from: 0.405, to: 0.47, who: 'Alice', text: 'Lemoine Logistique. Quarante millions à zéro, à 23 h 12. Rien dans les journaux.' },
  { from: 0.535, to: 0.565, who: 'Alice', text: 'Gaspard. Qui a un accès en écriture sur le registre ?' },
  { from: 0.567, to: 0.602, who: 'Gaspard', text: 'Moi. C’est précisément pour ça qu’on nous fait confiance.' },
  { from: 0.635, to: 0.682, who: 'Bob', text: 'J’avais quarante millions.' },
  { from: 0.684, to: 0.725, who: 'Alice', text: 'Le registre dit zéro. Et c’est le seul qui existe.' },
  { from: 0.727, to: 0.775, who: 'Inès', text: 'Un seul registre, c’est aussi un seul témoin.' },
  { from: 0.815, to: 0.88, who: 'Inès', text: 'Et si chaque tour de cette ville en tenait une copie ?' },
  { from: 0.905, to: 0.94, who: 'Inès', vo: true, text: 'L’idée existait déjà. Elle a un nom : la blockchain.' },
  { from: 0.943, to: 0.977, who: 'Inès', vo: true, text: 'Bitcoin fonctionne ainsi depuis 2009. Personne ne le possède.' }
];

export const TERMS = [
  {
    from: 0.135, to: 0.215, label: 'Point de départ', title: 'Registre centralisé',
    def: 'Une seule organisation détient le registre. Elle est la seule à pouvoir y écrire, et personne ne peut vérifier ce qu’elle en fait.'
  },
  {
    from: 0.735, to: 0.8, label: 'Le problème', title: 'Centre unique',
    def: 'Si le seul détenteur ment, tombe en panne ou disparaît, il ne reste aucune copie pour le contredire.'
  },
  {
    from: 0.905, to: 0.94, label: 'Le mot', title: 'Blockchain',
    def: 'Un registre public découpé en blocs, chaînés par des empreintes. Des nœuds indépendants en gardent chacun une copie, sans centre unique.'
  },
  {
    from: 0.943, to: 0.977, label: 'L’exemple', title: 'Bitcoin',
    def: 'La monnaie numérique décrite en 2008 par Satoshi Nakamoto. Aucune banque ne la gère : elle n’existe que comme lignes dans sa blockchain.'
  }
];

export const NEXT = { label: 'Séquence suivante', text: '03 h 05 — La structure d’un bloc' };
