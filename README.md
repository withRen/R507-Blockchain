# R507 — Blockchain en 3D
---

> **« Le Registre »** : un récit 3D dans un quartier d'affaires de nuit. Démo : https://withren.github.io/R507-Blockchain/ .

## Équipe

| Membre |
|---|
| Rahim Tamhaev ([@withRen](https://github.com/withRen)) |
| Nicolas Rapuzzi ([@hextravagance](https://github.com/hextravagance)) |

## Public et objectif

- **Public visé :** des personnes qui n'ont jamais étudié la blockchain, sans explication orale préalable.
- **Objectif :** qu'à la fin du parcours l'utilisateur comprenne ce qu'est un bloc, comment les blocs sont reliés, pourquoi une falsification se repère, et comment un réseau décentralisé se met d'accord.
- **Fil rouge narratif :** « Le Registre », une enquête d'une nuit (23 h 47 à 07 h 10) dans un quartier d'affaires. Léa Vasseur, auditrice, découvre que 40 millions ont disparu d'un registre central tenu par un seul administrateur. Avec Inès, elle découvre au fil de la nuit comment une blockchain répond à ce problème, face à Maxime Kern qui tente de tricher.

## Notions abordées

Chaque notion est associée à une animation ou une interaction visible, pas seulement à du texte.

| # | Notion | Interaction prévue |
|---|---|---|
| 1 | Structure d'un bloc | Séq. 1, salle des serveurs : un bloc de verre ouvert en trois couches ; on clique une couche pour sa définition, puis on retrouve parmi six transactions celle qui donne l'empreinte cible (vrai SHA-256) |
| 2 | Chaînage cryptographique | Séq. 2, passerelle vitrée : cinq blocs reliés ; modifier le bloc 2 rompt le lien 2-3 (rouge), puis on répare la chaîne en recopiant les hashes, sans aucun coût |
| 3 | Immutabilité et détection de falsification | Séq. 3, bureau de Maxime : on change 5 en 500 dans le bloc 3 de sa copie ; parmi les 14 copies affichées, seule la sienne passe au rouge |
| 4 | Réseau et décentralisation | Séq. 4, au-dessus de la ville : les 14 tours sont les nœuds ; on coupe des tours (dont Meridian) et on émet une transaction qui se propage de voisin en voisin |
| 5 | Validation et minage | Séq. 5, ferme de minage du port : vrai mineur SHA-256 dans le navigateur (2 à 5 zéros), puis vérification du bloc trouvé en un seul hash |
| 6 | Comparaison d'au moins deux mécanismes de consensus | Séq. 6, salle du conseil : trois hologrammes (travail, enjeu, autorité), simulation de 100 blocs, puis tentative de corrompre les cinq signataires de l'autorité |
| 7 | Cycle de vie d'une transaction et scénario d'attaque illustré | Séq. 7, parking de la tour Kern : voyage du paiement jusqu'aux confirmations, chaîne secrète de Maxime face aux 14 copies, et calculateur (formule de Nakamoto) pour décider combien de blocs Julien doit attendre |

**Concept :** un récit 3D à faire défiler (`index.html`), en 9 séquences : un prologue, une séquence par notion, un épilogue. Chaque séquence s'ouvre sur une question affichée à l'écran, propose un exercice « À toi de jouer » avec de vrais calculs, et se ferme sur une phrase « À retenir » suivie de son revers. Un premier exercice arrive dès le prologue. Un bouton « Passer » reste toujours visible, et la lecture automatique est un choix. Les sources de la séquence en cours s'ouvrent dans une fenêtre, sans quitter le récit ; la liste complète est sur [`sources.html`](sources.html).

Charte : une ville de nuit, mate et sombre, construite entièrement en code (aucune texture ni modèle externe, voir [`docs/ASSETS.md`](docs/ASSETS.md)). Seuls les objets techniques brillent : des blocs de verre au gabarit unique, qui affichent leurs vraies valeurs. Une couleur n'a qu'un sens, rappelé par une légende permanente : bleu = information, vert = valide, rouge = falsifié ou attaque, orange = minage, turquoise = enjeu, violet = autorité. Les personnages apparaissent en silhouettes 3D dans les décors et en portraits 2D dans la boîte de dialogue. Dialogues en Roboto, données en IBM Plex Mono. Navigation par une mini-chaîne de 9 blocs.

Interface : un style télé à tube (écran CRT avec lignes de balayage, vignette et cadre arrondi, titres en VT323) et des boîtes de dialogue façon vieux jeu vidéo, avec un bandeau de question, une console d'exercice sur le côté et une platine de commandes en bas. Les blocs 3D sont restylés en écrans, et un effet « BIEN JOUÉ » salue chaque exercice réussi (commit `2428bf3`). Les panneaux, boutons et champs sont agrandis et arrondis. Tant que le visiteur n'a rien touché, l'élément à manipuler pulse avec une étiquette « Clique ici », « Écris ici » ou « Fais glisser » (commit `f37260b`).

Son : un écran d'entrée propose « Commencer avec le son » ou « Commencer sans le son », ce qui autorise la musique dès le départ. Deux musiques de Feldup, déposées dans `public/audio/`, sont jouées en fond au volume 0,4 : `investigation-discovery.mp3` pour le prologue et les séquences 1 à 4, `unraveled.mp3` pour les séquences 5 à 7 et l'épilogue. Les bruitages des interactions sont synthétisés en direct avec Web Audio (`src/recit/sfx.js`, aucun fichier). Le bouton Son coupe la musique et les bruitages. Crédits dans [`docs/ASSETS.md`](docs/ASSETS.md) et [`sources.html`](sources.html).

Le projet a connu trois versions. La v1 (« Grand Registre », 1 800 cubes sur une interface de livre de comptes) reste dans l'historique Git et est documentée comme alternative écartée. La v2 a introduit le récit « Le Registre ». La v3 garde cette histoire et la réécrit à partir de la revue de l'enseignant et d'un test utilisateur : les retours et les décisions sont dans [`docs/TESTS-UTILISATEURS.md`](docs/TESTS-UTILISATEURS.md).

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
│       ├── SEMAINE-04.md
│       ├── SEMAINE-05.md
│       └── SEMAINE-06.md
│   ├── SCENARIO-V3.md                                     # scénario de la v3
│   └── TESTS-UTILISATEURS.md                              # retours reçus et décisions
├── public/audio/                                          # deux musiques de Feldup (voir docs/ASSETS.md)
├── src/                                                   # récit Three.js (src/recit) et calculs réels (src/lib)
├── index.html                                             # le récit en 9 séquences
├── sources.html                                           # page dédiée aux sources par notion
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

- Parcours principal à **30 FPS ou plus** sur un poste de TP standard (ville découpée en quartiers non dessinés hors champ, chargement à la demande, fenêtres calculées dans un shader, aucune texture externe).
  - **Trois niveaux de qualité**, choisis au lancement d'après la carte graphique : élevé (cartes dédiées et puces Apple), moyen (puces intégrées Intel ou AMD, téléphones), bas (rendu logiciel). Le niveau fixe la résolution maximale, l'antialiasing, le filtre d'image et la version des façades (sans les pièces simulées derrière les vitres au niveau bas).
  - **Baisse automatique** : sous 40 images par seconde sur deux mesures de suite, le récit retire d'abord le filtre d'image, puis baisse la résolution par paliers, puis simplifie les façades. Le changement attend un fondu au noir, sauf si l'image saccade déjà (moins de 24 images par seconde).
  - `?q=low`, `?q=medium` ou `?q=high` dans l'adresse force un niveau (tests sur poste de TP) ; `?bench` expose `__bench()` dans la console pour mesurer le temps d'une image.
  - Le rendu demande la **carte graphique dédiée** (`powerPreference: 'high-performance'`). Le navigateur et le système gardent le dernier mot : sur un portable Windows à deux cartes, choisir « Hautes performances » pour le navigateur dans *Paramètres > Système > Écran > Graphiques*. Si l'accélération matérielle du navigateur est coupée, l'écran d'accueil le signale.
- **Glossaire** consultable à tout moment (bouton « Glossaire », touches `G` ou `/`) : on tape un mot-clé (« nonce », « pow », « nœud »…) et sa définition s'affiche, avec un lien pour revoir la séquence concernée. Les cinq termes du glossaire commun du sujet gardent leur définition mot pour mot.
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
| Claude (Claude Code) | Branche `test-alternate` : scénario « Le Registre » et récit 3D en 9 séquences (`src/recit/`), décors construits en code, sans asset externe |
| Antigravity | Rédaction des livrables (`CHOIX-MODELISATION.md`, `GRILLE-AUTOEVAL.md`, fiches de suivi hebdomadaire `SEMAINE-02` à `SEMAINE-04`) et synchronisation avec la fiche de recherche |
| Claude (Claude Code) | Version 3 : comparaison des deux premières versions avec les retours de l'enseignant et d'une testeuse, réécriture des dialogues, gabarit de bloc unique, portraits 2D, fenêtre des sources, lecteur de musique, mise à jour des livrables |
| Claude (Claude Code) | Optimisation du rendu (niveaux de qualité selon la carte graphique, baisse automatique, façades simplifiées) et glossaire consultable par mot-clé, après le retour d'un testeur |

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
