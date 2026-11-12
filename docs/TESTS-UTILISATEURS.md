# Retours reçus et décisions

Ce fichier consigne les observations faites sur le projet par des personnes extérieures au groupe, et ce que nous en avons fait. Les décisions sont détaillées dans `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` (section 2.6 et rubriques f de chaque notion).

Le sujet demande des tests avec au moins 2 personnes extérieures, non initiées. À ce jour, la v2 a été testée par **une** personne non initiée. Un second test, sur la v3, reste à faire avant la soutenance.

## 1. Revue de l'enseignant, 12 novembre 2026

Observations notées par Nicolas pendant la revue des deux sites.

### Sur la v1 (« Grand Registre »)

| Observation | Décision dans la v3 |
|---|---|
| Il clique ou cherche une interaction là où il n'y en a pas, et ne voit pas que certaines parties sont interactives. | Exercices annoncés (« À toi de jouer », halo, curseur en main sur les objets cliquables). |
| Idée : afficher les sources de la section dans une fenêtre, sans rediriger. | Bouton « Sources de cette séquence ». |
| Le visuel du bloc, dans la section du hash, est peu représentatif : il a cru que les trois couleurs étaient trois chaînes ou trois mineurs. | Les trois couches du bloc ont la même teinte. |
| Le bloc du début et les blocs suivants n'ont ni la même forme ni le même volume. | Gabarit unique pour tous les blocs. |
| Il faut garder une unicité (code couleur, formes), sinon on envoie des messages différents au lecteur. | Une couleur, un sens ; légende permanente. |
| Bitcoin est le plus connu mais ce n'est pas le seul usage ; un groupe a illustré une chaîne de production, du produit brut au produit transformé. | Bitcoin réduit à trois endroits ; usage hors finance mentionné en séquence 6. Histoire conservée (choix du groupe). |
| Les copies en parallèle ne sont pas visibles ; c'est pendant l'attaque que cela compte : il faut écraser la copie de tous. | 14 copies visibles en séquences 3 et 7. |
| L'information sur le stockage arrive un peu tard (corrigé sur la v2). | Conservé : prologue et séquence 4. |
| L'autorité peut se déléguer et tourner ; corrompre tout le monde est possible mais coûte plus cher que de calculer normalement. | Cinq signataires à tour de rôle, exercice de corruption. |
| Visuellement, c'est plutôt agréable. | |

### Sur la v2 (« Le Registre »)

| Observation | Décision dans la v3 |
|---|---|
| Plus sympa visuellement ; bien plus ludique, mieux adapté au tout public. | Direction conservée. |
| L'interaction semble n'être que le déroulé : est-ce seulement narratif ? | Premier exercice dès le prologue. |
| Les interactions ne sont pas assez explicites. | Exercices annoncés, consignes visibles aussi sur mobile. |
| « Mettre un truc que vous pouvez gérer ici, parce qu'on est pris dans le déroulement depuis un moment. » | Exercice du prologue : retrouver la ligne modifiée. |
| Ne pas tout rendre interactif non plus, sinon cela fait usine à gaz. | Un geste principal par exercice ; glisser-déposer retiré. |
| Si on reste narratif : de petites séquences comme un pseudo-film, peut-être avec de l'audio. | Lecteur de musique par séquence. |
| Le défilement est capricieux : ajouter un bouton « passer à la suite ». | Bouton « Passer » permanent ; lecture auto sur demande. |

## 2. Test utilisateur, personne non initiée, sur la v2

Retour écrit après un parcours complet, sans explication préalable.

| Observation | Décision dans la v3 |
|---|---|
| « J'ai tout bien vu. » | |
| « C'était terriblement long. » L'histoire est intéressante, mais plus elle s'allonge, plus on perd le fil ou on s'ennuie. | Répliques et fiches réduites, question d'ouverture et « À retenir » par séquence, défilement raccourci. |
| L'histoire a pourtant besoin d'être longue pour tout expliquer. | Histoire conservée ; c'est le rythme qui change (exercice plus tôt, repère « Notion n/7 »). |
| Une musique de fond qui varie à chaque palier serait très immersive. | Lecteur de musique, une piste par séquence. |
| Points appréciés : le défilement qui suit l'histoire, le retour en arrière, le rythme libre, comprendre par soi-même grâce aux exercices. | Conservés. |
| Les personnages manquent de cohérence et leur design est peu soigné. | Cou et mâchoire repris ; portraits aux mêmes couleurs que les modèles. |
| Suggestion : des fenêtres de dialogue avec un portrait 2D de face. | Portraits 2D dans la boîte de dialogue. |

## 3. Tests menés sur la v1

Voir le [formulaire de retours](https://docs.google.com/forms/d/e/1FAIpQLSdWOe5Z6wL2r4mvUCPZjamTJZX2sr3akOwpV4yEK9PuOTuHjA/viewform) et les lignes « (Test v1) » des rubriques f du livrable de modélisation.

## 4. Reste à faire

- Un second test de la v3 par une personne non initiée.
- Créer une issue par décision de ce fichier, et la lier au commit correspondant.
- Mesurer les images par seconde de la v3 sur un poste de TP.
