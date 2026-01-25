import type { Game, GameMove, GameStatus } from '../domain/game.js';

/**
 * Request to create a new game
 */
export interface CreateGameRequest {
  player_id: string; // UUID
  player_role?: 'x' | 'o';
}

/**
 * Response from creating a game
 */
export interface CreateGameResponse {
  game: Game;
}

/**
 * Request to join an existing game
 */
export interface JoinGameRequest {
  player_x_id: string; // UUID
}

/**
 * Response from joining a game
 */
export interface JoinGameResponse {
  game: Game;
}

/**
 * Response from getting a single game
 */
export interface GetGameResponse {
  game: Game;
  moves?: GameMove[];
}

/**
 * Info to be displayd when listing games to users
 */
export interface GameListItem {
  id: string; // UUID
  player_x_id: string | null; // UUID
  player_o_id: string; // UUID
  status: GameStatus;
  participant_count: number;
  created_at: Date;
}

/**
 * Response from listing games
 */
export interface ListGamesResponse {
  games: GameListItem[];
}

/**
 * Request to make a move
 */
export interface MakeMoveRequest {
  player_id: string; // UUID
  position: string; // 'a1' to 'c3'
}

/**
 * Response from making a move
 */
export interface MakeMoveResponse {
  game: Game;
  move: GameMove;
  is_winner?: boolean;
  is_draw?: boolean;
}

/**
 * Response from deleting a game
 */
export interface DeleteGameResponse {
  message: string;
  game_id: string; // UUID
}
