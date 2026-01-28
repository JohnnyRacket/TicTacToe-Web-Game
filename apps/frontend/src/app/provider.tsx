import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, _error) => {
        // Retry up to 3 times
        return failureCount < 3;
      },
      retryDelay: (retryAttempt) => {
        // Exponential backoff delays: 1s, 2s, 4s...
        const baseDelay = 1000; // 1 second
        const exponentialDelay = baseDelay * Math.pow(2, retryAttempt);
        return Math.min(exponentialDelay, 30000);
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Always refetch on reconnect, even if there's an error
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
