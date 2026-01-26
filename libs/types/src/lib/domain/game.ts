/**
 * PlayerSymbol enum representing the two player symbols in a tic-tac-toe game
 */
export enum PlayerSymbol {
  X = 'x',
  O = 'o',
}

/**
 * Valid board positions using chess notation (a1-c3)
 * Represents all valid positions on a 3x3 tic-tac-toe board
 */
export type BoardPosition = 'a1' | 'a2' | 'a3' | 'b1' | 'b2' | 'b3' | 'c1' | 'c2' | 'c3';

/**
 * Game status enum representing the current state of a game
 */
export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

/**
 * Board state type using chess notation (a1-c3)
 * Represents a 3x3 grid where each cell can contain a PlayerSymbol or null
 */
export type BoardState = {
  a1: PlayerSymbol | null;
  a2: PlayerSymbol | null;
  a3: PlayerSymbol | null;
  b1: PlayerSymbol | null;
  b2: PlayerSymbol | null;
  b3: PlayerSymbol | null;
  c1: PlayerSymbol | null;
  c2: PlayerSymbol | null;
  c3: PlayerSymbol | null;
};

/**
 * Game domain model
 */
export interface Game {
  id: string; // UUID
  player_x_id: string | null; // UUID
  player_o_id: string | null; // UUID
  current_turn: string | null; // UUID
  board_state: BoardState;
  status: GameStatus;
  winner_id: string | null; // UUID
  created_at: Date;
  updated_at: Date;
}

/**
 * Game move domain model
 * Tracks individual moves for replay capability
 */
export interface GameMove {
  id: string; // UUID
  game_id: string; // UUID
  player_id: string; // UUID
  position: BoardPosition;
  move_number: number;
  created_at: Date;
}
