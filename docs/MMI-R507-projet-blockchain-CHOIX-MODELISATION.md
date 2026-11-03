# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` — livrable officiel

Ce document détaillé est le **livrable officiel** consacré aux choix de modélisation. Il compte pour 25 % de la note. Il doit être complété au fur et à mesure du projet, avec une section par notion, au format `docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`. Chaque choix doit expliquer sa valeur pédagogique, une alternative écartée et l'effet des tests utilisateurs.

## 1. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | Rahim Tamhaev, Nicolas Rapuzzi |
| Membres et rôles | Rahim Tamhaev (@withRen), Nicolas Rapuzzi (@hextravagance). Création 3D et UX partagée à parts égales ; rôles détaillés dans le README. |
| Public cible | Personnes non initiées à la blockchain, sans explication orale préalable |
| Lien vers la démo | https://withren.github.io/R507-Blockchain/ |
| Lien vers GitHub Projects | https://github.com/users/withRen/projects/3 |
| Version et date de mise à jour | v1.0, 3 novembre 2026 |

## 2. Univers visuel et métaphore principale

### 2.1 Public cible et objectif
Le parcours s'adresse à un public grand public ou étudiant qui n'a jamais étudié la blockchain et qui découvre le site en autonomie complète, sans médiation orale préalable.
À la fin de l'expérience (environ 10 minutes de lecture et d'interactions au fil du défilement), l'utilisateur doit retenir :
1. qu'une blockchain est un **registre public de transactions** découpé en pages appelées **blocs** ;
2. que chaque bloc porte l'**empreinte cryptographique (hash)** du bloc précédent, ce qui rend toute falsification immédiatement visible en cascade ;
3. qu'aucun serveur central ne détient la vérité : des milliers de **nœuds** conservent chacun une copie complète du registre ;
4. que l'ajout d'un bloc exige une dépense vérifiable (**preuve de travail** par minage, **preuve d'enjeu** par mise en garantie, ou **preuve d'autorité** par identité), et que chaque méthode comporte des compromis majeurs (énergie, concentration financière, centralisation) ;
5. qu'une transaction n'est définitivement sûre qu'après plusieurs **confirmations** (blocs empilés par-dessus), ce qui protège contre l'attaque par **double dépense**.

### 2.2 Métaphore retenue
Nous avons retenu la double métaphore du **Grand Registre comptable (livre de comptes)** pour l'interface éditoriale et de **la pièce qui se décompose en briques d'information** pour la scène 3D :
- **Fil rouge narratif :** le paiement « Alice -> Bob : 5 jetons », suivi depuis son inscription dans une page du registre jusqu'à sa confirmation finale face à une tentative de double dépense de Mallory.
- **Continuité 3D (les 1 800 « petites infos ») :** le parcours s'ouvre sur un jeton Bitcoin en fil de fer recouvert de 1 800 petits cubes instanciés (`THREE.InstancedMesh`). Au fil du défilement, ces mêmes cubes se détachent de la pièce pour former tour à tour : les trois couches d'un bloc (notion 1), cinq blocs reliés en chaîne (notion 2), une chaîne dont la fin vire au rouge lors d'une falsification (notion 3), un maillage décentralisé de 14 nœuds (notion 4, où la pièce disparaît complètement pour montrer que le bitcoin n'est rangé dans aucun coffre), une loterie d'essais de minage (notion 5), trois architectures de consensus (notion 6) et deux chaînes concurrentes lors d'une attaque (notion 7).
- **Mise en abyme technique :** le site applique lui-même ce qu'il explique. L'en-tête de chaque chapitre calcule en direct (en SHA-256 réel via `src/lib/ledger.js`) son propre hash à partir de son titre, du hash du chapitre précédent et d'un nonce miné avec une difficulté de deux zéros (`00...`).
- **Dualité « Explication / Le revers » :** chaque chapitre comporte deux temps. Le premier présente le fonctionnement sur fond papier clair ; le second (« Le revers ») fait basculer la page et la scène 3D en mode sombre pour exposer les limites réelles (lenteur, consommation électrique de ~138 TWh/an, RGPD, concentration des mineurs, irréversibilité des erreurs) sous forme d'écritures de débit (`-`).

### 2.3 Justification et limites
| Question | Réponse |
|:---|:---|
| Quelles propriétés deviennent évidentes ? | La conservation de la matière informationnelle (les mêmes 1 800 cubes forment la pièce, les blocs et le réseau), la rupture en cascade du chaînage (passage au rouge du bloc 3 au bloc 5), l'absence d'organe central (éclatement de la pièce en 14 nœuds pairs) et la disproportion entre essais perdants et essai gagnant lors du minage. |
| Quelles propriétés sont difficiles à représenter ou risquent d'être déformées ? | 1. La nature mathématique du hash (qui ne chiffre pas les données mais les résume). 2. L'échelle réelle du réseau (des milliers de nœuds et des milliards de milliards de hashes par seconde en PoW). 3. La différence entre modèle UTXO (Bitcoin) et modèle par comptes (Ethereum). |
| Comment ces limites sont-elles compensées ? | Par des widgets interactifs réels (vrai calcul SHA-256 dans le navigateur aux chapitres 1 et 5, simulation statistique sur 100 blocs au chapitre 6, calculateur exact de la formule de Nakamoto au chapitre 7), par la section critique systématique « Le revers » à chaque chapitre, et par les notes explicites de simplification sur la page dédiée `sources.html`. |

### 2.4 Métaphores écartées
| Métaphore | Points forts | Pourquoi écartée |
|:---|:---|:---|
| **Le coffre-fort / cadenas blindé** | Très familier pour illustrer la sécurité. | Induit une fausse compréhension majeure : fait croire que les données d'une blockchain publique sont chiffrées ou secrètes, et qu'elles sont physiquement impossibles à réécrire (alors que tout est public et que la sécurité repose sur le coût économique de réécriture). |
| **Le train de wagons sur des rails** | Illustre bien l'ordre séquentiel des blocs. | Masque complètement la nature cryptographique du lien (un attelage mécanique ne dépend pas du contenu du wagon précédent) et se prête très mal à la représentation du réseau pair-à-pair (notion 4) ou de la loterie du minage (notion 5). |
| **L'usine / chaîne de montage industrielle** | Dynamique pour montrer le traitement des transactions. | Suggère à tort une entreprise centrale qui pilote l'usine, à l'opposé de la décentralisation et du consensus distribué. |

