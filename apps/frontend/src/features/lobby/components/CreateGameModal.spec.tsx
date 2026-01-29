import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';


import { useUser } from '../../../hooks/useUser';
import { useCreateGame } from '../../../lib/api/game/game.hooks';

import { CreateGameModal } from './CreateGameModal';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useUser hook
vi.mock('../../../hooks/useUser', () => ({
  useUser: vi.fn(),
}));

// Mock useCreateGame hook
vi.mock('../../../lib/api/game/game.hooks', () => ({
  useCreateGame: vi.fn(),
}));


const mockUseUser = vi.mocked(useUser);
const mockUseCreateGame = vi.mocked(useCreateGame);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

function renderModal(props: Partial<Parameters<typeof CreateGameModal>[0]> = {}) {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
  };

  return render(<CreateGameModal {...defaultProps} {...props} />, {
    wrapper: createWrapper(),
  });
}

describe('CreateGameModal', () => {
  let mockMutate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate = vi.fn();

    // Reset mocks to default state
    mockUseUser.mockReturnValue({
      user: { id: 'user-1', name: 'Test User', wins: 0, losses: 0, draws: 0, color: '#3b82f6' },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseCreateGame.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      isIdle: true,
      isSuccess: false,
      data: undefined,
      variables: undefined,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      status: 'idle',
      submittedAt: 0,
    } as unknown as ReturnType<typeof useCreateGame>);
  });

  it('renders the modal with title and description', () => {
    renderModal();

    expect(screen.getByText('Create New Game')).toBeInTheDocument();
    expect(screen.getByText('Choose your player role. X goes first, O goes second.')).toBeInTheDocument();
  });

  it('shows Player X and Player O role options', () => {
    renderModal();

    expect(screen.getByText('Player X')).toBeInTheDocument();
    expect(screen.getByText('Player O')).toBeInTheDocument();
    expect(screen.getByText('Goes first')).toBeInTheDocument();
    expect(screen.getByText('Goes second')).toBeInTheDocument();
  });

  it('allows selecting Player O role', async () => {
    const user = userEvent.setup();
    renderModal();

    // Click on Player O button
    const playerOButton = screen.getByText('Player O').closest('button');
    await user.click(playerOButton!);

    // The button should now have the selected styling (border-primary)
    expect(playerOButton).toHaveClass('border-primary');
  });

  it('calls createGame mutation with correct data when Create Game is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Create Game' }));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      {
        player_id: 'user-1',
        player_role: 'x', // Default selection is X
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
  });

  it('navigates to game page on successful creation', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    // Make mutate call the onSuccess callback
    mockMutate.mockImplementation((data: unknown, options: { onSuccess?: (response: { game: { id: string } }) => void }) => {
      options?.onSuccess?.({ game: { id: 'new-game-123' } });
    });

    mockUseCreateGame.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
      isIdle: true,
      isSuccess: false,
      data: undefined,
      variables: undefined,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      status: 'idle',
      submittedAt: 0,
    } as unknown as ReturnType<typeof useCreateGame>);

    renderModal({ onOpenChange });

    await user.click(screen.getByRole('button', { name: 'Create Game' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith('/game/new-game-123');
  });

  it('closes modal and resets selection when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderModal({ onOpenChange });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state when user is loading', () => {
    mockUseUser.mockReturnValue({
      user: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderModal();

    expect(screen.getByText('Loading user information...')).toBeInTheDocument();
  });

  it('shows error when user cannot be loaded', () => {
    mockUseUser.mockReturnValue({
      user: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed'),
      refetch: vi.fn(),
    });

    renderModal();

    expect(screen.getByText('Unable to load user. Please refresh the page.')).toBeInTheDocument();
  });

  it('disables Create Game button when user is not available', () => {
    mockUseUser.mockReturnValue({
      user: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderModal();

    expect(screen.getByRole('button', { name: 'Create Game' })).toBeDisabled();
  });

  it('shows Creating... text when mutation is pending', () => {
    mockUseCreateGame.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
      isIdle: false,
      isSuccess: false,
      data: undefined,
      variables: undefined,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      status: 'pending',
      submittedAt: 0,
    } as unknown as ReturnType<typeof useCreateGame>);

    renderModal();

    expect(screen.getByRole('button', { name: 'Creating...' })).toBeInTheDocument();
  });

  it('shows error message when game creation fails', () => {
    mockUseCreateGame.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: false,
      isError: true,
      error: { message: 'Server error' },
      isIdle: false,
      isSuccess: false,
      data: undefined,
      variables: undefined,
      reset: vi.fn(),
      context: undefined,
      failureCount: 1,
      failureReason: { message: 'Server error' },
      status: 'error',
      submittedAt: 0,
    } as unknown as ReturnType<typeof useCreateGame>);

    renderModal();

    expect(screen.getByText('Server error')).toBeInTheDocument();
  });
});
