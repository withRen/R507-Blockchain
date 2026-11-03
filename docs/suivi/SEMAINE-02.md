# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi — Semaine 2

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | Rahim Tamhaev (@withRen), Nicolas Rapuzzi (@hextravagance) |
| Semaine | 2 |
| Dates couvertes | 12 octobre au 18 octobre 2026 |
| Membres présents | Rahim Tamhaev, Nicolas Rapuzzi |
| Lien dépôt / GitHub Projects | https://github.com/withRen/R507-Blockchain / https://github.com/users/withRen/projects/3 |
| Lien démo (si disponible) | En cours de mise en place (scène Three.js initialisée localement) |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| Initialisation du projet Vite + Three.js (#6) | Toutes (socle 3D) | Fonctionnel | Commit `c895625` (`closes #6`) |
| Ajout du modèle `CHOIX-MODELISATION.md` (#5) | Toutes | Fonctionnel | Commit `cca4ac7` |
| Recherche : structure d'un bloc, hash et chaînage (#23) | Notions 1 et 2 | Fonctionnel | `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` (commits `8ffb494`, `1916b24`) |
| Recherche : immutabilité et détection de falsification (#24) | Notion 3 | Fonctionnel | `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` |
| Recherche : réseau, décentralisation et propagation (#25) | Notion 4 | Fonctionnel | `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` |
| Recherche : validation et minage, preuve de travail (#26) | Notion 5 | Fonctionnel | `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` |
| Recherche : mécanismes de consensus PoW, PoS, PoA (#27) | Notion 6 | Fonctionnel | `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` |
| Recherche : cycle de vie d'une transaction et double dépense (#28) | Notion 7 | Fonctionnel | `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Déploiement initial sur GitHub Pages (#7) | Priorité donnée à la vérification complète des sources primaires avant d'assembler les 7 chapitres | Semaine 4 |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | En cours | Recherche terminée (#23), socle Three.js prêt (#6) |
| Chaînage cryptographique | En cours | Recherche terminée (#23), mécanisme de hash défini |
| Immutabilité et détection de falsification | En cours | Recherche terminée (#24), logique de cascade définie |
| Réseau et décentralisation | En cours | Recherche terminée (#25), topologie P2P documentée |
| Validation et minage | En cours | Recherche terminée (#26), algorithme SHA-256 et cible documentés |
| Comparaison d'au moins deux mécanismes de consensus | En cours | Recherche terminée (#27 : PoW, PoS, PoA, BFT) |
| Cycle de vie d'une transaction et scénario d'attaque illustré | En cours | Recherche terminée (#28 : mempool, confirmations, formule de Nakamoto) |

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Rahim Tamhaev | Initialisation Vite + Three.js (#6), recherches notions 4, 5, 7 (#25, #26, #28), synthèse et vérification des sources dans `FICHE-RECHERCHE.md` | 4 fermées (#6, #25, #26, #28) | 4 |
| Nicolas Rapuzzi | Recherches notions 1, 2, 3, 6 (#23, #24, #27), définition du fil rouge « Alice -> Bob : 5 jetons » (#3) | 3 fermées (#23, #24, #27) | 0 (travail préparatoire fusionné dans la fiche commune) |

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 28 au total |
| Issues fermées | 9 (#1, #2, #4, #6, #23, #24, #25, #26, #27, #28) |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | 10 / 7 / 2 / 0 / 9 |
| Board mis à jour pendant la semaine ? | Oui, fermeture des 6 issues de recherche et de l'issue #6 |
| Milestone concerné et état | Cadrage (terminé) et Livraison du projet (en cours) |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Parties a, b et d préparées dans `FICHE-RECHERCHE.md` pour les 7 notions |
| Choix important et justification | Prendre Bitcoin comme fil conducteur pour les notions 1 à 5 et 7, et Ethereum / réseaux privés pour comparer PoW, PoS et PoA à la notion 6 |
| Choix remis en question | Écartement des sources secondaires peu fiables au profit exclusif des sources primaires (whitepaper Nakamoto, NIST, documentation officielle Bitcoin et Ethereum) |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | 0 (phase de recherche et socle technique) |
| Compréhension ou problème observé | Sans objet |
| Issue corrective | Issue #19 |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Antigravity pour l'initialisation Vite + Three.js (#6) ; assistance IA pour structurer la fiche de recherche, suivie d'une lecture et vérification manuelle de chaque source primaire le 13 octobre 2026. |
| Blocage technique | Aucun |
| Blocage pédagogique ou organisationnel | Aucun |
| Besoin d'un point enseignant | Non |

## 7. Objectifs de la semaine suivante

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Concevoir la direction artistique « Livre de comptes » et le fil conducteur des 1 800 cubes | Rahim et Nicolas | #3, #9, #18 |
| Développer les formations 3D des notions 1 à 4 (bloc, chaîne, falsification, maillage) | Nicolas et Rahim | #11, #12, #13, #14 |
| Développer les formations 3D et widgets des notions 5 à 7 (minage SHA-256, consensus, attaque) | Rahim et Nicolas | #15, #16, #17 |

## 8. Signaux d'alerte

- [ ] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [x] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [ ] Un choix de modélisation important n'est pas justifié.
- [ ] Une notion n'a pas avancé depuis 2 semaines.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** toutes les 7 notions ont progressé cette semaine grâce à la rédaction complète de `docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md` et à la fermeture des issues #23 à #28.

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | Oui |
| Date d'envoi | 16 octobre 2026 |
| Noms des membres | Rahim Tamhaev, Nicolas Rapuzzi |

