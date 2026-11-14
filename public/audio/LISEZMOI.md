# Musiques du récit

Deux pistes de Feldup, jouées en fond au volume 0,25 (sur 1). La correspondance entre séquences et pistes est dans `src/recit/music.js` (tableau `NAMES`).

| Fichier | Titre | Séquences |
|---|---|---|
| `investigation-discovery.mp3` | Investigation/discovery | Prologue, séquences 1 à 4 |
| `unraveled.mp3` | Unraveled | Séquences 5 à 7, épilogue |

Chaque piste tourne en boucle. Deux séquences qui partagent la même piste la laissent continuer ; au changement de piste, les deux s'enchaînent en fondu.

Pour ajouter une piste, déposez le MP3 ici, indiquez son nom dans `NAMES`, et notez l'auteur et la source dans `docs/ASSETS.md` et `sources.html`.
