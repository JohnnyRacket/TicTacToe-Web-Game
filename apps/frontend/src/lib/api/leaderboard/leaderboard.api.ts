import { apiClient } from '../client';

import type { GetLeaderboardResponse } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

/**
 * Get leaderboard
 */
export async function getLeaderboard(): Promise<GetLeaderboardResponse> {
  const response = await apiClient.get<GetLeaderboardResponse>('/leaderboard');
  return response.data;
}
