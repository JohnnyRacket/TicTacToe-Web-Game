/**
 * Error thrown when a game is not found
 */
export class GameNotFoundError extends Error {
  constructor(gameId: string) {
    super(`Game with id ${gameId} not found`);
    this.name = 'GameNotFoundError';
  }
}

/**
 * Error thrown when attempting to join a game that already has both players
 */
export class GameFullError extends Error {
  constructor(gameId: string) {
    super(`Game with id ${gameId} is full`);
    this.name = 'GameFullError';
  }
}

/**
 * Error thrown when a move is invalid (wrong turn, game over, position occupied, etc.)
 */
export class InvalidMoveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidMoveError';
  }
}

/**
 * Error thrown when attempting to join a game that is not in 'waiting' status
 */
export class GameNotJoinableError extends Error {
  constructor(gameId: string, status: string) {
    super(`Game with id ${gameId} is not joinable. Current status: ${status}`);
    this.name = 'GameNotJoinableError';
  }
}

/**
 * Error thrown when a user attempts to perform an action on a game they are not a participant of
 */
export class NotGameParticipantError extends Error {
  constructor(gameId: string, playerId: string) {
    super(`Player ${playerId} is not a participant in game ${gameId}`);
    this.name = 'NotGameParticipantError';
  }
}
