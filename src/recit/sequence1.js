// Sequence 1 : 03 h 05, la salle des serveurs. Structure d'un bloc.
// Les definitions marquees "glossaire" reprennent celles du sujet.
const R = 60; // hauteur de la salle dans la tour
const L = (x, y, z) => [x, y + R, z];

export const CAMERA = [
  { t: 0, pos: L(0.5, 1.85, 11), look: L(0, 2, 0), fov: 44 },
  { t: 0.09, pos: L(0.3, 1.8, 9), look: L(0, 1.9, 0), fov: 42 },
  { t: 0.2, pos: L(0.2, 1.85, 7.4), look: L(0, 2, 0), fov: 40 },
  // Le bloc apparait, couche par couche
  { t: 0.3, pos: L(-0.4, 1.55, 4.9), look: L(0, 1.3, 0.9), fov: 36 },
  { t: 0.39, pos: L(-0.2, 1.4, 4.3), look: L(0, 1.3, 0.9), fov: 34 },
  { t: 0.46, pos: L(0.3, 2.9, 4.4), look: L(0, 2.85, 0.9), fov: 34 },
  { t: 0.53, pos: L(-0.2, 2.15, 4.3), look: L(0, 2.05, 0.9), fov: 34 },
  // Le hash sort du bloc
  { t: 0.6, pos: L(0, 3.1, 6.2), look: L(0, 3.35, 0.9), fov: 38 },
  // Alice : "c'est chiffre"
  { t: 0.66, pos: L(0.6, 1.9, 7.2), look: L(-0.6, 1.9, 0.6), fov: 38 },
  { t: 0.73, pos: L(0.5, 1.95, 7.5), look: L(-0.4, 2, 0.6), fov: 38 },
  // A vous : le bloc occupe la droite, le panneau la gauche
  { t: 0.78, pos: L(-1.75, 2.75, 8.5), look: L(-1.75, 2.72, 0), fov: 38 },
  { t: 0.93, pos: L(-1.75, 2.75, 8.5), look: L(-1.75, 2.72, 0), fov: 38 },
  { t: 1, pos: L(0.6, 2.3, 8.4), look: L(0, 2.2, 0), fov: 40 }
];

export const ACTORS = {
  alice: {
    track: [
      { t: 0, x: 3.1, z: 10.2, face: 3 },
      { t: 0.09, x: 3.05, z: 3.1, face: -1.05 },
      { t: 1, x: 3.05, z: 3.1, face: -1.05 }
    ],
    headPitch: [[0.24, 0], [0.3, -0.12], [0.6, -0.16], [0.66, 0]]
  },
  ines: {
    track: [
      { t: 0, x: -3.1, z: 3, face: 1.05 },
      { t: 1, x: -3.1, z: 3, face: 1.05 }
    ],
    armLx: [[0.1, 0], [0.13, 0.5], [0.72, 0.5], [0.75, 0]],
    elbowL: [[0.1, 0.18], [0.13, 0.9], [0.72, 0.9], [0.75, 0.18]],
    headPitch: [[0.24, 0], [0.3, -0.1], [0.6, -0.14], [0.66, 0]]
  }
};

export const REVEAL = {
  data: [[0.24, 0], [0.29, 1]],
  parent: [[0.395, 0], [0.44, 1]],
  nonce: [[0.465, 0], [0.51, 1]],
  hash: [[0.54, 0], [0.59, 1]]
};

export const FOCUS = [
  { from: 0.24, to: 0.39, key: 'data' },
  { from: 0.395, to: 0.46, key: 'parent' },
  { from: 0.465, to: 0.53, key: 'nonce' }
];

export const LAB = { from: 0.755, to: 0.94 };

export const SLUGS = [{ from: 0.005, to: 1, time: '03 h 05', place: 'Tour Meridian, salle des serveurs' }];

