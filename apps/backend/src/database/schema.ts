/* schema types */

export interface UsersTable {
  id: string; // UUID
  name: string;
  color: string | null;
  wins: number;
  losses: number;
  draws: number;
  created_at: Date;
  updated_at: Date;
}

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

export interface GamesTable {
  id: string; // UUID
  player_x_id: string | null; // UUID, fk to users
  player_o_id: string; // UUID, fk to users
  current_turn: string | null; // UUID, fk to users
  board_state: BoardState; // JSON with grid coordinates: { "a1": "x" | "o" | null, ... }
  status: string; // 'waiting' | 'in_progress' | 'completed' | 'abandoned'
  winner_id: string | null; // UUID, fk to users
  created_at: Date;
  updated_at: Date;
}

export interface GameMovesTable {
  id: string; // UUID
  game_id: string; // UUID, fk to games
  player_id: string; // UUID, fkto users
  position: string; // Grid coordinate format: 'a1' to 'c3' (row a-c, column 1-3)
  move_number: number;
  created_at: Date;
}

export interface Database {
  users: UsersTable;
  games: GamesTable;
  game_moves: GameMovesTable;
}
