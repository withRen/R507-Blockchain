# Le Registre, v3 : la même histoire, mieux expliquée

Statut : base de travail de la v3. Remplace la proposition « chaîne de production », abandonnée.

## Ce qui ne change pas

L'histoire de la v2 : une nuit (23 h 47 à 07 h 10) dans un quartier d'affaires. Quarante millions disparaissent du registre central, tenu par un seul administrateur. Au fil de la nuit, on découvre comment une blockchain répond à ce problème, face à quelqu'un qui tente de tricher.

Les lieux, les heures et l'ordre des 7 notions restent ceux de la v2.

## Distribution

| Personnage | Rôle | Avant |
|---|---|---|
| Léa Vasseur | Auditrice interne. Mène l'enquête. | Alice |
| Julien Lemoine | Dirigeant de Lemoine Logistique. Ses 40 millions ont disparu. | Bob |
| Maxime Kern | Dirige les opérations d'un fonds. Tente de tricher. | Mallory |
| Inès | Ingénieure. Explique. | inchangé |
| Gaspard | Administrateur du registre central. | inchangé |
| Théo, Clara, Hélène | Défendent chacun un mécanisme de consensus. | inchangé |

Les personnages passent en portraits 2D dans une boîte de dialogue. La 3D est réservée aux lieux et aux objets.

## Pourquoi c'était mal expliqué, et ce qu'on corrige

| Problème de la v2 | Correction en v3 |
|---|---|
| Le début est long et passif : la première interaction arrive à 19 % du film. | Prologue réduit de moitié, avec une interaction dans la première minute : cliquer la ligne du registre qui a changé. |
| On perd le fil : chaque séquence enchaîne les répliques sans dire où on en est. | Chaque séquence s'ouvre sur une question écrite à l'écran et se ferme sur une phrase « À retenir ». Un repère « Notion 3/7 » reste affiché. |
| Trop de vocabulaire : environ 30 fiches de termes. | Deux fiches par séquence au plus. Les 5 termes du glossaire du sujet gardent leur définition mot pour mot. |
| Les 40 millions du début et les « 5 jetons » des exercices semblent sans rapport. | Inès fait le lien dès la séquence 1 : « On reprend avec un petit paiement, pour voir comment il est protégé. » |
| L'histoire ne se conclut pas : on ne voit jamais ce que la blockchain aurait changé. | L'épilogue rejoue la modification de 23 h 12 sur le registre distribué : la copie modifiée passe au rouge, les 13 autres la rejettent. |
| Bitcoin est cité à chaque séquence. | Cité une fois au prologue, puis seulement pour le minage (séquence 5) et la formule de l'attaque (séquence 7). |
| Rien ne montre qu'une blockchain sert à autre chose qu'à de l'argent (remarque du prof). | Séquence 6 et épilogue : Lemoine Logistique pourrait suivre ses marchandises de la même façon, du produit brut au produit transformé. |
| Les copies en parallèle ne se voient pas pendant la triche (remarque du prof). | Séquences 3 et 7 : les 14 copies sont à l'écran. Tricher, c'est devoir réécrire la majorité d'entre elles. |
| L'autorité est présentée comme « il faut faire confiance » (remarque du prof). | Séquence 6 : les signataires se relaient, le rôle se délègue, et corrompre tout le monde coûte plus cher que le travail honnête. |
| Le bloc change de forme et de couleur d'une séquence à l'autre (remarque du prof). | Un seul gabarit de bloc partout. Une couleur n'a qu'un sens. Légende affichée en permanence. |

## Alignement avec le sujet

Le sujet exige que chaque notion produise « une animation ou interaction observable, pas seulement un texte », et cite parmi les mécaniques attendues le **clic sur un bloc**. Les intitulés des notions ci-dessous sont ceux du sujet, à reprendre tels quels dans le README, le livrable de modélisation et la grille d'auto-évaluation.

| # | Notion (intitulé du sujet) | Ce que le visiteur voit | Ce que le visiteur fait |
|---|---|---|---|
| 1 | Structure d'un bloc | Le bloc s'ouvre en quatre champs : données, hash du bloc parent, nonce, hash du bloc. | Clique un champ du bloc pour savoir à quoi il sert, puis retrouve la transaction qui donne l'empreinte cible. |
| 2 | Chaînage cryptographique | Cinq blocs reliés. Une lettre change, le lien suivant casse. | Modifie le bloc 2, puis recopie les hashes pour réparer. |
| 3 | Immutabilité et détection de falsification | Les 14 copies côte à côte. Celle de Maxime devient incohérente, les autres nœuds la rejettent. | Change 5 en 500 dans la copie de Maxime. |
| 4 | Réseau et décentralisation | Les 14 tours sont les nœuds. Une transaction se propage de voisin en voisin. | Coupe des tours, puis émet une transaction. |
| 5 | Validation et minage | Les essais de nonce sautent, seuls ceux qui franchissent la barre de difficulté gagnent. | Mine un bloc avec de vrais SHA-256, puis le vérifie en un seul hash. |
| 6 | Comparaison d'au moins deux mécanismes de consensus | Trois hologrammes : travail, enjeu, autorité. Les signataires de l'autorité se relaient. | Produit 100 blocs avec chaque méthode, puis tente de corrompre des signataires. |
| 7 | Cycle de vie d'une transaction et scénario d'attaque illustré | Création, propagation, validation, inclusion, confirmation. Puis la chaîne secrète de Maxime face aux 14 copies. | Décide combien de blocs Julien doit attendre. |

## Séquences

Chaque séquence suit le même moule : **la question → l'explication → À toi → À retenir → le revers**.

| Séquence | Question d'ouverture | À retenir |
|---|---|---|
| Prologue · 23 h 47 | Que se passe-t-il quand un seul registre fait foi ? | Un seul registre, c'est un seul témoin. |
| 1 · 03 h 05 · Salle des serveurs | De quoi est fait un bloc ? | Le hash résume le bloc : la moindre modification le change complètement. |
| 2 · 03 h 40 · Passerelle | Qu'est-ce qui empêche de remplacer un bloc ? | Chaque bloc porte l'empreinte du précédent. |
| 3 · 04 h 15 · Bureau de Maxime | Et si quelqu'un modifie sa copie ? | La falsification se voit : les autres nœuds la rejettent. |
| 4 · 04 h 50 · Au-dessus de la ville | Où est rangé le registre ? | Partout : chaque nœud en garde une copie complète. |
| 5 · 05 h 20 · Entrepôt du port | Qui écrit le prochain bloc ? | Trouver le nonce est long, vérifier est immédiat. |
| 6 · 06 h 00 · Salle du conseil | Peut-on décider autrement qu'en brûlant de l'énergie ? | Travail, enjeu, autorité : chacun a ses avantages et ses limites. |
| 7 · 06 h 40 · Parking de la tour Kern | Quand un paiement est-il vraiment sûr ? | Il le devient peu à peu, à chaque confirmation. |
| Épilogue · 07 h 10 · Toit | Et les quarante millions ? | Une blockchain ne protège que ce qu'on y a écrit. |

## Objectif de durée

Environ 45 répliques au lieu de 70. C'est un objectif d'écriture, à mesurer une fois la v3 jouable.
