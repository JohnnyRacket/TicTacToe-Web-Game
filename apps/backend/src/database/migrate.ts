import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { getDatabase } from './connection.js';


// apps/backend/dist/database/migrations
const getMigrationsFolder = (): string => {
  if (typeof __dirname !== 'undefined') {
    return path.join(__dirname, 'migrations');
  }
  // Fallback: construct path relative to current working directory
  return path.join(process.cwd(), 'apps', 'backend', 'dist', 'database', 'migrations');
};

/**
 * Run all pending migrations
 * kysely handles knowing what migrations have been run using an internal table
 * the way the migrator object works is alphanumeric sort for ordering of migrations run
 */
export async function migrate(): Promise<void> {
  const db = getDatabase();

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: getMigrationsFolder(),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✓ Migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`✗ Failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('Migration failed:', error);
    throw error;
  }

  console.log('All migrations completed successfully');
}

export async function rollback(): Promise<void> {
  const db = getDatabase();

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: getMigrationsFolder(),
    }),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✓ Migration "${it.migrationName}" was rolled back successfully`);
    } else if (it.status === 'Error') {
      console.error(`✗ Failed to rollback migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}
