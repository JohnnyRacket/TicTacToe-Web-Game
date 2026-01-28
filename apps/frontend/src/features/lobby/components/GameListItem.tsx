import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

import type { GameListItem as GameListItemType } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GameListItemProps {
  game: GameListItemType;
  onJoin: (gameId: string) => void;
}

export function GameListItem({ game, onJoin }: GameListItemProps) {
  const isFull = game.participant_count >= 2;
  const canJoin = !isFull && game.status === 'waiting';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Game {game.id.slice(-4)}</CardTitle>
          <Badge variant="secondary">
            {game.participant_count}/2 players
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-muted-foreground">Host: </span>
            <span className="font-medium">
              {game.player_x_id ? `Player ${game.player_x_id.slice(-4)}` : 'Unknown'}
            </span>
          </div>
          <div className="text-muted-foreground">
            Created {new Date(game.created_at).toLocaleString()}
          </div>
        </div>
        <Button
          onClick={() => onJoin(game.id)}
          className="w-full"
          disabled={!canJoin}
        >
          {isFull ? 'Full' : 'Join Game'}
        </Button>
      </CardContent>
    </Card>
  );
}
