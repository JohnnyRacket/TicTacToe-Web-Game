
import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { Link } from 'react-router-dom';

import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';

import type { GameListItem } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface CurrentGameItemProps {
  game: GameListItem;
  currentUserId: string;
  opponentName?: string;
}

export function CurrentGameItem({
  game,
  currentUserId,
  opponentName,
}: CurrentGameItemProps) {
  const isWaiting = game.status === GameStatusEnum.WAITING;
  const isInProgress = game.status === GameStatusEnum.IN_PROGRESS;
  const isMyTurn = isInProgress && game.current_turn === currentUserId;

  const displayName = opponentName || 'Unknown Player';

  return (
    <Link to={`/game/${game.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer flex-shrink-0 md:flex-shrink w-32 md:w-auto">
        <CardContent className="p-2 md:p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs md:text-sm font-medium truncate">vs {displayName}</div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 mt-1">
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
                  <Badge variant="default" className="text-xs bg-green-600">
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
