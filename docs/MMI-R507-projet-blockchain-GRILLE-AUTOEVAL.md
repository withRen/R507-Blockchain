# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### `MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md`

Grille remplie en groupe puis individuellement, à jour au 15 novembre 2026 (v3 du récit « Le Registre », fusionnée dans `main` et en ligne). Chaque score (0 à 4) est appuyé sur une preuve.

Échelle : 0 absent, 1 ébauché, 2 partiel, 3 satisfaisant, 4 très abouti et défendable.

## Partie 1 — Pertinence pédagogique (25 %) : 22 / 28

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 1.1 | Les 7 notions sont représentées | 4 | Une séquence par notion (`src/recit/sequence1.js` à `sequence7.js`), définitions du glossaire du sujet. |
| 1.2 | Une interaction observable par notion | 4 | Un exercice « À toi de jouer » par séquence, plus un dès le prologue. |
| 1.3 | Compréhensible sans explication orale | 2 | Récit resserré après le test de la v2 ; les tests de la v3 montrent encore des décrochages chez les non-initiés. |
| 1.4 | Ordre progressif | 4 | Registre unique, bloc, chaîne, falsification, réseau, minage, consensus, attaque ; chaque séquence pose la question de la suivante. |
| 1.5 | Fil rouge cohérent | 3 | Une enquête d'une nuit autour des 40 millions disparus. Limites : montants qui changent, deux personnages introduits tard. |
| 1.6 | Métaphores sans contresens | 3 | Décor et objets techniques séparés, un « revers » par séquence, formulations fautives du 6 novembre corrigées. |
| 1.7 | Au moins 2 testeurs extérieurs | 2 | v1 par questionnaire, v2 par une non-initiée et l'enseignant (`docs/TESTS-UTILISATEURS.md`), v3 par 4 testeurs (`docs/TESTS-V3-QUESTIONNAIRE.md`, issues #32 à #35). |

## Partie 2 — Argumentation des choix (25 %) : 24 / 28

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 2.1 | `CHOIX-MODELISATION.md` complet | 3 | Passé en v3.0, section 2.6 « un retour, une décision » ; quelques numéros d'issues manquent. |
| 2.2 | Formes et échelles justifiées | 4 | Un lieu par notion, objets à hauteur de personnage, tours comme nœuds, justifiés fiche par fiche. |
| 2.3 | Couleurs cohérentes et accessibles | 4 | Palette sémantique unique (`COLORS` dans `src/recit/stage.js`) et légende permanente ; interface télé à tube neutre (`2428bf3`). |
| 2.4 | Animations au service de la compréhension | 3 | Animations fidèles au réel, retours « BIEN JOUÉ » et bruitages (`7c1b163`). Limite : l'interaction suit l'explication. |
| 2.5 | Une alternative écartée par notion | 4 | Une par fiche, et la v1 « Grand Registre » documentée comme métaphore écartée. |
| 2.6 | Risques de mauvaise interprétation traités | 4 | Rubriques b) et g) par notion, appuyées sur `FICHE-RECHERCHE.md` et reprises dans les dialogues. |
| 2.7 | Décisions issues des tests | 2 | Chaque changement de la v3 est rattaché à un retour (section 2.6) ; les retours de la v3 ont donné les correctifs #32 à #35. |

## Partie 3 — GitHub Projects (20 %) : 37 / 40

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 3.1 | Board dès la semaine 1, 5 colonnes | 4 | GitHub Project #3 avec les 5 colonnes communes. |
| 3.2 | Issues granulaires et assignées | 4 | Issues détaillées, réparties entre `@withRen` et `@hextravagance`. |
| 3.3 | Labels cohérents | 4 | `cadrage`, `doc`, `recherche`, `dev`, `notion`, `ux`, `test` sur toutes les issues. |
| 3.4 | Milestones du calendrier | 4 | `Cadrage`, `Livraison du projet`, `Répétition finale`, `Soutenance`. |
| 3.5 | Commits réguliers et liés aux issues | 3 | Commits explicites en français, pas toujours rattachés à une issue. |
| 3.6 | Board fidèle à l'état réel | 3 | Remis à jour le 14 novembre ; le virage vers le récit mériterait des issues dédiées. |
| 3.7 | Répartition visible | 4 | 50/50 documenté dans le README et les fiches hebdomadaires. |
| 3.8 | Retours transformés en issues | 3 | #18, #19, puis #29 à #35 fermées avec leurs correctifs ; #29 à #31 créées après coup. |
| 3.9 | Usage de l'IA déclaré | 4 | `README.md`, `CHOIX-MODELISATION.md` (section 6), `FICHE-RECHERCHE.md`. |
| 3.10 | README complet | 4 | Équipe, public, notions, lancement, structure, jalons, IA, sources. |

