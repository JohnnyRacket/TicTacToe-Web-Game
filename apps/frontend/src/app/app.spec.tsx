import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './app';

// Mock the cookies utility to avoid localStorage issues in tests
vi.mock('../utils/cookies', () => ({
  getUserId: vi.fn().mockReturnValue('test-user-id'),
  setUserId: vi.fn(),
  removeUserId: vi.fn(),
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  removeCookie: vi.fn(),
  hasCookie: vi.fn(),
}));

// Mock the user API hooks
vi.mock('../lib/api/user', () => ({
  useGetUser: vi.fn().mockReturnValue({
    data: { id: 'test-user-id', name: 'Test User', wins: 0, losses: 0, draws: 0, color: '#3b82f6' },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreateUser: vi.fn().mockReturnValue({
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
    mutate: vi.fn(),
  }),
  useUpdateUser: vi.fn().mockReturnValue({
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
    mutate: vi.fn(),
  }),
}));

// Mock the game API hooks
vi.mock('../lib/api/game/game.hooks', () => ({
  useListGames: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    isRefetching: false,
  }),
  useUserGames: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  }),
  useCreateGame: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
  useJoinGame: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function renderApp(initialRoute = '/') {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('renders successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });

  it('renders the lobby page by default', async () => {
    renderApp('/');
    // Lazy-loaded components need async assertions
    expect(await screen.findByText('Game Lobby')).toBeInTheDocument();
  });

  it('renders the sidebar navigation', () => {
    renderApp();
    // Sidebar should have Lobby and Leaderboard links (desktop version)
    expect(screen.getAllByText('Lobby').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Leaderboard').length).toBeGreaterThan(0);
  });
});
