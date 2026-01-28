import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createUser, getUser, updateUser } from './user.api';

import type { UpdateUserRequest } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

/**
 * Hook to get a user by ID
 */
export function useGetUser(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
    select: (data) => data.user,
    // Use default retry logic with exponential backoff (configured in QueryClient)
    throwOnError: false, // Don't throw errors, let components handle them gracefully
  });
}

/**
 * Hook to create a user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      // Set the user data in cache and invalidate queries
      queryClient.setQueryData(['user', data.user.id], data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    retry: false, // Don't retry on failure
    throwOnError: false, // Don't throw errors, let components handle them gracefully
  });
}

/**
 * Hook to update user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      updateUser(userId, data),
    onSuccess: (data, variables) => {
      // Update the user data in cache
      queryClient.setQueryData(['user', variables.userId], data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
