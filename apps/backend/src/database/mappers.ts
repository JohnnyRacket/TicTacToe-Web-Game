import type { GamesTable, GameMovesTable } from './schema.js';
import type { Game, GameMove, GameStatus, BoardPosition } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

/**
 * Maps a database GamesTable record to a domain Game model
 * Handles type conversion from database string types to domain enum types
 */
export function mapDbGameToDomainGame(dbGame: GamesTable): Game {
  return {
    ...dbGame,
    status: dbGame.status as GameStatus,
  };
}

/**
 * Maps a database GameMovesTable record to a domain GameMove model
 * Handles type conversion from database string types to domain types
 */
export function mapDbGameMoveToDomainGameMove(dbMove: GameMovesTable): GameMove {
  return {
    ...dbMove,
    position: dbMove.position as BoardPosition,
  };
}
