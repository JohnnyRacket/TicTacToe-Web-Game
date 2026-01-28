import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { GameBoard } from '../../features/game/components/GameBoard';
import { GameEndDialog } from '../../features/game/components/GameEndDialog';
import { GamePlayers } from '../../features/game/components/GamePlayers';
import { GameStatus } from '../../features/game/components/GameStatus';
import { useUser } from '../../hooks/useUser';
import { useGetGame, useMakeMove } from '../../lib/api/game/game.hooks';
import { useGetUser } from '../../lib/api/user';

import type { BoardPosition } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, refetch: refetchUser } = useUser();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);
  
  // Fetch game data with polling for real-time updates
  const {
    data: gameData,
    isLoading: isGameLoading,
    isError: isGameError,
  } = useGetGame(id || '', 2000); // Poll every 2 seconds

  const game = gameData?.game;

  // Show end dialog when game completes and refetch user stats
  useEffect(() => {
    if (
      game?.status === GameStatusEnum.COMPLETED &&
      currentUser &&
      !hasShownDialog
    ) {
      // Refetch user to get updated stats
      refetchUser();
      // Show dialog after a brief delay to ensure stats are updated
      const timer = setTimeout(() => {
        setShowEndDialog(true);
        setHasShownDialog(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [game?.status, currentUser, refetchUser, hasShownDialog]);

  // Reset dialog state when game ID changes
  useEffect(() => {
    setHasShownDialog(false);
    setShowEndDialog(false);
  }, [id]);

  // Fetch player data for both X and O
  const { data: playerXData } = useGetUser(game?.player_x_id || null);
  const { data: playerOData } = useGetUser(game?.player_o_id || null);

  const playerX = playerXData;
  const playerO = playerOData;

  // Make move mutation
  const makeMoveMutation = useMakeMove();

  const handleCellClick = (position: BoardPosition) => {
    if (!id || !currentUser?.id || !game) {
      return;
    }

    makeMoveMutation.mutate(
      {
        gameId: id,
        data: {
          player_id: currentUser.id,
          position,
        },
      },
      {
        onError: (error) => {
          console.error('Failed to make move:', error);
          // Error handling could be improved with toast notifications
        },
      }
    );
  };

  // Determine if board should be disabled
  // Allow moves if:
  // - Game is IN_PROGRESS and it's the user's turn, OR
  // - Game is WAITING, user is X, and it's X's turn (X can play before O joins)
  const canMakeMove =
    game &&
    currentUser?.id &&
    !makeMoveMutation.isPending &&
    game.player_x_id &&
    ((game.status === GameStatusEnum.IN_PROGRESS &&
      game.current_turn === currentUser.id &&
      game.player_o_id) ||
      (game.status === GameStatusEnum.WAITING &&
        game.player_x_id === currentUser.id &&
        game.current_turn === currentUser.id));

  const isDisabled = !canMakeMove;

  // Loading state
  if (isGameLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Loading game...
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isGameError || !game) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {isGameError
              ? 'Unable to load game. Please try again later.'
              : 'Game not found.'}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Game {id?.slice(-4)}</h1>
            <div className="mt-2">
              <GameStatus
                status={game.status}
                currentTurnPlayerId={game.current_turn}
                currentUserId={currentUser?.id || null}
                playerXId={game.player_x_id}
                playerOId={game.player_o_id}
              />
            </div>
          </div>
        </div>

        <GamePlayers
          playerX={playerX || null}
          playerO={playerO || null}
          playerXColor={playerX?.color || undefined}
          playerOColor={playerO?.color || undefined}
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
              playerXColor={playerX?.color || undefined}
              playerOColor={playerO?.color || undefined}
            />
          </CardContent>
        </Card>
      </div>

      <GameEndDialog
        open={showEndDialog}
        game={game}
        currentUser={currentUser || null}
        onOpenChange={setShowEndDialog}
      />
    </>
  );
}
