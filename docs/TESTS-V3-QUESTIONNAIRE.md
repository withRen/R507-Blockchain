# Questionnaire de test de la v3 (« Le Registre »)

Réponses au questionnaire Google Forms reçues le 15 novembre 2026, de 11 h 13 à 15 h 02. Trois testeurs extérieurs au groupe. Toutes les données ci-dessous viennent de l'export CSV du formulaire ; les réponses écrites sont recopiées telles quelles.

## Synthèse

- **3 réponses**, toutes sur ordinateur. Deux testeurs disent ne rien connaître à la blockchain, un en connaît le principe.
- **2 testeurs sur 3 ont terminé le parcours** (20 et 40 minutes). Jarod REVELLIN s'est arrêté au prologue.
- **Note globale moyenne : 4,0 / 5** (3, 5 et 4).
- Critères les mieux notés : le défilement et le bouton « Passer », et les phrases « À retenir » (4,67 / 5 chacun).
- Critères les moins bien notés : suivre l'histoire sans perdre le fil, et la fluidité (3,33 / 5 chacun). La fluidité va de 1 (Firefox) à 5 (Opera GX).
- Quiz : parmi les deux testeurs qui ont fini, C1, C3, C5 et C6 sont justes pour les deux. Les questions sur le minage (C7), le consensus (C8) et l'attaque (C9) ont le moins de réponses justes.
- Séquences citées comme gênantes ou confuses : le minage (séquence 5) par le testeur Firefox, la séquence 6 (consensus) par Sir Baguette.
- Recommandation : « Oui » (Sir Baguette), « Peut-être » (testeur Firefox), sans réponse (Jarod).

### Contexte des tests

- Le test du testeur sous Firefox (fluidité notée 1 / 5, « Lent sur mon pc ») date d'**avant l'optimisation des performances**.
- Jarod REVELLIN a testé **l'ancienne version restée en cache**, sans le bandeau « À toi de jouer » actuel. Sa note de 2 / 5 sur la clarté des consignes porte donc sur l'ancienne version. Il s'est arrêté au prologue : ses notes B3 portent sur ce seul passage.

## 1. Profil des testeurs

| | Testeur 1 | Testeur 2 | Testeur 3 |
|---|---|---|---|
| Nom | (anonyme) | Jarod REVELLIN | Sir Baguette |
| Date et heure | 15/11, 11 h 13 | 15/11, 14 h 04 | 15/11, 15 h 02 |
| Appareil | Ordinateur | Ordinateur | Ordinateur |
| Navigateur | Firefox | Chrome | Opera GX |
| A1. Connaissance de la blockchain avant le test | J'en connais le principe | Rien du tout | Rien du tout |
| A2. La blockchain avant le parcours, en une phrase | « Argent virtuel, crypto, transfert, pas infaillible » | « Je ne sais pas » | « je ne sais pas » |
| B1. Temps passé | 20 min | (non renseigné) | 40 min |

## 2. Notes de 1 à 5 (B3)

1 = pas du tout d'accord, 5 = tout à fait d'accord.

| Critère | Testeur 1 (Firefox) | Jarod | Sir Baguette | Moyenne |
|---|:-:|:-:|:-:|:-:|
| La longueur du parcours est raisonnable. | 3 | 5 | 4 | 4,00 |
| J'ai suivi l'histoire sans perdre le fil. | 4 | 3 | 3 | 3,33 |
| L'histoire (Léa, Inès, Maxime) m'a donné envie d'aller au bout. | 3 | 4 | 4 | 3,67 |
| J'ai vu tout de suite ce qui était cliquable ou interactif. | 4 | 3 | 5 | 4,00 |
| Les consignes des exercices « À toi de jouer » étaient claires. | 5 | 2 | 5 | 4,00 |
| Le défilement et le bouton « Passer » m'ont permis d'avancer à mon rythme. | 5 | 4 | 5 | 4,67 |
| Les phrases « À retenir » m'ont aidé(e) à fixer l'idée de chaque séquence. | 5 | 5 | 4 | 4,67 |
| Le code couleur (bleu, vert, rouge, orange…) était clair et cohérent. | 3 | 4 | 5 | 4,00 |
| Les personnages (silhouettes 3D et portraits) sont soignés et cohérents. | 3 | 5 | 5 | 4,33 |
| Le site était fluide (pas de saccades, pas de chargement trop long). | 1 | 4 | 5 | 3,33 |
| **E1. Note globale du parcours** | **3** | **5** | **4** | **4,00** |

