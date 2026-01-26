import type { BoardPosition } from '../domain/game.js';

/**
 * Error thrown when an invalid position is provided
 */
export class InvalidPositionError extends Error {
  constructor(position: string) {
    super(`Invalid position: ${position}. Must be one of: <a-c><1-3>.`);
    this.name = 'InvalidPositionError';
  }
}

/**
 * Error thrown when attempting to make a move to an already occupied position
 */
export class PositionOccupiedError extends Error {
  constructor(position: BoardPosition) {
    super(`Position ${position} is already occupied`);
    this.name = 'PositionOccupiedError';
  }
}
