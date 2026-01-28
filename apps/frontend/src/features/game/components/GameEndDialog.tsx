import { GameStatus as GameStatusEnum } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { useNavigate } from 'react-router-dom';


import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

import type { Game , User } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GameEndDialogProps {
  open: boolean;
  game: Game | null;
  currentUser: User | null;
  onOpenChange: (open: boolean) => void;
}

export function GameEndDialog({
  open,
  game,
  currentUser,
  onOpenChange,
}: GameEndDialogProps) {
  const navigate = useNavigate();

  if (!game || !currentUser) {
    return null;
  }

  // Determine game result
  const isWin = game.winner_id === currentUser.id;
  const isDraw =
    game.status === GameStatusEnum.COMPLETED && !game.winner_id;
  const isLoss = game.winner_id !== null && game.winner_id !== currentUser.id;

  const getTitle = () => {
    if (isWin) return '🎉 You Won!';
    if (isLoss) return '😔 You Lost';
    if (isDraw) return '🤝 Draw';
    return 'Game Over';
  };

  const getDescription = () => {
    if (isWin) return 'Congratulations! You won the game.';
    if (isLoss) return 'Better luck next time!';
    if (isDraw) return "It's a tie! Good game.";
    return 'The game has ended.';
  };

  const handleGoToLobby = () => {
    onOpenChange(false);
    navigate('/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{getTitle()}</DialogTitle>
          <DialogDescription className="text-center">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Your Record
            </p>
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentUser.wins}
                </div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {currentUser.losses}
                </div>
                <div className="text-xs text-muted-foreground">Losses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {currentUser.draws}
                </div>
                <div className="text-xs text-muted-foreground">Draws</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleGoToLobby} className="w-full">
            Back to Lobby
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
