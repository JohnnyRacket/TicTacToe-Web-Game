import { RefreshCw } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { LeaderboardEntry as LeaderboardEntryComponent } from '../../features/leaderboard/components/LeaderboardEntry';
import { UserStatsCard } from '../../features/leaderboard/components/UserStatsCard';
import { calculateWinRate } from '../../features/leaderboard/utils';
import { useUser } from '../../hooks/useUser';
import { useGetLeaderboard } from '../../lib/api/leaderboard/leaderboard.hooks';

export function LeaderboardPage() {
  const { user: currentUser } = useUser();
  const {
    data: leaderboard = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetLeaderboard(30000); // Auto-refetch every 30 seconds

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Top players ranked by wins
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isRefetching || isLoading}
        >
          <RefreshCw
            size={16}
            className={isRefetching ? 'animate-spin' : ''}
          />
          {isRefetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Loading leaderboard...
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Unable to load leaderboard. Please try again later.
          </CardContent>
        </Card>
      ) : leaderboard.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No players on the leaderboard yet. Play some games to get ranked!
          </CardContent>
        </Card>
      ) : (
        <>
          {/* User Stats */}
          <UserStatsCard user={currentUser} />

          {/* Leaderboard Entries */}
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <LeaderboardEntryComponent
                key={entry.user.id}
                entry={entry}
                isCurrentUser={currentUser?.id === entry.user.id}
                winRate={calculateWinRate(
                  entry.user.wins,
                  entry.user.losses,
                  entry.user.draws
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LeaderboardPage;
