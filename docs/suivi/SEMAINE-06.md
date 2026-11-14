# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi — Semaine 6

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | Rahim Tamhaev (@withRen), Nicolas Rapuzzi (@hextravagance) |
| Semaine | 6 |
| Dates couvertes | 10 au 15 novembre 2026 |
| Membres présents | À compléter |
| Lien dépôt / GitHub Projects | https://github.com/withRen/R507-Blockchain / https://github.com/users/withRen/projects/3 |
| Lien démo (si disponible) | https://withren.github.io/R507-Blockchain/ |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| v3 du récit « Le Registre » : toute l'histoire reprise à partir des retours | Les 7 notions (#31) | Fonctionnel | Commit `93e9a43`, `docs/SCENARIO-V3.md` |
| Livrables mis à jour pour la v3 et retours consignés (revue de l'enseignant du 12 novembre) | Toutes | Fonctionnel | Commit `0564c37`, `docs/TESTS-UTILISATEURS.md` |
| Questionnaire Google de retours réécrit pour recueillir des retours sur la nouvelle version | Toutes (#19) | Fonctionnel | Formulaire en ligne |
| Interface entièrement refaite en style terminal et vieux jeu vidéo (télé à tube), blocs 3D restylés, effet « BIEN JOUÉ » | Toutes (#29) | Fonctionnel | Commit `2428bf3` |
| Dialogues inspirés d'Undertale, interactions plus grandes et arrondies, indicateur « Clique ici », écran d'entrée | Toutes (#29) | Fonctionnel | Commit `f37260b` |
| Musiques de fond (crédits Feldup), une piste pour l'enquête et une pour le dénouement, volume réglé | Toutes (#30) | Fonctionnel | Commits `1279d3a`, `bf258ef`, `aecad07` |
| Bruitages des interactions synthétisés avec Web Audio | Toutes (#30) | Fonctionnel | Commit `7c1b163` |
| Issues #29, #30 et #31 fermées | Toutes | Fonctionnel | Issues fermées le 14 novembre |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Second test de la v3 par une personne non initiée (#19) | La v3 n'est complète que depuis le 14 novembre | Avant la soutenance |
| Mesure des FPS de la v3 sur un poste de TP | La v3 et la nouvelle interface viennent d'être terminées | Avant la soutenance |
| Support de soutenance (#22) | Priorité donnée à la v3 | Avant la répétition du 19 novembre |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | Fonctionnel | Séquence 1 de la v3 : le bloc s'ouvre en quatre champs (`93e9a43`) |
| Chaînage cryptographique | Fonctionnel | Séquence 2 : cinq blocs reliés, on répare le lien cassé (`93e9a43`) |
| Immutabilité et détection de falsification | Fonctionnel | Séquence 3 : les 14 copies côte à côte, la copie modifiée est rejetée (`93e9a43`) |
| Réseau et décentralisation | Fonctionnel | Séquence 4 : on coupe des tours puis on émet une transaction (`93e9a43`) |
| Validation et minage | Fonctionnel | Séquence 5 : minage avec de vrais SHA-256 (`93e9a43`) |
| Comparaison d'au moins deux mécanismes de consensus | Fonctionnel | Séquence 6 : travail, enjeu, autorité, signataires qui se relaient (`93e9a43`) |
| Cycle de vie d'une transaction et scénario d'attaque illustré | Fonctionnel | Séquence 7 : confirmations puis chaîne secrète face aux 14 copies (`93e9a43`) |

La v3 n'a pas encore été testée par une personne extérieure : aucune notion n'est donc à l'état `Testé` sur cette version.

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Rahim Tamhaev | Musiques et bruitages, écran d'entrée, interactions plus visibles, création et fermeture des issues de retours | #29, #30, #31 | 5 |
| Nicolas Rapuzzi | Réécriture de la v3, mise à jour des livrables, notes de la revue de l'enseignant, refonte en style télé à tube | #29, #31 | 3 |

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 3 (#29, #30, #31), 31 au total |
| Issues fermées | 3 (#29, #30, #31) ; restent ouvertes #19 et #22 |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | 14 / 12 / 0 / 0 / 2 au 14 novembre. Ces statuts ne suivent pas les fermetures d'issues et les issues #29 à #31 ne sont pas sur le board : à mettre à jour |
| Board mis à jour pendant la semaine ? | Non, seules les issues ont été mises à jour |
| Milestone concerné et état | Livraison du projet (échéance 15 novembre 2026) : v3 livrée, il reste #19 et #22 |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Les 7 fiches sont mises à jour pour la v3, avec la section 2.6 « Ce que la v3 change, et pourquoi » (`0564c37`) |
| Choix important et justification | Garder l'histoire de la v2 mais changer le rythme : une question d'ouverture et une phrase « À retenir » par séquence, un exercice dès le prologue, un repère « Notion n/7 ». Le test a montré qu'on perdait le fil, pas que l'histoire était inutile |
| Choix remis en question | La place du bitcoin : il n'est plus cité qu'au prologue, au minage et à l'attaque. La séquence 6 montre un usage hors finance (suivi de marchandises), suite à la remarque de l'enseignant |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | 1 revue de l'enseignant le 12 novembre (v1 et v2). Aucun test de la v3 pour l'instant |
| Compréhension ou problème observé | Interactions pas assez visibles, code couleur et formes de blocs pas assez cohérents, copies en parallèle invisibles pendant l'attaque, défilement capricieux. Détail dans `docs/TESTS-UTILISATEURS.md` |
| Issue corrective | #29, #30 et #31, fermées. Le second test de la v3 reste à faire (#19) |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Claude Code utilisé pour la refonte de l'interface, l'ajout du son et la rédaction des issues et des fiches. Chaque changement a été vérifié dans le navigateur et avec `npm run build`. Le déploiement GitHub Pages a réussi après la fusion |
| Blocage technique | Aucun |
| Blocage pédagogique ou organisationnel | Il manque un second testeur non initié sur la v3 |
| Besoin d'un point enseignant | Non, la répétition du 19 novembre servira de point |

## 7. Objectifs jusqu'à la soutenance

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Faire tester la v3 par une personne non initiée et consigner le retour | À compléter | #19 |
| Mesurer les FPS de la v3 sur un poste de TP | À compléter | #20 |
| Préparer le support et faire la répétition le 19 novembre à 9 h 30 | Rahim et Nicolas | #22 |

## 8. Signaux d'alerte

- [x] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [x] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [ ] Un choix de modélisation important n'est pas justifié.
- [ ] Une notion n'a pas avancé depuis 2 semaines.

**Board :** les colonnes du board ne reflètent pas les issues fermées. Il faut les mettre à jour.

**Testeurs :** la v2 a été testée par une personne non initiée. Les 2 testeurs de la v3 ne sont pas encore atteints.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** aucune notion n'est en retard. Les 7 notions ont été réécrites dans la v3 (`93e9a43`) et documentées dans `CHOIX-MODELISATION.md` (`0564c37`).

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | À compléter |
| Date d'envoi | À compléter |
| Noms des membres | Rahim Tamhaev, Nicolas Rapuzzi |
