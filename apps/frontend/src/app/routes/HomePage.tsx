import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { CreateGameModal } from '../../features/lobby/components/CreateGameModal';
import { GameListItem as GameListItemComponent } from '../../features/lobby/components/GameListItem';
import { useUser } from '../../hooks/useUser';
import { useJoinGame, useListGames } from '../../lib/api/game/game.hooks';

export function HomePage() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useUser();
  const {
    data: games = [],
    isLoading: isGamesLoading,
    isError: isGamesError,
    refetch: refetchGames,
    isRefetching: isRefetchingGames,
  } = useListGames(30000); // Auto-refetch every 30 seconds
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const joinGameMutation = useJoinGame();

  const handleCreateGame = () => {
    setIsCreateModalOpen(true);
  };

  const handleJoinGame = (gameId: string) => {
    if (!user?.id) {
      return;
    }

    setJoiningGameId(gameId);
    joinGameMutation.mutate(
      {
        gameId,
        data: { player_x_id: user.id },
      },
      {
        onSuccess: () => {
          navigate(`/game/${gameId}`);
        },
        onError: (error) => {
          console.error('Failed to join game:', error);
          setJoiningGameId(null);
          // Error handling could be improved with toast notifications
        },
      }
    );
  };

  const availableGames = games.filter(
    (game) =>
      game.status === GameStatusEnum.WAITING && game.participant_count < 2
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Game Lobby</h1>
            <p className="text-muted-foreground mt-1">
              Join an available game or create a new one
            </p>
          </div>
          <Button
            onClick={handleCreateGame}
            size="lg"
            disabled={isUserLoading}
          >
            Create Game
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Games</h2>
            <Button
              onClick={() => refetchGames()}
              variant="outline"
              size="sm"
              disabled={isRefetchingGames || isGamesLoading}
            >
              <RefreshCw
                size={16}
                className={isRefetchingGames ? 'animate-spin' : ''}
              />
              {isRefetchingGames ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          {isGamesLoading ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Loading games...
              </CardContent>
            </Card>
          ) : isGamesError ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Unable to load games. Please try again later.
              </CardContent>
            </Card>
          ) : availableGames.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No available games. Create a new game to get started!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableGames.map((game) => (
                <GameListItemComponent
                  key={game.id}
                  game={game}
                  onJoin={handleJoinGame}
                  isJoining={joiningGameId === game.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateGameModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}

export default HomePage;
