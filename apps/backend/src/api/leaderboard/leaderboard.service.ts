import { getDatabase } from '../../database/index.js';

import type { LeaderboardEntry } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

export class LeaderboardService {
  /**
   * Get top n players
   * Ordering: wins DESC, losses ASC, draws DESC, updated_at ASC
   * @param limit Maximum number of players to return (default: 5)
   * @returns Array of leaderboard entries with rank
   */
  async getTopPlayers(limit = 5): Promise<LeaderboardEntry[]> {
    const db = getDatabase();

    const users = await db
      .selectFrom('users')
      .selectAll()
      .orderBy('wins', 'desc')
      .orderBy('losses', 'asc')
      .orderBy('draws', 'desc')
      .orderBy('updated_at', 'asc')
      .limit(limit)
      .execute();

    return users.map((user, index) => ({
      user,
      rank: index + 1,
    }));
  }
}
