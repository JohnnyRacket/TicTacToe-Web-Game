import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { GameListItem as GameListItemComponent } from '../../features/lobby/components/GameListItem';

import type { GameListItem } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

// Mock game list data - will be replaced with API data
const mockGames: GameListItem[] = [
  {
    id: 'game-1',
    player_x_id: 'player-x-1',
    player_o_id: null,
    status: GameStatusEnum.WAITING,
    participant_count: 1,
    created_at: new Date('2024-01-27T10:00:00Z'),
  },
  {
    id: 'game-2',
    player_x_id: 'player-x-2',
    player_o_id: null,
    status: GameStatusEnum.WAITING,
    participant_count: 1,
    created_at: new Date('2024-01-27T10:05:00Z'),
  },
  {
    id: 'game-3',
    player_x_id: 'player-x-3',
    player_o_id: 'player-o-3',
    status: GameStatusEnum.IN_PROGRESS,
    participant_count: 2,
    created_at: new Date('2024-01-27T09:50:00Z'),
  },
];

export function HomePage() {
  // Mock data - will be replaced with API call
  const games = mockGames;

  const handleCreateGame = () => {
    // Mock create game - will be wired up to API
    console.log('Creating new game...');
  };

  const handleJoinGame = (gameId: string) => {
    // Mock join game - will be wired up to API
    console.log('Joining game:', gameId);
  };

  const availableGames = games.filter(
    (game) =>
      game.status === GameStatusEnum.WAITING && game.participant_count < 2
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Game Lobby</h1>
          <p className="text-muted-foreground mt-1">
            Join an available game or create a new one
          </p>
        </div>
        <Button onClick={handleCreateGame} size="lg">
          Create Game
        </Button>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Available Games</h2>
        {availableGames.length === 0 ? (
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
