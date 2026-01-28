import { apiClient } from '../client';

import type {
  CreateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@tic-tac-toe-web-game/tic-tac-toe-lib';

/**
 * Create a new user
 */
export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await apiClient.post<CreateUserResponse>('/user/create', data);
  return response.data;
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<GetUserResponse> {
  const response = await apiClient.get<GetUserResponse>(`/user/${userId}`);
  return response.data;
}

/**
 * Update user name and/or color
 */
export async function updateUser(
  userId: string,
  data: UpdateUserRequest
): Promise<UpdateUserResponse> {
  const response = await apiClient.put<UpdateUserResponse>(
    `/user/${userId}`,
    data
  );
  return response.data;
}
