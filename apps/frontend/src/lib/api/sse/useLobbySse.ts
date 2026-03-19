import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { API_BASE_URL } from '../../../config/env';

import type { GameListItem } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

export function useLobbySse(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const es = new EventSource(`${API_BASE_URL}/api/sse/lobby`, {
      withCredentials: true,
    });

    es.addEventListener('lobby_updated', (e: MessageEvent) => {
      const { games }: { games: GameListItem[] } = JSON.parse(e.data);
      queryClient.setQueryData(['games', 'list'], { games });
      const userGames = games.filter(
        (g) => g.player_x_id === userId || g.player_o_id === userId
      );
      queryClient.setQueryData(['games', 'user', userId], userGames);
    });

    es.onerror = () => console.warn('Lobby SSE reconnecting...');

    return () => es.close();
  }, [userId, queryClient]);
}
