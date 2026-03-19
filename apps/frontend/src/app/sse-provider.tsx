import { useLeaderboardSse, useLobbySse } from '../lib/api/sse';
import { getUserId } from '../utils/cookies';

import type { ReactNode } from 'react';

interface SseProviderProps {
  children: ReactNode;
}

export function SseProvider({ children }: SseProviderProps) {
  const userId = getUserId();

  useLobbySse(userId);
  useLeaderboardSse();

  return <>{children}</>;
}
