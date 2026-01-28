import axios from 'axios';

import { API_BASE_URL } from '../../config/env';

import type { ApiError } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import type { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Important for cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: ApiError }>) => {
    // If the error has a response with our ApiError format, use it
    if (error.response?.data?.error) {
      return Promise.reject(error.response.data.error);
    }
    
    // Otherwise, create a generic error
    return Promise.reject({
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
    } as ApiError);
  }
);
