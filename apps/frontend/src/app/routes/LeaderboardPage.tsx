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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isRefetching ? 'animate-spin' : ''}
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
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
