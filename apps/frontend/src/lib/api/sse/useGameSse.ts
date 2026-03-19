import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { API_BASE_URL } from '../../../config/env';

export function useGameSse(gameId: string, userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!gameId || !userId) return;

    const es = new EventSource(`${API_BASE_URL}/api/sse/game/${gameId}`, {
      withCredentials: true,
    });

    es.addEventListener('game_updated', (e: MessageEvent) => {
      const { game } = JSON.parse(e.data);
      queryClient.setQueryData(['games', gameId], { game });
    });

    es.addEventListener('game_deleted', () => {
      queryClient.removeQueries({ queryKey: ['games', gameId] });
    });

    es.onerror = () => console.warn('Game SSE reconnecting...');

    return () => es.close();
  }, [gameId, userId, queryClient]);
}
