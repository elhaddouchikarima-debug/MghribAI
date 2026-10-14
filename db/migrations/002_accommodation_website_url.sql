-- Rename the early official_url column: OSM website tags are not independently verified as official.
ALTER TABLE accommodations RENAME COLUMN official_url TO website_url;
