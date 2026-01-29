import { randomUUID } from 'crypto';

import { PlayerSymbol, GameStatus } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getDatabase, mapDbGameToDomainGame } from '../../database/index.js';
import { UserNotFoundError } from '../users/user.errors.js';

import {
  GameNotFoundError,
  GameFullError,
  InvalidMoveError,
  GameNotJoinableError,
  NotGameParticipantError,
} from './game.errors.js';
import { GameService } from './game.service.js';

import type { Game, GameMove } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

// Mock the database module
vi.mock('../../database/index.js', () => ({
  getDatabase: vi.fn(),
  mapDbGameToDomainGame: vi.fn((game) => ({ ...game, status: game.status as GameStatus })),
  mapDbGameMoveToDomainGameMove: vi.fn((move) => move),
}));

// Mock the user service
vi.mock('../users/user.service.js', () => ({
  UserService: class {
    getUserById = vi.fn().mockResolvedValue({ id: 'user-id', name: 'Test User' });
  },
}));

describe('GameService', () => {
  let gameService: GameService;
  let mockDb: any;
  let mockTrx: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    gameService = new GameService();

    // Create a shared chainable query builder mock
    mockQueryBuilder = {
      selectAll: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      returningAll: vi.fn().mockReturnThis(),
      execute: vi.fn(),
      executeTakeFirst: vi.fn(),
    };

    mockTrx = {
      insertInto: vi.fn(() => mockQueryBuilder),
      updateTable: vi.fn(() => mockQueryBuilder),
      selectFrom: vi.fn(() => mockQueryBuilder),
      deleteFrom: vi.fn(() => mockQueryBuilder),
    };

    mockDb = {
      insertInto: vi.fn(() => mockQueryBuilder),
      updateTable: vi.fn(() => mockQueryBuilder),
      selectFrom: vi.fn(() => mockQueryBuilder),
      deleteFrom: vi.fn(() => mockQueryBuilder),
      transaction: vi.fn().mockReturnValue({
        execute: vi.fn((callback) => callback(mockTrx)),
      }),
      fn: {
        count: vi.fn().mockReturnValue({
          as: vi.fn().mockReturnThis(),
        }),
      },
      // For backward compatibility with tests that access these directly
      execute: mockQueryBuilder.execute,
      executeTakeFirst: mockQueryBuilder.executeTakeFirst,
      values: mockQueryBuilder.values,
      set: mockQueryBuilder.set,
      where: mockQueryBuilder.where,
    };
    vi.mocked(getDatabase).mockReturnValue(mockDb as any);
  });

  describe('createGame', () => {
    it('should create game with player as X when role is X', async () => {
      const playerId = randomUUID();
      const mockGame: Game = {
        id: randomUUID(),
        player_x_id: playerId,
        player_o_id: null,
        current_turn: playerId,
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.WAITING,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockGame]);

      await gameService.createGame(playerId, PlayerSymbol.X);

      const valuesCall = mockQueryBuilder.values.mock.calls[0][0];
      expect(valuesCall.player_x_id).toBe(playerId);
      expect(valuesCall.player_o_id).toBeNull();
      expect(valuesCall.current_turn).toBe(playerId);
    });

    it('should create game with player as O when role is O', async () => {
      const playerId = randomUUID();
      const mockGame: Game = {
        id: randomUUID(),
        player_x_id: null,
        player_o_id: playerId,
        current_turn: null,
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.WAITING,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockGame]);

      await gameService.createGame(playerId, PlayerSymbol.O);

      const valuesCall = mockQueryBuilder.values.mock.calls[0][0];
      expect(valuesCall.player_o_id).toBe(playerId);
      expect(valuesCall.player_x_id).toBeNull();
      expect(valuesCall.current_turn).toBeNull();
    });

    it('should default to X when role is not specified', async () => {
      const playerId = randomUUID();
      const mockGame: Game = {
        id: randomUUID(),
        player_x_id: playerId,
        player_o_id: null,
        current_turn: playerId,
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.WAITING,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockGame]);

      await gameService.createGame(playerId);

      const valuesCall = mockQueryBuilder.values.mock.calls[0][0];
      expect(valuesCall.player_x_id).toBe(playerId);
    });
  });

  describe('joinGame', () => {
    it('should throw GameNotFoundError when game does not exist', async () => {
      mockDb.executeTakeFirst.mockResolvedValue(undefined);

      await expect(gameService.joinGame('non-existent', 'player-id')).rejects.toThrow(
        GameNotFoundError
      );
    });

    it('should throw GameNotJoinableError when game is not waiting', async () => {
      const game: Game = {
        id: randomUUID(),
        player_x_id: randomUUID(),
        player_o_id: null,
        current_turn: randomUUID(),
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.IN_PROGRESS,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.executeTakeFirst.mockResolvedValue(game);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      await expect(gameService.joinGame(game.id, 'player-id')).rejects.toThrow(
        GameNotJoinableError
      );
    });

    it('should throw GameFullError when game already has both players', async () => {
      const game: Game = {
        id: randomUUID(),
        player_x_id: randomUUID(),
        player_o_id: randomUUID(),
        current_turn: randomUUID(),
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.WAITING,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.executeTakeFirst.mockResolvedValue(game);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      await expect(gameService.joinGame(game.id, 'player-id')).rejects.toThrow(GameFullError);
    });

    it('should assign player to X slot when X is available', async () => {
      const gameId = randomUUID();
      const playerOId = randomUUID();
      const game: Game = {
        id: gameId,
        player_x_id: null,
        player_o_id: null,
        current_turn: null,
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.WAITING,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedGame: Game = {
        ...game,
        player_x_id: playerOId,
        current_turn: null, // Not set until both players join
        status: GameStatus.WAITING, // Remains WAITING until both players join
      };

      mockDb.executeTakeFirst.mockResolvedValue(game);
      mockDb.execute.mockResolvedValue([updatedGame]);
      vi.mocked(mapDbGameToDomainGame).mockReturnValueOnce(game).mockReturnValueOnce(updatedGame);

      await gameService.joinGame(gameId, playerOId);

      const setCall = mockQueryBuilder.set.mock.calls[0][0];
      expect(setCall.player_x_id).toBe(playerOId);
      expect(setCall.status).toBeUndefined(); // Status not set when only one player joins
      expect(setCall.current_turn).toBeUndefined(); // Current turn not set when only one player joins
    });

    it('should assign player to O slot when O is available', async () => {
      const gameId = randomUUID();
      const playerXId = randomUUID();
      const playerOId = randomUUID();
      const game: Game = {
        id: gameId,
        player_x_id: playerXId,
        player_o_id: null,
        current_turn: playerXId,
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.WAITING,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedGame: Game = {
        ...game,
        player_o_id: playerOId,
        status: GameStatus.IN_PROGRESS,
        current_turn: playerXId, // X goes first
      };

      mockDb.executeTakeFirst.mockResolvedValue(game);
      mockDb.execute.mockResolvedValue([updatedGame]);
      vi.mocked(mapDbGameToDomainGame).mockReturnValueOnce(game).mockReturnValueOnce(updatedGame);

      await gameService.joinGame(gameId, playerOId);

      const setCall = mockQueryBuilder.set.mock.calls[0][0];
      expect(setCall.player_o_id).toBe(playerOId);
      expect(setCall.status).toBe(GameStatus.IN_PROGRESS);
      expect(setCall.current_turn).toBe(playerXId);
    });
  });

  describe('getGameById', () => {
    it('should throw GameNotFoundError when game does not exist', async () => {
      mockDb.executeTakeFirst.mockResolvedValue(undefined);

      await expect(gameService.getGameById('non-existent')).rejects.toThrow(GameNotFoundError);
    });

    it('should return game without moves when includeMoves is false', async () => {
      const game: Game = {
        id: randomUUID(),
        player_x_id: randomUUID(),
        player_o_id: randomUUID(),
        current_turn: randomUUID(),
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.IN_PROGRESS,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.executeTakeFirst.mockResolvedValue(game);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      const result = await gameService.getGameById(game.id);

      expect(result.game).toEqual(game);
      expect(result.moves).toBeUndefined();
    });

    it('should return game with moves when includeMoves is true', async () => {
      const game: Game = {
        id: randomUUID(),
        player_x_id: randomUUID(),
        player_o_id: randomUUID(),
        current_turn: randomUUID(),
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.IN_PROGRESS,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const moves: GameMove[] = [
        {
          id: randomUUID(),
          game_id: game.id,
          player_id: game.player_x_id!,
          position: 'a1',
          move_number: 1,
          created_at: new Date(),
        },
      ];

      mockDb.executeTakeFirst.mockResolvedValue(game);
      mockDb.execute.mockResolvedValue(moves);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      const result = await gameService.getGameById(game.id, true);

      expect(result.game).toEqual(game);
      expect(result.moves).toEqual(moves);
    });
  });

  describe('makeMove', () => {
    it('should throw GameNotFoundError when game does not exist', async () => {
      mockDb.executeTakeFirst.mockResolvedValue(undefined);

      await expect(
        gameService.makeMove('non-existent', 'player-id', 'a1')
      ).rejects.toThrow(GameNotFoundError);
    });

    it('should throw InvalidMoveError when game is not in progress', async () => {
      const game: Game = {
        id: randomUUID(),
        player_x_id: randomUUID(),
        player_o_id: randomUUID(),
        current_turn: randomUUID(),
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.COMPLETED,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.executeTakeFirst.mockResolvedValue(game);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      await expect(gameService.makeMove(game.id, game.player_x_id!, 'a1')).rejects.toThrow(
        InvalidMoveError
      );
    });

    it('should throw NotGameParticipantError when player is not in game', async () => {
      const playerXId = randomUUID();
      const game: Game = {
        id: randomUUID(),
        player_x_id: playerXId,
        player_o_id: randomUUID(),
        current_turn: playerXId,
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.IN_PROGRESS,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.executeTakeFirst.mockResolvedValue(game);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      await expect(gameService.makeMove(game.id, 'not-a-player', 'a1')).rejects.toThrow(
        NotGameParticipantError
      );
    });
  });

  describe('deleteGame', () => {
    it('should throw GameNotFoundError when game does not exist', async () => {
      mockDb.executeTakeFirst.mockResolvedValue(undefined);

      await expect(gameService.deleteGame('non-existent')).rejects.toThrow(GameNotFoundError);
    });

    it('should delete game when it exists', async () => {
      const game: Game = {
        id: randomUUID(),
        player_x_id: randomUUID(),
        player_o_id: randomUUID(),
        current_turn: randomUUID(),
        board_state: {
          a1: null,
          a2: null,
          a3: null,
          b1: null,
          b2: null,
          b3: null,
          c1: null,
          c2: null,
          c3: null,
        },
        status: GameStatus.IN_PROGRESS,
        winner_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.executeTakeFirst.mockResolvedValue(game);
      mockDb.execute.mockResolvedValue(undefined);
      vi.mocked(mapDbGameToDomainGame).mockReturnValue(game);

      await gameService.deleteGame(game.id);

      expect(mockDb.deleteFrom).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id', '=', game.id);
    });
  });

  describe('getGamesByUserId', () => {
    it('should throw UserNotFoundError when user does not exist', async () => {
      // Access the mocked UserService instance
      const userServiceInstance = (gameService as any).userService;
      vi.spyOn(userServiceInstance, 'getUserById').mockRejectedValue(
        new UserNotFoundError('non-existent')
      );

      await expect(gameService.getGamesByUserId('non-existent')).rejects.toThrow(
        UserNotFoundError
      );
    });

    it('should return empty array when user has no games', async () => {
      mockDb.execute.mockResolvedValue([]);

      const result = await gameService.getGamesByUserId('user-id');

      expect(result).toEqual([]);
      expect(mockDb.selectFrom).toHaveBeenCalledWith('games');
    });

    it('should return games where user is player_x_id', async () => {
      const userId = randomUUID();
      const gameId = randomUUID();
      const otherPlayerId = randomUUID();
      const dbGame = {
        id: gameId,
        player_x_id: userId,
        player_o_id: otherPlayerId,
        current_turn: userId,
        status: GameStatus.IN_PROGRESS,
        created_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([dbGame]);

      const result = await gameService.getGamesByUserId(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: gameId,
        player_x_id: userId,
        player_o_id: otherPlayerId,
        current_turn: userId,
        status: GameStatus.IN_PROGRESS,
        participant_count: 2,
        created_at: dbGame.created_at,
      });
    });

    it('should return games where user is player_o_id', async () => {
      const userId = randomUUID();
      const gameId = randomUUID();
      const otherPlayerId = randomUUID();
      const dbGame = {
        id: gameId,
        player_x_id: otherPlayerId,
        player_o_id: userId,
        current_turn: otherPlayerId,
        status: GameStatus.WAITING,
        created_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([dbGame]);

      const result = await gameService.getGamesByUserId(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: gameId,
        player_x_id: otherPlayerId,
        player_o_id: userId,
        current_turn: otherPlayerId,
        status: GameStatus.WAITING,
        participant_count: 2,
        created_at: dbGame.created_at,
      });
    });

    it('should filter to only WAITING and IN_PROGRESS status', async () => {
      const userId = randomUUID();
      const waitingGame = {
        id: randomUUID(),
        player_x_id: userId,
        player_o_id: null,
        current_turn: userId,
        status: GameStatus.WAITING,
        created_at: new Date(),
      };
      const inProgressGame = {
        id: randomUUID(),
        player_x_id: userId,
        player_o_id: randomUUID(),
        current_turn: userId,
        status: GameStatus.IN_PROGRESS,
        created_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([waitingGame, inProgressGame]);

      const result = await gameService.getGamesByUserId(userId);

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe(GameStatus.IN_PROGRESS);
      expect(result[1].status).toBe(GameStatus.WAITING);
      // Verify where clause was called with status filter
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('status', 'in', [
        GameStatus.WAITING,
        GameStatus.IN_PROGRESS,
      ]);
    });

    it('should order games by created_at DESC', async () => {
      const userId = randomUUID();
      const olderDate = new Date('2024-01-01');
      const newerDate = new Date('2024-01-02');
      const olderGame = {
        id: randomUUID(),
        player_x_id: userId,
        player_o_id: null,
        current_turn: userId,
        status: GameStatus.WAITING,
        created_at: olderDate,
      };
      const newerGame = {
        id: randomUUID(),
        player_x_id: userId,
        player_o_id: null,
        current_turn: userId,
        status: GameStatus.WAITING,
        created_at: newerDate,
      };

      mockDb.execute.mockResolvedValue([newerGame, olderGame]);

      const result = await gameService.getGamesByUserId(userId);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(result[0].created_at).toEqual(newerDate);
      expect(result[1].created_at).toEqual(olderDate);
    });
  });
});