### 2.5 Charte visuelle
| Élément | Choix | Justification pédagogique |
|:---|:---|:---|
| Palette et signification des couleurs | Fond papier chaud (`#f5f3ee`), fond sombre pour « Le revers » (`#131218`). Couleurs sémantiques strictes et constantes : Bleu encre (`#3346d3`) = information / donnée ; Vert (`#1e9e6a`) = bloc valide / confirmé ; Rouge (`#e0473e`) = falsification / chaîne attaquante ; Orange (`#e89a2c`) = effort / minage / nonce ; Turquoise (`#1a9aa0`) = preuve d'enjeu ; Violet (`#7357d6`) = preuve d'autorité. | Un code couleur invariant sur les 7 chapitres évite toute surcharge cognitive : dès que l'utilisateur voit du rouge ou du vert dans la scène 3D ou dans un widget, il sait immédiatement s'il s'agit d'une donnée valide, d'une fraude détectée ou d'une dépense d'énergie. |
| Formes, style et niveau d'abstraction | Esthétique éditoriale « Livre de comptes » (filets fins, pas de cartes flottantes arrondies, tableaux de débit/crédit) associée à un nuage de 1 800 cubes low-poly instanciés et un logo en fil de fer (`EdgesGeometry`). | Le style épuré évite l'effet « décor de jeu vidéo » qui distrait du propos technique. L'unité géométrique (le cube élémentaire) permet des transitions fluides par interpolation entre toutes les notions. |
| Éclairage et ambiance | `HemisphereLight` douce + `DirectionalLight` principale + brouillard atmosphérique (`THREE.Fog`) + lignes de cahier de comptes en arrière-plan 3D. Bascule automatique en ambiance nocturne (`#131218`) lors des sections « Le revers ». | Le brouillard fait disparaître en douceur les cubes non utilisés (« poussière d'information » en arrière-plan) pour garder une lisibilité maximale sur la figure principale au premier plan. Le passage au sombre marque physiquement le changement de posture (de l'explication technique à l'esprit critique). |
| Typographie et lisibilité | Police principale sans-serif claire (`DM Sans`) pour le corps et l'interface, `Instrument Serif` pour les titres éditoriaux, `JetBrains Mono` (`tabular-nums`) pour les hashes, nonces et compteurs. | La police à chasse fixe avec chiffres tabulaires est indispensable pour comparer visuellement deux empreintes SHA-256 de 64 caractères et observer l'effet avalanche sans décalage de ligne. |
| Échelle et rapport de taille | Plateau 3D normalisé de 13 x 8 unités, recadré automatiquement à droite (ou à gauche un chapitre sur deux) sur grand écran, et en bandeau supérieur sur mobile (`max-width: 860px`). | Permet de ne jamais superposer le texte explicatif et l'objet 3D : l'œil dispose toujours d'une moitié d'écran dédiée au texte/interaction et d'une moitié dédiée à la visualisation 3D. |

## 3. Caméra, espace et navigation

| Question | Réponse et justification |
|:---|:---|
| Caméra libre, guidée ou mixte ? | **Caméra guidée par le défilement (scrollytelling) avec légère parallaxe au pointeur.** Une caméra `OrbitControls` totalement libre fait perdre les repères spatiaux aux débutants et casse la lecture des étiquettes. Le défilement contrôle la progression narrative et l'inclinaison du plateau (`stage.rotation`), tandis que le mouvement de la souris offre une parallaxe douce pour ressentir le volume 3D sans jamais perdre l'angle pédagogique optimal. |
| Comment l'utilisateur sait-il où regarder ? | Alternance gauche/droite entre les chapitres (`data-side="right"`), étiquettes 3D toujours face caméra (`THREE.Sprite` sur canvas haute résolution avec pastille de couleur), et contraste fort entre les cubes actifs au premier plan et la poussière atténuée dans le brouillard. |
| Organisation spatiale et signification des positions | L'axe horizontal (`X`) représente toujours l'**ordre chronologique** (Bloc 1 -> Bloc 5 de gauche à droite, confirmations successives). L'axe vertical (`Y`) représente la **structure interne** (couches Données / Lien / Nonce au ch. 1), le **seuil de difficulté** (barre à franchir au ch. 5) ou la **puissance/mise cumulée** (hauteur des colonnes au ch. 6). |
| Représentation du temps | Le temps est représenté à la fois par le **défilement vertical de la page** (progression de l'histoire et empilement des confirmations), par la **position de gauche à droite** dans les chaînes de blocs, et par le **temps réel** dans les animations continues (propagation des messages entre nœuds, sauts d'essais de minage, chronomètre réel du mineur SHA-256). |
| Passage d'une notion à l'autre | Interpolation continue image par image (`smoothstep` + décalage par particule `SEEDS[i]` + léger tourbillon trigonométrique) : l'utilisateur voit littéralement les cubes d'une notion se réassembler pour former la notion suivante, renforçant l'idée qu'il s'agit toujours des mêmes données vues sous un nouvel angle. Une barre de navigation en bas à gauche (mini-chaîne de 7 blocs) indique la progression et permet de sauter directement à n'importe quel chapitre. |

## 4. Fiches des 7 notions obligatoires

### 4.1 — Structure d'un bloc

**Issues liées :** #11, #23  
**Séquence(s) concernée(s) :** Chapitre 1 (`#bloc`, formation `block`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre qu'un bloc est une page du registre regroupant trois éléments essentiels — des **données** (les transactions), le **lien** (empreinte du bloc précédent) et un **nonce** (numéro d'ajustement) — et que l'ensemble produit une **empreinte (hash)** unique de longueur fixe qui change intégralement au moindre caractère modifié (effet avalanche).

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que l'empreinte (hash) chiffre ou cache les données (les transactions restent publiques et lisibles en clair), ni que l'empreinte garantit que l'information est « vraie » dans le monde réel (elle garantit uniquement que le contenu n'a pas été modifié depuis son calcul).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Un bloc éclaté en 3 strates horizontales de 200 petits cubes chacune (600 cubes au total). | Sépare visuellement les trois composants internes d'un bloc tout en montrant qu'ils forment un seul et même objet. |
| Taille et échelle | 3 strates de dimensions identiques (10 x 2 x 10 cubes) espacées verticalement de 1,2 unité. | Permet d'identifier clairement chaque couche et d'y associer une étiquette 3D dédiée sans chevauchement. |
| Couleur / matériau / texture | Bleu (`#3346d3`) pour les Données, Gris encre (`#4a4854`) pour le Lien parent, Orange (`#e89a2c`) pour le Nonce. | Introduit dès le chapitre 1 le vocabulaire chromatique qui sera conservé dans tout le parcours. |
| Position | Centré sur le plateau 3D, incliné de trois quarts (`tilt: 0.22, -0.32`), logo Bitcoin réduit en filigrane dans le coin supérieur droit. | L'inclinaison révèle la profondeur et la structure en couches ; le logo en coin rappelle d'où viennent les cubes. |
| Mouvement / animation | Respiration verticale lente des 3 couches (`Math.sin`) ; tremblement haute fréquence (`fx.pulse`) de tous les cubes dès que l'utilisateur modifie le texte. | Le tremblement matérialise physiquement dans l'espace 3D l'« effet avalanche » du hachage SHA-256. |
| Interaction et retour visuel | Champ de saisie en direct (`Alice → Bob : 5 jetons`) couplé à un vrai calcul SHA-256 : chaque caractère modifié surligne en jaune (`<mark>`) les caractères changés dans le hash de 64 caractères, indique le nombre exact de caractères modifiés (souvent ~60/64) et fait trembler le bloc 3D. | L'utilisateur expérimente par lui-même qu'une modification minime (« 5 » -> « 6 ») bouleverse toute l'empreinte, sans motif prévisible. |
| Son, si utilisé | Aucun son (parcours conçu pour fonctionner sans audio en salle de TP ou bibliothèque). | Évite toute dépendance sonore ; tous les retours sont visuels et textuels (`aria-live="polite"`). |
| Texte d'accompagnement | Légende structurée des 3 couches + widget d'empreinte + section « Le revers » (limite de 7 tx/s sur Bitcoin, croissance infinie du registre, distinction intégrité vs véracité). | Donne la définition immédiate de chaque couche, puis nuance aussitôt les promesses exagérées sur la blockchain. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Empreinte SHA-256 de 64 caractères hexadécimaux recalculée à la frappe | Fonction de hachage cryptographique SHA-256 (standard NIST FIPS 180-4) | **Exacte** (algorithme SHA-256 réel implémenté dans `src/lib/sha256.js`). |
| 3 couches : Données, Lien parent, Nonce | En-tête de bloc Bitcoin (80 octets : version, hash parent, racine de Merkle, timestamp, nBits, nonce) + corps des transactions | **Simplifiée** (la version, l'horodatage et la cible `nBits` sont omis ; les transactions et leur racine de Merkle sont regroupées sous « Données »). |
| Un seul hachage SHA-256 du bloc | Double SHA-256 (`SHA256(SHA256(header))`) dans Bitcoin | **Simplifiée** (un seul passage SHA-256 suffit à démontrer exactement les mêmes propriétés d'effet avalanche). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Afficher l'arbre de Merkle complet et les 6 champs techniques de l'en-tête dès le chapitre 1 | Surcharge cognitive immédiate pour un débutant qui découvre à peine la notion de bloc et de hash. Cette précision est documentée dans `sources.html#ch1` mais écartée de la scène 3D initiale. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Certains utilisateurs n'osaient pas cliquer dans le champ texte croyant que c'était un simple exemple statique. | Ajout d'une invite explicite sous le champ (« Par exemple, remplacez 5 par 6 ») et mise en évidence de la ligne de saisie. | #18, #19 |

#### g) Limites assumées
Nous regroupons le corps des transactions et la racine de Merkle sous le terme unique « Données » et omettons l'horodatage et la version. Cette simplification est indispensable au chapitre 1 pour concentrer l'attention sur le triptyque fondamental (Données -> Lien -> Nonce -> Empreinte), et elle est explicitement signalée dans la note du chapitre 1 sur `sources.html`.

---

### 4.2 — Chaînage cryptographique

**Issues liées :** #12, #23  
**Séquence(s) concernée(s) :** Chapitre 2 (`#chaine`, formation `chain`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que les blocs ne sont pas simplement posés les uns à côté des autres, mais que chaque bloc **incorpore l'empreinte exacte du bloc précédent** dans ses propres données, formant une chaîne chronologique où chaque maillon dépend de toute l'histoire qui le précède.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que le lien est un simple numéro de page séquentiel (1, 2, 3...) indépendant du contenu, ni que le chaînage suffit à lui seul à empêcher toute réécriture (sans preuve de travail ou consensus, recalculer toute une chaîne est très rapide).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | 5 blocs cubiques (chacun composé d'une grille 5 x 5 x 5 = 125 petits cubes) alignés horizontalement et reliés par 4 tubes cylindriques (`makeLink`). | Montre la transition directe entre le bloc isolé du chapitre 1 et la succession ordonnée de blocs. |
| Taille et échelle | 5 blocs de 1,1 unité de côté, espacés régulièrement de 2,5 unités sur l'axe X (de `X = -5` à `X = +5`). | Permet d'embrasser du regard toute une portion de chaîne (du Bloc 1 au Bloc 5) et de voir les 4 liaisons simultanément. |
| Couleur / matériau / texture | Blocs et tubes de liaison en bleu information (`#3346d3`). | Indique une chaîne intègre et cohérente où l'information circule sans altération d'un bloc au suivant. |
| Position | Alignement horizontal au centre de la scène ; le texte explicatif passe à droite (`data-side="right"`) et la scène 3D glisse à gauche. | Le changement de côté marque le passage au chapitre 2 et dégage tout l'axe horizontal pour la chaîne. |
| Mouvement / animation | Ondulation sinusoïdale déphasée d'un bloc au suivant (`Math.sin(t * 1.2 - b * 0.7)`). | Le mouvement d'onde qui se propage du Bloc 1 vers le Bloc 5 traduit visuellement la dépendance séquentielle de gauche à droite. |
| Interaction et retour visuel | Défilement produisant le regroupement des 600 cubes du bloc unique en 5 blocs chaînés + vérification concrète dans l'en-tête du chapitre (`Bloc 02`) où le champ `lien` affiche exactement l'empreinte `00...` calculée au chapitre 1 (survolable pour voir les 64 caractères). | L'utilisateur constate que les chapitres qu'il est en train de lire forment eux-mêmes une véritable chaîne cryptographique. |
| Son, si utilisé | Aucun. | Cohérence du parcours silencieux. |
| Texte d'accompagnement | Explication du report d'empreinte + invitation à vérifier l'en-tête du chapitre + section « Le revers » (attente d'un bloc toutes les 10 minutes, bifurcations temporaires / forks lorsque deux blocs arrivent en même temps). | Introduit dès maintenant l'idée que le chaînage séquentiel impose une latence et peut créer des branches concurrentes. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Champ `lien` de l'en-tête du chapitre 2 égal au champ `empreinte` du chapitre 1 | Champ `previousblockhash` (32 octets) dans l'en-tête de chaque bloc Bitcoin | **Exacte** (les en-têtes du site sont réellement chaînés par SHA-256). |
| Tubes cylindriques reliant deux blocs consécutifs | Correspondance mathématique entre deux valeurs hexadécimales | **Simplifiée** (matérialise par un objet 3D une relation purement cryptographique). |
| 5 blocs affichés | Plus de 850 000 blocs sur Bitcoin depuis 2009 | **Simplifiée** (échantillon représentatif pour la lisibilité). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Afficher les hashes complets de 64 caractères sur chaque bloc dans la scène 3D | Illisible en 3D et crée un mur de texte hexadécimal intimidant. Nous avons préféré placer les vrais hashes chaînés dans les en-têtes HTML des chapitres (`Bloc 01` -> `Bloc 02`) et garder des étiquettes 3D épurées (`Bloc 1`, `Bloc 5`). |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| L'idée que les chapitres du site sont eux-mêmes chaînés passait parfois inaperçue si on ne regardait pas le petit en-tête au-dessus du titre. | Ajout d'une phrase explicite dans le corps du chapitre 2 (« Regardez au-dessus du titre : le lien de ce chapitre est exactement l'empreinte du chapitre 1 »). | #12, #18 |

#### g) Limites assumées
Nous ne représentons pas ici le second chaînage interne aux transactions (modèle UTXO où chaque entrée pointe vers la sortie d'une transaction antérieure), afin de ne pas confondre la chaîne des blocs et le graphe des transactions.

---

### 4.3 — Immutabilité et détection de falsification

**Issues liées :** #13, #24  
**Séquence(s) concernée(s) :** Chapitre 3 (`#triche`, formation `tamper`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que modifier une donnée dans un bloc passé (ici le Bloc 3) change son empreinte, ce qui **rompt le lien avec le Bloc 4**, change l'empreinte du Bloc 4, rompt le lien avec le Bloc 5, et invalide ainsi **toute la suite de la chaîne en cascade**, rendant toute triche silencieuse impossible.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire qu'il est physiquement ou mathématiquement impossible de modifier une blockchain (c'est possible mais extrêmement coûteux, cf. chapitre 7), ni que l'immutabilité est toujours une qualité sans défaut (elle empêche aussi d'annuler un vol ou d'effacer des données personnelles au sens du RGPD).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Reprise exacte des 5 blocs de 125 cubes et des 4 tubes de liaison du chapitre 2. | Garder exactement la même géométrie permet d'isoler la variable pédagogique : seule l'altération du Bloc 3 et sa propagation changent. |
| Taille et échelle | Identique au chapitre 2, avec un décrochement vertical (`+0.25` sur Y) du Bloc 3 falsifié. | Le décalage vertical du Bloc 3 montre immédiatement quel maillon a été touché (« désaligné » du reste de la chaîne). |
| Couleur / matériau / texture | Blocs 1 et 2 restent bleus (`#3346d3`) ; le Bloc 3 et les Blocs 4 et 5, ainsi que les tubes de liaison après le Bloc 3, virent au rouge vif (`#e0473e`) sur un fond qui prend une teinte rosée d'alerte (`#f8eeec`). | Contraste immédiat entre la partie passée restée saine (Blocs 1-2) et toute la postérité contaminée (Blocs 3-4-5). |
| Position | Même cadrage que la chaîne du chapitre 2, étiquette `Modifié !` en rouge au-dessus du Bloc 3. | Guider immédiatement le regard sur l'origine de la fraude. |
| Mouvement / animation | Cascade pilotée par la progression du défilement (`reach = (p - 0.15) / 0.15`) : le Bloc 3 passe au rouge et se soulève, puis le lien 3-4 clignote en rouge, puis le Bloc 4 vire au rouge et vibre, puis le lien 4-5, puis le Bloc 5. | La propagation temporelle de gauche à droite montre la relation de cause à effet : ce n'est pas un bloc isolé qui devient rouge, c'est une réaction en chaîne. |
| Interaction et retour visuel | Animation progressive liée au défilement : en descendant dans la section, la modification du Bloc 3 propage le passage au rouge et le tremblement aux blocs 4 et 5 ainsi qu'aux liens qui les relient. | Permet à l'utilisateur de contrôler et rejouer la cascade de falsification à son propre rythme en faisant défiler la page vers le bas ou vers le haut. |
| Son, si utilisé | Aucun. | Cohérence du parcours silencieux. |
| Texte d'accompagnement | Scénario concret (« 5 jetons » changé en « 500 » dans le bloc 3) + section « Le revers » (réécriture possible si majoritaire, piratage de The DAO en 2016 ayant forcé la scission d'Ethereum, incompatibilité avec le droit à l'oubli de la CNIL). | Nuance fortement le mot « immuable » souvent présenté comme magique et absolu. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Passage au rouge en cascade du bloc 3 jusqu'au bloc 5 | Désaccord entre le `previousblockhash` inscrit dans le bloc `i+1` et le nouveau hash calculé du bloc `i`, invalidant aussi la preuve de travail | **Exacte** sur la logique causale en cascade. |
| Liens rouges clignotants | Vérification mathématique instantanée par les nœuds qui rejettent les blocs invalides | **Simplifiée** (traduit un test logique d'égalité de hashes par un signal visuel d'alerte). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Faire exploser ou tomber dans le vide les blocs 3, 4 et 5 | Spectaculaire mais faux pédagogiquement : une donnée modifiée ne « détruit » pas le fichier, elle produit simplement une empreinte différente que les autres participants refusent de reconnaître. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| En défilant très vite, certains testeurs voyaient les 3 derniers blocs déjà rouges sans remarquer que cela partait du Bloc 3. | Étalement du seuil de déclenchement (`reach`) sur la hauteur de défilement, surélévation du Bloc 3 (`o.y += 0.25`) et ajout du badge `Modifié !` juste au-dessus du Bloc 3. | #13, #19 |

#### g) Limites assumées
Dans la réalité, un attaquant ne se contenterait pas de modifier le texte du bloc 3 sans mettre à jour les champs `previousblockhash` des blocs 4 et 5 ; ce qui l'arrête vraiment est l'obligation de recalculer la preuve de travail (nonce) de chaque bloc à partir du bloc 3 plus vite que tout le reste du réseau (ce qui est expliqué juste après aux chapitres 5 et 7).

---

### 4.4 — Réseau et décentralisation

**Issues liées :** #14, #25  
**Séquence(s) concernée(s) :** Chapitre 4 (`#reseau`, formations `logoCenter` puis `mesh`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre qu'il n'existe **aucun serveur central ni coffre-fort** où seraient stockés les bitcoins : la monnaie n'existe qu'à travers le registre, et ce registre est **dupliqué et vérifié en permanence par des milliers d'ordinateurs indépendants (les nœuds)** qui se transmettent les informations de proche en proche.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire qu'une entreprise ou une banque centrale héberge « la » blockchain officielle, ni à l'inverse que le réseau est parfaitement égalitaire et instantané (la propagation prend du temps et le minage réel est concentré dans quelques grands pools).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Séquence en deux temps : 1) la pièce Bitcoin revient au centre (`logoCenter`) avec la question « Mais où est rangé ce bitcoin ? » ; 2) au défilement suivant (`mesh`), l'armature de la pièce disparaît (`LOGO_GONE`) et ses 1 800 cubes éclatent pour former **14 nœuds** (14 mini-blocs de 125 cubes = 1 750 cubes) reliés par un graphe en maillage (`LineSegments`), tandis que les 50 cubes restants voyagent le long des arêtes. | C'est le moment clé du récit : voir la pièce se dissoudre littéralement en une constellation de copies identiques fait comprendre visuellement que l'objet « pièce » est une illusion et que seul le réseau de registres existe. |
| Taille et échelle | 14 nœuds répartis sur une sphère de Fibonacci écrasée (`4.6 x 2.9 x 2.6` unités), chaque nœud étant une réplique miniature d'un bloc (grille 5 x 5 x 5 de côté 0,52 unité) connecté à ses 3 plus proches voisins. | L'absence de nœud central ou plus gros que les autres montre immédiatement l'architecture pair-à-pair (P2P) égalitaire en vérification. |
| Couleur / matériau / texture | Chaque nœud est bleu (`#3346d3`) avec sa couche supérieure verte (`#1e9e6a`, dernier bloc validé) ; les liaisons sont bleu-gris (`#8f97c9`) ; les messages qui circulent entre les nœuds sont orange (`#e89a2c`). | Montre que chaque nœud possède la même copie valide (bleu + vert) et que l'activité du réseau consiste à faire circuler des messages (orange) sur les liaisons. |
| Position | Constellation 3D centrée qui occupe tout le volume du plateau. | Donne une sensation d'espace distribué en trois dimensions, contrairement à l'alignement linéaire des chapitres 2 et 3. |
| Mouvement / animation | Rotation lente de l'ensemble du maillage (`t * 0.12`) + déplacement continu des 50 cubes-messages le long des segments (`lerp` entre nœuds connectés). | La rotation révèle qu'aucun nœud n'est au centre, et la circulation continue des particules illustre le protocole de diffusion de proche en proche (*gossip protocol*). |
| Interaction et retour visuel | Décomposition progressive de la pièce en réseau contrôlée par le défilement + parallaxe à la souris permettant d'observer le maillage sous différents angles. | L'utilisateur contrôle lui-même avec sa molette la dissolution de la pièce en réseau puis sa recomposition s'il remonte. |
| Son, si utilisé | Aucun. | Cohérence du parcours silencieux. |
| Texte d'accompagnement | Question d'accroche (« Mais où est rangé ce bitcoin ? ») suivie de l'explication des nœuds + section « Le revers » (redondance massive très lourde par rapport à une base de données classique, concentration réelle de la création des blocs dans quelques pools, difficulté de gouvernance lors des mises à jour). | Déconstruit le mythe d'une décentralisation pure et gratuite. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Graphe non hiérarchique où chaque nœud est relié à quelques voisins (3) et non à tous | Réseau P2P non structuré de Bitcoin où chaque nœud maintient un nombre limité de connexions TCP sortantes/entrantes | **Exacte** sur la topologie en maillage partiel (diffusion de proche en proche). |
| Particules orange circulant d'un nœud à ses voisins | Annonces `inv` / `getdata` / `block` / `tx` propagées entre pairs | **Simplifiée** (regroupe les différents messages du protocole en un flux visuel unique). |
| 14 nœuds affichés | Des dizaines de milliers de nœuds complets joignables sur Bitcoin | **Simplifiée** (14 nœuds suffisent à montrer un maillage dense sans rendre le graphe illisible). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Dessiner un schéma comparatif « Réseau centralisé (étoile) vs Réseau décentralisé » avec des icônes d'ordinateurs | Déjà vu partout en 2D et perd le fil conducteur de nos 1 800 cubes. Faire éclater la pièce Bitcoin elle-même en 14 copies du registre utilise pleinement la 3D et marque beaucoup plus les esprits. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Le passage direct de la chaîne falsifiée (ch. 3) au maillage (ch. 4) était jugé trop abrupt sans transition narrative. | Ajout d'une étape intermédiaire (`logoCenter` : « Mais où est rangé ce bitcoin ? ») qui fait revenir la pièce au centre avant de la faire éclater en maillage au coup de molette suivant. | #14, #19 |

#### g) Limites assumées
Tous les 14 nœuds sont représentés avec la même taille et le même rôle (nœuds complets qui stockent et relaient). La distinction entre nœuds complets vérificateurs, clients légers (SPV) et nœuds mineurs est précisée par le texte et développée au chapitre 5.

---

### 4.5 — Validation et minage

**Issues liées :** #15, #26  
**Séquence(s) concernée(s) :** Chapitre 5 (`#minage`, formation `lottery`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que pour obtenir le droit d'ajouter un bloc, les mineurs participent à une **loterie énergétique (preuve de travail)** : ils modifient le nonce à toute vitesse jusqu'à tomber par hasard sur une empreinte commençant par suffisamment de zéros (franchir la barre de difficulté), ce qui rend la création d'un bloc — et donc la falsification — très coûteuse.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire que les mineurs résolvent des « équations mathématiques utiles ou complexes » (ce ne sont que des tirages SHA-256 au hasard, dont 99,999... % sont jetés à la poubelle), ni que seuls les mineurs valident les règles (tous les nœuds du chapitre 4 vérifient le bloc gagnant en un seul calcul).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | À gauche : le bloc candidat à valider (64 cubes en grille 4 x 4 x 4). Au centre et à droite : un tapis de 900 petits cubes (les essais de nonces) qui sautent verticalement vers une barre horizontale orange (`lotteryBarY = 0.7`). | Sépare clairement l'objet du travail (le bloc candidat à gauche) et la mécanique probabiliste (la foule d'essais qui tentent de franchir la barre de difficulté à droite). |
| Taille et échelle | Barre horizontale de 7,8 unités de large placée en hauteur ; les essais perdants restent petits (`0.09`), ceux qui franchissent la barre grossissent (`0.16`). | Rend immédiatement lisible la rareté des essais gagnants par rapport à la masse des essais qui retombent trop bas. |
| Couleur / matériau / texture | Essais faibles en gris (`#bdb6a8`), essais proches en orange (`#e89a2c`), essais qui franchissent la barre en vert (`#1e9e6a`). Le bloc candidat à gauche est orange pendant la recherche et devient vert (`fx.mined`) dès que l'utilisateur trouve un bloc valide. | L'utilisateur distingue d'un coup d'œil l'effort dépensé en pure perte (gris/orange) et l'unique essai valide (vert). |
| Position | Cadrage de face légèrement incliné, texte à gauche, scène à droite avec deux étiquettes 3D : `Le bloc à valider` et `Barre à franchir`. | Lecture naturelle de gauche (le bloc) vers la droite (les essais face à la barre). |
| Mouvement / animation | La hauteur de saut de chaque cube suit une **vraie loi exponentielle en base 16** (`-Math.log(hash2(i, cycle)) / Math.log(16)`), identique à la probabilité d'obtenir 1, 2, 3 ou 4 zéros en tête d'un hash hexadécimal ! Quand l'utilisateur clique sur « Miner », la vitesse des sauts et de rotation du bloc candidat est multipliée par 3 (`fx.mining`). | Même l'animation 3D obéit à la vraie distribution mathématique du minage : chaque palier de hauteur supplémentaire est 16 fois plus rare à atteindre. |
| Interaction et retour visuel | **Vrai mineur SHA-256 dans le navigateur** (`src/lib/blockchain.js` + `src/lib/widgets.js`) : curseur de difficulté de 2 à 5 zéros (affichant la probabilité exacte de `1 chance sur 256` à `1 chance sur 1 048 576`), compteur d'essais en direct, chronomètre, et calcul du pourcentage exact d'essais gaspillés (ex. `99,9 % ont consommé de l'énergie pour rien`). | L'utilisateur ressent physiquement le temps d'attente et le travail de calcul de son propre processeur lorsque la difficulté passe de 2 à 5 zéros. |
| Son, si utilisé | Aucun. | Cohérence du parcours silencieux. |
| Texte d'accompagnement | Explication de la loterie du nonce + widget de minage réel + section « Le revers » (~138 TWh/an selon l'étude de Cambridge 2025, soit ~0,5 % de l'électricité mondiale, course au matériel ASIC, 10 minutes par bloc). | Relie l'expérience vécue à l'échelle de son navigateur (quelques secondes d'attente pour 4 ou 5 zéros) au coût énergétique planétaire de Bitcoin. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Mineur incrémental testant des nonces avec SHA-256 jusqu'à obtenir `d` zéros en tête | Preuve de travail Hashcash / Bitcoin testant `SHA256(SHA256(header)) <= target` | **Exacte** sur le principe algorithmique et probabiliste (`1 / 16^d` par caractère hexadécimal `0`). |
| Curseur de difficulté réglable de 2 à 5 zéros | Cible `nBits` ajustée automatiquement tous les 2 016 blocs (~2 semaines) pour maintenir 10 min par bloc (~19 zéros hexadécimaux aujourd'hui) | **Simplifiée** (l'échelle est réduite à 2-5 zéros pour qu'un navigateur trouve un bloc en quelques dixièmes de seconde à quelques secondes). |
| Hauteur de saut des cubes suivant `-ln(U)/ln(16)` | Distribution géométrique du nombre de zéros initiaux d'un hash uniforme | **Exacte** (fidélité mathématique de la visualisation 3D). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Simuler le minage avec un simple `setTimeout` factice et un nombre d'essais aléatoire | Aurait trahi l'objectif pédagogique : faire exécuter de vrais calculs SHA-256 par le navigateur prouve sans tricher pourquoi la difficulté augmente exponentiellement le temps de calcul. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Les testeurs comprenaient que le bouton trouvait un bloc, mais ne réalisaient pas toujours que tous les essais précédents avaient été jetés. | Ajout de la phrase finale calculée dynamiquement après chaque minage : « Trouvé ! Les X autres essais (99,9 %+) ont consommé de l'énergie pour rien. » | #15, #19 |

#### g) Limites assumées
Nous ne modélisons pas la récompense de bloc (*coinbase* + frais de transaction) ni l'épuisement du nonce 32 bits (*extra nonce*) dans la scène 3D afin de garder l'interaction centrée sur le lien entre difficulté, nombre d'essais et dépense énergétique.

---

### 4.6 — Comparaison d'au moins deux mécanismes de consensus

**Issues liées :** #16, #27  
**Séquence(s) concernée(s) :** Chapitre 6 (`#consensus`, formation `consensus`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre qu'il existe plusieurs façons de désigner qui a le droit d'écrire le prochain bloc — par la puissance de calcul (**Preuve de travail / PoW**), par l'argent bloqué en garantie (**Preuve d'enjeu / PoS**) ou par une liste restreinte de membres approuvés (**Preuve d'autorité / PoA**) — et que **chaque mécanisme est un compromis** entre sobriété énergétique, ouverture et décentralisation.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire que toutes les blockchains consomment autant d'électricité que Bitcoin (Ethereum a réduit sa consommation de ~99,9 % en passant au PoS), ni qu'il existe un consensus « parfait » sans contrepartie (le PoS favorise la concentration financière des gros détenteurs qui réinvestissent leurs récompenses, et le PoA réintroduit de la centralisation).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Trois architectures placées côte à côte sur le plateau (`X = -4.3`, `0`, `+4.3`), représentant chacune 5 participants (A, B, C, D, E) : 1) **Travail (PoW)** : 5 colonnes vibrantes de machines proportionnelles à la puissance (`40 %, 25 %, 15 %, 12 %, 8 %`) ; 2) **Enjeu (PoS)** : 5 piles cylindriques de jetons proportionnelles à la mise déposée ; 3) **Autorité (PoA)** : 3 hauts piliers actifs (A, B, C autorisés) et 2 socles bas grisés (D et E exclus du droit d'écriture). | Permet une comparaison visuelle simultanée (côte à côte) de la ressource qui donne le pouvoir dans chaque système : des machines, des piles de jetons, ou un statut d'autorité. |
| Taille et échelle | 3 groupes espacés de 4,3 unités, chaque groupe alignant 5 colonnes de hauteur proportionnelle au poids de chaque participant (jusqu'à 12 couches de haut). | Échelle commune entre les 3 groupes : l'utilisateur voit immédiatement que dans PoW et PoS les 5 acteurs participent selon leur taille, tandis qu'en PoA seuls 3 acteurs ont le droit d'écrire à parts égales. |
| Couleur / matériau / texture | Orange (`#e89a2c`) pour le Travail (énergie), Turquoise (`#1a9aa0`) pour l'Enjeu (capital bloqué), Violet (`#7357d6`) pour l'Autorité (membres accrédités) et Gris (`#bdb6a8`) pour les membres non autorisés en PoA. | Trois couleurs distinctes reprises à l'identique dans la légende, dans le graphique de simulation et dans le tableau « Crédit / Débit » du revers. |
| Position | Alignement frontal des 3 groupes à gauche de l'écran (texte à droite), surmontés des étiquettes 3D `Travail`, `Enjeu`, `Autorité`. | Facilite le balayage visuel horizontal pour comparer les trois modèles d'un seul regard. |
| Mouvement / animation | En PoW, les colonnes vibrent en permanence (`Math.sin(t * 45)`) pour traduire l'activité de calcul ; en PoS et PoA, les colonnes sont calmes (sobriété énergétique). Lorsqu'on lance la simulation, la colonne du participant tiré au sort dans chaque groupe bondit vers le haut (`fx.winners`). | La vibration continue du seul groupe PoW illustre sans un mot pourquoi seul le minage consomme de l'énergie en continu. |
| Interaction et retour visuel | Bouton « Produire 100 blocs » : simule l'attribution de 100 blocs selon les règles des 3 consensus (tirage pondéré par la puissance en PoW, tirage pondéré avec **réinvestissement des récompenses** en PoS, tour de rôle strict `A -> B -> C` en PoA), affiche les histogrammes comparatifs pour A, B, C, D, E et commente le résultat. | Révèle empiriquement deux phénomènes clés : en PoS, le participant A (parti à 40 %) dépasse souvent sa part initiale car ses gains augmentent sa mise ; en PoA, D et E restent toujours à 0 bloc. |
| Son, si utilisé | Aucun. | Cohérence du parcours silencieux. |
| Texte d'accompagnement | Légende des 3 méthodes avec exemples réels (*Bitcoin*, *Ethereum*, *Réseaux privés*) + simulateur de 100 blocs + section « Le revers » présentée comme une balance comptable `Crédit / Débit` comparant les avantages et défauts des trois approches. | Synthétise le « trilemme » sous forme d'un bilan comptable immédiatement lisible. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Vibration continue en PoW vs immobilité en PoS / PoA | Hachage intensif continu vs sélection pseudo-aléatoire par créneau (slots de 12 s sur Ethereum) ou tour de rôle (Clique PoA) | **Exacte** sur le contraste énergétique (~99,95 % d'écart). |
| Simulation de 100 blocs avec réinvestissement en PoS et tour de rôle sur 3 nœuds en PoA | Probabilité proportionnelle au hashrate (PoW), au stake cumulé (PoS) et rotation déterministe des signataires autorisés (PoA) | **Simplifiée** (parts initiales d'exemple `40/25/15/12/8 %` et effet de capitalisation amplifié pour être visible dès 100 blocs). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Comparer uniquement PoW et PoS dans deux sections séparées l'une après l'autre | Séparer les mécanismes empêche de les comparer d'un seul coup d'œil, et omettre la Preuve d'Autorité (PoA) laisse de côté le cas pourtant fréquent des blockchains privées/consortium où l'ouverture est sacrifiée au profit de la rapidité. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Après avoir cliqué sur « Produire 100 blocs », certains testeurs voyaient les barres A-B-C-D-E mais ne comprenaient pas tout de suite pourquoi A gagnait parfois plus en Enjeu qu'en Travail. | Ajout d'une phrase de synthèse dynamique sous le graphique expliquant le score obtenu par A dans chaque mode et mentionnant explicitement le réinvestissement des gains et l'exclusion de D et E en Autorité. | #16, #19 |

#### g) Limites assumées
Nous ne détaillons pas visuellement le mécanisme des comités d'attestation ni le *slashing* (destruction de la mise d'un tricheur en PoS, qui est expliqué dans le texte de la légende) pour que la scène 3D et la simulation restent focalisées sur la question centrale : « Qui obtient le droit d'écrire les blocs et selon quelle loi de répartition ? ».

---

### 4.7 — Cycle de vie d'une transaction et scénario d'attaque illustré

**Issues liées :** #17, #28  
**Séquence(s) concernée(s) :** Chapitre 7 (`#paiement`, formations `confirm` puis `race`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre les **5 étapes du voyage d'un paiement** (signature, diffusion, file d'attente / mempool, inclusion dans un bloc, empilement des confirmations) et pourquoi il faut attendre plusieurs blocs : un attaquant (Mallory) peut tenter une **double dépense** en minant en secret une chaîne parallèle plus longue qui annule et remplace les blocs récents.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire qu'une transaction est définitive dès qu'elle apparaît à l'écran ou dès son premier bloc, ni que l'attaque à 51 % est un seuil binaire « tout ou rien » (même avec 30 % de la puissance, Mallory a une chance non nulle de réussir si Bob n'attend qu'un ou deux blocs, comme le démontre la formule de Nakamoto).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Séquence en deux tableaux 3D distincts : 1) **`confirm` (Cycle de vie et confirmations)** : le bloc contenant le paiement d'Alice à gauche (`X = -4.95`), suivi de 6 blocs de confirmation qui viennent s'empiler un par un à sa droite à mesure que l'on défile ; 2) **`race` (Attaque par double dépense)** : à partir d'un bloc ancêtre commun à gauche, deux chaînes parallèles s'allongent en course : en haut (`Y = +1.4`) la vraie chaîne honnête (4 blocs verts), en bas (`Y = -1.4`) la chaîne secrète de Mallory (6 blocs rouges). | Sépare clairement le cas normal (comment les confirmations enterrent et protègent un paiement) et le scénario d'attaque (la course entre deux branches concurrentes issue d'une bifurcation). |
| Taille et échelle | Blocs de 64 cubes (grille 4 x 4 x 4) alignés de gauche à droite. Dans `race`, la chaîne de Mallory compte 6 blocs contre 4 pour la chaîne honnête. | La différence de longueur (6 blocs contre 4) rend visuellement évidente la règle du protocole : la chaîne la plus longue (la plus lourde en travail) l'emporte. |
| Couleur / matériau / texture | Dans `confirm` : le bloc d'Alice passe du bleu (`#3346d3`) au vert (`#1e9e6a`) dès que les blocs suivants (verts) s'empilent. Dans `race` : la chaîne honnête est verte, la chaîne secrète de Mallory est rouge (`#e0473e`) ; au moment où la chaîne de Mallory dépasse la vraie et déclenche la réorganisation (`reorg`), la vraie chaîne recule dans l'ombre et devient grise (`#bdb6a8`), tandis que la chaîne de Mallory prend sa place en haut et devient la nouvelle chaîne verte officielle ! | Ce changement de couleur et de position au moment du `reorg` est d'une efficacité pédagogique redoutable : l'utilisateur voit littéralement la version frauduleuse devenir la « vérité officielle » du réseau tandis que le paiement à Bob est rejeté dans le gris. |
| Position | Deux lignes horizontales superposées (`honest: +1.4`, `secret: -1.4`) pour la course, puis glissement vertical de la chaîne gagnante vers `Y = +1.4` à la fin du scroll. | Traduit fidèlement la notion de branche parallèle (*fork*) puis de réorganisation de chaîne (*chain reorganization*). |
| Mouvement / animation | Dans `confirm`, les 6 blocs descendent du haut et s'ajoutent un par un au fil du scroll pendant que le compteur 3D affiche `0 confirmation` -> `6 confirmations`. Dans `race`, les blocs secrets de Mallory apparaissent un par un en bas, dépassent les 4 blocs du haut, puis entre `p = 0.7` et `p = 0.85` poussent la chaîne honnête en arrière-plan (`o.z -= 2.5`) et prennent sa place. | L'utilisateur contrôle le déroulement temporel de l'attaque avec son défilement et peut revenir en arrière pour observer le moment précis du basculement. |
| Interaction et retour visuel | Calculateur interactif basé sur la **vraie formule de la section 11 du livre blanc de Satoshi Nakamoto** (`attackerSuccessProbability(q, z)`) : deux curseurs permettent de régler la **puissance de Mallory** (`q` de 5 % à 60 %) et le **nombre de blocs attendus par Bob** (`z` de 1 à 6 blocs), affichant en grand la probabilité exacte de réussite de Mallory (qui tombe à `100 %` dès que `q >= 50 %`). | Permet de vérifier concrètement pourquoi on recommande d'attendre 6 blocs sur Bitcoin (avec 10 % de puissance ennemie, le risque tombe de 20 % pour 1 bloc à `< 0,1 %` pour 6 blocs) et pourquoi au-delà de 50 % aucune attente ne protège plus. |
| Son, si utilisé | Aucun. | Cohérence du parcours silencieux. |
| Texte d'accompagnement | Liste numérotée `01` à `05` des étapes du paiement d'Alice + récit de l'attaque de Mallory contre Bob + calculateur de probabilité + section « Le revers » (attaques 51 % réelles sur Ethereum Classic / Bitcoin Gold en 2019-2020, finalité jamais égale à 100 % en PoW, absence totale de recours en cas de perte de clé ou d'erreur d'adresse). | Relie le cycle complet du fil rouge (Alice -> Bob) aux risques concrets de sécurité pour l'utilisateur final. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Liste des 5 étapes (Signé -> Envoyé -> En attente / frais -> Dans un bloc -> Confirmé) et empilement de 6 blocs | Cycle complet d'une transaction Bitcoin (signature ECDSA/Schnorr, gossip P2P, mempool trié par frais, minage, règle des 6 confirmations) | **Exacte** sur l'ordre et la mécanique des étapes. |
| Chaîne secrète plus longue provoquant l'abandon de la chaîne honnête | Réorganisation (*reorg*) selon la règle de la chaîne ayant le plus de travail cumulé | **Exacte**. |
| Calculateur de chances de réussite de Mallory | Formule de Poisson / marche aléatoire du ruin problem de Nakamoto (Whitepaper, section 11) | **Exacte** (formule mathématique exacte du whitepaper implémentée dans `src/lib/blockchain.js`). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Illustrer une attaque par « piratage de la clé privée d'Alice » | Voler une clé privée relève de la sécurité informatique générale (phishing, malware) et ne montre rien du fonctionnement propre à la blockchain, contrairement à la double dépense par course de chaînes et réorganisation. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Dans la scène `race`, certains testeurs ne comprenaient pas pourquoi la chaîne rouge devenait verte à la fin du défilement. | Clarification du texte (« Si sa chaîne devient plus longue que la vraie, le réseau l'adopte ») et ajout des deux étiquettes 3D explicites `La vraie chaîne` et `La chaîne secrète de Mallory`. | #17, #19 |

#### g) Limites assumées
Nous représentons les 5 étapes préalables au bloc (signature, diffusion, mempool) sous forme d'un registre numéroté synthétique pour consacrer les deux animations 3D du chapitre 7 à l'empilement des confirmations (`confirm`) et à la course de réorganisation (`race`), qui sont les deux phénomènes spatiaux et temporels les plus difficiles à se représenter sans la 3D.

---

## 5. Cohérence globale

| Question | Réponse |
|:---|:---|
| Les codes visuels sont-ils constants ? | **Oui.** Du premier au dernier chapitre, le bleu (`#3346d3`) désigne l'information normale, le vert (`#1e9e6a`) un bloc valide ou confirmé, le rouge (`#e0473e`) une falsification ou une branche d'attaque, et l'orange (`#e89a2c`) le nonce et l'effort de minage. Le passage sur fond sombre (`#131218`) signale toujours la section critique « Le revers ». |
| Un même élément est-il représenté de la même façon partout ? | **Oui.** L'unité de base est toujours le petit cube d'information (`InstancedMesh` de 1 800 cubes), et un bloc est toujours représenté par un assemblage cubique de ces petites informations. |
| L'ordre des séquences est-il progressif ? | **Oui.** On part de l'intérieur d'un seul bloc (1), on assemble plusieurs blocs en chaîne (2), on teste la solidité de cette chaîne face à une modification (3), on élargit la focale pour voir qui détient les copies de cette chaîne (4), on explique comment on gagne le droit d'y ajouter un bloc par le minage (5) ou d'autres consensus (6), et on conclut en suivant un paiement complet face à une attaque (7). |
| Quelle notion est la moins bien représentée ? | La phase de **mempool (file d'attente triée par frais)** au début de la notion 7 : elle est expliquée dans le registre numéroté en 5 étapes, tandis que l'animation 3D du chapitre 7 se concentre sur l'empilement des 6 confirmations et la course de double dépense. |
| Quelle décision reverriez-vous avec une semaine de plus ? | Ajouter une étape 3D intermédiaire au début du chapitre 7 où les petits cubes de transactions flottent dans une « salle d'attente » (mempool) et où les cubes portant les frais les plus élevés (plus lumineux) sont aspirés en premier dans le bloc candidat. |

## 6. Rôle de l'IA générative

Conformément aux consignes, nous déclarons de façon transparente l'usage des outils d'IA générative et le contrôle exercé par le groupe :
- **Collecte documentaire et structuration initiale :** Claude (Claude Code) a été utilisé en semaine 1 et 2 pour structurer le dépôt, générer les issues initiales et aider à synthétiser la fiche de recherche (`docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md`). Toutes les sources primaires (whitepaper de Nakamoto, documentation développeur Bitcoin et Ethereum, rapports NIST, CNIL et Cambridge) ont été ouvertes, lues et vérifiées le 13 octobre 2026.
- **Erreurs et dérives détectées et corrigées par le groupe :**
  1. *Sources douteuses écartées :* une première ébauche documentaire citait des prépublications non vérifiées et une revue peu fiable (`ijnrd.org`) ; nous les avons intégralement rejetées pour ne conserver que des sources primaires institutionnelles et académiques vérifiées dans `sources.html`.
  2. *Dates obsolètes :* les montants de récompense de bloc de la documentation Bitcoin dataient de 2017 ; nous avons choisi de ne pas citer de montant fixe obsolète.
  3. *Direction artistique et métaphore :* nous avons écarté les propositions génériques de cartes UI en « glassmorphism » sombre/néon typiques des sites crypto au profit d'une direction éditoriale originale de **livre de comptes papier** avec bascule sombre sur « Le revers » et mise en abyme SHA-256 des en-têtes de chapitres.
- **Développement 3D et intégration (Antigravity & Claude Code) :** génération et affinage des formations de particules instanciées (`src/lib/formations.js`), de l'échantillonnage de surface du logo (`MeshSurfaceSampler` dans `src/lib/logo.js`) et des widgets pédagogiques (`src/lib/widgets.js`). Tout le code a été relu, compris et testé par Rahim Tamhaev et Nicolas Rapuzzi.

## 7. Sources

L'intégralité des sources vérifiées, classées chapitre par chapitre avec notes de simplification, est consultable dans la page dédiée [`sources.html`](../sources.html) ainsi que dans [`docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md`](MMI-R507-projet-blockchain-FICHE-RECHERCHE.md) :

- **Nakamoto, S. (2008).** *Bitcoin: A Peer-to-Peer Electronic Cash System*. [bitcoin.org/bitcoin.pdf](https://bitcoin.org/bitcoin.pdf) (sections 3, 4, 5, 7 et 11).
- **NIST (2015).** *FIPS 180-4, Secure Hash Standard (SHS)*. [csrc.nist.gov/pubs/fips/180-4/upd1/final](https://csrc.nist.gov/pubs/fips/180-4/upd1/final).
- **Yaga, D. et al. (2018).** *NIST IR 8202, Blockchain Technology Overview*. [nvlpubs.nist.gov/nistpubs/ir/2018/NIST.IR.8202.pdf](https://nvlpubs.nist.gov/nistpubs/ir/2018/NIST.IR.8202.pdf).
- **Bitcoin Developer Guide & Reference.** *Block Chain, Proof of Work, P2P Network, Transactions, Memory Pool*. [developer.bitcoin.org](https://developer.bitcoin.org/devguide/).
- **Ethereum.org Documentation.** *Consensus Mechanisms (PoW, PoS, PoA), Energy Consumption, History of Ethereum (DAO fork)*. [ethereum.org/fr/developers/docs/consensus-mechanisms/](https://ethereum.org/fr/developers/docs/consensus-mechanisms/).
- **Croman, K. et al. (2016).** *On Scaling Decentralized Blockchains*. [initc3.org/files/Scaling2016.pdf](https://www.initc3.org/files/Scaling2016.pdf) (~7 transactions/s).
- **Gervais, A. et al. (2016).** *On the Security and Performance of Proof of Work Blockchains*. ACM CCS. [eprint.iacr.org/2016/555](https://eprint.iacr.org/2016/555).
- **Eyal, I. & Sirer, E. G. (2014).** *Majority is not Enough: Bitcoin Mining is Vulnerable*. [arxiv.org/abs/1311.0243](https://arxiv.org/abs/1311.0243).
- **Cambridge Centre for Alternative Finance (2025).** *Cambridge Bitcoin Electricity Consumption Index (CBECI) & 2025 Study*. [ccaf.io/cbnsi/cbeci](https://ccaf.io/cbnsi/cbeci) (~138 TWh/an, ~0,5 % de l'électricité mondiale).
- **MIT Digital Currency Initiative.** *51% Attacks*. [dci.mit.edu/projects/51-percent-attacks](https://www.dci.mit.edu/projects/51-percent-attacks).
- **CNIL (2018).** *Blockchain et RGPD : quelles solutions pour un usage responsable en présence de données personnelles ?* [cnil.fr](https://www.cnil.fr/fr/blockchain-et-rgpd-quelles-solutions-pour-un-usage-responsable-en-presence-de-donnees-personnelles).
- **Inspiration visuelle et interactive :** Anders Brownworth, *Blockchain 101 Demo* ([andersbrownworth.com/blockchain/](https://andersbrownworth.com/blockchain/)) ; questionnaire de tests utilisateurs ([Google Forms](https://docs.google.com/forms/d/e/1FAIpQLSdWOe5Z6wL2r4mvUCPZjamTJZX2sr3akOwpV4yEK9PuOTuHjA/viewform)).
