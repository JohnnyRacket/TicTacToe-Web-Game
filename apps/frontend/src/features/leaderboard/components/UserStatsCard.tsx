import { Card, CardContent } from '../../../components/ui/card';
import { calculateWinRate } from '../utils';

import type { User } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface UserStatsCardProps {
  user: User | undefined;
}

export function UserStatsCard({ user }: UserStatsCardProps) {
  if (!user) {
    return null;
  }

  const totalGames = user.wins + user.losses + user.draws;
  const winRate = calculateWinRate(user.wins, user.losses, user.draws);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-around text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.wins}</div>
            <div className="text-muted-foreground">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.losses}</div>
            <div className="text-muted-foreground">Losses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.draws}</div>
            <div className="text-muted-foreground">Draws</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalGames}</div>
            <div className="text-muted-foreground">Total Games</div>
          </div>
          {totalGames > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold">{winRate}%</div>
              <div className="text-muted-foreground">Win Rate</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
