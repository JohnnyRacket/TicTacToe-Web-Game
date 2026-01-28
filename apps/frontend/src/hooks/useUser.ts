import { useEffect, useRef } from 'react';

import { useGetUser, useCreateUser } from '../lib/api/user';
import { getUserId } from '../utils/cookies';

import type { User } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

/**
 * Hook to manage current user
 * Auto-creates user if cookie doesn't exist, otherwise fetches from API
 */
export function useUser(): {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const userId = getUserId();
  const createUserMutation = useCreateUser();
  const hasAttemptedCreation = useRef(false);

  // Fetch user if we have a user ID
  const userQuery = useGetUser(userId);

  // Auto-create user if no userId exists (only once)
  useEffect(() => {
    if (!userId && !hasAttemptedCreation.current && !createUserMutation.isPending) {
      hasAttemptedCreation.current = true;
      createUserMutation.mutate({});
    }
  }, [userId, createUserMutation]);

  // Use user from query if available, otherwise use mutation data (user was just created)
  const user = userQuery.data || createUserMutation.data?.user;

  // Loading if: query is loading OR mutation is pending OR we're waiting for user (no user yet and creation attempted)
  const isLoading =
    userQuery.isLoading ||
    createUserMutation.isPending ||
    (!user && hasAttemptedCreation.current && !createUserMutation.isError);

  // Error if either query or mutation has error
  const isError = userQuery.isError || createUserMutation.isError;
  const error = userQuery.error || createUserMutation.error;

  return {
    user,
    isLoading,
    isError,
    error,
    refetch: userQuery.refetch,
  };
}
