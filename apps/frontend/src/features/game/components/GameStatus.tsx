import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

import { Badge } from '../../../components/ui/badge';

import type { GameStatus as GameStatusType } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GameStatusProps {
  status: GameStatusType;
  currentTurnPlayerId: string | null;
  currentUserId: string | null;
  playerXId: string | null;
  playerOId: string | null;
}

export function GameStatus({
  status,
  currentTurnPlayerId,
  currentUserId,
}: GameStatusProps) {
  const isUserTurn =
    currentTurnPlayerId === currentUserId &&
    status === GameStatusEnum.IN_PROGRESS;

  const getStatusLabel = () => {
    switch (status) {
      case GameStatusEnum.WAITING:
        return 'Waiting';
      case GameStatusEnum.IN_PROGRESS:
        return 'In Progress';
      case GameStatusEnum.COMPLETED:
        return 'Completed';
      case GameStatusEnum.ABANDONED:
        return 'Abandoned';
      default:
        return 'Unknown';
    }
  };

  const getTurnLabel = () => {
    if (status !== GameStatusEnum.IN_PROGRESS) return null;
    if (!currentTurnPlayerId || !currentUserId) return null;

    // Check if it's the current user's turn
    if (currentTurnPlayerId === currentUserId) {
      return "Your Turn";
    }

    // Otherwise it's the opponent's turn
    return "Opponent's Turn";
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={
          status === GameStatusEnum.IN_PROGRESS ? 'default' : 'secondary'
        }
      >
        {getStatusLabel()}
      </Badge>
      {getTurnLabel() && (
        <Badge
          variant={isUserTurn ? 'default' : 'outline'}
          className={
            isUserTurn
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
              : ''
          }
        >
          {getTurnLabel()}
        </Badge>
      )}
    </div>
  );
}
