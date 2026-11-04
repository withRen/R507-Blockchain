# R507 — Blockchain en 3D
---

> **Branche `test-alternate`** : version alternative du parcours, un récit 3D dans un quartier d'affaires de nuit. Démo : https://withren.github.io/R507-Blockchain/ . L'ancien parcours reste sur `ancien-parcours.html`.

## Équipe

| Membre |
|---|
| Rahim Tamhaev ([@withRen](https://github.com/withRen)) |
| Nicolas Rapuzzi ([@hextravagance](https://github.com/hextravagance)) |

## Public et objectif

- **Public visé :** des personnes qui n'ont jamais étudié la blockchain, sans explication orale préalable.
- **Objectif :** qu'à la fin du parcours l'utilisateur comprenne ce qu'est un bloc, comment les blocs sont reliés, pourquoi une falsification se repère, et comment un réseau décentralisé se met d'accord.
- **Fil rouge narratif :** la transaction « Alice → Bob : 5 jetons », racontée en faisant défiler la page.

## Notions abordées

Chaque notion est associée à une animation ou une interaction visible, pas seulement à du texte.

| # | Notion | Interaction prévue |
|---|---|---|
| 1 | Structure d'un bloc (données, hash, hash parent, nonce) | Les petites infos forment un bloc en trois couches (données, lien, nonce) ; on modifie une lettre et l'empreinte change en direct, les cubes « tremblent » |
| 2 | Chaînage cryptographique | Les infos se regroupent en 5 blocs reliés par des liens ; en-têtes de chapitres réellement chaînés en SHA-256 |
| 3 | Immutabilité et détection de falsification | En défilant, le bloc 3 est modifié : lui et toute la suite deviennent rouges en cascade |
| 4 | Réseau et décentralisation | La pièce revient au centre puis **se décompose en maillage** : 14 nœuds qui ont chacun leur copie, des messages circulent sur les liaisons |
| 5 | Validation et minage (PoW, nonce, difficulté) | Chaque cube qui saute est un essai ; seuls ceux qui franchissent la barre gagnent. Minage réel (SHA-256) dans le navigateur |
| 6 | Comparaison de consensus (PoW vs PoS / PoA) | Trois figures (colonnes de machines, piles de jetons, piliers d'autorité) et une simulation de 100 blocs |
| 7 | Cycle de vie d'une transaction et scénario d'attaque | Les confirmations s'empilent au défilement, puis la chaîne secrète de Mallory rattrape la vraie et la remplace ; chances de réussite selon la formule de Nakamoto |

**Concept :** un récit à faire défiler. On ouvre sur un logo Bitcoin en fil de fer, couvert de ~1 800 petits cubes, les « petites infos ». À chaque étape, ces infos se détachent pour prendre une nouvelle forme ; dans la section maillage, la pièce entière se décompose en réseau, pour montrer que le bitcoin n'est rangé nulle part. Le fond change de teinte selon le chapitre et des fragments d'information y flottent. Chaque chapitre a une carte d'explication et une carte « Le revers » (inconvénients). Les sources sont sur une page dédiée : [`sources.html`](sources.html).

Charte : le site prend l'allure d'un **livre de comptes**. Pas de cartes ni d'arrondis : du texte posé sur la page, des filets fins, des chiffres en police à chasse fixe. Chaque chapitre est une écriture du registre, avec sa vraie empreinte SHA-256 et le lien vers celle du chapitre précédent ; les chapitres sont donc eux-mêmes chaînés. La navigation est une mini-chaîne de 7 blocs. « Le revers » fait basculer la page en sombre et liste les inconvénients comme des débits (−), et « À retenir » est le total souligné d'un double filet. Couleurs : une encre bleue pour l'information, vert = valide, rouge = falsifié, orange = effort et énergie. Titres en Instrument Serif, texte en DM Sans, données en JetBrains Mono.
Les choix de représentation sont justifiés dans [`docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`](docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md) et s'appuient sur la fiche de recherche [`docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md`](docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md).

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
│   ├── MMI-R507-projet-blockchain-CHOIX-MODELISATION.md   # livrable officiel (25 % de la note)
│   ├── MMI-R507-projet-blockchain-FICHE-RECHERCHE.md      # fiche de recherche primaire par notion
│   ├── MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md      # grille d'auto-évaluation complétée
│   └── suivi/
│       ├── SEMAINE-01.md
│       ├── SEMAINE-02.md
│       ├── SEMAINE-03.md
│       └── SEMAINE-04.md
├── src/                                                   # code Three.js, SHA-256 et widgets
├── index.html                                             # parcours scénarisé en 7 chapitres
├── sources.html                                           # page dédiée aux sources par chapitre
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

- Parcours principal à **30 FPS ou plus** sur un poste de TP standard (rendu optimisé via un unique `THREE.InstancedMesh` de 1 800 cubes).
- **Tests utilisateurs** avec au moins 2 personnes extérieures au groupe. Leurs retours sont notés et transformés en issues si besoin.
  Questionnaire à leur faire remplir : [formulaire de retours testeurs](https://docs.google.com/forms/d/e/1FAIpQLSdWOe5Z6wL2r4mvUCPZjamTJZX2sr3akOwpV4yEK9PuOTuHjA/viewform).
- Textes lisibles, légendes, retours visuels et navigation claire.

## Usage de l'IA générative

Nous déclarons ici les outils d'IA utilisés et à quelle fin. Tout code généré a été relu, compris et vérifié par l'équipe.

| Outil | Usage |
|---|---|
| Claude (Claude Code) | Cadrage initial, rédaction de la structure du README, génération des jalons et issues GitHub |
| Antigravity | Initialisation du projet Vite + Three.js, scène 3D minimale, intégration UI WebGL (issue #6) |
| Claude (Claude Code) | Première version du parcours scénarisé en 7 chapitres (scènes Three.js, textes, inconvénients, recherche et vérification des sources) |
| Claude (Claude Code) | Branche `test-alternate` : scénario « Le Registre » et récit 3D en 9 séquences (`src/recit/`), intégration des assets Poly Haven (voir `docs/ASSETS.md`) |
| Antigravity | Rédaction des livrables (`CHOIX-MODELISATION.md`, `GRILLE-AUTOEVAL.md`, fiches de suivi hebdomadaire `SEMAINE-02` à `SEMAINE-04`) et synchronisation avec la fiche de recherche |

## Sources

- Nakamoto, S. (2008). [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)
- Yaga, D. et al. (2018). [NIST IR 8202 Blockchain Technology Overview](https://nvlpubs.nist.gov/nistpubs/ir/2018/NIST.IR.8202.pdf)
- NIST (2015). [FIPS 180-4 Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final)
- [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/)
- ethereum.org : [mécanismes de consensus](https://ethereum.org/fr/developers/docs/consensus-mechanisms/), [PoA](https://ethereum.org/en/developers/docs/consensus-mechanisms/poa/), [consommation d'énergie](https://ethereum.org/en/energy-consumption/), [historique (DAO fork)](https://ethereum.org/en/history/)
- Croman, K. et al. (2016). [On Scaling Decentralized Blockchains](https://www.initc3.org/files/Scaling2016.pdf)
- Gervais, A. et al. (2016). [On the Security and Performance of Proof of Work Blockchains](https://eprint.iacr.org/2016/555)
- Eyal, I. & Sirer, E. G. (2014). [Majority is not Enough](https://arxiv.org/abs/1311.0243)
- Cambridge Centre for Alternative Finance : [CBECI](https://ccaf.io/cbnsi/cbeci), [étude 2025](https://www.jbs.cam.ac.uk/2025/cambridge-study-sustainable-energy-rising-in-bitcoin-mining/)
- MIT DCI. [51% Attacks](https://www.dci.mit.edu/projects/51-percent-attacks)
- CNIL (2018). [Blockchain et RGPD](https://www.cnil.fr/fr/blockchain-et-rgpd-quelles-solutions-pour-un-usage-responsable-en-presence-de-donnees-personnelles)