## 3. Questions fermées (B2, B4 à B7)

| Question | Testeur 1 (Firefox) | Jarod | Sir Baguette |
|---|---|---|---|
| B2. Parcours terminé jusqu'à l'épilogue ? | Oui | Non, arrêté au prologue | Oui |
| B4. Lecture automatique utilisée ? | Oui | Non | Non |
| B5. Fenêtre « Sources de cette séquence » ouverte ? | Oui | Oui | Je ne l'ai pas vue |
| B6. Musique activée ? | Oui, mais elle gêne | Non | Oui, elle ajoute à l'ambiance |
| B7. Clic ou attente d'une interaction qui n'existait pas ? | « Je ne m'en rappelle plus » | (sans réponse) | « non » |

## 4. Quiz de compréhension (C1 à C10)

La réponse attendue est tirée du scénario de la v3 (`SCENARIO-V3.md`, phrases « À retenir » et contenu des séquences). ✅ juste, ⚠️ en partie juste, ❌ faux, ➖ pas de réponse ou « je ne sais pas ».

Jarod s'étant arrêté au prologue, il a répondu « Je ne sais pas » ou rien à toutes les questions du quiz ; il n'apparaît pas dans ce tableau.

| Question | Réponse attendue | Testeur 1 (Firefox) | Sir Baguette |
|---|---|---|---|
| C1. Problème du registre de la banque au début | Il est tenu par une seule personne, qui peut le modifier seule | ✅ Il est tenu par une seule personne, qui peut le modifier seule | ✅ Il est tenu par une seule personne, qui peut le modifier seule |
| C2. Contenu d'un bloc | Les données (transactions), l'empreinte du bloc précédent, le nonce, sa propre empreinte | ⚠️ L'empreinte du bloc précédent ; le nom de son propriétaire ; sa propre empreinte | ⚠️ L'empreinte du bloc précédent |
| C3. Une lettre change dans une transaction : l'empreinte… | Elle change complètement | ✅ Elle change complètement | ✅ Elle change complètement |
| C4. Pourquoi modifier le bloc 2 casse le lien avec le bloc 3 | Le bloc 3 porte l'empreinte du bloc 2, qui ne correspond plus | ⚠️ « C'est une "anomalie" qui modifie structurellement le hash et ne permet pas de.retrouver l'original red flag » | ✅ « car le bloc 3 contient une copie du bloc 2. donc si le bloc 2 change, le bloc 3 ne contiendra plus la meme copie du bloc 2 » |
| C5. Comment la fraude de Maxime est repérée | Sa copie ne correspond plus aux 13 autres | ✅ Sa copie ne correspond plus aux 13 autres | ✅ Sa copie ne correspond plus aux 13 autres |
| C6. On coupe plusieurs tours, dont Meridian | La transaction circule quand même par les autres tours | ✅ La transaction circule quand même par les autres tours | ✅ La transaction circule quand même par les autres tours |
| C7. Long pour le mineur, rapide pour les autres | Trouver le nonce est long, vérifier est immédiat | ⚠️ « Le controle est rapide le minage couteux en electricité » | ➖ « je me suis perdu vers ici donc je sais pas » |
| C8. Preuve de travail | Dépenser de la puissance de calcul | ✅ Dépenser de la puissance de calcul | ➖ |
| C8. Preuve d'enjeu | Bloquer une mise (tiré au sort parmi les validateurs) | ❌ Être un signataire reconnu, à tour de rôle | ➖ |
| C8. Preuve d'autorité | Être un signataire reconnu, à tour de rôle | ✅ Être un signataire reconnu, à tour de rôle | ➖ |
| C9. Pourquoi Julien attend plusieurs confirmations | Un paiement devient sûr peu à peu, à chaque confirmation : une chaîne secrète (double dépense) pourrait sinon annuler le paiement | ⚠️ « En cas de double.ligne de depense » | ➖ « Je sais pas » |
| C10. La blockchain après le parcours, en une ou deux phrases | (question ouverte) | « C'est un moyen plus sur que le controle unique pour garantir une meilleure inviolabilité de ses crypto par la multiplication des points de controles, et sobre en energie » | « un réseau pour effectuer des paiements et échanger de la crypto monnaies » |

