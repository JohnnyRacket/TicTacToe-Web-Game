import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createGame,
  joinGame,
  listGames,
  getUserGames,
  getGame,
  makeMove,
  deleteGame,
} from './game.api';

import type {
  JoinGameRequest,
  MakeMoveRequest,
} from '@tic-tac-toe-web-game/tic-tac-toe-lib';

/**
 * Hook to create a game
 */
export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      // Invalidate game list and user games queries
      queryClient.invalidateQueries({ queryKey: ['games', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['games', 'user'] });
    },
  });
}

/**
 * Hook to join a game
 */
export function useJoinGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, data }: { gameId: string; data: JoinGameRequest }) =>
      joinGame(gameId, data),
    onSuccess: (_, variables) => {
      // Invalidate game list, user games, and the specific game
      queryClient.invalidateQueries({ queryKey: ['games', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['games', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['games', variables.gameId] });
    },
  });
}

/**
 * Hook to list available games
 */
export function useListGames(refetchInterval?: number) {
  return useQuery({
    queryKey: ['games', 'list'],
    queryFn: listGames,
    refetchInterval: refetchInterval
      ? (query) => {
          // Disable refetch interval if there's an error (backend is down)
          if (query.state?.error) {
            return false;
          }
          return refetchInterval;
        }
      : undefined,
    select: (data) => data.games,
    // Use default retry logic with exponential backoff
    throwOnError: false,
  });
}

/**
 * Hook to get a single game
 */
export function useGetGame(gameId: string, refetchInterval?: number) {
  return useQuery({
    queryKey: ['games', gameId],
    queryFn: () => getGame(gameId),
    enabled: !!gameId,
    refetchInterval: refetchInterval
      ? (query) => {
          // Disable refetch interval if there's an error (backend is down)
          if (query.state?.error) {
            return false;
          }
          return refetchInterval;
        }
      : undefined,
    // Use default retry logic with exponential backoff
    throwOnError: false,
  });
}

/**
 * Hook to make a move
 */
export function useMakeMove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gameId,
      data,
    }: {
      gameId: string;
      data: MakeMoveRequest;
    }) => makeMove(gameId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific game and user games
      queryClient.invalidateQueries({ queryKey: ['games', variables.gameId] });
      queryClient.invalidateQueries({ queryKey: ['games', 'user'] });
    },
  });
}

/**
 * Hook to delete a game
 */
export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGame,
    onSuccess: (_, gameId) => {
      // Invalidate game list, user games, and the specific game
      queryClient.invalidateQueries({ queryKey: ['games', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['games', 'user'] });
      queryClient.removeQueries({ queryKey: ['games', gameId] });
    },
  });
}

/**
 * Hook to get user's games (server-side filtered)
 * Returns GameListItem[]
 */
export function useUserGames(userId: string | null, refetchInterval?: number) {
  return useQuery({
    queryKey: ['games', 'user', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const response = await getUserGames(userId);
      return response.games;
    },
    enabled: !!userId,
    refetchInterval: refetchInterval
      ? (query) => {
          // Disable refetch interval if there's an error (backend is down)
          if (query.state?.error) {
            return false;
          }
          return refetchInterval;
        }
      : undefined,
    // Use default retry logic with exponential backoff
    throwOnError: false,
  });
}
