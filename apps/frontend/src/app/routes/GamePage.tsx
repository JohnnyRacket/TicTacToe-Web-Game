import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { GameBoard } from '../../features/game/components/GameBoard';
import { GamePlayers } from '../../features/game/components/GamePlayers';
import { GameStatus } from '../../features/game/components/GameStatus';

import type { BoardPosition, Game } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

// Mock game data - will be replaced with API data
const mockGame: Game = {
  id: 'game-1',
  player_x_id: 'player-x-id',
  player_o_id: 'player-o-id',
  current_turn: 'player-x-id',
  board_state: {
    a1: 'x',
    a2: null,
    a3: 'o',
    b1: null,
    b2: 'x',
    b3: null,
    c1: 'o',
    c2: null,
    c3: null,
  },
  status: GameStatusEnum.IN_PROGRESS,
  winner_id: null,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockPlayerX = {
  id: 'player-x-id',
  name: 'Player One',
  color: '#3b82f6',
  wins: 5,
  losses: 2,
  draws: 1,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockPlayerO = {
  id: 'player-o-id',
  name: 'Player Two',
  color: '#ef4444',
  wins: 3,
  losses: 4,
  draws: 1,
  created_at: new Date(),
  updated_at: new Date(),
};

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const currentUserId = 'player-x-id'; // Mock - will come from user context

  // Mock data - will be replaced with API call
  const game = mockGame;
  const playerX = mockPlayerX;
  const playerO = mockPlayerO;

  const handleCellClick = (position: BoardPosition) => {
    // Mock cell click - will be wired up to API
    console.log('Cell clicked:', position);
  };

  const isDisabled =
    game.status !== GameStatusEnum.IN_PROGRESS ||
    game.current_turn !== currentUserId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Game {id?.slice(-4)}</h1>
          <div className="mt-2">
            <GameStatus
              status={game.status}
              currentTurnPlayerId={game.current_turn}
              currentUserId={currentUserId}
              playerXId={game.player_x_id}
              playerOId={game.player_o_id}
            />
          </div>
        </div>
      </div>

      <GamePlayers
        playerX={playerX}
        playerO={playerO}
        playerXColor={playerX.color || undefined}
        playerOColor={playerO.color || undefined}
      />

      <Card>
        <CardHeader>
          <CardTitle>Game Board</CardTitle>
        </CardHeader>
        <CardContent>
          <GameBoard
            boardState={game.board_state}
            isDisabled={isDisabled}
            onCellClick={handleCellClick}
            playerXColor={playerX.color || undefined}
            playerOColor={playerO.color || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
