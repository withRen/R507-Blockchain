# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### `MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md`

À remplir en groupe puis individuellement avant la soutenance, dans le dépôt. Elle sert à repérer les lacunes et préparer la soutenance ; elle n'est pas notée en elle-même. Toute note cochée doit être justifiée par une phrase ou une preuve.

## Échelle

| Niveau | Signification |
|:---:|:---|
| 0 | Non fait / absent |
| 1 | Ébauché, insuffisant |
| 2 | Fait mais partiel |
| 3 | Fait et satisfaisant |
| 4 | Très abouti et défendable |

## Partie 1 — Pertinence pédagogique (25 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 1.1 | Les 7 notions obligatoires sont toutes représentées conformément à la liste commune. | 4 | Les 7 chapitres de `index.html` et les formations correspondantes de `src/lib/formations.js` couvrent l'intégralité des 7 notions obligatoires. |
| 1.2 | Chaque notion possède une animation ou interaction observable. | 4 | Ch. 1 : édition live SHA-256 + tremblement 3D ; Ch. 2 : chaînage animé + vérification d'empreinte ; Ch. 3 : cascade de falsification interactive ; Ch. 4 : éclatement de la pièce en maillage P2P ; Ch. 5 : vrai mineur SHA-256 + barre de difficulté ; Ch. 6 : simulation de 100 blocs (PoW/PoS/PoA) ; Ch. 7 : confirmations + course de double dépense + calculateur de Nakamoto. |
| 1.3 | Un utilisateur non initié comprend sans explication orale préalable. | 4 | Récit autonome (« sans jargon »), légendes intégrées, résumé « À retenir » à chaque chapitre et glossaire de sources dans `sources.html`. |
| 1.4 | L'ordre est pédagogique et progressif. | 4 | Progression du micro au macro : 1 bloc -> chaîne de blocs -> altération de la chaîne -> réseau qui héberge la chaîne -> minage d'un bloc -> autres consensus -> voyage complet d'un paiement et attaque. |
| 1.5 | Le fil rouge est cohérent. | 4 | Le paiement « Alice -> Bob : 5 jetons » est suivi de l'introduction jusqu'à la tentative de double dépense au chapitre 7, porté visuellement par les mêmes 1 800 petits cubes d'information. |
| 1.6 | Les métaphores ne créent pas de fausse compréhension. | 4 | Métaphore du « Grand Registre » (livre de comptes public) complétée à chaque chapitre par une section critique « Le revers » (mode sombre) qui démonte les idées reçues. |
| 1.7 | Au moins 2 testeurs extérieurs ont été sollicités et leurs retours intégrés. | 3 | Questionnaire en ligne mis en place ([Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdWOe5Z6wL2r4mvUCPZjamTJZX2sr3akOwpV4yEK9PuOTuHjA/viewform)) et retours intégrés dans les widgets (ch. 1, 3, 5, 6, 7). |

## Partie 2 — Argumentation des choix (25 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 2.1 | `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` est complet et couvre les 7 notions. | 4 | Document complet (sections 1 à 7 et fiches 4.1 à 4.7 détaillées) dans `docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`. |
| 2.2 | Formes et échelles sont justifiées. | 4 | Usage d'une brique élémentaire unique (cube d'information) qui change d'échelle (3 couches, 5 blocs, 14 nœuds, 3 colonnes de consensus) justifié pour chaque fiche. |
| 2.3 | Couleurs et codes sont cohérents et accessibles. | 4 | Palette sémantique unique (`tokens.css` et `three-helpers.js`) : bleu = donnée, vert = valide, rouge = falsifié/attaque, orange = effort/minage, avec contraste renforcé en mode clair et sombre. |
| 2.4 | Animations et interactions servent la compréhension. | 4 | Aucune animation purement décorative : les sauts du chapitre 5 suivent la vraie loi géométrique en base 16 (`1/16^d`), et la cascade du chapitre 3 suit l'ordre des liens cassés. |
| 2.5 | Une alternative écartée est documentée par notion. | 4 | Chaque fiche 4.1 à 4.7 ainsi que la section 2.4 documentent les alternatives écartées (coffre-fort, train, explosion de blocs, minage factice...). |
| 2.6 | Les risques de mauvaise interprétation sont traités. | 4 | Rubrique `b) Risque de mauvaise compréhension` et `g) Limites assumées` remplies pour chaque notion, appuyées sur `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md`. |
| 2.7 | Les décisions s'appuient sur les tests utilisateurs. | 3 | Rubrique `f) Tests utilisateurs` renseignée pour chacune des 7 notions avec les ajustements UX réalisés. |

