import { useUser } from '../../../hooks/useUser';
import { useUserGames } from '../../../lib/api/game';

import { CurrentGameItem } from './CurrentGameItem';

export function CurrentGamesList() {
  const { user } = useUser();
  const { data: games = [], isLoading } = useUserGames(user?.id || null, 2000); // Poll every 2 seconds

  const getOpponentName = (game: typeof games[0]): string => {
    if (!user) return 'Unknown';
    
    if (game.player_x_id === user.id) {
      return game.player_o_id ? `Player ${game.player_o_id.slice(-4)}` : 'Waiting...';
    }
    return game.player_x_id ? `Player ${game.player_x_id.slice(-4)}` : 'Unknown';
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2 px-4 text-muted-foreground">
        Current Games
      </h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto px-2">
        {isLoading ? (
          <div className="text-sm text-muted-foreground px-4 py-2">
            Loading games...
          </div>
        ) : games.length === 0 ? (
          <div className="text-sm text-muted-foreground px-4 py-2">
            No active games
          </div>
        ) : (
          games.map((game) => (
            <CurrentGameItem
              key={game.id}
              game={game}
              currentUserId={user?.id || ''}
              opponentName={getOpponentName(game)}
            />
          ))
        )}
      </div>
    </div>
  );
}
