import { LeaderboardEntry as LeaderboardEntryComponent } from '../../features/leaderboard/components/LeaderboardEntry';

import type { LeaderboardEntry } from '@tic-tac-toe-web-game/tic-tac-toe-lib';

// Mock leaderboard data - will be replaced with API data
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      id: 'user-1',
      name: 'Champion Player',
      color: '#ffd700',
      wins: 15,
      losses: 2,
      draws: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    rank: 2,
    user: {
      id: 'user-2',
      name: 'Second Place',
      color: '#c0c0c0',
      wins: 12,
      losses: 5,
      draws: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    rank: 3,
    user: {
      id: 'user-3',
      name: 'Third Place',
      color: '#cd7f32',
      wins: 10,
      losses: 4,
      draws: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    rank: 4,
    user: {
      id: 'user-4',
      name: 'Player Four',
      color: '#3b82f6',
      wins: 8,
      losses: 6,
      draws: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  {
    rank: 5,
    user: {
      id: 'user-5',
      name: 'Player Five',
      color: '#10b981',
      wins: 7,
      losses: 7,
      draws: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
];

export function LeaderboardPage() {
  // Mock data - will be replaced with API call
  const leaderboard = mockLeaderboard;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          Top 5 players by wins
        </p>
      </div>

      <div className="space-y-4">
        {leaderboard.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No leaderboard data available
          </div>
        ) : (
          leaderboard.map((entry) => (
            <LeaderboardEntryComponent key={entry.user.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
