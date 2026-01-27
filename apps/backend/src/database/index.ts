export { getDatabase, closeDatabase, initializeDatabase } from './connection.js';
export { getDatabaseConfig } from './config.js';
export type { DatabaseConfig } from './config.js';
export type { Database, UsersTable, GamesTable, GameMovesTable, BoardState } from './schema.js';
export { migrate, rollback } from './migrate.js';
export { mapDbGameToDomainGame, mapDbGameMoveToDomainGameMove } from './mappers.js';
