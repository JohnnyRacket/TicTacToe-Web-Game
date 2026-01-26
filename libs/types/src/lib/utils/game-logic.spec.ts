import { describe, it, expect } from 'vitest';

import { PlayerSymbol } from '../domain/game.js';

import { InvalidPositionError, PositionOccupiedError } from './game-logic.errors.js';
import {
  isValidPosition,
  isPositionEmpty,
  getPlayerRole,
  getCurrentTurn,
  getNextTurn,
  makeMove,
  checkWin,
  checkDraw,
  isValidMove,
} from './game-logic.js';

import type { BoardState } from '../domain/game.js';

describe('game-logic', () => {
  const emptyBoard: BoardState = {
    a1: null,
    a2: null,
    a3: null,
    b1: null,
    b2: null,
    b3: null,
    c1: null,
    c2: null,
    c3: null,
  };

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(isValidPosition('a1')).toBe(true);
      expect(isValidPosition('a2')).toBe(true);
      expect(isValidPosition('a3')).toBe(true);
      expect(isValidPosition('b1')).toBe(true);
      expect(isValidPosition('b2')).toBe(true);
      expect(isValidPosition('b3')).toBe(true);
      expect(isValidPosition('c1')).toBe(true);
      expect(isValidPosition('c2')).toBe(true);
      expect(isValidPosition('c3')).toBe(true);
    });

    it('should return false for invalid positions', () => {
      expect(isValidPosition('a4')).toBe(false);
      expect(isValidPosition('d1')).toBe(false);
      expect(isValidPosition('')).toBe(false);
      expect(isValidPosition('a')).toBe(false);
      expect(isValidPosition('1')).toBe(false);
      expect(isValidPosition('invalid')).toBe(false);
    });
  });

  describe('isPositionEmpty', () => {
    it('should return true for empty positions', () => {
      expect(isPositionEmpty(emptyBoard, 'a1')).toBe(true);
      expect(isPositionEmpty(emptyBoard, 'b2')).toBe(true);
      expect(isPositionEmpty(emptyBoard, 'c3')).toBe(true);
    });

    it('should return false for occupied positions', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        b2: PlayerSymbol.O,
      };
      expect(isPositionEmpty(board, 'a1')).toBe(false);
      expect(isPositionEmpty(board, 'b2')).toBe(false);
      expect(isPositionEmpty(board, 'c3')).toBe(true);
    });

    it('should throw InvalidPositionError for invalid positions', () => {
      expect(() => isPositionEmpty(emptyBoard, 'invalid')).toThrow(InvalidPositionError);
      expect(() => isPositionEmpty(emptyBoard, 'a4')).toThrow(InvalidPositionError);
    });
  });

  describe('getPlayerRole', () => {
    const playerXId = 'player-x-id';
    const playerOId = 'player-o-id';

    it('should return X for player X', () => {
      expect(getPlayerRole(playerXId, playerXId, playerOId)).toBe(PlayerSymbol.X);
    });

    it('should return O for player O', () => {
      expect(getPlayerRole(playerOId, playerXId, playerOId)).toBe(PlayerSymbol.O);
    });

    it('should return null for player not in game', () => {
      expect(getPlayerRole('other-player', playerXId, playerOId)).toBe(null);
    });

    it('should handle null playerXId', () => {
      expect(getPlayerRole(playerOId, null, playerOId)).toBe(PlayerSymbol.O);
      expect(getPlayerRole('other-player', null, playerOId)).toBe(null);
    });

    it('should handle null playerOId', () => {
      expect(getPlayerRole(playerXId, playerXId, null)).toBe(PlayerSymbol.X);
      expect(getPlayerRole('other-player', playerXId, null)).toBe(null);
    });

    it('should return null when both players are null', () => {
      expect(getPlayerRole('any-player', null, null)).toBe(null);
    });
  });

  describe('getCurrentTurn', () => {
    const playerXId = 'player-x-id';
    const playerOId = 'player-o-id';

    it('should return playerXId when currentTurn is null', () => {
      expect(getCurrentTurn(null, playerXId, playerOId)).toBe(playerXId);
    });

    it('should return currentTurn when it is set', () => {
      expect(getCurrentTurn(playerXId, playerXId, playerOId)).toBe(playerXId);
      expect(getCurrentTurn(playerOId, playerXId, playerOId)).toBe(playerOId);
    });

    it('should return null when playerXId is null', () => {
      expect(getCurrentTurn(null, null, playerOId)).toBe(null);
      expect(getCurrentTurn(playerOId, null, playerOId)).toBe(null);
    });

    it('should return playerXId when playerOId is null and currentTurn is null', () => {
      expect(getCurrentTurn(null, playerXId, null)).toBe(playerXId);
    });

    it('should return currentTurn when playerOId is null but currentTurn is set', () => {
      expect(getCurrentTurn(playerXId, playerXId, null)).toBe(playerXId);
    });

    it('should return null when both players are null', () => {
      expect(getCurrentTurn(null, null, null)).toBe(null);
    });
  });

  describe('getNextTurn', () => {
    const playerXId = 'player-x-id';
    const playerOId = 'player-o-id';

    it('should return playerXId when currentTurn is null', () => {
      expect(getNextTurn(null, playerXId, playerOId)).toBe(playerXId);
    });

    it('should return playerOId when currentTurn is playerXId', () => {
      expect(getNextTurn(playerXId, playerXId, playerOId)).toBe(playerOId);
    });

    it('should return playerXId when currentTurn is playerOId', () => {
      expect(getNextTurn(playerOId, playerXId, playerOId)).toBe(playerXId);
    });

    it('should return null when playerXId is null', () => {
      expect(getNextTurn(null, null, playerOId)).toBe(null);
      expect(getNextTurn(playerOId, null, playerOId)).toBe(null);
    });

    it('should return playerXId when playerOId is null and currentTurn is null', () => {
      expect(getNextTurn(null, playerXId, null)).toBe(playerXId);
    });

    it('should return playerXId when playerOId is null and currentTurn is playerXId', () => {
      // X can make a move without O joining
      expect(getNextTurn(playerXId, playerXId, null)).toBe(playerXId);
    });

    it('should return null when both players are null', () => {
      expect(getNextTurn(null, null, null)).toBe(null);
    });
  });

  describe('makeMove', () => {
    it('should apply move to empty position', () => {
      const result = makeMove(emptyBoard, 'a1', PlayerSymbol.X);
      expect(result.a1).toBe(PlayerSymbol.X);
      expect(result.a2).toBe(null);
      expect(emptyBoard.a1).toBe(null); // Original board unchanged (immutability)
    });

    it('should apply multiple moves immutably', () => {
      const board1 = makeMove(emptyBoard, 'a1', PlayerSymbol.X);
      const board2 = makeMove(board1, 'b2', PlayerSymbol.O);
      const board3 = makeMove(board2, 'c3', PlayerSymbol.X);

      expect(board3.a1).toBe(PlayerSymbol.X);
      expect(board3.b2).toBe(PlayerSymbol.O);
      expect(board3.c3).toBe(PlayerSymbol.X);
      expect(emptyBoard.a1).toBe(null); // Original unchanged
    });

    it('should throw InvalidPositionError for invalid position', () => {
      expect(() => makeMove(emptyBoard, 'invalid', PlayerSymbol.X)).toThrow(InvalidPositionError);
      expect(() => makeMove(emptyBoard, 'a4', PlayerSymbol.X)).toThrow(InvalidPositionError);
    });

    it('should throw PositionOccupiedError for occupied position', () => {
      const board = makeMove(emptyBoard, 'a1', PlayerSymbol.X);
      expect(() => makeMove(board, 'a1', PlayerSymbol.O)).toThrow(PositionOccupiedError);
    });
  });

  describe('checkWin', () => {
    it('should return null for empty board', () => {
      expect(checkWin(emptyBoard)).toBe(null);
    });

    it('should detect horizontal win', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        a2: PlayerSymbol.X,
        a3: PlayerSymbol.X,
      };
      expect(checkWin(board)).toBe(PlayerSymbol.X);
    });

    it('should detect vertical win', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        b1: PlayerSymbol.X,
        c1: PlayerSymbol.X,
      };
      expect(checkWin(board)).toBe(PlayerSymbol.X);
    });


    it('should detect diagonal win a1-b2-c3', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        b2: PlayerSymbol.X,
        c3: PlayerSymbol.X,
      };
      expect(checkWin(board)).toBe(PlayerSymbol.X);
    });

    it('should detect diagonal win a3-b2-c1', () => {
      const board: BoardState = {
        ...emptyBoard,
        a3: PlayerSymbol.O,
        b2: PlayerSymbol.O,
        c1: PlayerSymbol.O,
      };
      expect(checkWin(board)).toBe(PlayerSymbol.O);
    });

    it('should return null when no winner', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        a2: PlayerSymbol.O,
        b1: PlayerSymbol.O,
        b2: PlayerSymbol.X,
        c1: PlayerSymbol.X,
        c2: PlayerSymbol.O,
      };
      expect(checkWin(board)).toBe(null);
    });

    it('should return null for partial game', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        b2: PlayerSymbol.O,
      };
      expect(checkWin(board)).toBe(null);
    });
  });

  describe('checkDraw', () => {
    it('should return false for empty board', () => {
      expect(checkDraw(emptyBoard)).toBe(false);
    });

    it('should return false when there is a winner', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        a2: PlayerSymbol.X,
        a3: PlayerSymbol.X,
      };
      expect(checkDraw(board)).toBe(false);
    });

    it('should return true when board is full with no winner', () => {
      const board: BoardState = {
        a1: PlayerSymbol.X,
        a2: PlayerSymbol.O,
        a3: PlayerSymbol.X,
        b1: PlayerSymbol.O,
        b2: PlayerSymbol.X,
        b3: PlayerSymbol.O,
        c1: PlayerSymbol.O,
        c2: PlayerSymbol.X,
        c3: PlayerSymbol.O,
      };
      expect(checkDraw(board)).toBe(true);
    });

    it('should return false for partial board', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        b2: PlayerSymbol.O,
        c3: PlayerSymbol.X,
      };
      expect(checkDraw(board)).toBe(false);
    });
  });

  describe('isValidMove', () => {
    const playerXId = 'player-x-id';
    const playerOId = 'player-o-id';

    it('should return false for invalid position', () => {
      expect(isValidMove(emptyBoard, 'invalid', null, playerXId, playerOId, playerXId)).toBe(
        false
      );
    });

    it('should return false for occupied position', () => {
      const board = makeMove(emptyBoard, 'a1', PlayerSymbol.X);
      expect(isValidMove(board, 'a1', playerXId, playerXId, playerOId, playerOId)).toBe(false);
    });

    it('should return false when game is already won', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        a2: PlayerSymbol.X,
        a3: PlayerSymbol.X,
      };
      expect(isValidMove(board, 'b1', playerOId, playerXId, playerOId, playerOId)).toBe(false);
    });

    it('should return false when it is not players turn', () => {
      expect(isValidMove(emptyBoard, 'a1', playerXId, playerXId, playerOId, playerOId)).toBe(
        false
      );
    });

    it('should return true for valid first move (X goes first)', () => {
      expect(isValidMove(emptyBoard, 'a1', null, playerXId, playerOId, playerXId)).toBe(true);
      expect(isValidMove(emptyBoard, 'a1', null, playerXId, playerOId, playerOId)).toBe(false);
    });

    it('should return true for valid move on players turn', () => {
      const board = makeMove(emptyBoard, 'a1', PlayerSymbol.X);
      expect(isValidMove(board, 'b2', playerOId, playerXId, playerOId, playerOId)).toBe(true);
      expect(isValidMove(board, 'b2', playerOId, playerXId, playerOId, playerXId)).toBe(false);
    });

    it('should return true for valid move when it is players turn', () => {
      const board: BoardState = {
        ...emptyBoard,
        a1: PlayerSymbol.X,
        b2: PlayerSymbol.O,
      };
      expect(isValidMove(board, 'c3', playerXId, playerXId, playerOId, playerXId)).toBe(true);
    });

    it('should return false when playerXId is null', () => {
      expect(isValidMove(emptyBoard, 'a1', null, null, playerOId, playerOId)).toBe(false);
    });

    it('should return true when playerOId is null but playerXId is set and it is Xs turn', () => {
      expect(isValidMove(emptyBoard, 'a1', null, playerXId, null, playerXId)).toBe(true);
      expect(isValidMove(emptyBoard, 'a1', playerXId, playerXId, null, playerXId)).toBe(true);
    });

    it('should return false when playerOId is null and it is not X turn', () => {
      expect(isValidMove(emptyBoard, 'a1', null, playerXId, null, playerOId)).toBe(false);
    });

    it('should return false when both players are null', () => {
      expect(isValidMove(emptyBoard, 'a1', null, null, null, 'any-player')).toBe(false);
    });
  });
});
