import type { BoardPosition, PlayerSymbol } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GameCellProps {
  position: BoardPosition;
  value: PlayerSymbol | null;
  isDisabled: boolean;
  onClick: (position: BoardPosition) => void;
  playerXColor?: string;
  playerOColor?: string;
}

export function GameCell({
  position,
  value,
  isDisabled,
  onClick,
  playerXColor = '#3b82f6',
  playerOColor = '#ef4444',
}: GameCellProps) {
  return (
    <button
      onClick={() => onClick(position)}
      disabled={isDisabled || value !== null}
      className="aspect-square border-2 border-border rounded-lg text-4xl font-bold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center justify-center"
    >
      {value === 'x' && (
        <span style={{ color: playerXColor }}>X</span>
      )}
      {value === 'o' && (
        <span style={{ color: playerOColor }}>O</span>
      )}
    </button>
  );
}
