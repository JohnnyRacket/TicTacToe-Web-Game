import type { GameListItem } from './game.js';
import type { LeaderboardEntry } from './leaderboard.js';
import type { Game } from '../domain/game.js';

export interface GameConnectedSseEvent {
  type: 'connected';
  data: { game_id: string };
}

export interface GameUpdatedSseEvent {
  type: 'game_updated';
  data: { game: Game };
}

export interface GameDeletedSseEvent {
  type: 'game_deleted';
  data: { game_id: string };
}

export interface LobbyConnectedSseEvent {
  type: 'connected';
  data: Record<string, never>;
}

export interface LobbyUpdatedSseEvent {
  type: 'lobby_updated';
  data: { games: GameListItem[] };
}

export interface LeaderboardConnectedSseEvent {
  type: 'connected';
  data: Record<string, never>;
}

export interface LeaderboardUpdatedSseEvent {
  type: 'leaderboard_updated';
  data: { leaderboard: LeaderboardEntry[] };
}

export type GameSseEvent = GameConnectedSseEvent | GameUpdatedSseEvent | GameDeletedSseEvent;
export type LobbySseEvent = LobbyConnectedSseEvent | LobbyUpdatedSseEvent;
export type LeaderboardSseEvent = LeaderboardConnectedSseEvent | LeaderboardUpdatedSseEvent;
