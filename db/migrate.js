const fs = require('fs');
const path = require('path');

function migrate(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const migrationDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationDir).filter(name => name.endsWith('.sql')).sort();

  for (const file of files) {
    const version = file.replace(/\.sql$/i, '');
    const applied = db.prepare('SELECT 1 FROM schema_migrations WHERE version = ?').get(version);
    if (applied) continue;

    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    db.exec('BEGIN');
    try {
      for (const statement of sql.split(/;\s*(?:\r?\n|$)/).map(s => s.trim()).filter(Boolean)) {
        const executable = statement.replace(/^\s*--.*(?:\r?\n|$)/gm, '').trim();
        if (!executable) continue;
        const rename = executable.match(/^ALTER\s+TABLE\s+(\w+)\s+RENAME\s+COLUMN\s+(\w+)\s+TO\s+(\w+)$/i);
        if (rename) {
          const [, table, oldColumn, newColumn] = rename;
          const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(row => row.name);
          if (columns.includes(newColumn)) continue;
          if (!columns.includes(oldColumn)) throw new Error(`Neither ${oldColumn} nor ${newColumn} exists on ${table}`);
        }
        db.exec(executable);
      }
      db.prepare('INSERT INTO schema_migrations(version) VALUES (?)').run(version);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw new Error(`Migration ${file} failed: ${error.message}`, { cause: error });
    }
  }
}

module.exports = migrate;
