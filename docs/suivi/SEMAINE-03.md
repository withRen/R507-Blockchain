# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi — Semaine 3

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | Rahim Tamhaev (@withRen), Nicolas Rapuzzi (@hextravagance) |
| Semaine | 3 |
| Dates couvertes | 19 octobre au 25 octobre 2026 |
| Membres présents | Rahim Tamhaev, Nicolas Rapuzzi |
| Lien dépôt / GitHub Projects | https://github.com/withRen/R507-Blockchain / https://github.com/users/withRen/projects/3 |
| Lien démo (si disponible) | En développement local |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| Storyboard complet du parcours en 7 chapitres et choix de la métaphore du « Grand Registre » (#3, #9) | Toutes | Fonctionnel | Structure de `index.html` et `README.md` |
| Modélisation procédurale du logo Bitcoin en fil de fer et échantillonnage de surface (`MeshSurfaceSampler`) | Genèse & Notion 4 | En cours | `src/lib/logo.js` |
| Architecture d'interpolation des 1 800 cubes instanciés (`InstancedMesh`) | Toutes | En cours | `src/lib/formations.js`, `src/main.js` |
| Implémentation synchrone de SHA-256 (FIPS 180-4) et du modèle de bloc | Notions 1, 2, 5, 7 | Fonctionnel | `src/lib/sha256.js`, `src/lib/blockchain.js` |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Finalisation des 7 scènes et des widgets HTML | Le système d'interpolation fluide entre formations 3D a demandé un travail de prototypage important | Semaine 4 |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | En cours | Formation 3 couches en cours d'intégration (`src/lib/formations.js`) |
| Chaînage cryptographique | En cours | Alignement de 5 blocs et liens cylindriques en cours |
| Immutabilité et détection de falsification | En cours | Animation de cascade rouge au défilement en cours |
| Réseau et décentralisation | En cours | Génération sphérique de Fibonacci des 14 nœuds en cours |
| Validation et minage | En cours | Mineur incrémental SHA-256 codé dans `src/lib/blockchain.js` |
| Comparaison d'au moins deux mécanismes de consensus | En cours | Conception des 3 groupes (Travail, Enjeu, Autorité) |
| Cycle de vie d'une transaction et scénario d'attaque illustré | En cours | Formule de Nakamoto codée dans `src/lib/blockchain.js` |

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Nicolas Rapuzzi | Conception du récit à défiler, prototypage des formations 3D, rédaction des textes accessibles et des sections « Le revers » | En cours (#11 à #17) | Sur branche de travail `semaine-2026-10-26-recit-3d` |
| Rahim Tamhaev | Algorithmes cryptographiques (`sha256.js`, `blockchain.js`), vérification de la fidélité technique avec la fiche de recherche, préparation du protocole de test | En cours (#11 à #17, #19) | Sur `main` et branche de travail |

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 28 |
| Issues fermées | 10 |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | 4 / 7 / 7 / 0 / 10 |
| Board mis à jour pendant la semaine ? | Oui |
| Milestone concerné et état | Livraison du projet (15 novembre 2026) : en cours |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Brouillon des 7 fiches en cours de rédaction |
| Choix important et justification | Utiliser un unique `THREE.InstancedMesh` de 1 800 cubes qui se réorganisent à chaque chapitre : cela garantit à la fois une excellente fluidité (> 60 FPS, un seul draw call pour les 1 800 cubes) et une continuité visuelle forte |
| Choix remis en question | Abandon des cartes UI classiques au profit d'une mise en page éditoriale de « Livre de comptes » (avec bascule en mode sombre pour « Le revers » de chaque chapitre) |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | 0 |
| Compréhension ou problème observé | Tests prévus dès la finalisation du parcours en semaine 4 |
| Issue corrective | Issue #19 |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Aide à l'écriture des formules géométriques de placement des cubes (`formations.js`). Vérification visuelle et mathématique dans le navigateur. |
| Blocage technique | Aucun |
| Blocage pédagogique ou organisationnel | Aucun |
| Besoin d'un point enseignant | Non |

## 7. Objectifs de la semaine suivante

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Finaliser le récit 3D complet en 7 chapitres + page `sources.html` sur la branche `semaine-2026-10-26-recit-3d` | Nicolas et Rahim | #11 à #18 |
| Vérifier la performance (>= 30 FPS) et préparer le questionnaire testeurs | Rahim | #19, #20 |
| Compléter `CHOIX-MODELISATION.md` | Rahim et Nicolas | #10 |

## 8. Signaux d'alerte

- [ ] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [x] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [ ] Un choix de modélisation important n'est pas justifié.
- [ ] Une notion n'a pas avancé depuis 2 semaines.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** aucune notion bloquée ; le code des 7 notions est en cours d'assemblage dans `src/`.

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | Oui |
| Date d'envoi | 23 octobre 2026 |
| Noms des membres | Rahim Tamhaev, Nicolas Rapuzzi |

