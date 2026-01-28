import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardTitle } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';

import type { LeaderboardEntry as LeaderboardEntryType } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  isCurrentUser?: boolean;
  winRate?: number;
}

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
    case 2:
      return 'bg-gray-400/20 text-gray-600 dark:text-gray-400 border-gray-400/30';
    case 3:
      return 'bg-orange-600/20 text-orange-600 dark:text-orange-400 border-orange-600/30';
    default:
      return 'bg-muted border-border';
  }
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return null;
  }
};

export function LeaderboardEntry({
  entry,
  isCurrentUser = false,
  winRate = 0,
}: LeaderboardEntryProps) {
  const totalGames = entry.user.wins + entry.user.losses + entry.user.draws;
  const rankIcon = getRankIcon(entry.rank);

  return (
    <Card
      className={cn(
        'transition-all',
        isCurrentUser && 'ring-2 ring-primary shadow-lg'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div
            className={cn(
              'flex items-center justify-center w-14 h-14 rounded-full font-bold text-xl border-2',
              getRankBadgeColor(entry.rank)
            )}
          >
            {rankIcon || entry.rank}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {entry.user.color && (
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-border"
                  style={{ backgroundColor: entry.user.color }}
                />
              )}
              <CardTitle className="text-xl truncate">
                {entry.user.name}
                {isCurrentUser && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    You
                  </Badge>
                )}
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
              {totalGames > 0 && winRate !== undefined && (
                <span>
                  <span className="font-semibold text-foreground">
                    {winRate}%
                  </span>{' '}
                  win rate
                </span>
              )}
            </div>
          </div>

          {/* Wins Badge */}
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={entry.rank <= 3 ? 'default' : 'outline'}
              className="text-lg px-4 py-2 font-bold"
            >
              {entry.user.wins}W
            </Badge>
            {totalGames > 0 && (
              <span className="text-xs text-muted-foreground">
                {totalGames} games
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
