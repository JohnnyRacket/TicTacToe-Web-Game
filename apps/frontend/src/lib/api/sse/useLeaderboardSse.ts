import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { API_BASE_URL } from '../../../config/env';

export function useLeaderboardSse() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`${API_BASE_URL}/api/sse/leaderboard`, {
      withCredentials: true,
    });

    es.addEventListener('leaderboard_updated', (e: MessageEvent) => {
      const { leaderboard } = JSON.parse(e.data);
      queryClient.setQueryData(['leaderboard'], { leaderboard });
    });

    es.onerror = () => console.warn('Leaderboard SSE reconnecting...');

    return () => es.close();
  }, [queryClient]);
}
