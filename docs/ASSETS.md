# Assets externes

## Images, modèles et textures

Aucun. Les personnages 3D, les portraits 2D, la ville, les décors et les blocs sont construits en code dans `src/recit/`.

- Les silhouettes 3D sont assemblées à partir de volumes simples (`src/recit/figure.js`).
- Les portraits de la boîte de dialogue sont dessinés pixel par pixel en SVG, sur une grille de 24 × 24 (`src/recit/portraits.js`).

## Musiques

Le récit peut jouer une piste par séquence (`src/recit/music.js`). Les fichiers se déposent dans `public/audio/`, avec les noms listés dans `public/audio/LISEZMOI.md`.

Chaque piste déposée doit être déclarée ici, avec son auteur et sa licence.

Les musiques sont jouées en fond, au volume 0,25 (sur 1), pour ne pas couvrir les dialogues.

| Titre | Auteur | Source |
|---|---|---|
| Unraveled | Feldup | https://youtu.be/SsPhCLu9_3U |
| Investigation/discovery | Feldup | https://youtu.be/5IAnhHgmrAI |