export const LINES = [
  { from: 0.03, to: 0.09, who: 'Alice', text: 'Ce que vous décrivez, ça existe vraiment ?' },
  { from: 0.095, to: 0.17, who: 'Inès', text: 'Oui. Ça s’appelle une blockchain. Bitcoin fonctionne comme ça depuis 2009, sans banque et sans propriétaire.' },
  { from: 0.175, to: 0.235, who: 'Alice', text: 'Et concrètement, c’est quoi ?' },
  { from: 0.24, to: 0.31, who: 'Inès', text: 'Un registre découpé en blocs. Un bloc, c’est une page : un lot de transactions.' },
  { from: 0.315, to: 0.39, who: 'Inès', text: 'Ici, votre paiement à Bob. Sur Bitcoin, ces données sont publiques : n’importe qui peut les lire.' },
  { from: 0.395, to: 0.46, who: 'Inès', text: 'Au-dessus, l’empreinte du bloc précédent. C’est le lien avec le passé.' },
  { from: 0.465, to: 0.53, who: 'Inès', text: 'Et le nonce : un simple nombre, qui ne veut rien dire. Les mineurs le font varier.' },
  { from: 0.535, to: 0.6, who: 'Inès', text: 'On passe l’ensemble dans SHA-256, la fonction de hachage de Bitcoin. Il en sort le hash du bloc.' },
  { from: 0.605, to: 0.66, who: 'Alice', text: 'Donc c’est chiffré.' },
  { from: 0.665, to: 0.74, who: 'Inès', text: 'Non. Rien n’est caché. Le hash résume le bloc, et on ne peut pas retrouver le bloc à partir de lui.' },
  { from: 0.95, to: 1, who: 'Alice', text: 'Et qu’est-ce qui empêche de remplacer tout le bloc, avec un nouveau hash ?' }
];

export const TERMS = [
  { from: 0.1, to: 0.17, label: 'Le mot', title: 'Blockchain', def: 'Un registre public découpé en blocs. Chaque bloc porte l’empreinte du précédent, et des nœuds indépendants en gardent chacun une copie.' },
  { from: 0.245, to: 0.39, label: 'Structure', title: 'Bloc', def: 'Un lot de transactions, accompagné d’un en-tête. Une transaction dit qui transfère quoi à qui.' },
  { from: 0.4, to: 0.46, label: 'Structure', title: 'Hash du bloc parent', def: 'Le hash du bloc précédent, recopié dans celui-ci. C’est ce qui relie les blocs entre eux.' },
  { from: 0.47, to: 0.53, label: 'Glossaire', title: 'Nonce', def: 'Valeur, souvent numérique, modifiée pendant une recherche de preuve de travail afin d’obtenir un hash respectant une difficulté donnée.' },
  { from: 0.54, to: 0.6, label: 'Glossaire', title: 'Hash', def: 'Résultat de l’application d’une fonction de hachage à des données ; il sert notamment à produire une représentation de longueur fixe et à relier des blocs.' },
  { from: 0.67, to: 0.74, label: 'Glossaire', title: 'Empreinte cryptographique', def: 'Hash utilisé comme identifiant vérifiable de données. Elle est très sensible à une modification et ne permet pas, en pratique, de retrouver les données originales.' },
  { from: 0.945, to: 1, label: 'Note d’audit', title: 'Ce que ça ne prouve pas', def: 'Une empreinte montre que le contenu n’a pas changé, pas qu’il est vrai. Ce bloc est simplifié : un vrai bloc Bitcoin contient davantage de champs.' }
];

// Definitions affichees quand le visiteur clique sur une couche du bloc
export const LAYER_INFO = {
  data: { label: 'Couche cliquée', title: 'Données', def: 'Les transactions du bloc, lisibles par tous. Modifiez-les dans le panneau : le hash change.' },
  parent: { label: 'Couche cliquée', title: 'Hash du bloc parent', def: 'L’empreinte du bloc précédent. Si le passé change, ce lien ne correspond plus.' },
  nonce: { label: 'Couche cliquée', title: 'Nonce', def: 'Un simple nombre. Changez-le : tout le hash change aussi, et c’est ce qu’exploitent les mineurs.' }
};

export const PARENT = '000a3f1c9e27d46b';
