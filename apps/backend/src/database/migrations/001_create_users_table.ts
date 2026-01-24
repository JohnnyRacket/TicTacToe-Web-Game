import { sql } from 'kysely';

import type { Kysely} from 'kysely';

/**
 * Migration: Create users table
 * 
 * Creates the users table with the following columns:
 * - id: UUID primary key
 * - name: User's display name
 * - color: User's preferred color (nullable)
 * - wins: Number of wins (default 0)
 * - losses: Number of losses (default 0)
 * - draws: Number of draws (default 0)
 * - created_at: Timestamp of creation
 * - updated_at: Timestamp of last update
 */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('color', 'varchar(50)')
    .addColumn('wins', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('losses', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('draws', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  // Create index on name for faster lookups
  await db.schema
    .createIndex('idx_users_name')
    .on('users')
    .column('name')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
