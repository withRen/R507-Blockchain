# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### `MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md`

À remplir en groupe puis individuellement avant la soutenance, dans le dépôt. Elle sert à repérer les lacunes et préparer la soutenance ; elle n'est pas notée en elle-même. Toute note cochée doit être justifiée par une phrase ou une preuve.

> Mise à jour du 6 novembre 2026 : la grille évalue désormais la v2, le récit urbain « Le Registre » (`index.html`, `src/recit/`), qui sera présenté en soutenance. Les scores ont été revus à la baisse là où la v2 n'est pas encore testée ou mesurée.

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
| 1.1 | Les 7 notions obligatoires sont toutes représentées conformément à la liste commune. | 4 | Une séquence par notion (`src/recit/sequence1.js` à `sequence7.js`), avec les définitions du glossaire du sujet dans les encarts. |
| 1.2 | Chaque notion possède une animation ou interaction observable. | 4 | Un panneau « À vous » par séquence : modifier un bloc avec vrai SHA-256 (1), rompre et réparer la chaîne (2), falsifier le bloc 3 face à 14 nœuds (3), couper des tours et propager une transaction (4), vrai mineur 2 à 5 zéros et vérification en un hash (5), 100 blocs en PoW / PoS / PoA (6), calculateur de Nakamoto pour la décision de Bob (7). |
| 1.3 | Un utilisateur non initié comprend sans explication orale préalable. | 2 | Le récit pose le problème avant la solution et les fausses idées sont corrigées par les personnages. Mais le dialogue est lu en entier avant chaque interaction, avec de longues répliques d'Inès (séquences 1 et 7), et la v2 n'a pas encore été testée par des personnes extérieures. |
| 1.4 | L'ordre est pédagogique et progressif. | 4 | Problème (registre unique) puis bloc, chaîne, falsification, réseau, minage, consensus, paiement et attaque, puis bilan. Chaque séquence finit sur la question que la suivante résout. |
| 1.5 | Le fil rouge est cohérent. | 3 | Une enquête d'une nuit (23 h 47 à 07 h 10) autour des 40 millions disparus et de Mallory. Points faibles : les transactions d'exemple et les montants changent d'une séquence à l'autre, et deux personnages (Hélène, Clara) arrivent tard sans présentation. |
| 1.6 | Les métaphores ne créent pas de fausse compréhension. | 3 | Décor mat et objets techniques en verre lumineux, séparés ; encarts « Le revers ». Formulations à corriger : la voix off qui dit qu'à six confirmations Mallory abandonne (faux à 30 % de puissance, 13 % de réussite), et « il faudrait corriger chaque copie » en séquence 4. |
| 1.7 | Au moins 2 testeurs extérieurs ont été sollicités et leurs retours intégrés. | 2 | Tests menés sur la v1 via le [questionnaire](https://docs.google.com/forms/d/e/1FAIpQLSdWOe5Z6wL2r4mvUCPZjamTJZX2sr3akOwpV4yEK9PuOTuHjA/viewform), dont plusieurs corrections ont été reprises dans la v2. Le récit reste à tester avec au moins 2 personnes extérieures. |

## Partie 2 — Argumentation des choix (25 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 2.1 | `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` est complet et couvre les 7 notions. | 3 | Document réécrit pour la v2 (v2.0) : univers, caméra, 7 fiches, cohérence, IA, sources. Les rubriques « Tests utilisateurs » de la v2 restent à compléter. |
| 2.2 | Formes et échelles sont justifiées. | 4 | Un lieu par notion, objets techniques à hauteur de personnage, tours du quartier utilisées comme nœuds ; justifié fiche par fiche. |
| 2.3 | Couleurs et codes sont cohérents et accessibles. | 4 | Palette sémantique unique (`COLORS` dans `src/recit/stage.js`) : bleu = donnée, vert = valide, rouge = falsifié / attaque, orange = effort, turquoise = enjeu, violet = autorité, sur fond de ville nocturne. |
| 2.4 | Animations et interactions servent la compréhension. | 3 | Animations fidèles au réel (sauts en base 16 en séquence 5, délai par saut en séquence 4, formule exacte en séquence 7). Limite : l'interaction arrive après l'explication au lieu de la précéder. |
| 2.5 | Une alternative écartée est documentée par notion. | 4 | Une alternative par fiche, et la v1 « Grand Registre » documentée comme métaphore écartée avec les raisons du changement (section 2.4). |
| 2.6 | Les risques de mauvaise interprétation sont traités. | 4 | Rubriques b) et g) remplies pour chaque notion, appuyées sur `FICHE-RECHERCHE.md`, et reprises dans les dialogues (« Donc c'est chiffré ? Non. », « On m'avait dit infalsifiable. Faux. »). |
| 2.7 | Les décisions s'appuient sur les tests utilisateurs. | 2 | Les décisions issues des tests v1 sont reprises et signalées ; aucune décision n'est encore issue d'un test de la v2. |

