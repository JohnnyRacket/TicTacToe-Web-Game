import { GameCell } from './GameCell';

import type { BoardPosition, BoardState } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GameBoardProps {
  boardState: BoardState;
  isDisabled: boolean;
  onCellClick: (position: BoardPosition) => void;
  playerXColor?: string;
  playerOColor?: string;
}

const BOARD_POSITIONS: BoardPosition[] = [
  'a1',
  'a2',
  'a3',
  'b1',
  'b2',
  'b3',
  'c1',
  'c2',
  'c3',
];

export function GameBoard({
  boardState,
  isDisabled,
  onCellClick,
  playerXColor,
  playerOColor,
}: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
      {BOARD_POSITIONS.map((position) => (
        <GameCell
          key={position}
          position={position}
          value={boardState[position]}
          isDisabled={isDisabled}
          onClick={onCellClick}
          playerXColor={playerXColor}
          playerOColor={playerOColor}
        />
      ))}
    </div>
  );
}
