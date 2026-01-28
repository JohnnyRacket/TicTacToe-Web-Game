import { apiClient } from '../client';

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

/**
 * Create a new game
 */
export async function createGame(data: CreateGameRequest): Promise<CreateGameResponse> {
  const response = await apiClient.post<CreateGameResponse>('/game/create', data);
  return response.data;
}

/**
 * Join an existing game
 */
export async function joinGame(
  gameId: string,
  data: JoinGameRequest
): Promise<JoinGameResponse> {
  const response = await apiClient.post<JoinGameResponse>(
    `/game/${gameId}/join`,
    data
  );
  return response.data;
}

/**
 * List available games
 */
export async function listGames(): Promise<ListGamesResponse> {
  const response = await apiClient.get<ListGamesResponse>('/game/list');
  return response.data;
}

/**
 * Get a game by ID
 */
export async function getGame(
  gameId: string,
  includeMoves = false
): Promise<GetGameResponse> {
  const response = await apiClient.get<GetGameResponse>(`/game/${gameId}`, {
    params: { includeMoves },
  });
  return response.data;
}

/**
 * Make a move in a game
 */
export async function makeMove(
  gameId: string,
  data: MakeMoveRequest
): Promise<MakeMoveResponse> {
  const response = await apiClient.put<MakeMoveResponse>(
    `/game/${gameId}`,
    data
  );
  return response.data;
}

/**
 * Delete a game
 */
export async function deleteGame(gameId: string): Promise<DeleteGameResponse> {
  const response = await apiClient.delete<DeleteGameResponse>(`/game/${gameId}`);
  return response.data;
}