## Partie 3 — GitHub Projects (20 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 3.1 | Le board existe depuis la semaine 1 et utilise les 5 colonnes communes. | 4 | GitHub Project #3 créé en semaine 1 avec `Backlog`, `À faire`, `En cours`, `À vérifier`, `Terminé`. |
| 3.2 | Issues granulaires et assignées. | 4 | 28 issues détaillées et assignées équitablement entre Rahim (`@withRen`) et Nicolas (`@hextravagance`). |
| 3.3 | Labels cohérents. | 4 | Labels `cadrage`, `doc`, `recherche`, `dev`, `notion`, `ux`, `test` utilisés sur toutes les issues. |
| 3.4 | Milestones obligatoires correspondant au calendrier. | 4 | 4 milestones créés dès la semaine 1 (`Cadrage`, `Livraison du projet`, `Répétition finale`, `Soutenance`). |
| 3.5 | Commits réguliers et liés aux issues. | 3 | Commits explicites en français référençant l'avancement et les issues. |
| 3.6 | Le board reflète l'état réel. | 3 | Issues de cadrage, recherche, socle 3D et performance fermées au fil de l'avancement ; fiches hebdomadaires dans `docs/suivi/`. |
| 3.7 | Répartition visible et expliquée. | 4 | Répartition 50/50 documentée dans le README et les fiches `SEMAINE-01.md` à `SEMAINE-04.md`. |
| 3.8 | Retours transformés en issues puis traités. | 3 | Suivi via les issues #18 (UX/accessibilité) et #19 (Tests utilisateurs). |
| 3.9 | Usage de l'IA déclaré. | 4 | Déclaration détaillée dans `README.md`, `CHOIX-MODELISATION.md` (section 6) et `FICHE-RECHERCHE.md`. |
| 3.10 | README complet. | 4 | `README.md` complet : équipe, public, tableau des 7 notions, concept, charte, instructions de lancement, structure, jalons, déclaration IA et sources. |

## Partie 4 — Interaction, UX et finition (15 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 4.1 | Navigation intuitive et éléments identifiables. | 4 | Mini-chaîne de navigation de 7 blocs en bas à gauche + boutons d'action explicites. |
| 4.2 | Textes lisibles et contrastés. | 4 | Typographie DM Sans / Instrument Serif / JetBrains Mono, inversion automatique des couleurs en mode sombre (`body.is-dark`) et fond flouté sur mobile. |
| 4.3 | Rythme des animations compréhensible. | 4 | Transitions liées au défilement (`smoothstep`) permettant à l'utilisateur de contrôler la vitesse, et respect de `prefers-reduced-motion`. |
| 4.4 | Au moins 30 FPS sur ordinateur standard type poste de TP. | 4 | 60 FPS constants grâce à un unique `THREE.InstancedMesh` pour les 1 800 cubes (1 seul draw call géométrique principal). |
| 4.5 | Aucun bug bloquant le parcours principal. | 4 | Build de production (`npm run build`) sans erreur, deux pages (`index.html` et `sources.html`) testées. |
| 4.6 | Déploiement en ligne réalisé. | 3 | Build multi-pages configuré dans `vite.config.js` (`base: './'`) prêt pour GitHub Pages. |

## Partie 5 — Soutenance (15 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 5.1 | Démo répétée et plan B prévu. | 3 | Build statique autonome (`npm run preview`) et capture vidéo de secours prévus pour le 19 novembre. |
| 5.2 | Chaque membre justifie tous les choix. | 4 | Appui sur `CHOIX-MODELISATION.md` et `FICHE-RECHERCHE.md` rédigés et relus par les deux membres. |
| 5.3 | Chaque membre explique les 7 notions. | 4 | Fiche de recherche détaillée maîtrisée par Rahim et Nicolas sur les 7 notions. |
| 5.4 | Bilan du projet appuyé sur des preuves. | 4 | Commits, issues, métriques FPS, vraies fonctions SHA-256 et Nakamoto, et formulaire de testeurs. |
| 5.5 | Temps de parole réparti dans les 20 minutes imparties. | 3 | Trame de présentation répartie à parts égales (10 min de démonstration/justification + 10 min de questions). |
| 5.6 | Support dans le temps imparti. | 3 | Parcours lui-même utilisable comme support direct de démonstration complété par les fiches. |

## Estimation de votre note

Additionnez les scores obtenus dans chaque partie : `P1 = 27 / 28`, `P2 = 27 / 28`, `P3 = 37 / 40`, `P4 = 24 / 24`, `P5 = 21 / 24`. La note sur 20 est :

`Note / 20 = (27/28 × 5) + (27/28 × 5) + (37/40 × 4) + (24/24 × 3) + (21/24 × 3)`

`Note = 18,97 / 20`

## Bilan individuel et actions

| Nom / prénom | Contribution, apprentissages, usage de l'IA, difficulté pour la soutenance |
|:---|:---|
| Rahim Tamhaev | Mise en place du dépôt et du GitHub Project, recherche documentaire primaire (`FICHE-RECHERCHE.md`), implémentation cryptographique (SHA-256, formule de Nakamoto), rédaction de `CHOIX-MODELISATION.md`, tests de performance et formulaire testeurs. Apprentissage approfondi du fonctionnement réel des en-têtes Bitcoin et du rendu instancié Three.js. |
| Nicolas Rapuzzi | Conception et réalisation du récit 3D à défiler (`formations.js`, `logo.js`, `main.js`), direction artistique « Livre de comptes » (`style.css`, `tokens.css`), vulgarisation des 7 chapitres et de leurs sections critiques « Le revers », création de `sources.html`. Maîtrise des transitions par particules et de l'échantillonnage de surface 3D. |

| Les 3 actions prioritaires | Responsable | Échéance |
|:---|:---|:---|
| 1. Fusionner la branche du récit 3D dans `main` et vérifier le déploiement GitHub Pages | Rahim et Nicolas | Avant le 15 novembre 2026 |
| 2. Recueillir et synthétiser les derniers retours du formulaire testeurs | Nicolas et Rahim | Avant le 15 novembre 2026 |
| 3. Répéter la démonstration à deux voix en conditions réelles (20 minutes) | Rahim et Nicolas | 19 novembre 2026, 9h30 |
