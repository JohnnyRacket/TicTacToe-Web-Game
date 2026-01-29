import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { useGetUser, useCreateUser } from '../lib/api/user';
import { getUserId } from '../utils/cookies';

import { useUser } from './useUser';


// Mock the cookies utility
vi.mock('../utils/cookies', () => ({
  getUserId: vi.fn(),
}));

// Mock the API hooks
vi.mock('../lib/api/user', () => ({
  useGetUser: vi.fn(),
  useCreateUser: vi.fn(),
}));

const mockGetUserId = vi.mocked(getUserId);
const mockUseGetUser = vi.mocked(useGetUser);
const mockUseCreateUser = vi.mocked(useCreateUser);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data when user ID exists in cookie', () => {
    const mockUser = { id: 'user-123', name: 'Test User', wins: 5, losses: 2, draws: 1, color: '#3b82f6' };

    mockGetUserId.mockReturnValue('user-123');
    mockUseGetUser.mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetUser>);
    mockUseCreateUser.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateUser>);

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns loading state when fetching user', () => {
    mockGetUserId.mockReturnValue('user-123');
    mockUseGetUser.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetUser>);
    mockUseCreateUser.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateUser>);

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
  });

  it('triggers user creation when no user ID in cookie', async () => {
    const mockMutate = vi.fn();

    mockGetUserId.mockReturnValue(null);
    mockUseGetUser.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetUser>);
    mockUseCreateUser.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useCreateUser>);

    renderHook(() => useUser(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({});
    });
  });

  it('returns error state when query fails', () => {
    const mockError = new Error('Failed to fetch user');

    mockGetUserId.mockReturnValue('user-123');
    mockUseGetUser.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetUser>);
    mockUseCreateUser.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateUser>);

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });

  it('uses created user data when mutation succeeds', () => {
    const mockCreatedUser = { id: 'new-user', name: 'New User', wins: 0, losses: 0, draws: 0, color: '#3b82f6' };

    mockGetUserId.mockReturnValue(null);
    mockUseGetUser.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetUser>);
    mockUseCreateUser.mockReturnValue({
      data: { user: mockCreatedUser },
      isPending: false,
      isError: false,
      error: null,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateUser>);

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

    expect(result.current.user).toEqual(mockCreatedUser);
  });
});
