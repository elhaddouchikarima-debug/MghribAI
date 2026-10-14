const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbFile = path.resolve(__dirname, '..', process.env.DATABASE_FILE || 'maghribai.db');
const db = new DatabaseSync(dbFile);

db.exec('PRAGMA foreign_keys = ON;');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
// Upgrade databases created before destination_food.img was added.
try {
  db.exec('ALTER TABLE destination_food ADD COLUMN img TEXT');
} catch (error) {
  if (!/duplicate column name/i.test(error.message)) throw error;
}
try {
  db.exec('ALTER TABLE destination_landmarks ADD COLUMN img TEXT');
} catch (error) {
  if (!/duplicate column name/i.test(error.message)) throw error;
}

require('./migrate')(db);

module.exports = db;
