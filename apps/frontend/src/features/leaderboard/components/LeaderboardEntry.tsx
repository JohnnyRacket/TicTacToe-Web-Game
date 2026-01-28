import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardTitle } from '../../../components/ui/card';

import type { LeaderboardEntry as LeaderboardEntryType } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
}

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
    case 2:
      return 'bg-gray-400/20 text-gray-600 dark:text-gray-400';
    case 3:
      return 'bg-orange-600/20 text-orange-600 dark:text-orange-400';
    default:
      return 'bg-muted';
  }
};

export function LeaderboardEntry({ entry }: LeaderboardEntryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadgeColor(
              entry.rank
            )}`}
          >
            {entry.rank}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {entry.user.color && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.user.color }}
                />
              )}
              <CardTitle className="text-xl">{entry.user.name}</CardTitle>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">
                  {entry.user.wins}
                </span>{' '}
                wins
              </span>
              <span>
                <span className="font-semibold text-foreground">
                  {entry.user.losses}
                </span>{' '}
                losses
              </span>
              <span>
                <span className="font-semibold text-foreground">
                  {entry.user.draws}
                </span>{' '}
                draws
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {entry.user.wins}W
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
