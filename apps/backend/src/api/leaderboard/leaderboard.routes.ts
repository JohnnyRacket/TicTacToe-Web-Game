import { Router } from 'express';

import { LeaderboardService } from './leaderboard.service.js';

import type { GetLeaderboardResponse } from '@tic-tac-toe-web-game/types';

const router = Router();
const leaderboardService = new LeaderboardService();

/**
 * GET /api/leaderboard
 * Get top 5 players ordered by wins
 */
router.get('/', async (req, res, next) => {
  try {
    const leaderboard = await leaderboardService.getTopPlayers(5);
    const response: GetLeaderboardResponse = { leaderboard };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
