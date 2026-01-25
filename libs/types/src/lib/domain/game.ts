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
 * Represents a 3x3 grid where each cell can contain 'x', 'o', or null
 */
export type BoardState = {
  a1: 'x' | 'o' | null;
  a2: 'x' | 'o' | null;
  a3: 'x' | 'o' | null;
  b1: 'x' | 'o' | null;
  b2: 'x' | 'o' | null;
  b3: 'x' | 'o' | null;
  c1: 'x' | 'o' | null;
  c2: 'x' | 'o' | null;
  c3: 'x' | 'o' | null;
};

/**
 * Game domain model
 */
export interface Game {
  id: string; // UUID
  player_x_id: string | null; // UUID
  player_o_id: string; // UUID
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
  position: string; // 'a1' to 'c3'
  move_number: number;
  created_at: Date;
}
