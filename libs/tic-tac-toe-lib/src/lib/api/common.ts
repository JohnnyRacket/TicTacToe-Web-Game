/**
 * Standard API error response format
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Standard API response wrapper
 */
export type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: ApiError;
};