## Partie 3 — GitHub Projects (20 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 3.1 | Le board existe depuis la semaine 1 et utilise les 5 colonnes communes. | 4 | GitHub Project #3 créé en semaine 1 avec `Backlog`, `À faire`, `En cours`, `À vérifier`, `Terminé`. |
| 3.2 | Issues granulaires et assignées. | 4 | 28 issues détaillées et assignées entre Rahim (`@withRen`) et Nicolas (`@hextravagance`). |
| 3.3 | Labels cohérents. | 4 | Labels `cadrage`, `doc`, `recherche`, `dev`, `notion`, `ux`, `test` utilisés sur toutes les issues. |
| 3.4 | Milestones obligatoires correspondant au calendrier. | 4 | 4 milestones créés dès la semaine 1 (`Cadrage`, `Livraison du projet`, `Répétition finale`, `Soutenance`). |
| 3.5 | Commits réguliers et liés aux issues. | 3 | Commits explicites en français sur `main` puis sur les branches `semaine-2026-10-26-recit-3d` et `test-alternate`. |
| 3.6 | Le board reflète l'état réel. | 3 | À vérifier : le changement de direction vers le récit doit apparaître dans des issues dédiées (décision, séquences, tests du récit). |
| 3.7 | Répartition visible et expliquée. | 4 | Répartition 50/50 documentée dans le README et les fiches hebdomadaires. |
| 3.8 | Retours transformés en issues puis traités. | 3 | Suivi via les issues #18 (UX / accessibilité) et #19 (tests utilisateurs). |
| 3.9 | Usage de l'IA déclaré. | 4 | Déclaration dans `README.md`, `CHOIX-MODELISATION.md` (section 6) et `FICHE-RECHERCHE.md`. |
| 3.10 | README complet. | 4 | Équipe, public, 7 notions, lancement, structure, jalons, IA, sources. À vérifier : qu'il décrive bien le récit comme version principale. |

## Partie 4 — Interaction, UX et finition (15 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 4.1 | Navigation intuitive et éléments identifiables. | 4 | Mini-chaîne de 9 blocs (prologue, 7 notions, épilogue) avec « Notion n/7 », saut direct à chaque séquence, invite « Fais défiler pour commencer », en-tête heure et lieu. |
| 4.2 | Textes lisibles et contrastés. | 3 | Dialogues en bas d'écran avec nom du locuteur et mention « voix off », définitions dans un encart séparé, `Roboto` et `IBM Plex Mono`. À vérifier sur petit écran et vidéoprojecteur. |
| 4.3 | Rythme des animations compréhensible. | 3 | Progression liée au défilement, donc au rythme de l'utilisateur ; respect de `prefers-reduced-motion`. Les séquences longues (7) restent denses. |
| 4.4 | Au moins 30 FPS sur ordinateur standard type poste de TP. | 2 | Optimisations en place (culling par quartiers, chargement à la demande, fenêtres calculées dans le shader, pas de texture externe). Mesure sur un poste de TP encore à faire pour la v2. |
| 4.5 | Aucun bug bloquant le parcours principal. | 3 | Parcours complet jouable en local. À revérifier après fusion dans `main` et build de production. |
| 4.6 | Déploiement en ligne réalisé. | 3 | Le récit est la page d'entrée (`index.html`) et un workflow GitHub Actions déploie la branche `test-alternate` sur GitHub Pages. À faire : fusionner dans `main` et vérifier la démo en ligne. |

