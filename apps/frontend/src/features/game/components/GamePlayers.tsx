import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

import type { User } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface GamePlayersProps {
  playerX: User | null;
  playerO: User | null;
  playerXColor?: string;
  playerOColor?: string;
}

export function GamePlayers({
  playerX,
  playerO,
  playerXColor = '#3b82f6',
  playerOColor = '#ef4444',
}: GamePlayersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: playerXColor }}
            />
            <span className="font-medium">
              Player X: {playerX?.name || 'Waiting...'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: playerOColor }}
            />
            <span className="font-medium">
              Player O: {playerO?.name || 'Waiting...'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
