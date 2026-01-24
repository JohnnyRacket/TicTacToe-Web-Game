import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { getDatabaseConfig } from './config.js';
import type { Database } from './schema.js';
import { migrate } from './migrate.js';

let dbInstance: Kysely<Database> | null = null;
let migrationsRun = false;

/**
 * Singleton pattern to ensure single connection pool as preferrred by kysely docs
 * https://kysely.dev/docs/getting-started#instantiation
 */
export function getDatabase(): Kysely<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const config = getDatabaseConfig();

  const dialect = new PostgresDialect({
    pool: new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: 10,
    }),
  });

  dbInstance = new Kysely<Database>({
    dialect,
  });

  return dbInstance;
}

export async function initializeDatabase(): Promise<void> {
  if (migrationsRun) {
    return;
  }

  console.log('Running database migrations...');
  await migrate();
  migrationsRun = true;
  console.log('Database initialization complete');
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy();
    dbInstance = null;
  }
}
