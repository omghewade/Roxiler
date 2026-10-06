import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = path.isAbsolute(config.dbFile)
    ? config.dbFile
    : path.resolve(process.cwd(), config.dbFile);

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await dbInstance.run('PRAGMA foreign_keys = ON;');
  await initializeSchema(dbInstance);

  return dbInstance;
}

async function initializeSchema(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      address TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN', 'USER', 'STORE_OWNER')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL,
      owner_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      store_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, store_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_stores_name ON stores(name);
    CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id);
    CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);
  `);

  const existingAdmin = await db.get("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
  if (!existingAdmin) {
    const defaultAdminId = uuidv4();
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);
    await db.run(
      `INSERT INTO users (id, name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        defaultAdminId,
        'System Administrator Account',
        'admin@roxiler.com',
        hashedPassword,
        'Roxiler Global Headquarters, Tech Park, Suite 400',
        'ADMIN',
      ]
    );
  }
}
