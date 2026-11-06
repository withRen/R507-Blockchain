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
| Version et date de mise à jour | v2.0, 6 novembre 2026 (passage du « Grand Registre » au récit urbain « Le Registre ») |

### Historique de la direction

Le projet a connu deux directions successives. La **v1 « Grand Registre »** (semaines 2 à 4, voir `docs/suivi/`) reposait sur un nuage abstrait de 1 800 cubes instanciés qui se réorganisaient d'une notion à l'autre, sur une interface éditoriale de type livre de comptes. La **v2 « Le Registre »**, présentée en soutenance, raconte les 7 notions à travers une enquête d'une nuit dans un quartier d'affaires, avec des personnages et des décors construits en code.

Ce document décrit la v2. La v1 est documentée comme métaphore écartée (section 2.4), avec les raisons du changement. Les tests utilisateurs menés sur la v1 sont conservés quand leur enseignement a été repris dans la v2, et signalés comme tels.

## 2. Univers visuel et métaphore principale

### 2.1 Public cible et objectif

Le parcours s'adresse à un public étudiant ou grand public qui n'a jamais étudié la blockchain et qui découvre le site seul, sans médiation orale. Il dure environ 10 à 15 minutes, au fil du défilement.

À la fin, l'utilisateur doit retenir :
1. qu'une blockchain est un **registre public de transactions** découpé en **blocs**, et que l'empreinte d'un bloc (**hash**) le résume sans le chiffrer ;
2. que chaque bloc contient le **hash de son parent**, ce qui rend toute modification du passé visible ;
3. qu'aucun serveur central ne détient la vérité : des **nœuds** indépendants gardent chacun une copie et vérifient tout eux-mêmes ;
4. que le droit d'écrire le bloc suivant s'obtient par une dépense vérifiable (**preuve de travail**, **preuve d'enjeu** ou **preuve d'autorité**) et que chaque méthode est un compromis ;
5. qu'un paiement n'est sûr qu'après plusieurs **confirmations**, ce qui protège contre la **double dépense** ;
6. et, en bilan, qu'une blockchain ne remplace pas la confiance partout : elle est lente, coûteuse et sans recours, et ne vaut que là où personne ne peut tenir le registre seul.

### 2.2 Métaphore retenue

**Le Registre** est une enquête qui dure une nuit, de 23 h 47 à 07 h 10, dans un quartier d'affaires.

- **Point de départ, le problème :** Alice Vasseur, auditrice chez Meridian Clearing, découvre que 40 millions ont disparu du registre central de la ville. Un seul administrateur, Gaspard, a les droits d'écriture et rien n'apparaît dans les journaux. Le registre unique est à la fois le coffre et le seul témoin.
- **L'idée :** Inès, experte système, propose que chaque tour de la ville tienne sa propre copie du registre. C'est l'idée de la blockchain, et le reste de la nuit sert à comprendre comment elle tient.
- **Une notion, un lieu, une heure :** chaque séquence se déroule dans un lieu dont la fonction rappelle la notion. La salle des serveurs pour l'intérieur d'un bloc, une passerelle qui relie deux tours pour le chaînage, le bureau de la rivale pour la falsification, la vue aérienne des 14 tours pour le réseau, une ferme de minage au port pour la preuve de travail, la salle du conseil pour le choix d'un consensus, un parking souterrain pour l'attaque cachée.
- **Les tours sont les nœuds :** les 14 tours éclairées du quartier, visibles dès le prologue, deviennent les 14 nœuds du réseau en séquence 4. La ville elle-même porte la décentralisation.
- **Des personnages qui portent les questions :** Alice pose les questions d'un débutant (« Donc c'est chiffré ? »), Inès répond, Mallory Kern incarne l'attaquante, Bob le client qui doit décider quand livrer, Théo le mineur.
- **Distinction métaphore / réalité :** les objets techniques (blocs, hashes, chaînes, nœuds) ne sont jamais des objets du décor. Ils apparaissent comme des hologrammes en verre, avec leurs vraies valeurs calculées, et chaque terme technique est défini dans un encart dédié. Le décor sert le récit, les hologrammes servent la notion.

### 2.3 Justification et limites

