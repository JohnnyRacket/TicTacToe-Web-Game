import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { Link } from 'react-router-dom';

import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';

import type { Game } from '@tic-tac-toe-web-game/tic-tac-toe-lib';


interface CurrentGameItemProps {
  game: Game;
  currentUserId: string;
  opponentName?: string;
}

export function CurrentGameItem({
  game,
  currentUserId,
  opponentName,
}: CurrentGameItemProps) {
  const isMyTurn =
    game.current_turn === currentUserId &&
    game.status === GameStatusEnum.IN_PROGRESS;
  const isWaiting = game.status === GameStatusEnum.WAITING;
  const isInProgress = game.status === GameStatusEnum.IN_PROGRESS;

  const displayName = opponentName || 'Unknown Player';

  return (
    <Link to={`/game/${game.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">vs {displayName}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isInProgress ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {isWaiting
                    ? 'Waiting'
                    : isInProgress
                    ? 'In Progress'
                    : 'Completed'}
                </Badge>
                {isMyTurn && (
                  <Badge variant="outline" className="text-xs">
                    Your Turn
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
