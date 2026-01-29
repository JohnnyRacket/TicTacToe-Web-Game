import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStatus } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { MemoryRouter } from 'react-router-dom';

import { GameEndDialog } from './GameEndDialog';

import type { Game, User } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  wins: 5,
  losses: 3,
  draws: 2,
  color: '#3b82f6',
};

const createMockGame = (overrides: Partial<Game> = {}): Game => ({
  id: 'game-1',
  player_x_id: 'user-1',
  player_o_id: 'user-2',
  current_turn: 'user-1',
  status: GameStatus.COMPLETED,
  winner_id: null,
  board_state: {
    a1: 'x', a2: 'o', a3: 'x',
    b1: 'o', b2: 'x', b3: 'o',
    c1: 'o', c2: 'x', c3: 'o',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

function renderDialog(props: Partial<Parameters<typeof GameEndDialog>[0]> = {}) {
  const defaultProps = {
    open: true,
    game: createMockGame(),
    currentUser: mockUser,
    onOpenChange: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <GameEndDialog {...defaultProps} {...props} />
    </MemoryRouter>
  );
}

describe('GameEndDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when game is null', () => {
    renderDialog({ game: null });
    expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
  });

  it('does not render when currentUser is null', () => {
    renderDialog({ currentUser: null });
    expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
  });

  it('shows win message when current user won', () => {
    renderDialog({
      game: createMockGame({ winner_id: 'user-1' }),
      currentUser: mockUser,
    });

    expect(screen.getByText('🎉 You Won!')).toBeInTheDocument();
    expect(screen.getByText('Congratulations! You won the game.')).toBeInTheDocument();
  });

  it('shows loss message when current user lost', () => {
    renderDialog({
      game: createMockGame({ winner_id: 'user-2' }),
      currentUser: mockUser,
    });

    expect(screen.getByText('😔 You Lost')).toBeInTheDocument();
    expect(screen.getByText('Better luck next time!')).toBeInTheDocument();
  });

  it('shows draw message when game ended in a draw', () => {
    renderDialog({
      game: createMockGame({ winner_id: null, status: GameStatus.COMPLETED }),
      currentUser: mockUser,
    });

    expect(screen.getByText('🤝 Draw')).toBeInTheDocument();
    expect(screen.getByText("It's a tie! Good game.")).toBeInTheDocument();
  });

  it('displays user record (wins, losses, draws)', () => {
    renderDialog();

    expect(screen.getByText('Your Record')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // wins
    expect(screen.getByText('3')).toBeInTheDocument(); // losses
    expect(screen.getByText('2')).toBeInTheDocument(); // draws
    expect(screen.getByText('Wins')).toBeInTheDocument();
    expect(screen.getByText('Losses')).toBeInTheDocument();
    expect(screen.getByText('Draws')).toBeInTheDocument();
  });

  it('navigates to lobby when Back to Lobby is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderDialog({ onOpenChange });

    await user.click(screen.getByRole('button', { name: 'Back to Lobby' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not render when dialog is closed', () => {
    renderDialog({ open: false });
    
    // Dialog content should not be visible when closed
    expect(screen.queryByText('Your Record')).not.toBeInTheDocument();
  });
});
