import type { User } from '../domain/user.js';

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  user: User;
  rank: number;
}

/**
 * Response from getting leaderboard
 */
export interface GetLeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}
