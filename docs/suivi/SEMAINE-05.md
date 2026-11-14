# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi — Semaine 5

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | Rahim Tamhaev (@withRen), Nicolas Rapuzzi (@hextravagance) |
| Semaine | 5 |
| Dates couvertes | 3 au 9 novembre 2026 |
| Membres présents | À compléter |
| Lien dépôt / GitHub Projects | https://github.com/withRen/R507-Blockchain / https://github.com/users/withRen/projects/3 |
| Lien démo (si disponible) | https://withren.github.io/R507-Blockchain/ |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| Fusion de `semaine-2026-10-26-recit-3d` dans `main` | Toutes | Fonctionnel | Commit `4d8242a` |
| Récit 3D « Le Registre » en 9 séquences, assets Poly Haven et déploiement GitHub Pages (#7) | Les 7 notions | Fonctionnel | Commit `f74d4be`, issue #7 fermée le 4 novembre |
| Performance : culling par quartiers et chargement à la demande | Toutes (#20) | Fonctionnel | Commit `2c8bd35` |
| Correction des glitchs Three.js : personnages qui traversaient le décor, façades trop low poly | Toutes | Fonctionnel | Commit `a146307` |
| Correction des aberrations visuelles : étalonnage, sol poli avec reflets, silhouettes détachées du fond | Toutes | Fonctionnel | Commit `e3d5d1c` |
| « Le Registre » devient la seule version du projet | Toutes | Fonctionnel | Commit `1196277` |
| Lecture automatique des dialogues, mini-jeu du hash, correction des panneaux qui restaient affichés | Notion 1 | Fonctionnel | Commit `34dc692` |
| Lecture automatique fluide, horloge de progression unique, caméra sans arrêts | Toutes | Fonctionnel | Commit `47d0f65` |
| Premier test du récit et premiers retours | Toutes (#19) | En cours | Section 5 et `docs/TESTS-UTILISATEURS.md` |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Atteindre 2 testeurs extérieurs non initiés (#19) | Les premiers retours ont montré qu'il fallait d'abord reprendre l'histoire et l'interface | Semaine 6 |
| Support de soutenance (#22) | Priorité donnée à la correction des glitchs 3D | Semaine 6 |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | Fonctionnel | Séquence 1 du récit et mini-jeu du hash (`34dc692`) |
| Chaînage cryptographique | Fonctionnel | Séquence 2 du récit (`f74d4be`) |
| Immutabilité et détection de falsification | Fonctionnel | Séquence 3 du récit (`f74d4be`) |
| Réseau et décentralisation | Fonctionnel | Séquence 4 du récit (`f74d4be`) |
| Validation et minage | Fonctionnel | Séquence 5 du récit (`f74d4be`) |
| Comparaison d'au moins deux mécanismes de consensus | Fonctionnel | Séquence 6 du récit (`f74d4be`) |
| Cycle de vie d'une transaction et scénario d'attaque illustré | Fonctionnel | Séquence 7 du récit (`f74d4be`) |

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Rahim Tamhaev | En binôme avec Nicolas : fusion dans `main`, récit « Le Registre » en 9 séquences, déploiement GitHub Pages, corrections des glitchs Three.js, lecture automatique des dialogues | #7, #14, #15, #17 (fermées le 4 novembre) | 9 (dont 1 merge et 1 commit de fiches) |
| Nicolas Rapuzzi | En binôme avec Rahim, sur les mêmes tâches | #11, #12, #13, #16 (fermées le 4 novembre) | 0 sur `main` |

Issues fermées le 4 novembre et assignées aux deux membres : #3, #8, #9, #10, #18, #21. Issue #5 assignée à Nicolas.

Cette semaine, le travail s'est fait à deux, en présentiel, sur le poste de Rahim. Tous les commits sont donc au nom de Rahim et ne reflètent pas la répartition réelle.

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 0 cette semaine (28 au total) |
| Issues fermées | 17 le 4 novembre : #3, #5, #7 à #18, #21 |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | À compléter (les statuts du board n'ont pas suivi les fermetures d'issues) |
| Board mis à jour pendant la semaine ? | En partie : issues fermées, colonnes non mises à jour |
| Milestone concerné et état | Livraison du projet (échéance 15 novembre 2026) : en cours |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Les 7 fiches restent rédigées. Elles sont à revoir après les retours de test |
| Choix important et justification | Garder un seul récit, « Le Registre » (`1196277`), pour concentrer l'effort sur une version et éviter deux sites à maintenir |
| Choix remis en question | La longueur de l'histoire et la place du bitcoin. Les retours montrent que le sujet est plus général que le bitcoin |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | Premier test, avec 2 ou 3 petits retours (nombre exact à compléter) |
| Compréhension ou problème observé | 1) L'histoire est intéressante mais vraiment trop longue, on perd le fil ; 2) Elle est parfois confuse ; 3) Elle est trop centrée sur le bitcoin alors que le sujet est plus général ; 4) Il y a peu d'interactions ; 5) L'interface n'est pas terrible. Détail dans `docs/TESTS-UTILISATEURS.md` |
| Issue corrective | #29 (interface), #30 (musique et son), #31 (histoire trop longue) |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Claude Code utilisé pour corriger les glitchs Three.js et pour la lecture automatique. Chaque correction a été vérifiée dans le navigateur et avec `npm run build` |
| Blocage technique | Glitchs Three.js : animations qui traversaient des objets et aberrations visuelles. Corrigés par `a146307` et `e3d5d1c` |
| Blocage pédagogique ou organisationnel | L'histoire est trop longue pour un public non initié |
| Besoin d'un point enseignant | Oui, pour une revue du site avant la refonte |

## 7. Objectifs de la semaine suivante

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Refaire l'interface : interactions plus visibles, style moins cubique | Rahim et Nicolas | #29 |
| Ajouter une musique de fond et des retours sonores | Rahim | #30 |
| Raccourcir et clarifier l'histoire, réduire la place du bitcoin | Nicolas et Rahim | #31 |

## 8. Signaux d'alerte

- [ ] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [x] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [ ] Un choix de modélisation important n'est pas justifié.
- [ ] Une notion n'a pas avancé depuis 2 semaines.

**Répartition :** tous les commits sont au nom de Rahim parce que le binôme a travaillé ensemble sur son poste. La répartition réelle est équilibrée.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** aucune notion n'est en retard. Les 7 notions sont dans le récit déployé (`f74d4be`) et les issues #11 à #17 sont fermées.

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | À compléter |
| Date d'envoi | À compléter |
| Noms des membres | Rahim Tamhaev, Nicolas Rapuzzi |
