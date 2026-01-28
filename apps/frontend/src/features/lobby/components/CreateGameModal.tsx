import { PlayerSymbol, type ApiError } from '@tic-tac-toe-web-game/tic-tac-toe-lib';
import { useState } from 'react';
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
import { useUser } from '../../../hooks/useUser';
import { useCreateGame } from '../../../lib/api/game/game.hooks';

interface CreateGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGameModal({ open, onOpenChange }: CreateGameModalProps) {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useUser();
  const createGameMutation = useCreateGame();
  const [selectedRole, setSelectedRole] = useState<PlayerSymbol>(PlayerSymbol.X);

  const handleCreateGame = () => {
    if (!user) {
      return;
    }

    createGameMutation.mutate(
      {
        player_id: user.id,
        player_role: selectedRole,
      },
      {
        onSuccess: (response) => {
          onOpenChange(false);
          navigate(`/game/${response.game.id}`);
        },
      }
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset selection when closing
    setSelectedRole(PlayerSymbol.X);
  };

  const isLoading = createGameMutation.isPending || isUserLoading;
  const canCreate = user && !isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
          <DialogDescription>
            Choose your player role. X goes first, O goes second.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Your Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole(PlayerSymbol.X)}
                disabled={isLoading}
                className={`
                  flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 transition-all
                  ${
                    selectedRole === PlayerSymbol.X
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-4xl font-bold text-primary">X</div>
                <div className="text-sm font-medium">Player X</div>
                <div className="text-xs text-muted-foreground">Goes first</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole(PlayerSymbol.O)}
                disabled={isLoading}
                className={`
                  flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 transition-all
                  ${
                    selectedRole === PlayerSymbol.O
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-4xl font-bold text-destructive">O</div>
                <div className="text-sm font-medium">Player O</div>
                <div className="text-xs text-muted-foreground">Goes second</div>
              </button>
            </div>
          </div>

          {createGameMutation.isError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">
                {(createGameMutation.error as ApiError)?.message ||
                  'Failed to create game. Please try again.'}
              </p>
            </div>
          )}

          {isUserLoading && (
            <div className="text-sm text-muted-foreground text-center py-2">
              Loading user information...
            </div>
          )}

          {!user && !isUserLoading && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">
                Unable to load user. Please refresh the page.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGame}
            disabled={!canCreate}
          >
            {isLoading ? 'Creating...' : 'Create Game'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
