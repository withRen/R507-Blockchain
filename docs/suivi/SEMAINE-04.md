# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi — Semaine 4

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | Rahim Tamhaev (@withRen), Nicolas Rapuzzi (@hextravagance) |
| Semaine | 4 |
| Dates couvertes | 26 octobre au 2 novembre 2026 |
| Membres présents | Rahim Tamhaev, Nicolas Rapuzzi |
| Lien dépôt / GitHub Projects | https://github.com/withRen/R507-Blockchain / https://github.com/users/withRen/projects/3 |
| Lien démo (si disponible) | Fonctionnel sur la branche `semaine-2026-10-26-recit-3d` |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| Récit 3D complet en 7 chapitres à défiler (`index.html`, `src/main.js`, `src/lib/*`) | Les 7 notions (#11 à #17) | Fonctionnel | Commit `41f047e` sur `semaine-2026-10-26-recit-3d` |
| Page dédiée aux sources vérifiées par chapitre (`sources.html`, `src/sources.css`) | Toutes (#8) | Fonctionnel | Commit `41f047e` (`sources.html`) |
| Chaînage réel SHA-256 des en-têtes de chapitres (`src/lib/ledger.js`) | Notions 1 et 2 (#11, #12) | Fonctionnel | Commit `41f047e` (`src/lib/ledger.js`) |
| Widgets interactifs : empreinte en direct, mineur SHA-256 réel, simulateur de 100 blocs, calculateur de Nakamoto (`src/lib/widgets.js`) | Notions 1, 5, 6, 7 | Fonctionnel | Commit `41f047e` (`src/lib/widgets.js`) |
| Validation de la performance (>= 30 FPS) grâce à `InstancedMesh` (#20) | Toutes (#20) | Testé | Issue #20 fermée (60 FPS constants mesurés) |
| Création et mise en ligne du questionnaire de retours pour les testeurs extérieurs (#19) | Toutes (#19) | Fonctionnel | Commit `12e5420` sur `main` ([Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdWOe5Z6wL2r4mvUCPZjamTJZX2sr3akOwpV4yEK9PuOTuHjA/viewform)) |
| Rédaction complète du livrable `CHOIX-MODELISATION.md` (#10) | Toutes (#10) | Fonctionnel | `docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Fusion de la branche `semaine-2026-10-26-recit-3d` dans `main` et déploiement automatique GitHub Pages (#7) | Relecture finale et améliorations UX/3D avant fusion | Semaine 5 |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | Fonctionnel | Formation `block` (3 couches) + widget SHA-256 temps réel (`#bloc`) |
| Chaînage cryptographique | Fonctionnel | Formation `chain` (5 blocs reliés) + en-têtes de chapitres chaînés (`#chaine`) |
| Immutabilité et détection de falsification | Fonctionnel | Formation `tamper` (cascade rouge du bloc 3 au bloc 5 au défilement, `#triche`) |
| Réseau et décentralisation | Fonctionnel | Formation `logoCenter` puis `mesh` (14 nœuds P2P + propagation de messages, `#reseau`) |
| Validation et minage | Fonctionnel | Formation `lottery` (sauts exponentiels + barre de difficulté) + vrai mineur SHA-256 (`#minage`) |
| Comparaison d'au moins deux mécanismes de consensus | Fonctionnel | Formation `consensus` (Travail, Enjeu, Autorité) + simulateur de 100 blocs et balance Crédit/Débit (`#consensus`) |
| Cycle de vie d'une transaction et scénario d'attaque illustré | Fonctionnel | Formations `confirm` (6 confirmations) et `race` (double dépense et réorganisation) + calculateur de Nakamoto (`#paiement`) |

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Nicolas Rapuzzi | Intégration complète du parcours 3D en 7 chapitres, scènes Three.js (`formations.js`, `logo.js`, `main.js`), design système « Livre de comptes » (`style.css`, `sources.html`) | 7 notions implémentées (#11 à #17) | Commit majeur `41f047e` (15 fichiers, +1 951 lignes) |
| Rahim Tamhaev | Mise en place du formulaire testeurs (#19), validation performance #20, documentation de recherche et rédaction complète de `CHOIX-MODELISATION.md` (#10), améliorations interactives et accessibilité (#18) | #10, #18, #19, #20 | Commit `12e5420` + ajouts semaine 4 |

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 28 |
| Issues fermées | 11 (#1, #2, #4, #6, #20, #23 à #28) ; #3, #5, #8, #9, #10, #11 à #18 prêtes à passer en `À vérifier` / `Terminé` |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | 2 / 4 / 3 / 8 / 11 |
| Board mis à jour pendant la semaine ? | Oui |
| Milestone concerné et état | Livraison du projet (échéance 15 novembre 2026) : bien avancé |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Les 7 fiches obligatoires (4.1 à 4.7) ainsi que les sections 1, 2, 3, 5, 6 et 7 sont entièrement rédigées |
| Choix important et justification | Ajout d'une étape intermédiaire `logoCenter` au début du chapitre 4 (« Mais où est rangé ce bitcoin ? ») avant d'éclater la pièce en maillage de 14 nœuds, pour renforcer l'impact visuel et pédagogique de la décentralisation |
| Choix remis en question | Synchronisation du mode sombre (« Le revers ») sur la position réelle de défilement (`window.scrollY`) plutôt que sur le défilement lissé, pour garantir un contraste de texte toujours lisible |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | 2 premiers retours collectés via le questionnaire en ligne |
| Compréhension ou problème observé | 1) Hésitation à modifier le champ de texte au ch. 1 ; 2) Besoin d'interactivité directe sur le chapitre 3 (falsification) ; 3) Besoin de mieux visualiser la hauteur de la barre de minage quand on change la difficulté au ch. 5 |
| Issue corrective | #18 (UX et accessibilité) et #19 (Tests utilisateurs) |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Claude Code et Antigravity utilisés pour le parcours scénarisé, la structuration de `CHOIX-MODELISATION.md` et les fiches de suivi. Tout le code a été testé et validé avec `vite build`. |
| Blocage technique | Aucun |
| Blocage pédagogique ou organisationnel | Aucun |
| Besoin d'un point enseignant | Non |

## 7. Objectifs de la semaine suivante

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Fusionner `semaine-2026-10-26-recit-3d` dans `main` et activer GitHub Pages | Rahim et Nicolas | #7 |
| Poursuivre les tests utilisateurs avec le formulaire et intégrer les derniers retours | Nicolas et Rahim | #19 |
| Remplir la grille d'auto-évaluation et préparer le support de soutenance | Rahim et Nicolas | #21, #22 |

## 8. Signaux d'alerte

- [ ] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [ ] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [ ] Un choix de modélisation important n'est pas justifié.
- [ ] Une notion n'a pas avancé depuis 2 semaines.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** aucune notion n'est en retard ; les 7 notions sont implémentées dans `src/` et documentées dans `CHOIX-MODELISATION.md`.

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | Oui |
| Date d'envoi | 3 novembre 2026 |
| Noms des membres | Rahim Tamhaev, Nicolas Rapuzzi |

