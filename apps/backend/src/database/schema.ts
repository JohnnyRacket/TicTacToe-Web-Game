import type { PlayerSymbol } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

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

export interface GamesTable {
  id: string; // UUID
  player_x_id: string | null; // UUID, fk to users
  player_o_id: string | null; // UUID, fk to users
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
