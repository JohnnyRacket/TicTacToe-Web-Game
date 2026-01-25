import { sql } from 'kysely';

import type { Kysely } from 'kysely';

/**
 * Migration: Add index on users for leaderboard queries
 *
 * Creates a composite index on
 * - wins descending
 * - losses ascending
 * - draws descending
 * - updated_at ascending (whoever got there first stays)
 */
export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE INDEX idx_users_leaderboard
    ON users (wins DESC, losses ASC, draws DESC, updated_at ASC)
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP INDEX IF EXISTS idx_users_leaderboard`.execute(db);
}
