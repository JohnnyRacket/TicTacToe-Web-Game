import { sql } from 'kysely';

import type { Kysely} from 'kysely';

/**
 * Migration: Create games table
 * 
 * Creates the games table with the following columns:
 * - id: UUID primary key
 * - player_x_id: UUID foreign key to users (player X, nullable until someone joins)
 * - player_o_id: UUID foreign key to users (player O, nullable until someone joins)
 * - current_turn: UUID foreign key to users (whose turn it is, nullable)
 * - board_state: JSONB storing board state as JSON object with grid coordinates as keys
 *   Format: { "a1": "x" | "o" | null, "a2": ..., "c3": ... }
 * - status: VARCHAR storing game status ('waiting', 'in_progress', 'completed', 'abandoned')
 * - winner_id: UUID foreign key to users (winner, nullable)
 * - created_at: Timestamp of creation
 * - updated_at: Timestamp of last update
 * 
 * Note: Both player_x_id and player_o_id are nullable. Players are assigned when they join the game.
 */
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('games')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('player_x_id', 'uuid')
    .addColumn('player_o_id', 'uuid')
    .addColumn('current_turn', 'uuid')
    .addColumn('board_state', 'jsonb', (col) =>
      col.notNull().defaultTo(
        sql`'{"a1":null,"a2":null,"a3":null,"b1":null,"b2":null,"b3":null,"c1":null,"c2":null,"c3":null}'::jsonb`
      )
    )
    .addColumn('status', 'varchar(20)', (col) =>
      col.notNull().defaultTo('waiting')
    )
    .addColumn('winner_id', 'uuid')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addForeignKeyConstraint('fk_games_player_x', ['player_x_id'], 'users', ['id'], (cb) =>
      cb.onDelete('restrict')
    )
    .addForeignKeyConstraint('fk_games_player_o', ['player_o_id'], 'users', ['id'], (cb) =>
      cb.onDelete('restrict')
    )
    .addForeignKeyConstraint('fk_games_current_turn', ['current_turn'], 'users', ['id'], (cb) =>
      cb.onDelete('set null')
    )
    .addForeignKeyConstraint('fk_games_winner', ['winner_id'], 'users', ['id'], (cb) =>
      cb.onDelete('set null')
    )
    .addCheckConstraint('ck_games_status', sql`status IN ('waiting', 'in_progress', 'completed', 'abandoned')`)
    .execute();

  // Create indexes for common queries
  await db.schema
    .createIndex('idx_games_status')
    .on('games')
    .column('status')
    .execute();

  await db.schema
    .createIndex('idx_games_player_x')
    .on('games')
    .column('player_x_id')
    .execute();

  await db.schema
    .createIndex('idx_games_player_o')
    .on('games')
    .column('player_o_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('games').execute();
}
