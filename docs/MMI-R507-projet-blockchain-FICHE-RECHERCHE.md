# Blockchain : fiche de recherche R507

Rahim, 13 octobre 2026

## Comment lire cette fiche

Cette fiche explique les 7 notions de votre projet avec **Bitcoin comme modèle de référence** (notions 1 à 5 et 7) et **Ethereum pour comparer PoS et PoA** (notion 6), car ce sont les deux systèmes les mieux documentés. Chaque affirmation a été vérifiée dans une source primaire listée en fin de document.

**L'idée centrale en une phrase :** le hash relie les blocs entre eux, la preuve de travail rend leur réécriture très coûteuse, le réseau retient la chaîne qui représente le plus de travail, et chaque nouveau bloc rend l'annulation d'une transaction de moins en moins probable.

Chaque notion suit le même schéma, pour nourrir directement les parties a, b et d de vos fiches de `CHOIX-MODELISATION.md` :

- **À comprendre** : ce que l'utilisateur doit retenir (partie a).
- **À ne pas comprendre** : les fausses idées à éviter (partie b).
- **Fidélité** : ce qui est exact, simplifié ou approximatif (partie d).

Un point de vocabulaire à fixer dès le départ : Bitcoin fonctionne avec des **sorties non dépensées** (UTXO, des morceaux de monnaie qui passent de transaction en transaction), alors qu'Ethereum fonctionne avec des **comptes** qui ont un solde. Pour votre scénario avec Alice, Bob et Carol, choisissez un seul des deux modèles et gardez-le partout.

## 1. Structure d'un bloc

Un bloc est un lot de transactions accompagné d'une fiche d'identité de 80 octets, l'**en-tête**, qui contient entre autres le lien vers le bloc précédent.

| Champ de l'en-tête | Taille | Rôle en langage simple |
|---|---|---|
| Version | 4 octets | Quel jeu de règles de validation s'applique |
| Hash du bloc précédent | 32 octets | Le lien vers le parent |
| Racine de Merkle | 32 octets | Une empreinte unique qui résume toutes les transactions du bloc |
| Heure (time) | 4 octets | Moment où le mineur a commencé à calculer |
| Cible (nBits) | 4 octets | Le seuil que le hash du bloc doit respecter |
| Nonce | 4 octets | Le nombre que le mineur fait varier pour obtenir un hash valide |

Le **corps** du bloc contient le nombre de transactions puis les transactions elles-mêmes. La première est toujours la transaction **coinbase** : elle crée la récompense du mineur (voir notion 5) et contient un champ de données libres, jusqu'à 100 octets, que les mineurs exploitent aussi comme extra nonce.

**Le hash du bloc** est l'empreinte calculée sur l'en-tête, pas sur le corps entier. Le corps est quand même protégé : la racine de Merkle, incluse dans l'en-tête, change dès qu'une transaction change.

