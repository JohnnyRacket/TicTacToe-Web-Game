import { sql } from 'kysely';

import type { Kysely} from 'kysely';

/**
 * Migration: Create game_moves table
 * 
 * Creates the game_moves table to track all moves in a game for replay capability.
 * Columns:
 * - id: UUID primary key
 * - game_id: UUID foreign key to games
 * - player_id: UUID foreign key to users
 * - position: VARCHAR(2) representing board position in grid coordinates (a1-c3)
 *   Format: row (a-c) + column (1-3), e.g., 'a1', 'b2', 'c3'
 * - move_number: INTEGER representing the sequence of moves
 * - created_at: Timestamp of when the move was made
 */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('game_moves')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('game_id', 'uuid', (col) => col.notNull())
    .addColumn('player_id', 'uuid', (col) => col.notNull())
    .addColumn('position', 'varchar(2)', (col) => col.notNull())
    .addColumn('move_number', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addForeignKeyConstraint('fk_game_moves_game', ['game_id'], 'games', ['id'], (cb) =>
      cb.onDelete('cascade')
    )
    .addForeignKeyConstraint('fk_game_moves_player', ['player_id'], 'users', ['id'], (cb) =>
      cb.onDelete('restrict')
    )
    .addCheckConstraint(
      'ck_game_moves_position',
      sql`position ~ '^[a-c][1-3]$'`
    )
    .addCheckConstraint('ck_game_moves_move_number', sql`move_number > 0`)
    .execute();

  // Create indexes for efficient queries
  await db.schema
    .createIndex('idx_game_moves_game_id')
    .on('game_moves')
    .column('game_id')
    .execute();

  await db.schema
    .createIndex('idx_game_moves_game_move_number')
    .on('game_moves')
    .columns(['game_id', 'move_number'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('game_moves').execute();
}
