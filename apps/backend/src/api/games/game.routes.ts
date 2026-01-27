import { InvalidPositionError, PositionOccupiedError } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { Router } from 'express';

import {
  GameNotFoundError,
  GameFullError,
  InvalidMoveError,
  GameNotJoinableError,
  NotGameParticipantError,
} from './game.errors.js';
import { GameService } from './game.service.js';


import type {
  CreateGameRequest,
  CreateGameResponse,
  JoinGameRequest,
  JoinGameResponse,
  ListGamesResponse,
  GetGameResponse,
  MakeMoveRequest,
  MakeMoveResponse,
  DeleteGameResponse,
} from '@tic-tac-toe-web-game/tic-tac-toe-lib';

const router = Router();
const gameService = new GameService();

/**
 * POST /api/game/create
 * Create a new game
 */
router.post('/create', async (req, res, next) => {
  try {
    const body: CreateGameRequest = req.body;
    const game = await gameService.createGame(body.player_id, body.player_role);

    const response: CreateGameResponse = { game };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/game/:id/join
 * Join an existing game
 */
router.post('/:id/join', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body: JoinGameRequest = req.body;

    const game = await gameService.joinGame(id, body.player_x_id);
    const response: JoinGameResponse = { game };

    res.json(response);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      res.status(404).json({
        error: {
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        },
      });
      return;
    }
    if (error instanceof GameNotJoinableError || error instanceof GameFullError) {
      res.status(400).json({
        error: {
          error: 'Bad Request',
          message: error.message,
          statusCode: 400,
        },
      });
      return;
    }
    next(error);
  }
});

/**
 * GET /api/game/list
 * List available games (waiting or in_progress)
 */
router.get('/list', async (req, res, next) => {
  try {
    const games = await gameService.listGames();
    const response: ListGamesResponse = { games };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/game/:id
 * Get a game by ID, optionally including move history
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const includeMoves = req.query.includeMoves === 'true';

    const result = await gameService.getGameById(id, includeMoves);
    const response: GetGameResponse = {
      game: result.game,
      moves: result.moves,
    };

    res.json(response);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      res.status(404).json({
        error: {
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        },
      });
      return;
    }
    next(error);
  }
});

/**
 * PUT /api/game/:id
 * Make a move in a game
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body: MakeMoveRequest = req.body;

    const result = await gameService.makeMove(id, body.player_id, body.position);
    const response: MakeMoveResponse = {
      game: result.game,
      move: result.move,
      is_winner: result.isWinner,
      is_draw: result.isDraw,
    };

    res.json(response);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      res.status(404).json({
        error: {
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        },
      });
      return;
    }
    if (
      error instanceof InvalidMoveError ||
      error instanceof NotGameParticipantError ||
      error instanceof InvalidPositionError ||
      error instanceof PositionOccupiedError
    ) {
      res.status(400).json({
        error: {
          error: 'Bad Request',
          message: error.message,
          statusCode: 400,
        },
      });
      return;
    }
    next(error);
  }
});

/**
 * DELETE /api/game/:id
 * Delete a game
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await gameService.deleteGame(id);
    const response: DeleteGameResponse = {
      message: 'Game deleted successfully',
      game_id: id,
    };

    res.json(response);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      res.status(404).json({
        error: {
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        },
      });
      return;
    }
    next(error);
  }
});

export default router;
