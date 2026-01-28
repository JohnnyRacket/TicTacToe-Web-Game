import {
  PlayerSymbol,
  GameStatus,
  checkWin,
  checkDraw,
  makeMove as applyMove,
  getPlayerRole,
  getNextTurn,
  getCurrentTurn,
  InvalidPositionError,
  PositionOccupiedError } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { sql } from 'kysely';

import { getDatabase, mapDbGameToDomainGame, mapDbGameMoveToDomainGameMove } from '../../database/index.js';
import { UserService } from '../users/user.service.js';

import {
  GameNotFoundError,
  GameFullError,
  InvalidMoveError,
  GameNotJoinableError,
  NotGameParticipantError,
} from './game.errors.js';

import type { GamesTable, Database } from '../../database/index.js';
import type {
  Game,
  GameMove,
  BoardPosition,
  BoardState,
  GameListItem,
} from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import type { InsertObject } from 'kysely';

export class GameService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new game
   * @param playerId Player creating the game
   * @param playerRole Optional role (X or O). Defaults to X if not specified
   * @returns Created game
   */
  async createGame(playerId: string, playerRole?: PlayerSymbol): Promise<Game> {
    const db = getDatabase();

    // Validate user exists
    await this.userService.getUserById(playerId);

    // Determine assignment based on playerRole
    const role = playerRole ?? PlayerSymbol.X;
    const gameData = {} as InsertObject<Database, 'games'>;

    if (role === PlayerSymbol.X) {
      gameData.player_x_id = playerId;
      gameData.player_o_id = null;
      // X goes first, so set current_turn to X's ID
      gameData.current_turn = playerId;
    } else {
      gameData.player_o_id = playerId;
      gameData.player_x_id = null;
      // O is waiting for X to join, so current_turn is null
      gameData.current_turn = null;
    }

    const [game] = await db
      .insertInto('games')
      .values(gameData)
      .returningAll()
      .execute();

    return mapDbGameToDomainGame(game);
  }

  /**
   * Get a game by ID (internal helper, doesn't include moves)
   * @param gameId Game ID
   * @returns Game
   * @throws GameNotFoundError if game doesn't exist
   */
  private async getGameInternal(gameId: string): Promise<Game> {
    const db = getDatabase();

    const game = await db
      .selectFrom('games')
      .selectAll()
      .where('id', '=', gameId)
      .executeTakeFirst();

    if (!game) {
      throw new GameNotFoundError(gameId);
    }

    return mapDbGameToDomainGame(game);
  }

  /**
   * Join an existing game
   * @param gameId Game to join
   * @param playerId Player joining the game
   * @returns Updated game
   * @throws GameNotFoundError if game doesn't exist
   * @throws GameNotJoinableError if game is not in 'waiting' status
   * @throws GameFullError if game already has both players
   */
  async joinGame(gameId: string, playerId: string): Promise<Game> {
    const db = getDatabase();

    // Get game, throw if not found
    const game = await this.getGameInternal(gameId);

    // Validate user exists
    await this.userService.getUserById(playerId);

    // Check game status
    if (game.status !== GameStatus.WAITING) {
      throw new GameNotJoinableError(gameId, game.status);
    }

    // Check if game is full
    if (game.player_x_id && game.player_o_id) {
      throw new GameFullError(gameId);
    }

    // Check if player is already in game
    if (game.player_x_id === playerId || game.player_o_id === playerId) {
      throw new InvalidMoveError('Player is already in this game');
    }

    // Assign player to available slot
    const updateData: Partial<GamesTable> = {};

    if (!game.player_x_id) {
      updateData.player_x_id = playerId;
    } else if (!game.player_o_id) {
      updateData.player_o_id = playerId;
    }

    // When both players are present, start the game
    const willHaveBothPlayers =
      (game.player_x_id && updateData.player_o_id === playerId) ||
      (updateData.player_x_id === playerId && game.player_o_id);

    if (willHaveBothPlayers) {
      updateData.status = GameStatus.IN_PROGRESS as string;
      // X always goes first, regardless of who created the game
      // If game.player_x_id exists, use it; otherwise use the newly assigned player_x_id
      updateData.current_turn = game.player_x_id ?? updateData.player_x_id!;
    }

    const [updatedGame] = await db
      .updateTable('games')
      .set({
        ...updateData,
        updated_at: sql`now()`,
      })
      .where('id', '=', gameId)
      .returningAll()
      .execute();

    return mapDbGameToDomainGame(updatedGame);
  }

  /**
   * List available games (waiting or in_progress)
   * @returns List of games with participant count
   */
  async listGames(): Promise<GameListItem[]> {
    const db = getDatabase();

    const games = await db
      .selectFrom('games')
      .selectAll()
      .where('status', 'in', [GameStatus.WAITING, GameStatus.IN_PROGRESS])
      .orderBy('created_at', 'desc')
      .execute();

    return games.map((game) => {
      let participantCount = 0;
      if (game.player_x_id) participantCount++;
      if (game.player_o_id) participantCount++;

      return {
        id: game.id,
        player_x_id: game.player_x_id,
        player_o_id: game.player_o_id,
        current_turn: game.current_turn,
        status: game.status as GameStatus,
        participant_count: participantCount,
        created_at: game.created_at,
      };
    });
  }

  /**
   * Get a game by ID
   * @param gameId Game ID
   * @param includeMoves Whether to include move history
   * @returns Game and optional moves
   * @throws GameNotFoundError if game doesn't exist
   */
  async getGameById(gameId: string, includeMoves = false): Promise<{ game: Game; moves?: GameMove[] }> {
    const db = getDatabase();

    const game = await this.getGameInternal(gameId);

    let moves: GameMove[] | undefined;
    if (includeMoves) {
      const movesResult = await db
        .selectFrom('game_moves')
        .selectAll()
        .where('game_id', '=', gameId)
        .orderBy('move_number', 'asc')
        .execute();
      moves = movesResult.map(mapDbGameMoveToDomainGameMove);
    }

    return {
      game,
      moves,
    };
  }

  /**
   * Make a move in a game
   * @param gameId Game ID
   * @param playerId Player making the move
   * @param position Board position (a1-c3)
   * @returns Updated game, move, and win/draw flags
   * @throws GameNotFoundError if game doesn't exist
   * @throws InvalidMoveError if move is invalid
   */
  async makeMove(
    gameId: string,
    playerId: string,
    position: BoardPosition
  ): Promise<{ game: Game; move: GameMove; isWinner: boolean; isDraw: boolean }> {
    const db = getDatabase();

    // Get game, throw if not found
    const gameResult = await this.getGameById(gameId);
    const game = gameResult.game;

    // Validate user exists
    await this.userService.getUserById(playerId);

    // Check game status
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new InvalidMoveError(`Game is not in progress. Current status: ${game.status}`);
    }

    // Get player's role
    const playerRole = getPlayerRole(playerId, game.player_x_id, game.player_o_id);
    if (!playerRole) {
      throw new NotGameParticipantError(gameId, playerId);
    }

    // Check if game is already won (service-level check)
    if (checkWin(game.board_state) !== null) {
      throw new InvalidMoveError('Game is already won');
    }

    // Check if it's the player's turn (service-level check)
    const expectedTurn = getCurrentTurn(game.current_turn, game.player_x_id, game.player_o_id);
    if (expectedTurn !== playerId) {
      throw new InvalidMoveError("It's not your turn");
    }

    // Apply move to board - lib will throw exceptions for invalid position or occupied position
    let newBoardState: BoardState;
    try {
      newBoardState = applyMove(game.board_state, position, playerRole);
    } catch (error) {
      if (error instanceof InvalidPositionError || error instanceof PositionOccupiedError) {
        throw new InvalidMoveError(error.message);
      }
      throw error;
    }

    // Get next move number
    const existingMoves = await db
      .selectFrom('game_moves')
      .select(db.fn.count('id').as('count'))
      .where('game_id', '=', gameId)
      .executeTakeFirst();

    const moveNumber = (Number(existingMoves?.count) || 0) + 1;

    // Use transaction for acid
    return await db.transaction().execute(async (trx) => {
      // Insert move
      const moveData = {
        game_id: gameId,
        player_id: playerId,
        position: position as string,
        move_number: moveNumber,
      } as InsertObject<Database, 'game_moves'>;
      const [move] = await trx
        .insertInto('game_moves')
        .values(moveData)
        .returningAll()
        .execute();

      // Check for win and draw
      const winner = checkWin(newBoardState);
      const isDraw = checkDraw(newBoardState);

      const updateData: Partial<GamesTable> = {
        board_state: newBoardState,
      };

      if (winner || isDraw) {
        // Game is over
        updateData.status = GameStatus.COMPLETED as string;
        if (winner) {
          // Determine winner ID based on symbol
          updateData.winner_id =
            winner === PlayerSymbol.X ? game.player_x_id : game.player_o_id;
          updateData.current_turn = null;

          // Update player stats
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const winnerId = updateData.winner_id!;
          const loserId = winnerId === game.player_x_id ? game.player_o_id : game.player_x_id;

          if (loserId) {
            // Increment winner's wins
            await trx
              .updateTable('users')
              .set({
                wins: sql`wins + 1`,
                updated_at: new Date(),
              })
              .where('id', '=', winnerId)
              .execute();

            // Increment loser's losses
            await trx
              .updateTable('users')
              .set({
                losses: sql`losses + 1`,
                updated_at: new Date(),
              })
              .where('id', '=', loserId)
              .execute();
          }
        } else {
          // Draw
          updateData.winner_id = null;
          updateData.current_turn = null;

          // Update both players' draws
          if (game.player_x_id) {
            await trx
              .updateTable('users')
              .set({
                draws: sql`draws + 1`,
                updated_at: new Date(),
              })
              .where('id', '=', game.player_x_id)
              .execute();
          }
          if (game.player_o_id) {
            await trx
              .updateTable('users')
              .set({
                draws: sql`draws + 1`,
                updated_at: new Date(),
              })
              .where('id', '=', game.player_o_id)
              .execute();
          }
        }
      } else {
        // Game continues, set next turn
        updateData.current_turn = getNextTurn(
          game.current_turn,
          game.player_x_id,
          game.player_o_id
        );
      }

      // Update game
      const [updatedGame] = await trx
        .updateTable('games')
        .set({
          ...updateData,
          updated_at: sql`now()`,
        })
        .where('id', '=', gameId)
        .returningAll()
        .execute();

      return {
        game: mapDbGameToDomainGame(updatedGame),
        move: mapDbGameMoveToDomainGameMove(move),
        isWinner: winner !== null,
        isDraw,
      };
    });
  }

  /**
   * Delete a game
   * @param gameId Game ID
   * @throws GameNotFoundError if game doesn't exist
   */
  async deleteGame(gameId: string): Promise<void> {
    const db = getDatabase();

    // Check if game exists, throw if not
    await this.getGameInternal(gameId);

    // Delete game (cascade will delete moves via foreign key)
    await db.deleteFrom('games').where('id', '=', gameId).execute();
  }
}