| Question | Réponse |
|:---|:---|
| Quelles propriétés deviennent évidentes ? | Le problème que la blockchain résout (un registre unique tenu par une seule personne), la duplication du registre (chaque tour garde une copie), l'absence de centre (Meridian s'éteint et le réseau continue), la propagation de proche en proche (l'onde lumineuse de tour en tour), le coût du minage (une ferme entière d'ASIC), et le fait qu'une attaque se prépare en secret (la chaîne de Mallory au sous-sol). |
| Quelles propriétés sont difficiles à représenter ou risquent d'être déformées ? | 1. Le hash, qui pourrait passer pour du chiffrement. 2. L'échelle réelle : des milliers de nœuds et un nombre astronomique d'essais par bloc, contre 14 tours et quelques milliers d'essais dans le navigateur. 3. Le risque de faire croire que le consensus est un vote à la majorité des nœuds, alors qu'en preuve de travail le poids vient de la puissance de calcul. 4. Le risque que le décor distraie de la notion. |
| Comment ces limites sont-elles compensées ? | Par des calculs réels dans le navigateur (SHA-256 aux séquences 1, 2, 3 et 5, simulation de 100 blocs en séquence 6, formule de Nakamoto en séquence 7), par des répliques qui posent puis corrigent les idées fausses (« Donc c'est chiffré ? Non. »), par les encarts « Le revers » qui donnent les limites réelles, et par la page `sources.html` qui détaille chaque simplification. Pour le décor : une seule matière mate, aucune texture, et des hologrammes très contrastés qui attirent l'œil (section 2.5). |

### 2.4 Métaphores écartées

| Métaphore | Points forts | Pourquoi écartée |
|:---|:---|:---|
| **Le « Grand Registre » abstrait (notre v1) :** 1 800 cubes instanciés qui forment tour à tour une pièce Bitcoin, un bloc, une chaîne et un réseau, sur une interface de livre de comptes | Continuité visuelle forte, excellentes performances (un seul `InstancedMesh`), aucun risque de confondre décor et technique. | Abandonné après les semaines 2 à 4. Sans personnages ni situation, l'utilisateur ne savait pas **pourquoi** on aurait besoin d'une blockchain : la v1 montrait le fonctionnement sans montrer le problème. Les cubes étaient aussi trop interchangeables : un même cube était tour à tour une donnée, un essai de minage et un message réseau, ce qui brouillait le sens de l'unité de base. Le récit donne un enjeu (les 40 millions disparus) et un lieu par notion, ce qui rend chaque séquence mémorisable. Nous en avons gardé les codes couleur, les widgets de calcul réel et le principe du « revers ». |
| **Le coffre-fort / cadenas blindé** | Très familier pour parler de sécurité. | Fait croire que les données sont chiffrées ou secrètes, et qu'elles sont physiquement impossibles à réécrire, alors que tout est public et que la sécurité repose sur le coût d'une réécriture. |
| **Le train de wagons** | Illustre bien l'ordre des blocs. | Un attelage ne dépend pas du contenu du wagon précédent : le lien cryptographique disparaît. Se prête mal au réseau et au minage. |
| **L'usine ou la chaîne de montage** | Dynamique pour montrer le traitement des transactions. | Suggère une entreprise centrale qui pilote l'usine, à l'opposé de la décentralisation. |

### 2.5 Charte visuelle

| Élément | Choix | Justification pédagogique |
|:---|:---|:---|
| Palette et signification des couleurs | Ville de nuit très sombre (fond `#020306`). Couleurs sémantiques réservées aux hologrammes, constantes sur tout le parcours (`COLORS` dans `src/recit/stage.js`) : bleu `#5b74ff` = information / donnée, vert `#35c98a` = valide / confirmé, rouge `#ff4f45` = falsification / chaîne attaquante, orange `#e89a2c` = effort / minage, turquoise `#1fb4ba` = preuve d'enjeu, violet `#8f73ee` = preuve d'autorité, gris `#59616f` = inactif. | La nuit laisse le décor en retrait et fait ressortir les seuls éléments lumineux, qui sont les objets techniques. Un code couleur invariant permet de lire une scène sans légende : du rouge signale toujours une fraude, du vert toujours un état valide. |
| Formes, style et niveau d'abstraction | Deux registres visuels séparés. **Le décor** (ville, bureaux, personnages) est construit en code dans `src/recit/` avec une seule matière mate, sans texture ni modèle externe (`docs/ASSETS.md`). **Les objets techniques** sont des blocs de verre holographiques, avec des faces qui affichent les vraies données, le hash parent, le nonce et le hash calculés. | Séparer nettement le décor (mat, sombre, réaliste) et la technique (verre, lumineux, chiffré) évite de confondre métaphore et réalité : l'utilisateur sait que ce qui brille est ce qu'il faut comprendre. |
| Éclairage et ambiance | Ville éclairée par les fenêtres calculées dans un shader, lumières ponctuelles colorées propres à chaque séquence, tonemapping ACES. L'heure change à chaque séquence et le jour se lève à l'épilogue. | La progression de la nuit vers l'aube matérialise l'avancée de la compréhension, de l'opacité du registre unique au bilan lucide. |
| Typographie et lisibilité | `Roboto` pour les dialogues et l'interface, `IBM Plex Mono` pour les hashes, nonces et compteurs, `Newsreader` pour les titres. Dialogues en bas d'écran (nom du personnage, mention « voix off »), définitions dans un encart séparé, heure et lieu en haut. | La chasse fixe permet de comparer deux hashes caractère par caractère. Séparer dialogue, définition et repère spatio-temporel évite que tout se mélange dans un seul bloc de texte. |
| Échelle et rapport de taille | Personnages à l'échelle humaine, tours d'environ 200 m, blocs holographiques à hauteur de personnage. Pendant les panneaux « À vous », l'objet 3D occupe une moitié de l'écran et le panneau l'autre. | Mettre le bloc à hauteur des personnages en fait un objet qu'on examine, pas un symbole lointain. Le partage d'écran pendant les interactions évite que le panneau cache la scène qu'il pilote. |

## 3. Caméra, espace et navigation

| Question | Réponse et justification |
|:---|:---|
| Caméra libre, guidée ou mixte ? | **Guidée par le défilement, avec une légère parallaxe au pointeur.** Chaque séquence définit une suite de plans de caméra (`CAMERA` dans chaque fichier `sequenceN.js`) interpolés selon la progression du défilement, comme un découpage de film. Une caméra libre ferait perdre les repères à un débutant dans une ville entière. La parallaxe (forte en extérieur, presque nulle en intérieur) donne le volume sans jamais quitter le bon angle. Elle est désactivée si l'utilisateur a demandé à réduire les animations (`prefers-reduced-motion`). |
| Comment l'utilisateur sait-il où regarder ? | Par le cadrage : la caméra s'approche de l'objet qui compte au moment où il est nommé (par exemple, en séquence 1, elle monte couche par couche le long du bloc pendant qu'Inès décrit données, hash parent et nonce). Par la lumière : seuls les hologrammes sont colorés et brillants. Par le texte : la réplique en cours et la définition du terme apparaissent au même moment que l'objet. |
| Organisation spatiale et signification des positions | Chaque notion a son lieu, et les lieux sont répartis dans une même ville cohérente : la tour Meridian (le centre de l'ancien système), la tour Kern en face (la rivale), le port à l'écart (l'industrie du minage). Dans les hologrammes, l'axe horizontal représente toujours l'ordre chronologique des blocs, de gauche à droite. En séquence 7, la chaîne publique est en haut et la chaîne secrète en bas, comme au-dessus et au-dessous du sol. |
| Représentation du temps | Trois échelles. L'heure du récit (affichée en haut, de 23 h 47 à 07 h 10) donne le fil de la nuit. L'ordre gauche-droite des blocs donne le temps de la chaîne. Le temps réel est utilisé là où il porte le sens : la propagation qui arrive plus tard aux tours lointaines (séquence 4) et le chronomètre du vrai mineur (séquence 5). |
| Passage d'une notion à l'autre | Chaque séquence se termine par une question d'un personnage à laquelle la séquence suivante répond (« Et qu'est-ce qui empêche de remplacer tout le bloc ? », « Qui écrit le prochain bloc ? »). Un fondu au noir et un nouvel en-tête heure / lieu marquent le changement. Une mini-chaîne de 9 blocs en bas de l'écran (prologue, 7 notions, épilogue) indique la position, affiche « Notion n/7 » et permet de sauter à n'importe quelle séquence. |

## 4. Fiches des 7 notions obligatoires

### 4.1 — Structure d'un bloc

**Issues liées :** #11, #23  
**Séquence(s) concernée(s) :** Séquence 1, 03 h 05, salle des serveurs de la tour Meridian (`src/recit/sequence1.js`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre qu'un bloc est une page du registre qui regroupe des **données** (les transactions), le **hash du bloc parent** et un **nonce**, et que l'ensemble, passé dans SHA-256, produit le **hash du bloc** : une empreinte de longueur fixe qui change entièrement au moindre caractère modifié.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que le hash chiffre ou cache les données (elles restent publiques), ni qu'une empreinte garantit que l'information est vraie (elle garantit seulement qu'elle n'a pas changé). Ce risque est traité par le récit lui-même : Alice dit « Donc c'est chiffré », Inès répond « Non. Rien n'est caché », et l'encart « Ce que ça ne prouve pas » le précise.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Un bloc de verre holographique en trois couches superposées (Données, Hash du bloc parent, Nonce), d'où sort le hash du bloc au-dessus. | Sépare les trois composants tout en montrant qu'ils forment un seul objet, et place le hash comme un résultat qui sort du bloc, pas comme une partie cachée. |
| Taille et échelle | Bloc à hauteur de personnage, posé au milieu de la salle des serveurs, Alice et Inès autour. | Le bloc devient un objet qu'on examine de près, à l'échelle des personnages. |
| Couleur / matériau / texture | Verre bleu information, faces qui affichent les vraies valeurs en `IBM Plex Mono`, décor de la salle mat et sombre. | Le contraste verre lumineux / décor mat isole l'objet technique. |
| Position | Au centre de la salle, puis décalé à droite quand le panneau « À vous » s'ouvre à gauche. | L'objet reste visible pendant qu'on le manipule. |
| Mouvement / animation | Les couches apparaissent une par une, la caméra monte le long du bloc pendant qu'Inès nomme chaque couche, puis le hash sort par le haut. | L'ordre d'apparition suit l'ordre de l'explication : on voit chaque élément au moment où on l'entend nommé. |
| Interaction et retour visuel | Panneau « À vous : modifiez le bloc » : champ Données (`Alice → Bob : 5 jetons`) et champ Nonce. Le hash est recalculé en vrai SHA-256 à chaque frappe. Un clic sur une couche du bloc 3D affiche sa définition. | L'utilisateur constate seul qu'un caractère change tout le hash, et que le nonce, « un nombre qui ne veut rien dire », change aussi le hash : c'est ce qu'exploiteront les mineurs en séquence 5. |
| Son, si utilisé | Aucun. | Le parcours doit fonctionner sans audio en salle de TP. Tous les retours sont visuels et textuels (`aria-live`). |
| Texte d'accompagnement | Dialogue Alice / Inès, encarts de définition (Bloc, Hash du bloc parent, Nonce, Hash, Empreinte cryptographique, Ce que ça ne prouve pas). Les définitions reprennent celles du glossaire du sujet. | Utiliser exactement les définitions du sujet garantit la conformité à la liste commune. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Hash de 64 caractères recalculé à la frappe | SHA-256 (NIST FIPS 180-4) | **Exacte** (`src/lib/sha256.js`). |
| Trois couches : Données, Hash du bloc parent, Nonce | En-tête Bitcoin de 80 octets (version, hash parent, racine de Merkle, horodatage, cible, nonce) + transactions | **Simplifiée** : version, horodatage et cible omis ; transactions et racine de Merkle regroupées sous « Données ». |
| Un seul passage SHA-256 sur tout le bloc | Double SHA-256 de l'en-tête seulement | **Simplifiée** : les propriétés montrées (sensibilité, irréversibilité) sont les mêmes. |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Afficher dès la séquence 1 les six champs de l'en-tête et l'arbre de Merkle | Surcharge immédiate pour quelqu'un qui découvre la notion de bloc. La précision est donnée dans `sources.html`. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| (Test v1) Des testeurs n'osaient pas modifier le champ, le prenant pour un exemple statique. | Invite explicite conservée dans la v2 : « Remplace 5 par 6 et regarde le hash. » | #18, #19 |
| À compléter : test de la séquence 1 du récit avec au moins 2 personnes extérieures. | | |

#### g) Limites assumées
Le bloc regroupe transactions et racine de Merkle sous « Données » et omet version, horodatage et cible. C'est acceptable car la séquence vise le lien entre contenu, nonce et empreinte, et l'encart « Ce que ça ne prouve pas » signale qu'un vrai bloc contient davantage de champs.

---

### 4.2 — Chaînage cryptographique

**Issues liées :** #12, #23  
**Séquence(s) concernée(s) :** Séquence 2, 03 h 40, passerelle vitrée de la tour Meridian (`src/recit/sequence2.js`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que chaque bloc contient le **hash de son parent**, que ce lien dépend du contenu entier du bloc précédent (et donc, de proche en proche, de toute l'histoire), et qu'une modification rompt le lien avec le bloc suivant.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire que le lien est un simple numéro de page indépendant du contenu (Alice le propose, Inès corrige). Il ne doit pas non plus croire que le chaînage suffit à protéger la chaîne : sans coût, on peut tout recalculer. Ce risque est traité volontairement par l'interaction (voir c) et par l'encart « Le chaînage ne suffit pas ».

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Cinq blocs de verre alignés sur des socles le long de la passerelle, reliés par des liens lumineux. | Reprend le bloc de la séquence 1 et le multiplie : l'utilisateur reconnaît l'objet et voit qu'il en existe une suite. |
| Taille et échelle | Les cinq blocs tiennent dans un même cadre, au-dessus de la ville visible à travers les vitres. | On embrasse les quatre liens d'un regard. |
| Couleur / matériau / texture | Liens et blocs bleus quand tout est cohérent ; un lien rompu et le bloc qui attendait l'ancien hash passent en rouge. | Le rouge désigne exactement l'endroit où le hash parent ne correspond plus. |
| Position | Alignement gauche-droite le long de la passerelle, dans l'ordre chronologique. | La passerelle, qui relie deux tours, est elle-même une image du lien. |
| Mouvement / animation | Les blocs se révèlent un par un de gauche à droite. | L'ordre d'apparition suit l'ordre de la chaîne. |
| Interaction et retour visuel | Panneau « À vous : modifiez le bloc 2 » : modifier le texte rompt le lien 2-3, qui passe au rouge, avec le message « le bloc 3 contient l'ancien hash ». Le bouton « Recopier le nouveau hash dans le bloc suivant » répare un lien à la fois ; la rupture se déplace alors vers le lien suivant, jusqu'à la fin de la chaîne. Une fois tout réparé, le panneau affiche : « Tous les hashes suivants ont dû être recalculés. Sans coût, rien n'empêche de le faire. » | Ce bouton est un choix délibéré : il fait **éprouver** que le chaînage seul ne protège rien, puisque l'utilisateur répare lui-même la chaîne en quelques clics. Cela prépare la question de Mallory en séquence 3 (« Il suffit donc de corriger tous les hashes ») et la réponse de la séquence 5, où chaque bloc coûte des milliers d'essais. |
| Son, si utilisé | Aucun. | Parcours silencieux. |
| Texte d'accompagnement | Dialogue (« Un numéro de page ? Non. Un numéro ne dépend pas du contenu »), encarts Chaînage cryptographique, Empreinte cryptographique, Le chaînage ne suffit pas. | L'encart final renvoie explicitement à la séquence 5. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Champ « hash parent » de chaque bloc égal au hash calculé du précédent | Champ `previousblockhash` de l'en-tête Bitcoin | **Exacte** (hashes réellement calculés). |
| Lien lumineux entre deux blocs | Égalité entre deux valeurs | **Simplifiée** (une relation mathématique matérialisée par un objet). |
| Cinq blocs | Plus de 850 000 blocs sur Bitcoin | **Simplifiée** (échantillon lisible). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Ne pas proposer de réparation, la chaîne restant rouge | Plus simple, mais laisse croire que le chaînage seul rend la falsification impossible. La réparation gratuite pose le vrai problème que la preuve de travail résout. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| À compléter : vérifier qu'un testeur extérieur comprend, après avoir tout réparé, que la protection ne vient pas du chaînage seul. | | |

#### g) Limites assumées
Nous ne représentons pas le chaînage interne des transactions (une entrée qui pointe vers une sortie antérieure), pour ne pas confondre la chaîne des blocs et le graphe des transactions.

---

### 4.3 — Immutabilité et détection de falsification

**Issues liées :** #13, #24  
**Séquence(s) concernée(s) :** Séquence 3, 04 h 15, bureau de Mallory Kern, tour Kern (`src/recit/sequence3.js`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que chacun peut modifier **sa** copie, mais que la modification change le hash du bloc, rompt le lien avec le bloc suivant, et que tous les autres nœuds, en recalculant, voient l'incohérence et gardent leur propre copie. L'immutabilité est pratique, pas physique.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire qu'une blockchain est physiquement infalsifiable (Mallory le croit, la voix off répond « Faux »), ni que le rejet est un vote à la majorité : un seul nœud honnête, en recalculant, détecte la fraude. Il ne doit pas croire non plus que l'immutabilité est toujours une qualité (encart « Le revers » : erreurs, vols, données personnelles, The DAO).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | La même chaîne de cinq blocs qu'en séquence 2, projetée dans le bureau de Mallory, plus une rangée de 14 carrés représentant les 14 copies du réseau. | Garder la même chaîne isole la variable : seule la modification change. |
| Taille et échelle | Identique à la séquence 2. | Continuité visuelle. |
| Couleur / matériau / texture | Le bloc 3 modifié et les liens qui suivent passent au rouge. Dans la rangée de nœuds, le carré de Mallory passe au rouge, les 13 autres restent verts. | On voit en même temps où est la fraude dans la chaîne et qui la détient dans le réseau. |
| Position | Bureau vitré de la tour Kern, en face de Meridian. | Le lieu de la rivale situe l'attaque chez un participant comme les autres, qui détient sa copie « comme tout le monde ». |
| Mouvement / animation | Le rouge progresse d'un maillon à l'autre (cascade). | Montre la relation de cause à effet de gauche à droite. |
| Interaction et retour visuel | Panneau « À vous : falsifiez le bloc 3 » : l'utilisateur remplace 5 par 500 dans la copie de Mallory. Le panneau affiche le nouveau hash du bloc 3, le hash que le bloc 4 attendait, et indique que les 13 autres nœuds gardent leur copie et rejettent celle de Mallory. | L'utilisateur commet lui-même la fraude et constate qu'elle se voit immédiatement, avec les deux hashes sous les yeux. |
| Son, si utilisé | Aucun. | Parcours silencieux. |
| Texte d'accompagnement | Voix off d'Inès sur Mallory, encarts Détection de falsification (« n'importe quel nœud le voit en recalculant »), Immutabilité (définition du sujet), Le revers. | « N'importe quel nœud » corrige l'idée d'un vote. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Hash du bloc 3 qui ne correspond plus au hash parent du bloc 4 | Bloc invalide rejeté par la vérification de chaque nœud | **Exacte** sur la logique. |
| 13 nœuds qui « rejettent » la copie de Mallory | Chaque nœud vérifie seul et ignore les blocs invalides, sans vote | **Simplifiée** (la rangée de 14 carrés peut évoquer un décompte ; le texte précise que chaque nœud vérifie seul). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Faire exploser ou tomber les blocs falsifiés | Spectaculaire mais faux : une modification ne détruit rien, elle produit une empreinte que les autres refusent de reconnaître. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| (Test v1) En défilant vite, des testeurs voyaient la fin de chaîne rouge sans voir que cela partait du bloc 3. | Dans la v2, la falsification est faite par l'utilisateur lui-même dans le panneau, ce qui désigne sans ambiguïté le bloc d'origine. | #13, #19 |
| À compléter : test sur le récit. | | |

#### g) Limites assumées
Ici, Mallory modifie un bloc sans recalculer la suite. Ce qui l'arrête vraiment, c'est l'obligation de refaire la preuve de travail de chaque bloc plus vite que le reste du réseau. C'est la réplique de fin (« Il suffit donc de corriger tous les hashes ») et la réponse est donnée en séquences 5 et 7.

---

### 4.4 — Réseau et décentralisation

**Issues liées :** #14, #25  
**Séquence(s) concernée(s) :** Séquence 4, 04 h 50, vue aérienne du quartier d'affaires (`src/recit/sequence4.js`, `src/recit/city.js`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que le registre est conservé et vérifié par de nombreux **nœuds** indépendants, qu'une transaction se propage **de voisin en voisin** sans arriver partout au même instant, et qu'il n'y a **aucun centre** : retirer un nœud, même le plus important, ne retire pas le registre.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire qu'une entreprise héberge « la » blockchain officielle, ni que le réseau est instantané et parfaitement égalitaire (encart « Le revers » : la production des blocs se concentre dans quelques grands groupes de mineurs). Il ne doit pas croire non plus qu'un attaquant devrait pirater chaque copie : il lui suffirait de produire une chaîne avec plus de travail (séquence 7).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Les 14 tours éclairées du quartier, déjà visibles depuis le prologue, deviennent les 14 nœuds. Des liens lumineux entre tours voisines se révèlent peu à peu et forment un maillage. | Les nœuds ne sont pas un schéma ajouté : c'est la ville du récit, tour Meridian comprise, qui devient le réseau. |
| Taille et échelle | Vue aérienne de tout le quartier ; Meridian a la même taille de nœud que les autres. | Aucun nœud n'est plus important pour le réseau, même la tour de l'ancien registre central. |
| Couleur / matériau / texture | Tours allumées = nœuds actifs, tours coupées éteintes, impulsions lumineuses pour les transactions. | Allumé / éteint se lit sans légende. |
| Position | Caméra au-dessus du quartier de nuit. | La hauteur donne la vue d'ensemble qu'aucun personnage n'a. |
| Mouvement / animation | Une impulsion part d'une tour et se propage le long du graphe ; plus une tour est loin en nombre de sauts, plus l'impulsion arrive tard (parcours en largeur, un délai par saut). Puis Meridian s'éteint et l'impulsion suivante contourne la tour éteinte. | Le délai par saut montre que personne ne reçoit l'information au même moment. Le contournement montre l'absence de centre. |
| Interaction et retour visuel | Panneau « À vous : testez le réseau » : cliquer sur une tour pour la couper, couper la tour Meridian, émettre une transaction depuis une tour au hasard et voir le compteur « Nœuds qui l'ont reçue » (sur 14), tout rallumer. | L'utilisateur peut chercher lui-même à casser le réseau et constater qu'il faut couper beaucoup de tours pour isoler une partie du registre. |
| Son, si utilisé | Aucun. | Parcours silencieux. |
| Texte d'accompagnement | Voix off d'Inès, encarts Nœud, Propagation, Décentralisation, Le revers. | |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Maillage partiel : chaque tour reliée à quelques voisines | Réseau pair-à-pair non structuré, chaque nœud ayant un nombre limité de connexions | **Exacte** sur la topologie. |
| Impulsion qui avance d'un saut à la fois | Diffusion de proche en proche (annonces `inv` / `getdata`) | **Simplifiée** (un seul type de message, délai identique par saut). |
| 14 nœuds | Des milliers de nœuds complets joignables | **Simplifiée** (lisibilité). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Un schéma « étoile vs maillage » avec des icônes d'ordinateurs | Vu partout en 2D, et détaché du récit. Faire de la ville elle-même le réseau, et éteindre la tour Meridian que l'utilisateur connaît depuis le prologue, donne un enjeu à la démonstration. |
| (v1) La pièce Bitcoin qui éclate en 14 nœuds de cubes | Fort visuellement, mais abstrait : la v2 lui préfère un réseau qui a un sens dans l'histoire. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| (Test v1) Le passage de la falsification au réseau paraissait abrupt. | Dans la v2, la transition passe par une question d'Alice (« Si tout le monde a le registre… ») et par le lieu : on sort de la tour Kern pour monter au-dessus du quartier. | #14, #19 |
| À compléter : test sur le récit. | | |

#### g) Limites assumées
Les 14 nœuds ont le même rôle (stocker, vérifier, relayer). La distinction entre nœuds complets, clients légers et mineurs est faite par le texte, et les mineurs sont présentés à part en séquence 5.

---

### 4.5 — Validation et minage

**Issues liées :** #15, #26  
**Séquence(s) concernée(s) :** Séquence 5, 05 h 20, entrepôt du port, ferme de minage (`src/recit/sequence5.js`)

#### a) Objectif pédagogique
> L'utilisateur doit distinguer deux métiers : la **validation** (tous les nœuds vérifient signatures et fonds) et le **minage** (gagner le droit de proposer le bloc suivant). Il doit comprendre que miner consiste à changer le nonce et recalculer le hash jusqu'à passer sous une **cible**, que plus la **difficulté** est élevée plus il faut d'essais, et que trouver est très coûteux alors que vérifier ne prend qu'un hash.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire que les mineurs résolvent des problèmes mathématiques utiles (Alice : « Elles résolvent quoi ? », Théo : « Rien. C'est une loterie. »), ni que seuls les mineurs valident (encart Validation : « tous les nœuds la font »).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Un entrepôt de rangées de machines ASIC avec gaines d'extraction d'air chaud. Au centre, le bloc candidat sur un socle, une matrice de 340 essais et une barre de cible portée par des poteaux gradués. Un grand écran affiche le hash en cours. | Le lieu industriel rend tangible le coût matériel et énergétique du minage. La barre de cible donne une forme simple à « passer sous la cible ». |
| Taille et échelle | Bâtiment de plusieurs mètres de haut, personnages petits devant les rangées de machines. | L'échelle écrase les personnages : le minage est une industrie, pas un geste individuel. |
| Couleur / matériau / texture | Orange pour l'effort et les essais, vert pour l'essai qui passe. | Code couleur constant : orange = effort. |
| Position | Le bloc candidat d'un côté, les essais face à la barre de l'autre. | Sépare l'objet du travail et la loterie. |
| Mouvement / animation | Chaque essai saute à la hauteur que son hash lui donne, selon la vraie loi : chaque zéro de plus en tête est 16 fois plus rare. | Même l'animation suit la distribution réelle. |
| Interaction et retour visuel | Panneau « À vous : prenez la machine » : vrai mineur SHA-256 dans le navigateur, difficulté réglable de 2 à 5 zéros, nonces qui défilent, nombre d'essais et temps. Puis bouton « Vérifier comme un nœud (un seul hash) ». | L'utilisateur ressent le temps qui explose quand on ajoute un zéro, puis constate qu'il suffit d'un seul calcul pour vérifier. C'est l'asymétrie qui rend la falsification chère pour Mallory. |
| Son, si utilisé | Aucun. | Parcours silencieux. |
| Texte d'accompagnement | Dialogue Inès / Théo / Alice, encarts Validation, Récompense et frais, Preuve de travail, Difficulté (« s'ajuste pour garder environ un bloc toutes les 10 minutes »), Le revers (environ 138 TWh par an, Cambridge). | |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Mineur qui teste des nonces jusqu'à obtenir `d` zéros en tête | Preuve de travail Bitcoin : `SHA256(SHA256(en-tête)) <= cible` | **Exacte** sur le principe (probabilité `1/16^d`). |
| Difficulté de 2 à 5 zéros | Cible ajustée tous les 2 016 blocs, aujourd'hui une vingtaine de zéros hexadécimaux | **Simplifiée** pour qu'un navigateur trouve en quelques secondes. |
| Hauteur des sauts | Distribution du nombre de zéros en tête d'un hash uniforme | **Exacte**. |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Simuler le minage avec un délai factice | Aurait trahi l'objectif : faire calculer de vrais SHA-256 prouve pourquoi la difficulté fait exploser le temps. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| (Test v1) Les testeurs ne réalisaient pas que tous les essais précédents étaient jetés. | Repris dans la v2 : après chaque bloc trouvé, le panneau affiche « Les X autres essais ont été jetés, avec l'énergie qu'ils ont coûtée ». | #15, #19 |
| À compléter : test sur le récit. | | |

#### g) Limites assumées
La récompense et les frais sont expliqués par le texte, pas représentés en 3D. L'extra nonce et le détail de la cible `nBits` sont omis, pour garder l'interaction centrée sur le lien entre difficulté, nombre d'essais et énergie.

---

### 4.6 — Comparaison d'au moins deux mécanismes de consensus

**Issues liées :** #16, #27  
**Séquence(s) concernée(s) :** Séquence 6, 06 h 00, salle du conseil de la tour Meridian (`src/recit/sequence6.js`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre qu'il existe plusieurs façons de décider qui écrit le bloc suivant, par la puissance de calcul (**PoW**), par une mise bloquée (**PoS**) ou par une liste de signataires autorisés (**PoA**), que chacune repose sur une ressource différente, et qu'aucune n'est la meilleure partout.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire que toutes les blockchains consomment autant que Bitcoin, ni qu'un consensus est parfait. La PoS donne plus de poids au capital, la PoA réintroduit la confiance envers quelques signataires (Inès : « on sort à peine de chez Meridian »).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Trois hologrammes posés sur des socles projecteurs autour de la table du conseil, cinq participants A à E chacun : PoW en tours d'énergie proportionnelles à la puissance, PoS en piles de jetons proportionnelles à la mise, PoA en piliers pour les trois signataires autorisés et socles bas pour les deux exclus. | La forme dit la ressource : des machines, de l'argent bloqué, un statut. |
| Taille et échelle | Même échelle pour les trois ; parts de départ communes : A 40 %, B 25 %, C 15 %, D 12 %, E 8 %. | Comparer à ressources égales isole l'effet de la règle. |
| Couleur / matériau / texture | Orange (PoW), turquoise (PoS), violet (PoA), gris pour les exclus. | Les mêmes couleurs dans la scène, les barres de résultat et le tableau. |
| Position | Les trois côte à côte sur la table, face à la caméra. | Comparaison d'un seul regard. |
| Mouvement / animation | Seule la PoW s'agite en permanence ; PoS et PoA restent calmes. | Montre sans un mot pourquoi seule la PoW consomme en continu. |
| Interaction et retour visuel | Panneau « À vous : produisez 100 blocs » : simulation de 100 blocs avec chaque méthode (tirage pondéré par la puissance en PoW, tirage pondéré avec réinvestissement des gains en PoS, tour de rôle entre A, B et C en PoA), barres de résultat et phrase de synthèse. Tableau comparatif : ressource, énergie, ouverture, ce que coûte la triche, limite. | La simulation fait apparaître deux effets : en PoS, A dépasse souvent sa part parce qu'il réinvestit ; en PoA, D et E n'écrivent jamais. |
| Son, si utilisé | Aucun. | Parcours silencieux. |
| Texte d'accompagnement | Débat entre personnages, chacun défendant une méthode ; encarts Consensus, PoW, PoS, PoA (avec avantage et limite pour chacun), Pas de meilleur absolu. | Faire porter chaque méthode par un personnage différent rend la comparaison vivante et contradictoire. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| PoW agitée, PoS et PoA calmes | Hachage continu contre sélection par créneaux (Ethereum) ou tour de rôle (Clique) | **Exacte** sur le contraste énergétique (environ 99,95 % d'écart après le passage d'Ethereum à la PoS). |
| Simulation de 100 blocs | Probabilité proportionnelle à la puissance, à la mise, rotation des signataires | **Simplifiée** (parts d'exemple, effet de réinvestissement amplifié pour être visible sur 100 blocs). |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Comparer seulement PoW et PoS, dans deux séquences séparées | Empêche la comparaison d'un regard, et omet la PoA, fréquente dans les réseaux privés où l'ouverture est sacrifiée à la vitesse. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| (Test v1) Les testeurs ne comprenaient pas pourquoi A gagnait plus en PoS qu'en PoW. | Phrase de synthèse conservée dans la v2 : « A a écrit X blocs en PoW et Y en PoS, parce qu'il réinvestit ses gains. En PoA, D et E n'écrivent jamais. » | #16, #19 |
| À compléter : test sur le récit. | | |

#### g) Limites assumées
Le slashing (perte de la mise d'un tricheur) est dit dans l'encart PoS mais pas représenté, et les comités d'attestation d'Ethereum ne sont pas détaillés, pour garder la question centrale : qui écrit, et selon quelle règle.

---

### 4.7 — Cycle de vie d'une transaction et scénario d'attaque illustré

**Issues liées :** #17, #28  
**Séquence(s) concernée(s) :** Séquence 7, 06 h 40, parking souterrain de la tour Kern (`src/recit/sequence7.js`)

#### a) Objectif pédagogique
> L'utilisateur doit comprendre les étapes d'un paiement (création et signature, propagation et validation, attente dans le mempool, inclusion dans un bloc, confirmations successives), et pourquoi il faut attendre plusieurs blocs : un attaquant peut miner en secret une autre histoire où il récupère son paiement (**double dépense**), puis la dévoiler si elle représente plus de travail.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas croire qu'un paiement est acquis dès qu'il apparaît, ni que l'attaque à 51 % est un seuil tout ou rien : avec 30 % de la puissance, Mallory a encore des chances si Bob attend peu (le panneau le dit : « Pas de seuil magique à 51 % »). Il ne doit pas croire non plus que l'attaquant peut voler n'importe qui (encart « Les limites de l'attaque » : elle ne peut annuler que ses propres paiements récents).

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Un hologramme central encadré par un portique : la chaîne publique en haut, la chaîne secrète de Mallory en bas. Une salle d'attente (mempool) où flottent des transactions, celle d'Alice en bleu. Au fond du parking, les machines cachées de Mallory, en rouge. | La chaîne secrète se mine littéralement « sous » la chaîne publique, dans un sous-sol : le lieu dit que l'attaque est invisible. |
| Taille et échelle | Les deux chaînes partent d'un ancêtre commun (le bloc 4) ; le paiement de Mallory à Bob est dans le bloc 5 de la chaîne publique. | Le point de bifurcation est visible : tout ce qui suit le bloc 4 peut être remplacé. |
| Couleur / matériau / texture | Chaîne publique verte, chaîne secrète rouge, transaction d'Alice en bleu dans le mempool. | Couleurs constantes : vert = valide, rouge = attaque, bleu = donnée. |
| Position | Publique en haut, secrète en bas. | Superposition des deux histoires concurrentes. |
| Mouvement / animation | La transaction d'Alice traverse les étapes (signée, propagée, en attente, dans un bloc), puis les blocs s'empilent et un compteur affiche le nombre de confirmations. Ensuite, la chaîne secrète s'allonge en bas. | L'empilement montre ce qu'est une confirmation ; la course montre la double dépense. |
| Interaction et retour visuel | Panneau « À vous : décidez pour Bob » : calculateur fondé sur la formule de la section 11 du livre blanc de Nakamoto (`attackerSuccessProbability` dans `src/lib/blockchain.js`). Deux curseurs : puissance de Mallory de 5 à 60 % (30 % par défaut) et blocs attendus par Bob de 1 à 12 (6 par défaut). Au-delà de 50 %, le panneau affiche 100 % et explique qu'elle finit toujours par rattraper la chaîne publique. | L'utilisateur prend la décision de Bob et voit le risque baisser à chaque bloc attendu et monter avec la puissance de Mallory. Par exemple, à 10 % de puissance, le risque passe de 20 % pour 1 bloc à 0,02 % pour 6 blocs ; à 30 %, il reste de 13 % à 6 blocs et descend à 2,4 % à 12 blocs. |
| Son, si utilisé | Aucun. | Parcours silencieux. |
| Texte d'accompagnement | Explication du cycle de vie par Inès, scène Bob / Alice / Mallory, encarts Clé privée et signature, Mempool, Confirmation, Double dépense, Réorganisation (« la chaîne qui représente le plus de travail cumulé »), Les limites de l'attaque. | |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Étapes signature, propagation, mempool, bloc, confirmations | Cycle d'une transaction Bitcoin (signature ECDSA ou Schnorr, diffusion P2P, mempool trié par frais, minage, confirmations) | **Exacte** sur l'ordre des étapes. |
| Chaîne secrète adoptée si elle représente plus de travail | Réorganisation selon la règle du travail cumulé | **Exacte**. |
| Calculateur | Formule de Poisson de Nakamoto, section 11 | **Exacte** (valeurs identiques au tableau du livre blanc). |
| Une seule salle d'attente | Chaque nœud a son propre mempool | **Simplifiée**. |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Illustrer une attaque par vol de la clé privée d'Alice | Relève de la sécurité informatique générale (hameçonnage, logiciel malveillant) et ne montre rien de propre à la blockchain, contrairement à la double dépense par course de chaînes. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| (Test v1) Des testeurs ne comprenaient pas pourquoi la chaîne rouge devenait la chaîne officielle. | Dans la v2, la règle est donnée par l'encart Réorganisation et par la voix off (« elle dévoile une chaîne qui représente plus de travail. Les nœuds basculent »). | #17, #19 |
| À compléter : test sur le récit, en particulier la lecture du calculateur. | | |

#### g) Limites assumées
La signature est expliquée par le texte et un encart, sans visualiser la cryptographie à clé publique. Le scénario suppose que Mallory contrôle une part notable de la puissance de calcul, ce qui sur Bitcoin représenterait une installation bien plus grande qu'un parking ; c'est une licence narrative, signalée dans `sources.html`.

---

## 5. Cohérence globale

| Question | Réponse |
|:---|:---|
| Les codes visuels sont-ils constants ? | **Oui.** Bleu = information, vert = valide ou confirmé, rouge = falsification ou attaque, orange = effort de minage, turquoise = enjeu, violet = autorité, sur les 7 séquences. Le décor reste toujours mat et sombre ; seuls les objets techniques brillent. |
| Un même élément est-il représenté de la même façon partout ? | **Oui pour les objets techniques :** un bloc est toujours un bloc de verre à faces chiffrées, une chaîne toujours une suite de blocs de gauche à droite, un nœud toujours une tour du quartier. **Point à surveiller :** les transactions d'exemple varient d'une séquence à l'autre (Alice vers Bob, puis Bob vers Mallory, puis Mallory vers Bob), et le récit utilise « jetons » à la fois pour l'ancien registre central et pour la blockchain. |
| L'ordre des séquences est-il progressif ? | **Oui.** Le prologue pose le problème du registre unique. On entre dans un bloc (1), on en relie plusieurs (2), on teste leur solidité (3), on élargit à ceux qui détiennent les copies (4), on voit comment on gagne le droit d'écrire (5) et quelles autres règles existent (6), puis on suit un paiement face à une attaque (7). L'épilogue fait le bilan honnête. Chaque séquence se termine par la question à laquelle la suivante répond. |
| Quelle notion est la moins bien représentée ? | **Le mempool** (notion 7) : il est montré comme une salle d'attente unique, alors que chaque nœud a le sien, et il passe vite au milieu d'une séquence très dense. Plus largement, la séquence 7 concentre trop de texte avant l'interaction. |
| Quelle décision reverriez-vous avec une semaine de plus ? | **L'équilibre lecture / action.** Dans chaque séquence, le dialogue est lu en entier avant que le panneau « À vous » s'ouvre. Avec plus de temps, nous découperions les explications longues en étapes où chaque phrase déclenche une manipulation, pour que l'utilisateur agisse avant qu'on lui explique le résultat. Nous aurions aussi changé de direction plus tôt : le passage du Grand Registre au récit urbain a coûté plusieurs semaines. |

## 6. Rôle de l'IA générative

Conformément aux consignes, nous déclarons l'usage des outils d'IA générative et le contrôle exercé par le groupe :
- **Collecte documentaire et structuration initiale :** Claude (Claude Code) a été utilisé en semaines 1 et 2 pour structurer le dépôt, générer les issues initiales et aider à synthétiser la fiche de recherche (`docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md`). Toutes les sources primaires (livre blanc de Nakamoto, documentation Bitcoin et Ethereum, NIST, CNIL, Cambridge) ont été ouvertes, lues et vérifiées le 13 octobre 2026.
- **Erreurs et dérives détectées et corrigées par le groupe :**
  1. *Sources douteuses écartées :* une première ébauche citait des prépublications non vérifiées et une revue peu fiable (`ijnrd.org`) ; elles ont été rejetées au profit de sources primaires.
  2. *Dates obsolètes :* les montants de récompense de bloc de la documentation Bitcoin dataient de 2017 ; nous ne citons pas de montant fixe.
  3. *Direction artistique :* nous avons écarté les propositions génériques d'interface sombre et néon des sites crypto. La v1 a adopté un livre de comptes papier, puis la v2 un récit urbain nocturne où le décor reste mat et où seuls les objets techniques brillent.
  4. *Relecture du scénario :* une relecture critique assistée par IA (Claude, Gemini) a relevé des formulations risquées dans les dialogues (par exemple la probabilité de réussite de Mallory à six confirmations). Chaque remarque a été vérifiée par le groupe, notamment en relançant la formule de Nakamoto du projet.
- **Développement 3D et intégration (Antigravity et Claude Code) :** aide à la génération de la ville et de ses shaders (`src/recit/city.js`), des personnages (`src/recit/figure.js`), des séquences et des widgets pédagogiques. Tout le code a été relu, compris et testé par Rahim Tamhaev et Nicolas Rapuzzi.

## 7. Sources

L'intégralité des sources vérifiées, classées par séquence avec les notes de simplification, est consultable dans la page [`sources.html`](../sources.html) et dans [`docs/MMI-R507-projet-blockchain-FICHE-RECHERCHE.md`](MMI-R507-projet-blockchain-FICHE-RECHERCHE.md) :

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