## Partie 5 — Soutenance (15 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 5.1 | Démo répétée et plan B prévu. | 3 | Build statique autonome (`npm run preview`) et capture vidéo de secours prévus pour le 19 novembre. |
| 5.2 | Chaque membre justifie tous les choix. | 4 | Appui sur `CHOIX-MODELISATION.md` et `FICHE-RECHERCHE.md`, relus par les deux membres. Le choix de passer de la v1 à la v2 doit être préparé comme question probable du jury. |
| 5.3 | Chaque membre explique les 7 notions. | 4 | Fiche de recherche maîtrisée par Rahim et Nicolas sur les 7 notions. |
| 5.4 | Bilan du projet appuyé sur des preuves. | 4 | Commits, issues, vraies fonctions SHA-256 et Nakamoto, formulaire de testeurs. |
| 5.5 | Temps de parole réparti dans les 20 minutes imparties. | 3 | Trame répartie à parts égales (10 min de démonstration et justification, 10 min de questions). |
| 5.6 | Support dans le temps imparti. | 3 | Le récit sert de support direct ; la navigation par séquence permet de sauter aux interactions clés si le temps manque. |

## Estimation de votre note

Additionnez les scores obtenus dans chaque partie : `P1 = 22 / 28`, `P2 = 24 / 28`, `P3 = 37 / 40`, `P4 = 18 / 24`, `P5 = 21 / 24`. La note sur 20 est :

`Note / 20 = (22/28 × 5) + (24/28 × 5) + (37/40 × 4) + (18/24 × 3) + (21/24 × 3)`

`Note = 16,79 / 20`

Les points perdus viennent surtout des tests de la v2 (1.3, 1.7, 2.7), de la mesure des FPS (4.4) et de la fusion dans `main` (4.6) : ce sont aussi les plus rapides à regagner.

## Bilan individuel et actions

| Nom / prénom | Contribution, apprentissages, usage de l'IA, difficulté pour la soutenance |
|:---|:---|
| Rahim Tamhaev | v1 : mise en place du dépôt et du GitHub Project, recherche documentaire primaire (`FICHE-RECHERCHE.md`), implémentation cryptographique (SHA-256, formule de Nakamoto), rédaction de `CHOIX-MODELISATION.md`, tests de performance et formulaire testeurs. v2 : à compléter. |
| Nicolas Rapuzzi | v1 : récit 3D à défiler (`formations.js`, `logo.js`, `main.js`), direction artistique « Livre de comptes », vulgarisation des 7 chapitres et des sections « Le revers », création de `sources.html`. v2 : à compléter. |

| Les 3 actions prioritaires | Responsable | Échéance |
|:---|:---|:---|
| 1. Commiter le travail en cours, fusionner `test-alternate` dans `main` et vérifier la démo en ligne | Rahim et Nicolas | Avant le 15 novembre 2026 |
| 2. Faire tester le récit par au moins 2 personnes extérieures, puis remplir les rubriques f) de `CHOIX-MODELISATION.md` | Nicolas et Rahim | Avant le 15 novembre 2026 |
| 3. Corriger les dialogues à risque (six confirmations à 30 %, « corriger chaque copie », redite prologue / séquence 1, présentation d'Hélène et Clara) et mesurer les FPS sur un poste de TP | Rahim et Nicolas | Avant le 15 novembre 2026 |