## Partie 4 — Interaction, UX et finition (15 %) : 19 / 24

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 4.1 | Navigation intuitive | 4 | Mini-chaîne « Notion n/7 », bouton « Passer », lecture automatique, étiquettes « Clique ici » sur l'élément à manipuler (#29). |
| 4.2 | Textes lisibles et contrastés | 3 | Dialogues avec locuteur, encarts séparés, panneaux agrandis (`f37260b`) ; vidéoprojecteur à vérifier. |
| 4.3 | Rythme compréhensible | 3 | Progression au rythme de l'utilisateur, `prefers-reduced-motion` respecté, musiques en fondu (#30) ; séquence 7 dense. |
| 4.4 | 30 FPS sur un poste de TP | 2 | Optimisations conservées, mais pas de mesure sur poste de TP pour la v3. |
| 4.5 | Aucun bug bloquant | 3 | Parcours complet jouable, `npm run build` sans erreur ; à rejouer en ligne. |
| 4.6 | Déploiement en ligne | 4 | GitHub Pages à jour : https://withren.github.io/R507-Blockchain/ |

## Partie 5 — Soutenance (15 %) : 21 / 24

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 5.1 | Démo répétée, plan B | 3 | Build statique (`npm run preview`) et vidéo de secours prévus pour le 19 novembre. |
| 5.2 | Chaque membre justifie les choix | 4 | `CHOIX-MODELISATION.md` et `FICHE-RECHERCHE.md` relus par les deux ; passage v1 → v2 à préparer. |
| 5.3 | Chaque membre explique les 7 notions | 4 | Fiche de recherche maîtrisée par les deux. |
| 5.4 | Bilan appuyé sur des preuves | 4 | Commits, issues, vraies fonctions SHA-256 et Nakamoto, questionnaire testeurs. |
| 5.5 | Temps de parole réparti | 3 | 10 min de démonstration, 10 min de questions, à parts égales. |
| 5.6 | Support dans le temps imparti | 3 | Le récit sert de support ; navigation par séquence pour aller aux interactions clés. |

## Note estimée du groupe

`(22/28 × 5) + (24/28 × 5) + (37/40 × 4) + (19/24 × 3) + (21/24 × 3) =` **16,9 / 20**

Points à regagner en priorité : compréhension par les non-initiés (1.3, 1.7, 2.7) et mesure des FPS (4.4).

## Bilans individuels

| Membre | Note | Contribution et bilan |
|:---|:---:|:---|
| Rahim Tamhaev | 17 / 20 | **Contribution** : dépôt et GitHub Project, recherche documentaire (`FICHE-RECHERCHE.md`), SHA-256 et formule de Nakamoto, `CHOIX-MODELISATION.md`, tests de performance, questionnaire Google Forms des testeurs ; en v2 et v3, UI/UX avec Nicolas, musiques et bruitages. **Utilisation IA** : Claude pour le dev et inspiration mini-jeux, Perplexity pour la recherches **Bilan** : je me suis beaucoup impliqué et j'ai cherché à pousser le projet le plus loin possible malgré nos connaissances limitées de Three.js. J'ai trouvé le sujet intéressant. Ma principale limite : n'étant pas enseignants, nous n'avons pas forcément la pédagogie pour rendre la blockchain vraiment facile à comprendre pour un novice, ce que confirment les tests. |
| Nicolas Rapuzzi | À compléter | **Contribution** : récit 3D à défiler de la v1 (`formations.js`, `logo.js`, `main.js`), direction artistique « Livre de comptes », vulgarisation des 7 chapitres et des « revers », `sources.html` ; en v2 et v3, écriture et réécriture de l'histoire, UI/UX avec Rahim, interface en style télé à tube (`2428bf3`). **Bilan** : J'ai trouvé le sujet intéréssant et Three.js géniale mais plus difficile de narrer une histoire sur un sujet que moi et Rahim ne conaissent pas tant (encore plus quand le but est de présenter ce sujet a des néophytes). Egalement je trouve que personnellement j'ai moins été productif que Rahim, même a toujours pris les décisions en binome et des fois laissé commit a ma place ou je lui envoyais en .ZIP mais ça change pas l'écrasante différence entre nous 2, c'est dommage. |

## Actions avant la soutenance

| Action | Responsable | Échéance |
|:---|:---|:---|
| Rejouer la v3 de bout en bout sur la démo en ligne | Rahim et Nicolas | Avant le 19 novembre 2026 |
| Mesurer les FPS sur un poste de TP | Rahim | Avant le 19 novembre 2026 |
| Préparer le support et la vidéo de secours pour la répétition (#22), fiches de suivi 7 et 8 | Rahim et Nicolas | 19 novembre 2026 |
