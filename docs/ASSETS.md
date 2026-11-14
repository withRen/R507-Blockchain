# Assets externes

## Images, modèles et textures

Aucun. Les personnages 3D, les portraits 2D, la ville, les décors et les blocs sont construits en code dans `src/recit/`.

- Les silhouettes 3D sont assemblées à partir de volumes simples (`src/recit/figure.js`).
- Les portraits de la boîte de dialogue sont dessinés pixel par pixel en SVG, sur une grille de 24 × 24 (`src/recit/portraits.js`).

## Musiques

Le récit joue une musique de fond par séquence (`src/recit/music.js`), à partir des fichiers de `public/audio/` (voir `public/audio/LISEZMOI.md`).

Les musiques sont jouées en fond, au volume 0,25 (sur 1), pour ne pas couvrir les dialogues.

| Fichier | Titre | Auteur | Séquences | Source |
|---|---|---|---|---|
| `investigation-discovery.mp3` | Investigation/discovery | Feldup | Prologue, 1 à 4 | https://youtu.be/5IAnhHgmrAI |
| `unraveled.mp3` | Unraveled | Feldup | 5 à 7, épilogue | https://youtu.be/SsPhCLu9_3U |

## Bruitages

Aucun fichier. Les bruitages des interactions (clic, bonne ou mauvaise réponse, lien rompu, tour coupée, propagation, minage) sont synthétisés en direct avec Web Audio (`src/recit/sfx.js`), à un volume bas.
