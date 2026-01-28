import { useQuery } from '@tanstack/react-query';

import { getLeaderboard } from './leaderboard.api';

/**
 * Hook to get leaderboard
 */
export function useGetLeaderboard(refetchInterval?: number) {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
    refetchInterval: refetchInterval
      ? (query) => {
          // Disable refetch interval if there's an error (backend is down)
          if (query.state?.error) {
            return false;
          }
          return refetchInterval;
        }
      : undefined,
    select: (data) => data.leaderboard,
    // Use default retry logic with exponential backoff
    throwOnError: false,
  });
}
