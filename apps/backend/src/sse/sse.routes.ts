import { Router } from 'express';

import { GameNotFoundError } from '../api/games/game.errors.js';
import { GameService } from '../api/games/game.service.js';
import { LeaderboardService } from '../api/leaderboard/leaderboard.service.js';

import { sseManager } from './sse.manager.js';

const router = Router();
const gameService = new GameService();
const leaderboardService = new LeaderboardService();

/**
 * GET /api/sse/game/:gameId
 * Subscribe to real-time updates for a specific game
 */
router.get('/game/:gameId', async (req, res) => {
  const { gameId } = req.params;

  let gameResult;
  try {
    gameResult = await gameService.getGameById(gameId);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      res.status(404).json({
        error: { error: 'Not Found', message: `Game ${gameId} not found`, statusCode: 404 },
      });
      return;
    }
    res.status(500).json({
      error: { error: 'Internal Server Error', message: 'Failed to connect to game stream', statusCode: 500 },
    });
    return;
  }

  const clientId = sseManager.addClient('game', res, { gameId });

  req.on('close', () => {
    sseManager.removeClient(clientId);
  });

  // Send connected event, then immediate game snapshot
  sseManager.sendToClient(clientId, 'connected', { game_id: gameId });
  sseManager.sendToClient(clientId, 'game_updated', { game: gameResult.game });
});

/**
 * GET /api/sse/lobby
 * Subscribe to real-time lobby updates (game list changes)
 */
router.get('/lobby', async (req, res) => {
  const clientId = sseManager.addClient('lobby', res);

  req.on('close', () => {
    sseManager.removeClient(clientId);
  });

  // Send connected event, then immediate lobby snapshot
  sseManager.sendToClient(clientId, 'connected', {});
  try {
    const games = await gameService.listGames();
    sseManager.sendToClient(clientId, 'lobby_updated', { games });
  } catch {
    // Non-fatal: client will get next broadcast on next mutation
  }
});

/**
 * GET /api/sse/leaderboard
 * Subscribe to real-time leaderboard updates
 */
router.get('/leaderboard', async (req, res) => {
  const clientId = sseManager.addClient('leaderboard', res);

  req.on('close', () => {
    sseManager.removeClient(clientId);
  });

  // Send connected event, then immediate leaderboard snapshot
  sseManager.sendToClient(clientId, 'connected', {});
  try {
    const leaderboard = await leaderboardService.getTopPlayers(5);
    sseManager.sendToClient(clientId, 'leaderboard_updated', { leaderboard });
  } catch {
    // Non-fatal: client will get next broadcast on next mutation
  }
});

export default router;