Pour C2, le CSV ne donne pas la liste des choix proposés : seul « le nom de son propriétaire » y apparaît comme réponse fausse. La formulation exacte de la bonne réponse de C8 « Preuve d'enjeu » dans le formulaire n'est pas non plus dans l'export.

## 5. Avis par séquence (D1)

« Claire » et « Exercice agréable » sont deux cases à cocher indépendantes. Une case vide veut dire que le testeur n'a rien coché pour cette séquence.

| Séquence | Testeur 1 (Firefox) | Jarod | Sir Baguette |
|---|---|---|---|
| Prologue : la ligne modifiée | Exercice agréable | Claire ; exercice agréable | Claire ; exercice agréable |
| 1. Salle des serveurs : le bloc | Exercice agréable | | Claire ; exercice agréable |
| 2. Passerelle : la chaîne | Exercice agréable | | Claire ; exercice agréable |
| 3. Bureau de Maxime : la falsification | Exercice agréable | | Claire ; exercice agréable |
| 4. Au-dessus de la ville : le réseau | Exercice agréable | | Claire ; exercice agréable |
| 5. Ferme de minage : le minage | | | Claire |
| 6. Salle du conseil : le consensus | Claire | | |
| 7. Parking : transaction et attaque | | | |

Décompte : la séquence 7 n'a reçu aucune case cochée. Le testeur 1 n'a coché « Claire » que pour la séquence 6.

## 6. Questions ouvertes sur les séquences (D2 à D5)

| Question | Testeur 1 (Firefox) | Jarod | Sir Baguette |
|---|---|---|---|
| D2. L'épilogue était-il clair ? | Je n'y suis pas arrivé(e) | Je n'y suis pas arrivé(e) | Oui |
| D3. Séquence gênante, et pourquoi | « Le minage, pas tout compris, le parking pas vu. Epilogue la case ne s'est pas eclairé du coup pas sur de l'avoir vu » | (sans réponse) | « La sixieme ça m'avait confus » |
| D4. Séquence préférée, et pourquoi | « La presentation du block seance 2 » | (sans réponse) | « La premiere, la premiere fois que tu clique sur la bonne reponse etait tres satisfasante » |
| D5. Séquence la plus longue ou la plus confuse | « La validation et le minage » | (sans réponse) | « La sixieme jai commencé a me perdre » |

Le testeur 1 a répondu « Oui » en B2 (parcours terminé) mais « Je n'y suis pas arrivé(e) » en D2 ; sa réponse en D3 dit qu'il n'est pas sûr d'avoir vu l'épilogue.

## 7. Avis global (E1 à E4)

| Question | Testeur 1 (Firefox) | Jarod | Sir Baguette |
|---|---|---|---|
| E1. Note globale | 3 / 5 | 5 / 5 | 4 / 5 |
| E2. Recommanderiez-vous le site ? | Peut-être | (sans réponse) | Oui |
| E3. La chose à changer en priorité | « C'est destiné à qui ? Soit c'est trop technique pour un 100% novice, soit c'est trop light » | (sans réponse) | (sans réponse) |
| E4. Autres remarques | « Lent sur mon pc, ressources à revoir avec glossaire accessible en tapant mot clef "nonce = ....." Pourquoi pas une version adapté au niveau supposé indentifié des le debut par une question..? » | (sans réponse) | « C'était une tres sympa » |
