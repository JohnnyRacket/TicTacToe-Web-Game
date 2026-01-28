import { CurrentGameItem } from './CurrentGameItem';

import type { Game } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
// TODO: Import useUserGames hook when available
// import { useUserGames } from '../../../hooks/useUserGames';
// import { useUser } from '../../../hooks/useUser';

export function CurrentGamesList() {
  // TODO: Replace with React Query hooks
  // const { data: user } = useUser();
  // const { data: games, isLoading } = useUserGames(user?.id);
  
  // Mock data - will be replaced with hooks
  const games: Game[] = [];
  const currentUserId = 'user-123';
  const isLoading = false;

  const getOpponentName = (game: Game): string => {
    // TODO: Fetch opponent name from user data or API
    if (game.player_x_id === currentUserId) {
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
              currentUserId={currentUserId}
              opponentName={getOpponentName(game)}
            />
          ))
        )}
      </div>
    </div>
  );
}
