import { useEffect, useRef } from 'react';

import { useGetUser, useCreateUser } from '../lib/api/user';
import { getUserId } from '../utils/cookies';

import type { User } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

// Simple guard to prevent multiple simultaneous creation calls
let isCreating = false;

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

  // Auto-create user if no cookie exists (only once, across all instances)
  useEffect(() => {
    if (
      !userId &&
      !hasAttemptedCreation.current &&
      !isCreating &&
      !createUserMutation.isPending &&
      !createUserMutation.isError
    ) {
      isCreating = true;
      hasAttemptedCreation.current = true;
      createUserMutation.mutate({}, {
        onSettled: () => {
          isCreating = false;
        },
      });
    }
   
  }, [userId, createUserMutation.isPending, createUserMutation.isError]);

  // User is only available from query once cookie is readable
  // While creation is pending, user will be undefined
  const user = userQuery.data;
  const isLoading = userQuery.isLoading || createUserMutation.isPending;
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
