import { PlayerSymbol } from '../domain/game.js';

import { InvalidPositionError, PositionOccupiedError } from './game-logic.errors.js';

import type { BoardPosition, BoardState } from '../domain/game.js';

/**
 * Valid chess notation positions for a 3x3 tic-tac-toe board
 */
const VALID_POSITIONS: readonly BoardPosition[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];

/**
 * Check if a position string is valid chess notation (a1-c3)
 * @param position Position string to validate
 * @returns true if position is valid, false otherwise
 */
export function isValidPosition(position: string): position is BoardPosition {
  return VALID_POSITIONS.includes(position as BoardPosition);
}

/**
 * Check if a position on the board is empty
 * @param board Current board state
 * @param position Position to check (a1-c3)
 * @returns true if position is empty (null), false otherwise
 * @throws InvalidPositionError if position is invalid
 */
export function isPositionEmpty(board: BoardState, position: string): boolean {
  if (!isValidPosition(position)) {
    throw new InvalidPositionError(position);
  }
  return board[position] === null;
}

/**
 * Get a player's role (X or O) in a game
 * @param playerId Player UUID to check
 * @param playerXId Player X UUID (may be null)
 * @param playerOId Player O UUID (may be null)
 * @returns PlayerSymbol.X if player is X, PlayerSymbol.O if player is O, null if player is not in game
 */
export function getPlayerRole(
  playerId: string,
  playerXId: string | null,
  playerOId: string | null
): PlayerSymbol | null {
  if (playerXId && playerId === playerXId) {
    return PlayerSymbol.X;
  }
  if (playerOId && playerId === playerOId) {
    return PlayerSymbol.O;
  }
  return null;
}

/**
 * Get the current player's turn
 * @param currentTurn Current player's UUID stored in game state (may be null)
 * @param playerXId Player X UUID (may be null)
 * @param playerOId Player O UUID (may be null)
 * @returns Current player's UUID, or null if game is not ready
 */
export function getCurrentTurn(
  currentTurn: string | null,
  playerXId: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playerOId: string | null
): string | null {
  if (!playerXId) {
    // X must be assigned (X always goes first)
    return null;
  }
  if (currentTurn !== null) {
    // If current turn is already set, return it
    return currentTurn;
  }
  // If no current turn set, X goes first
  return playerXId;
}

/**
 * Determine the next player's turn
 * @param currentTurn Current player's UUID (whose turn it is now)
 * @param playerXId Player X UUID (may be null)
 * @param playerOId Player O UUID (may be null)
 * @returns Next player's UUID, or null if game is not ready
 */
export function getNextTurn(
  currentTurn: string | null,
  playerXId: string | null,
  playerOId: string | null
): string | null {
  if (!playerXId) {
    // X must be assigned (X always goes first)
    return null;
  }
  if (!currentTurn) {
    // If no current turn, X goes first
    return playerXId;
  }
  // If O is not assigned yet, X can continue moving
  if (!playerOId) {
    return playerXId;
  }
  // Alternate between X and O
  return currentTurn === playerXId ? playerOId : playerXId;
}

/**
 * Apply a move to the board (immutable operation)
 * @param board Current board state
 * @param position Position to place the move (a1-c3)
 * @param player PlayerSymbol making the move (PlayerSymbol.X or PlayerSymbol.O)
 * @returns New board state with the move applied
 * @throws InvalidPositionError if position is invalid
 * @throws PositionOccupiedError if position is already occupied
 */
export function makeMove(board: BoardState, position: string, player: PlayerSymbol): BoardState {
  if (!isValidPosition(position)) {
    throw new InvalidPositionError(position);
  }
  if (!isPositionEmpty(board, position)) {
    throw new PositionOccupiedError(position);
  }

  // Return new board state with move applied (immutable)
  return {
    ...board,
    [position]: player,
  };
}

/**
 * Check all win conditions for tic-tac-toe
 * Win conditions:
 * - Rows: a1-a2-a3, b1-b2-b3, c1-c2-c3
 * - Columns: a1-b1-c1, a2-b2-c2, a3-b3-c3
 * - Diagonals: a1-b2-c3, a3-b2-c1
 * @param board Current board state
 * @returns PlayerSymbol.X if X wins, PlayerSymbol.O if O wins, null if no winner
 */
export function checkWin(board: BoardState): PlayerSymbol | null {
  // Check rows
  const rows = [
    [board.a1, board.a2, board.a3],
    [board.b1, board.b2, board.b3],
    [board.c1, board.c2, board.c3],
  ];

  for (const row of rows) {
    if (row[0] !== null && row.every(currentValue => currentValue === row[0])) {
      return row[0];
    }
  }

  // Check columns
  const columns = [
    [board.a1, board.b1, board.c1],
    [board.a2, board.b2, board.c2],
    [board.a3, board.b3, board.c3],
  ];

  for (const column of columns) {
    if (column[0] !== null && column.every(currentValue => currentValue === column[0])) {
      return column[0];
    }
  }

  // Check diagonals
  const diagonal1 = [board.a1, board.b2, board.c3];
  if (diagonal1[0] !== null && diagonal1.every(currentValue => currentValue === diagonal1[0])) {
    return diagonal1[0];
  }

  const diagonal2 = [board.a3, board.b2, board.c1];
  if (diagonal2[0] !== null && diagonal2.every(currentValue => currentValue === diagonal2[0])) {
    return diagonal2[0];
  }

  return null;
}

/**
 * Check if the game is a draw (board is full with no winner)
 * @param board Current board state
 * @returns true if board is full and there's no winner, false otherwise
 */
export function checkDraw(board: BoardState): boolean {
  // If there's a winner, it's not a draw
  if (checkWin(board) !== null) {
    return false;
  }

  // Check if all positions are filled
  const positions: BoardPosition[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
  return positions.every((pos) => board[pos] !== null);
}

/**
 * Validate if a move is legal
 * Checks: position is valid, position is empty, it's the player's turn, game is not already won
 * @param board Current board state
 * @param position Position to place the move (a1-c3)
 * @param currentTurn Current player's UUID (whose turn it is)
 * @param playerXId Player X UUID (may be null)
 * @param playerOId Player O UUID (may be null)
 * @param playerId Player making the move (UUID)
 * @returns true if move is valid, false otherwise
 */
export function isValidMove(
  board: BoardState,
  position: string,
  currentTurn: string | null,
  playerXId: string | null,
  playerOId: string | null,
  playerId: string
): boolean {
  // validate
  if (!isValidPosition(position)) {
    return false;
  }

  if (!isPositionEmpty(board, position)) {
    return false;
  }

  // is the game already won?
  if (checkWin(board) !== null) {
    return false;
  }

  // Check if it's the player's turn
  const expectedCurrentTurn = getCurrentTurn(currentTurn, playerXId, playerOId);
  if (expectedCurrentTurn === null) {
    return false;
  }

  return expectedCurrentTurn === playerId;
}
