# Base touristique MaghribAI

## État audité

Le projet utilise SQLite (`node:sqlite`, fichier `maghribai.db`). Avant la migration, les données comportaient 12 destinations, 48 attractions, 36 plats, 69 photos de galerie, 121 tags et 36 conseils; les clés étrangères sont valides. Les coordonnées, hébergements, restaurants et liaisons de transport n'étaient pas stockés. Aucun doublon exact n'a été trouvé parmi les attractions et plats dans `destinations.json`.

Les textes de destination, saisons, météo indicative, budgets de voyage, descriptions d'attractions et plats présents dans `db/destinations.json` sont des exemples de démonstration sans source vérifiée. Ils ne constituent pas des prix, horaires ou faits confirmés. Les liens d'images du fichier `db/Dishes.json` sont séparés des données géographiques.

## Modèle et provenance

- `destinations` conserve les identifiants et contenus existants; latitude/longitude et identifiants OSM/Wikidata sont facultatifs. `data_status='demo'` signale que le texte historique n'a pas été vérifié.
- `destination_landmarks` reste la table des attractions; elle reçoit catégorie, coordonnées, durée, saison, restrictions et prix facultatifs. `price_status` distingue `unknown`, `estimate`, `confirmed` et `demo`.
- `accommodations`, `restaurants`, `transport_routes` et `weather_observations` portent seulement des valeurs connues. Une valeur absente reste `NULL`; les prix inconnus ne sont jamais déduits.
- `data_sources` décrit le producteur, la licence, l'attribution et les conditions. Chaque enregistrement importé garde l'identifiant source, l'URL de l'objet et les dates de collecte/vérification. `tourism_field_sources` trace les sources au niveau du champ lorsqu'un enregistrement mélange, par exemple, un texte de démonstration et des coordonnées OSM.
- Les index couvrent recherche de destinations, catégories, villes, cuisines, budgets et validité météo. Les tables d'établissements sont dédupliquées par identifiant stable de source.

## Initialiser et mettre à niveau

1. Depuis `MghribAI`, installer les dépendances avec `npm install`.
2. `node server.js` crée les tables de base puis applique, une seule fois, chaque fichier `db/migrations/*.sql`. Les versions terminées sont conservées dans `schema_migrations`.
3. `node db/seed.js` charge les destinations de démonstration. Le seed met à jour uniquement ces contenus, conserve les coordonnées et les POI importés, et ne supprime plus les enregistrements OSM.
4. Pour des exemples fictifs d'hébergements/restaurants/transports : `python db/load_demo.py`. Les prix de cet exemple sont marqués `demo`, jamais confirmés.

La migration `001_tourism_data.sql` est transactionnelle et ajoute les colonnes manquantes par rapport à la base existante; les lignes présentes sont conservées.

## Import OSM

L'importeur n'accepte qu'une ville par exécution et respecte les limites des services publics. Sans `--apply`, il affiche uniquement un aperçu :

```bash
python db/import_tourism.py --city marrakech
python db/import_tourism.py --city marrakech --apply
python db/import_tourism.py --city marrakech --center-only --apply
```

Il récupère d'abord le centre via Nominatim, puis les attractions, hébergements et restaurants cartographiés dans un rayon de 5 km via Overpass. `--center-only` permet de sauvegarder le seul centre si Overpass est temporairement inaccessible. Le rapprochement déduplique par identifiant OSM et nom de lieu dans la ville. Il n'infère ni prix, note, durée, horaires, disponibilité, ni lien de réservation. Les tags ouverts peuvent être incomplets ou obsolètes; une collecte OSM n'est pas une vérification commerciale.

Nominatim public est limité à une requête par seconde et exige un User-Agent qui identifie l'application. OSM est sous ODbL : afficher « © OpenStreetMap contributors » avec un lien vers https://www.openstreetmap.org/copyright; respecter l'obligation de partage applicable aux bases dérivées. Les sources publiques ne sont pas un service de disponibilité garanti.

## Sources et limites de collecte

- **OpenStreetMap / Overpass** : noms, catégories, adresses, coordonnées et quelques services de lieux. Licence ODbL. Les prix et notes ne sont pas suffisamment structurés pour les traiter comme confirmés.
- **Wikidata** : données structurées CC0, adaptées aux identifiants et descriptions stables après validation d'entité. Le schéma réserve `wikidata_id`; aucun texte existant n'est remplacé automatiquement par une description Wikidata non révisée.
- **Portail marocain data.gov.ma** : le filtre tourisme consulté propose notamment annuaires d'agences/guides et statistiques sectorielles, certaines séries couvrant 2010–2020. Ce ne sont pas des inventaires d'hôtels/restaurants à jour; ces jeux ne sont donc pas importés dans les tables d'établissements.
- **Open-Meteo** : source candidate pour des prévisions datées. La table météo conserve date valide et date de collecte. L'API gratuite est réservée à un usage non commercial, sous CC BY 4.0 et avec attribution; un déploiement commercial doit utiliser une offre autorisée.
- **ONCF et CTM** : liens officiels sont inscrits au registre des sources pour consultation. Aucun tarif/horaires n'est aspiré automatiquement; ces informations dépendent des dates et des conditions du transporteur. Une route avec valeurs confirmées doit être sourcée par une page/document officiel et datée.
- **Prix d'hébergement et de restauration** : pas de collecte automatique. Il faut une source autorisée et une date de vérification; les sites de réservation ne sont pas aspirés par cet outil.

## Import Wikidata et météo

Wikidata : `python db/import_wikidata.py --city marrakech` affiche les candidats sans écriture; après avoir confirmé l'unique entité proposée, ajouter `--apply`. Aucune description existante n'est écrasée : la définition Wikidata est stockée à part et les champs coordonnée/description reçoivent leur provenance.

Météo : après avoir importé et contrôlé les coordonnées, `python db/import_weather.py --city marrakech` enregistre les prévisions quotidiennes sur sept jours, horodatées. Une même collecte est idempotente; les collectes suivantes restent consultables comme instantanés distincts. La gratuité Open-Meteo n'est compatible qu'avec son usage non commercial; ne l'activez pas pour une application commerciale sans offre adéquate.

## Contrôles

Lancer les tests de schéma/import avec :

```bash
python -m unittest discover -s tests -v
```

Contrôle SQLite manuel : `PRAGMA foreign_key_check;`. Les tests n'appellent aucun service externe. Avant de publier des données OSM, vérifier l'attribution et les obligations ODbL; avant d'afficher un tarif comme confirmé, vérifier sa source, sa devise, ses conditions et sa date.

Rapport qualité en lecture seule sur la base configurée dans `.env` : `python db/audit_tourism.py`. Il vérifie les clés étrangères, les coordonnées, les noms possiblement dupliqués, les prix confirmés sans preuve, et la provenance des enregistrements importés.
