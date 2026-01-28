import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useUser } from '../../../hooks/useUser';
import { useGetUser } from '../../../lib/api/user';

import type { GameListItem as GameListItemType } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GameListItemProps {
  game: GameListItemType;
  onJoin: (gameId: string) => void;
  isJoining?: boolean;
}

export function GameListItem({ game, onJoin, isJoining = false }: GameListItemProps) {
  const { user: currentUser } = useUser();
  const isFull = game.participant_count >= 2;
  const isWaiting = game.status === 'waiting';
  
  // Check if current user is already a participant
  const isCurrentUserParticipant = 
    currentUser?.id === game.player_x_id || 
    currentUser?.id === game.player_o_id;
  
  const canJoin = !isFull && isWaiting && !isCurrentUserParticipant;

  // Determine the host - whoever created the game first (first non-null player)
  const hostId = game.player_x_id || game.player_o_id;
  const { data: hostUser } = useGetUser(hostId);

  // Determine display name
  const getHostDisplayName = () => {
    if (!hostId) return 'Unknown';
    
    // If it's the current user, show "You"
    if (currentUser?.id === hostId) {
      return currentUser.name || 'You';
    }
    
    // Otherwise show the host's name or fallback
    return hostUser?.name || `Player ${hostId.slice(-4)}`;
  };

  // Determine button text
  const getButtonText = () => {
    if (isJoining) {
      return 'Joining...';
    }
    if (isCurrentUserParticipant) {
      return 'Already Joined';
    }
    if (isFull) {
      return 'Full';
    }
    return 'Join Game';
  };

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
              {getHostDisplayName()}
            </span>
          </div>
          <div className="text-muted-foreground">
            Created {new Date(game.created_at).toLocaleString()}
          </div>
        </div>
        <Button
          onClick={() => onJoin(game.id)}
          className="w-full"
          disabled={!canJoin || isJoining}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