**La racine de Merkle** se construit en hachant les transactions deux par deux, puis les résultats deux par deux, jusqu'à obtenir une seule empreinte. Si le nombre est impair, la dernière est associée à une copie d'elle-même. Intérêt : prouver qu'une transaction est dans le bloc ne demande que les hashes de sa branche, soit environ log2(n) hashes pour n transactions. L'exemple de la documentation (5 transactions supposées de taille maximale : 3 hashes et l'en-tête, environ 140 octets, au lieu de plus de 500 000 octets) est un cas très favorable : avec des transactions ordinaires de quelques centaines d'octets, l'économie sur 5 transactions reste modeste. Elle devient massive sur un bloc proche de 1 Mo, limite citée par la documentation : une preuve d'environ 12 hashes de 32 octets plus l'en-tête de 80 octets (calcul fait ici pour quelques milliers de transactions) pèse environ 460 octets, soit un gain supérieur à un facteur 1 000.

### À comprendre

- Un bloc contient des données (les transactions) et des liens (le hash parent).
- Le hash est une empreinte de longueur fixe : si une seule information change, l'empreinte change complètement.
- Le nonce n'a aucun sens en soi : c'est un nombre de bricolage qui sert à modifier l'empreinte.

### À ne pas comprendre

- Que le hash est un cadenas ou un chiffrement : il ne cache rien, les transactions restent lisibles.
- Que le bloc contient son propre hash : l'en-tête du bloc suivant le contient, pas le bloc lui-même.
- Que le nonce est un code secret ou un mot de passe.

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| Données, hash parent, nonce, hash dans le bloc | En-tête de 6 champs + corps | Simplifiée (version, heure et cible omis ou regroupés) |
| Un seul hash affiché | Bitcoin applique SHA-256 deux fois de suite sur l'en-tête | Simplifiée |
| Racine de Merkle représentée comme une pile de hashes | Arbre binaire de hashes | Exacte si l'arbre est montré, approximative si seulement un résumé. Avec un nombre impair de transactions (3 ou 5 dans une démo), la dernière est dupliquée : à annoter visuellement comme une copie technique, sinon elle peut dérouter les testeurs |
| Hauteur du bloc | Déduite de la position dans la chaîne, absente de l'en-tête (elle figure dans la transaction coinbase depuis BIP34) | Approximative si dessinée dans l'en-tête |

Sources : [Bitcoin Developer Reference, Block Chain](https://developer.bitcoin.org/reference/block_chain.html) ; [Bitcoin Developer Guide, Block Chain](https://developer.bitcoin.org/devguide/block_chain.html) ; [whitepaper, sections 3 et 7](https://bitcoin.org/bitcoin.pdf).

## 2. Chaînage cryptographique

Chaque en-tête contient le hash de l'en-tête du bloc précédent : modifier un bloc change son hash, et ce nouveau hash ne correspond plus à celui que le bloc suivant a enregistré.

Le principe vient de l'horodatage : chaque horodatage inclut le précédent dans son propre calcul, ce qui forme une chaîne où chaque maillon renforce ceux d'avant.

```text
Bloc N-1  ->  son hash = H1
Bloc N    ->  contient H1, son hash = H2
Bloc N+1  ->  contient H2, son hash = H3
```

Résultat : on ne peut pas toucher à un bloc sans toucher à tous les suivants. Le coût de modification d'un bloc augmente à chaque bloc ajouté après lui.

Il existe un **second chaînage**, distinct du premier : les transactions se référencent entre elles, car l'entrée d'une transaction est la sortie d'une transaction précédente. Il y a donc deux chaînes (blocs et transactions), à ne pas confondre.

### À comprendre

- Chaque bloc "porte l'empreinte" du précédent, comme un sceau qui dépend du contenu.
- Casser un maillon casse visiblement tous les liens qui suivent.
- Le lien est vérifiable par n'importe qui, sans faire confiance à personne : il suffit de recalculer le hash.

### À ne pas comprendre

- Que le lien est un simple pointeur ou un numéro de page : c'est une empreinte du contenu, donc elle change si le contenu change.
- Que le chaînage suffit à lui seul à protéger la chaîne : un attaquant peut recalculer tous les hashes. Ce qui l'en empêche, c'est le travail exigé par bloc (notions 3 et 5).
- Que le hash "verrouille" ou chiffre les données.

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| Un fil ou une chaîne reliant le hash parent d'un bloc au hash du précédent | Champ "hash du bloc précédent" dans l'en-tête | Exacte (la relation) |
| Une chaîne physique qui se brise | Un hash qui ne correspond plus | Simplifiée : dans la réalité, rien ne se brise, le contrôle est un recalcul |
| Hash raccourci à quelques caractères | Hash de 256 bits | Simplifiée |

Sources : [Bitcoin Developer Guide, Block Chain](https://developer.bitcoin.org/devguide/block_chain.html) ; [whitepaper, section 3](https://bitcoin.org/bitcoin.pdf).

## 3. Immutabilité et détection de falsification

Une blockchain n'est pas "impossible à modifier" : toute modification est **immédiatement détectable**, et la faire accepter par le réseau coûte de plus en plus cher à chaque bloc ajouté.

Ce qui se passe si quelqu'un modifie une transaction du bloc *i* :

1. Le contenu du bloc change, donc sa racine de Merkle change.
2. L'en-tête change, donc son hash change.
3. Le bloc *i+1* contient l'ancien hash : le lien ne correspond plus.
4. Le hash modifié ne respecte probablement plus la cible : la preuve de travail du bloc *i* est invalide.
5. Pour être accepté, l'attaquant doit refaire le travail du bloc *i* et de tous les suivants, puis rattraper et dépasser les nœuds honnêtes.

Il faut distinguer deux choses. La **détection** est instantanée et gratuite : n'importe quel nœud recalcule les hashes. Le **coût de réécriture** est ce qui rend la fraude peu rentable : la vérification d'une preuve de travail ne demande qu'un seul hash, alors que la produire demande des millions d'essais.

Le whitepaper chiffre la course entre l'attaquant et le réseau honnête. Avec 10 % de la puissance de calcul, la probabilité qu'il rattrape son retard est d'environ 0,02 % quand 6 blocs ont été ajoutés après la transaction. Avec 30 %, elle reste à environ 18 % après 5 blocs et passe sous 0,1 % après 24 blocs.

Dernier point souvent oublié : même si l'attaquant gagne la course, il ne peut ni créer de l'argent de nulle part, ni prendre des fonds qui ne lui appartiennent pas. Il peut seulement tenter d'annuler **ses propres paiements récents**.

### À comprendre

- Falsifier un bloc se voit tout de suite : le lien avec le bloc suivant est rompu.
- Plus un bloc est ancien, plus il est protégé, car plus de travail a été empilé dessus.
- La sécurité vient du coût de réécriture, pas d'un coffre-fort.

### À ne pas comprendre

- Que les données sont physiquement impossibles à changer : un attaquant disposant de beaucoup de puissance de calcul peut réécrire des blocs récents.
- Qu'un attaquant peut tout faire (voler n'importe quel compte, créer de la monnaie) : les nœuds rejettent les transactions invalides, quoi que contienne la chaîne de l'attaquant.
- Que la détection est lente ou nécessite un contrôleur central.

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| Un bloc modifié devient rouge, les suivants aussi, en cascade | Les liens des blocs suivants ne correspondent plus au hash recalculé | Exacte (la logique de cascade) |
| Une barre "travail à refaire" qui grandit avec le nombre de blocs | Travail de preuve à refaire pour chaque bloc suivant | Simplifiée (coût en probabilité, pas en temps fixe) |
| Attaquant seul face à un réseau | Course entre puissances de calcul | Simplifiée (l'issue dépend de la part de puissance de chacun) |

Sources : [whitepaper, sections 4 et 11](https://bitcoin.org/bitcoin.pdf) ; [Bitcoin Developer Guide, Proof Of Work](https://developer.bitcoin.org/devguide/block_chain.html).

## 4. Réseau et décentralisation

Chaque nœud complet garde sa propre copie de la chaîne et vérifie lui-même chaque bloc : personne ne "tient" le registre à la place des autres, et le réseau s'accorde en suivant des règles communes.

Le whitepaper décrit le fonctionnement du réseau en six étapes :

1. Les nouvelles transactions sont diffusées à tous les nœuds.
2. Chaque nœud mineur les rassemble dans un bloc.
3. Chaque nœud mineur cherche la preuve de travail de son bloc.
4. Celui qui la trouve diffuse son bloc.
5. Les nœuds n'acceptent le bloc que si toutes ses transactions sont valides et pas déjà dépensées.
6. Ils montrent leur accord en construisant le bloc suivant à partir du hash de celui qu'ils viennent d'accepter.

Dans le whitepaper, "nœud" désigne un nœud qui mine ; aujourd'hui, les nœuds complets vérifient et relaient, et seuls les mineurs cherchent la preuve de travail. La diffusion est tolérante : une transaction n'a pas besoin d'atteindre tous les nœuds pour finir dans un bloc, et un nœud qui a raté un bloc le réclame en recevant le suivant. Les nœuds peuvent quitter et rejoindre le réseau à tout moment.

**Quelle chaîne est la bonne ?** Les nœuds suivent la chaîne qui représente le plus de travail cumulé (le whitepaper dit "la plus longue", la documentation développeur précise "la plus difficile à recréer"). Le nombre brut de blocs ne suffit pas, car chaque bloc peut représenter une difficulté différente. Si deux mineurs trouvent un bloc presque en même temps, le réseau se scinde brièvement en deux branches (un **fork**) : chaque nœud travaille sur la première branche reçue et garde l'autre en réserve. Dès qu'un nouveau bloc allonge l'une des deux, tout le monde bascule sur la plus lourde et les blocs de l'autre branche sont abandonnés.

**Pourquoi pas un nœud, un vote ?** Parce qu'une personne pourrait créer des milliers de nœuds pour peser davantage. La preuve de travail ramène le vote à "un processeur, un vote" : le poids vient de la puissance de calcul dépensée, pas du nombre d'identités.

### À comprendre

- Il n'y a pas de serveur central : des milliers de copies indépendantes se vérifient mutuellement.
- Quand une copie diffère, les règles du protocole permettent de savoir laquelle suivre.
- Un désaccord temporaire (fork) est normal et se résout tout seul.

### À ne pas comprendre

- Que la vérité est décidée par le plus grand nombre de nœuds : en preuve de travail, c'est le plus de travail cumulé.
- Que tous les nœuds voient le même état au même instant : il existe des délais de propagation et des forks temporaires.
- Que la décentralisation signifie qu'il n'y a aucune règle : les règles de consensus sont strictes et identiques pour tous.

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| Quelques nœuds (5 à 8) reliés entre eux, chacun avec sa copie de la chaîne | Des milliers de nœuds qui ne sont pas tous connectés entre eux | Simplifiée |
| Un message qui voyage de nœud en nœud | Diffusion de proche en proche, sans garantie de livraison à tous | Exacte (le principe) |
| Deux branches qui se séparent puis une qui l'emporte | Fork résolu au bloc suivant | Exacte |
| Tous les nœuds identiques et honnêtes | Certains nœuds peuvent être hors ligne ou malveillants | Simplifiée, à compléter par la notion 7 |

Sources : [whitepaper, sections 4 et 5](https://bitcoin.org/bitcoin.pdf) ; [Bitcoin Developer Guide, Block Height And Forking](https://developer.bitcoin.org/devguide/block_chain.html).

## 5. Validation et minage

**Valider** consiste à vérifier que les règles sont respectées ; **miner** consiste à prouver qu'on a dépensé du travail pour avoir le droit de proposer le prochain bloc. Ce sont deux rôles distincts.

**La validation** est faite par tous les nœuds, pas seulement par les mineurs. Une transaction est valide si elle n'utilise que des sorties non dépensées, si elle est correctement signée, et si ses sorties ne dépassent pas ses entrées. Si les entrées dépassent les sorties, la différence est un frais de transaction réclamé par le mineur. Un bloc n'est accepté que si toutes ses transactions passent ces contrôles.

**Le minage (preuve de travail)** consiste à trouver un **nonce** tel que le hash de l'en-tête soit inférieur ou égal à la **cible**. Comme un hash est imprévisible, la seule méthode est d'essayer : nonce 0, puis 1, puis 2, et ainsi de suite.

```text
hash(en-tête, nonce = 12)  ->  A8F2...  trop grand, raté
hash(en-tête, nonce = 13)  ->  00B7...  sous la cible, bloc valide
```

Exemple de la documentation : si la cible vaut la moitié de la valeur maximale d'un hash, on réussit en moyenne un essai sur deux. Plus on abaisse la cible, plus il faut d'essais en moyenne. Quand les 2^32 valeurs du nonce sont épuisées, le mineur modifie l'heure ou le champ de données de la transaction coinbase (le mécanisme dit d'extra nonce), ce qui change la racine de Merkle, et repart.

**La difficulté** est ajustée automatiquement tous les 2 016 blocs. Le réseau compare le temps réellement écoulé à l'objectif de deux semaines (1 209 600 secondes), ce qui correspond à environ un bloc toutes les 10 minutes. Si les blocs sont allés trop vite, la difficulté augmente (jusqu'à 300 %). S'ils sont allés trop lentement, elle diminue (jusqu'à 75 %).

**La récompense** : la première transaction du bloc crée de nouvelles pièces pour le mineur, plus les frais des transactions incluses. Dans Bitcoin, cette récompense de bloc était de 50 bitcoins au départ et est divisée par deux tous les 210 000 blocs. Sans cette incitation, personne n'aurait de raison de dépenser de l'électricité.

### À comprendre

- Trouver un hash sous la cible demande beaucoup d'essais ; vérifier la preuve de travail demande un seul hash. La validation complète du bloc demande en plus de revérifier toutes ses transactions.
- Il n'y a pas de raccourci : le travail ne peut pas être "deviné", c'est ce qui le rend crédible.
- Le réseau règle lui-même la difficulté pour garder un rythme régulier, même si plus de machines rejoignent le minage.
- Un mineur est payé en pièces nouvelles et en frais, ce qui l'encourage à suivre les règles.

### À ne pas comprendre

- Que les mineurs résolvent un problème mathématique profond : c'est une loterie de hashes, sans intelligence particulière.
- Que seuls les mineurs valident : tous les nœuds revérifient chaque bloc.
- Que le minage est gratuit ou instantané, ou qu'un bloc plus "difficile" est un bloc plus gros.
- Que le nonce est un secret du mineur : il est public, dans l'en-tête.

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| Hash qui doit commencer par un nombre de zéros | Le hash doit être numériquement inférieur ou égal à la cible (les zéros en tête en sont la conséquence visible) | Simplifiée |
| Difficulté réglée par un curseur (1 à 5 zéros) | Cible encodée sur 32 bits, ajustée tous les 2 016 blocs | Simplifiée, acceptable pour une démo interactive |
| Compteur d'essais qui défile | Un très grand nombre d'essais par seconde sur le réseau réel, sans commune mesure avec une démo | Approximative (échelle) |
| Récompense au mineur en haut du bloc | Transaction coinbase en première position | Exacte |

Sources : [whitepaper, sections 4 et 6](https://bitcoin.org/bitcoin.pdf) ; [Bitcoin Developer Guide, Proof Of Work](https://developer.bitcoin.org/devguide/block_chain.html) ; [Bitcoin Developer Reference, Block Chain](https://developer.bitcoin.org/reference/block_chain.html).

Complément sur l'extra nonce : [Bitcoin Developer Guide, Mining](https://developer.bitcoin.org/devguide/mining.html).

## 6. Comparaison des mécanismes de consensus

Les trois mécanismes répondent à la même question, "qui a le droit d'écrire le prochain bloc ?", avec trois ressources différentes : du **calcul**, de l'**argent bloqué en garantie**, ou une **identité reconnue**.

| Critère | Preuve de travail (PoW), Bitcoin | Preuve d'enjeu (PoS), Ethereum | Preuve d'autorité (PoA), Clique |
|---|---|---|---|
| Qui propose le bloc | Le mineur qui trouve un nonce valide, par loterie de calcul | Un validateur tiré au hasard à chaque créneau de 12 secondes | Un signataire autorisé, à tour de rôle |
| Ressource engagée | Puissance de calcul et électricité | ETH déposés en garantie (32 ETH pour devenir validateur) | Réputation et identité connue |
| Qui contrôle | Tous les nœuds, avec un seul hash | Des comités de validateurs qui votent (attestations) | Les signataires autorisés |
| Sanction de la triche | Travail et électricité gaspillés, bloc rejeté | Destruction d'une partie ou de la totalité de la mise (slashing) | Retrait de l'autorisation par vote des autres signataires |
| Fork : quelle branche suivre | Celle qui a le plus de travail cumulé | Celle qui a le plus de poids d'attestations | Celle qui a le plus de blocs signés "à son tour" |
| Annuler un bloc ancien | De plus en plus improbable avec les confirmations | Bloc "finalisé" quand les deux tiers de la mise totale valident ; l'annuler détruirait au moins un tiers de la mise totale | Possible si des signataires malveillants s'entendent, atténué mais pas supprimé |
| Énergie | Élevée | Faible | Faible |
| Nombre de participants | Ouvert à tous | Ouvert à tous, un validateur peut tourner sur un ordinateur ordinaire | Petit groupe fermé |
| Usage typique | Bitcoin | Ethereum depuis septembre 2022 | Réseaux privés, réseaux de test |
| Limite principale | Coût énergétique | Plus récent et plus complexe à mettre en oeuvre | Plus centralisé, il faut faire confiance aux signataires |

**En PoS**, le temps est découpé en créneaux (slots) de 12 secondes, regroupés en périodes (epochs) de 32 créneaux. À chaque créneau, un validateur est choisi au hasard pour proposer un bloc, et un comité d'autres validateurs vote pour dire s'il est valide. Un validateur qui propose deux blocs au même créneau ou vote de façon contradictoire s'expose à perdre une partie de sa mise.

**En PoA**, les signataires sont désignés à l'avance et se relaient. Ils peuvent voter pour ajouter ou retirer un signataire. Le réseau est très rapide et peu coûteux, mais il repose sur la confiance dans ces quelques acteurs.

### À comprendre

- Un mécanisme de consensus est un moyen de se mettre d'accord sans arbitre central, en rendant la triche coûteuse.
- Ce coût change de nature : travail perdu (PoW), argent perdu (PoS), réputation perdue (PoA).
- Aucun mécanisme n'est parfait : chacun échange de la sécurité, de la vitesse, de l'énergie et de la décentralisation.

### À ne pas comprendre

- Qu'il existe un "meilleur" mécanisme absolu : les sources présentent des avantages et des limites pour chacun.
- Qu'en PoS, il suffit d'être riche pour tout contrôler : une attaque à 51 % de la mise reste possible mais coûteuse, et la communauté peut réagir en détruisant la mise de l'attaquant.
- Que PoS et PoA sont de simples variantes du minage : il n'y a ni nonce ni calcul à trouver.
- Que PoA est une blockchain publique comme Bitcoin : elle est surtout utilisée dans des réseaux privés ou de test.

### Suggestion pour le projet

PoW et PoS se comparent très bien visuellement (calcul contre mise), car leur ressource est facile à matérialiser. PoA peut servir de troisième cas court pour montrer le cas "quelques acteurs de confiance".

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| PoW : machines qui chauffent, compteur d'essais | Mineurs qui testent des nonces | Exacte (le principe), approximative (l'échelle) |
| PoS : jetons posés en garantie, un validateur tiré au sort | 32 ETH déposés, sélection pseudo-aléatoire par créneau | Simplifiée |
| PoS : jetons qui disparaissent en cas de triche | Slashing proportionnel, parfois minime pour un cas isolé | Simplifiée |
| PoA : badge ou sceau sur quelques nœuds | Liste de signataires autorisés définie dans la configuration | Simplifiée |

Sources : [ethereum.org, Proof-of-stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/) ; [ethereum.org, Proof-of-authority](https://ethereum.org/developers/docs/consensus-mechanisms/poa/) ; [whitepaper, sections 4 et 5](https://bitcoin.org/bitcoin.pdf).

## 7. Cycle de vie d'une transaction et scénario d'attaque

Une transaction passe de "annoncée" à "pratiquement définitive" en plusieurs étapes, et c'est entre les deux que se joue la double dépense.

### Le cycle de vie (modèle Bitcoin)

1. **Création** : l'expéditeur désigne les sorties non dépensées qu'il utilise comme entrées, et le ou les destinataires. Un éventuel surplus d'entrées devient un frais pour le mineur.
2. **Signature** : il signe avec sa clé privée, ce qui prouve qu'il est le propriétaire sans révéler la clé.
3. **Diffusion** : la transaction est envoyée à des nœuds qui la relaient de proche en proche. Elle n'a pas besoin d'atteindre tous les nœuds.
4. **Vérification** : chaque nœud contrôle la signature et que les fonds n'ont pas déjà été dépensés.
5. **Attente** : la transaction valide patiente dans la liste des transactions en attente de chaque nœud (appelée *mempool* dans la documentation Ethereum, qui parle aussi de transaction pool ; ce mot n'apparaît pas dans la documentation développeur Bitcoin consultée).
6. **Inclusion dans un bloc candidat** : un mineur la choisit ; les frais qu'elle offre lui reviennent, ce qui l'incite à l'inclure. Le détail du marché des frais (taux par unité de poids, gas) n'a pas été vérifié ici.
7. **Preuve de travail** : un mineur trouve un nonce valide et diffuse le bloc.
8. **Acceptation** : les nœuds vérifient que toutes les transactions du bloc sont valides, puis construisent le bloc suivant dessus.
9. **Confirmations** : le bloc qui contient la transaction compte pour 1 confirmation, puis chaque bloc ajouté par-dessus en ajoute une (confirmations = 1 + nombre de blocs empilés au-dessus), ce qui rend l'annulation plus improbable.

**Point clé :** voir une transaction en attente ne veut pas dire qu'elle est payée. Elle ne compte que lorsqu'elle est dans un bloc accepté, et d'autant plus sûrement que des blocs ont été ajoutés après.

### La double dépense

Le problème est de dépenser deux fois les mêmes fonds. Dans Bitcoin, chaque sortie ne peut servir d'entrée qu'une seule fois ; toute seconde utilisation est une double dépense interdite. Le whitepaper souligne que, sans autorité centrale, la seule manière de savoir qu'une dépense antérieure n'existe pas est de connaître **toutes** les transactions et de s'accorder sur leur ordre. Seule la plus ancienne compte.

### Scénario d'attaque illustrable

1. L'attaquant paie un marchand. La transaction entre dans un bloc de la chaîne publique.
2. En secret, il mine une chaîne parallèle contenant une autre transaction qui renvoie ces fonds vers lui-même.
3. Le marchand attend un certain nombre de confirmations avant de livrer.
4. Si la chaîne secrète devient plus lourde que la chaîne publique, les nœuds basculent dessus : le paiement au marchand disparaît de l'historique, c'est une **réorganisation**.
5. Si la chaîne publique garde l'avance, l'attaque échoue et les blocs secrets sont perdus.

Plus l'attaquant contrôle de puissance de calcul, plus il faut de blocs après la transaction pour rester sous 0,1 % de risque (valeurs z du whitepaper ; confirmations = z + 1) :

| Part de puissance de l'attaquant | Blocs ajoutés après le bloc de la transaction (z) pour passer sous 0,1 % de risque |
|---|---|
| 10 % | 5 |
| 20 % | 11 |
| 30 % | 24 |
| 40 % | 89 |
| 45 % | 340 |

Note sur ces valeurs : le whitepaper utilise une approximation (loi de Poisson). Un calcul exact, refait ici avec la loi binomiale négative (calcul personnel, sans article de référence ouvert), donne un risque un peu plus élevé : pour 10 %, environ 0,18 % avec z = 5 et environ 0,06 % avec z = 6. Comme le bloc de la transaction compte pour 1 confirmation, z = 5 correspond à 6 confirmations et z = 6 à 7. Pour une démo prudente, retenir z = 6 est défendable ; indiquez alors que ce chiffre est calculé et non repris du whitepaper.

À noter : la documentation développeur remarque que même avec moins de 50 % de la puissance, une attaque a des chances d'aboutir. Et en PoS, un bloc finalisé ne peut être annulé qu'en détruisant au moins un tiers de la mise totale, ce qui rend l'attaque économiquement dissuasive.

### À comprendre

- Une transaction devient sûre progressivement, pas d'un coup.
- Ce qui empêche la double dépense n'est pas un contrôleur, mais l'accord du réseau sur un seul historique et le coût de le réécrire.
- Un attaquant doit gagner une course contre tout le réseau honnête.

### À ne pas comprendre

- Qu'une transaction vue dans l'interface est déjà confirmée.
- Qu'une attaque réussie permet de créer de la monnaie ou de voler n'importe qui : elle ne permet que d'annuler ses propres paiements récents, car les nœuds honnêtes rejettent les transactions invalides.
- Que la double dépense est "détectée par quelqu'un" : l'une des deux transactions est simplement écartée de l'historique final.
- Que 51 % est un seuil magique : le risque croît progressivement avec la part de puissance de l'attaquant.

### Fidélité

| Élément visuel possible | Réalité | Fidélité |
|---|---|---|
| Transaction qui voyage, attend, entre dans un bloc | Création, diffusion, attente, inclusion, acceptation | Simplifiée (étapes regroupées) |
| Compteur de confirmations qui monte | 1 + nombre de blocs ajoutés au-dessus du bloc de la transaction (ce bloc compte pour 1) | Exacte |
| Chaîne secrète qui se construit à côté de la chaîne publique | Chaîne parallèle minée en secret | Exacte |
| Bascule du réseau vers la chaîne la plus lourde | Réorganisation des nœuds sur la branche à plus de travail | Exacte |
| Course animée entre deux chaînes avec issue garantie | Course probabiliste, l'issue dépend du hasard et de la puissance | Simplifiée, à dire explicitement |

Sources : [whitepaper, sections 2, 5, 6 et 11](https://bitcoin.org/bitcoin.pdf) ; [Bitcoin Developer Guide, Block Chain](https://developer.bitcoin.org/devguide/block_chain.html) ; [ethereum.org, Proof-of-stake (transaction, finalité)](https://ethereum.org/developers/docs/consensus-mechanisms/pos/).

## Pièges de vulgarisation à éviter

Ces dix raccourcis sont inexacts ou trompeurs d'après les sources de cette fiche. Ils sont une bonne base pour vos parties "risque de mauvaise compréhension".

| Idée fausse courante | Ce qui est exact | Notion |
|---|---|---|
| "La blockchain est impossible à modifier" | Toute modification est détectable, et la faire accepter est de plus en plus coûteuse | 3 |
| "La majorité des nœuds décide" | En preuve de travail, c'est la chaîne qui représente le plus de travail cumulé | 4 |
| "Les mineurs résolvent un problème mathématique complexe" | Ils tentent des nonces au hasard jusqu'à obtenir un hash sous la cible | 5 |
| "Le hash chiffre ou cache les données" | Le hash est une empreinte ; les transactions sont publiques | 1, 2 |
| "Le mineur valide les transactions" | Tous les nœuds vérifient ; le mineur propose le bloc | 5 |
| "La hauteur du bloc est dans l'en-tête" | Elle se déduit de la position dans la chaîne | 1 |
| "Une transaction visible est confirmée" | Elle n'est fiable qu'une fois dans un bloc accepté, puis après des confirmations | 7 |
| "Une attaque à 51 % permet de tout faire" | Elle permet surtout de réécrire ses propres transactions récentes, pas de créer de la monnaie | 3, 7 |
| "Bitcoin et Ethereum fonctionnent pareil" | Bitcoin suit des sorties non dépensées, Ethereum des comptes avec solde | 7 |
| "Le nonce, c'est toujours la même chose" | Le nonce de minage (Bitcoin, dans l'en-tête) n'est pas le nonce de compte d'Ethereum, qui compte les transactions envoyées pour empêcher leur rejeu | 1, 5 |

La dernière ligne est un piège spécifique si vous vous appuyez sur les deux systèmes : le mot "nonce" désigne deux choses différentes. Dans votre interface, gardez le mot réservé au minage ou précisez-le.

Sources : [Bitcoin Developer Reference, Block Chain](https://developer.bitcoin.org/reference/block_chain.html) ; [ethereum.org, Accounts](https://ethereum.org/developers/docs/accounts/) ; [whitepaper, sections 4, 5 et 11](https://bitcoin.org/bitcoin.pdf).

## Sources

Toutes les pages ci-dessous ont été ouvertes et lues le 13 octobre 2026.

| Source | Type | Ce qu'elle a servi à vérifier |
|---|---|---|
| [Nakamoto, Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf) | Article fondateur | Chaînage et horodatage (3), preuve de travail et règle de la chaîne la plus lourde (4), étapes du réseau (5), incitation (6), racine de Merkle (7), probabilités d'attaque (11) |
| [Bitcoin Developer Reference, Block Chain](https://developer.bitcoin.org/reference/block_chain.html) | Documentation officielle | Les 6 champs et les 80 octets de l'en-tête, cible (nBits), structure du bloc, coinbase |
| [Bitcoin Developer Guide, Block Chain](https://developer.bitcoin.org/devguide/block_chain.html) | Documentation officielle | Preuve de travail, ajustement tous les 2 016 blocs, forks, double dépense, UTXO, attaque à 51 % |
| [ethereum.org, Proof-of-stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/) | Documentation officielle | Validateurs, 32 ETH, créneaux et périodes, slashing, finalité, comparaison avec PoW |
| [ethereum.org, Proof-of-authority](https://ethereum.org/developers/docs/consensus-mechanisms/poa/) | Documentation officielle | Signataires autorisés, tour de rôle, avantages et limites, attaques possibles |
| [ethereum.org, Accounts](https://ethereum.org/developers/docs/accounts/) | Documentation officielle | Modèle par comptes, nonce de compte |

Ajouté après relecture critique : [Bitcoin Developer Guide, Mining](https://developer.bitcoin.org/devguide/mining.html) (extra nonce, champ coinbase) et [Bitcoin Developer Glossary](https://developer.bitcoin.org/glossary.html) (coinbase, nœud complet, mineur) ; [ethereum.org, Transactions](https://ethereum.org/developers/docs/transactions/) (transaction pool, pourboire et frais).

Définition d'une confirmation : [Bitcoin Developer Guide, Payment Processing](https://developer.bitcoin.org/devguide/payment_processing.html), section Verifying Payment.

**Limites de cette fiche**

- Les chiffres de la documentation Bitcoin (2 016 blocs, 80 octets, 210 000 blocs entre deux réductions de récompense) sont des paramètres du protocole ; ne reprenez pas les montants de récompense cités dans cette documentation, qui datent de 2017.
- Le mot mempool n'apparaît pas dans la documentation développeur Bitcoin consultée ; ethereum.org l'emploie dans sa page sur la preuve d'enjeu et parle de transaction pool dans sa page sur les transactions. Le concept existe dans les deux systèmes, mais l'origine historique du terme n'a pas été vérifiée ici.
- La première fiche de révision reçue citait surtout des articles arXiv et une revue peu connue (ijnrd.org). Je ne les ai pas rouverts et je ne les reprends pas ici : pour le livrable, citez de préférence les sources de ce tableau.
- Pour la section 6 du livrable, indiquez l'usage d'un outil d'IA pour la collecte de ces sources, et la vérification que vous en avez faite vous-mêmes.
