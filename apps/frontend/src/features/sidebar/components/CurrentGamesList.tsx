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
    <div className="flex flex-col md:flex-col h-full md:h-full">
      <h3 className="text-xs md:text-sm font-semibold mb-2 px-2 md:px-4 text-muted-foreground flex-shrink-0 py-2">
        Current Games
      </h3>
      <div className="flex-1 overflow-y-auto md:overflow-y-auto overflow-x-auto md:overflow-x-visible px-2 min-h-0 md:min-h-0">
        {isLoading ? (
          <div className="text-xs md:text-sm text-muted-foreground px-2 md:px-4 py-2 whitespace-nowrap md:whitespace-normal">
            Loading games...
          </div>
        ) : games.length === 0 ? (
          <div className="text-xs md:text-sm text-muted-foreground px-2 md:px-4 py-2 whitespace-nowrap md:whitespace-normal">
            No active games
          </div>
        ) : (
          <div className="flex flex-row md:flex-col gap-2 pb-2 md:pb-0">
            {games.map((game) => (
              <CurrentGameItem
                key={game.id}
                game={game}
                currentUserId={user?.id || ''}
                opponentName={getOpponentName(game)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
