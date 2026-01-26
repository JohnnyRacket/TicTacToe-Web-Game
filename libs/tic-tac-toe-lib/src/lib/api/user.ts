import type { User } from '../domain/user.js';

/**
 * Request to create a new user
 */
export interface CreateUserRequest {
  name?: string;
}

/**
 * Response from creating a user
 */
export interface CreateUserResponse {
  user: User;
}

/**
 * Request to update a user
 */
export interface UpdateUserRequest {
  name?: string;
  color?: string | null;
}

/**
 * Response from updating a user
 */
export interface UpdateUserResponse {
  user: User;
}
