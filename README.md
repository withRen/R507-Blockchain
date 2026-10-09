# R507 — Blockchain en 3D

Expérience web interactive en **Three.js** qui explique le fonctionnement d'une blockchain à une personne qui n'y connaît rien.

> Projet de médiation scientifique réalisé dans le cadre de la ressource **R507**, BUT MMI 3ᵉ année (2026).
> Le projet ne code pas une vraie blockchain : il en **représente** les concepts dans l'espace, avec des animations et des interactions.

**Démo en ligne :** _à venir (GitHub Pages)_
**GitHub Projects :** [R507-Blockchain](https://github.com/users/withRen/projects/3)

---

## Équipe

| Membre |
|---|
| Rahim Tamhaev ([@withRen](https://github.com/withRen)) |
| Nicolas Rapuzzi ([@hextravagance](https://github.com/hextravagance)) |

## Public et objectif

- **Public visé :** des personnes qui n'ont jamais étudié la blockchain, sans explication orale préalable.
- **Objectif :** qu'à la fin du parcours l'utilisateur comprenne ce qu'est un bloc, comment les blocs sont reliés, pourquoi une falsification se repère, et comment un réseau décentralisé se met d'accord.
- **Fil rouge narratif :** _à définir (ex. suivre le parcours d'une transaction depuis l'envoi jusqu'à sa confirmation)_

## Notions abordées

Chaque notion est associée à une animation ou une interaction visible, pas seulement à du texte.

| # | Notion | Interaction prévue |
|---|---|---|
| 1 | Structure d'un bloc (données, hash, hash parent, nonce) | _à définir_ |
| 2 | Chaînage cryptographique | _à définir_ |
| 3 | Immutabilité et détection de falsification | _à définir_ |
| 4 | Réseau et décentralisation | _à définir_ |
| 5 | Validation et minage (PoW, nonce, difficulté) | _à définir_ |
| 6 | Comparaison de consensus (PoW vs PoS / PoA) | _à définir_ |
| 7 | Cycle de vie d'une transaction et scénario d'attaque | _à définir_ |

Les choix de représentation sont justifiés dans [`docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`](docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md).

## Stack technique

- [Three.js](https://threejs.org/)
- [Vite](https://vitejs.dev/) (serveur de développement et build)
- Déploiement sur **GitHub Pages**

## Lancer le projet

```bash
git clone https://github.com/withRen/R507-Blockchain.git
cd R507-Blockchain
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

## Structure du dépôt

```
R507-Blockchain/
├── docs/
│   ├── MMI-R507-projet-blockchain-CHOIX-MODELISATION.md   # livrable officiel
│   ├── MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md      # avant la soutenance
│   └── suivi/
│       ├── SEMAINE-01.md
│       └── …                                              # jusqu'à SEMAINE-08.md
├── src/                                                   # code Three.js
├── public/                                                # assets statiques
└── README.md
```

## Jalons

| Jalon | Date | Attendu |
|---|---|---|
| Cadrage | 9 octobre 2026, 17h | Groupe, dépôt, GitHub Projects, premières issues |
| Livraison | 15 novembre 2026, 23h59 | Code, GitHub Projects, démo en ligne |
| Répétition finale | 19 novembre 2026, 9h30 | Répétition entre groupes |
| Soutenance | 19 novembre 2026, 11h | 20 minutes par groupe |

## Gestion de projet

Le suivi se fait dans **GitHub Projects**, avec les colonnes :
`Backlog` → `À faire` → `En cours` → `À vérifier` → `Terminé`

- Les issues sont détaillées, assignées et liées aux commits et PR (`Closes #12`).
- Les milestones correspondent aux jalons du calendrier.
- Une fiche de suivi est rédigée chaque semaine dans `docs/suivi/`.

## Critères de qualité

- Parcours principal à **30 FPS ou plus** sur un poste de TP standard.
- **Tests utilisateurs** avec au moins 2 personnes extérieures au groupe. Leurs retours sont notés et transformés en issues si besoin.
- Textes lisibles, légendes, retours visuels et navigation claire.

## Usage de l'IA générative

Nous déclarons ici les outils d'IA utilisés et à quelle fin. Tout code généré a été relu, compris et vérifié par l'équipe.

| Outil | Usage |
|---|---|
| _ex. Claude / ChatGPT / Copilot_ | _ex. rédaction de la base du README, aide sur les shaders…_ |

## Sources

_À compléter : sources fiables utilisées pour la recherche (whitepaper Bitcoin, documentation Ethereum, etc.)_
