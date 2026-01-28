/**
 * Calculate win rate percentage from wins, losses, and draws
 * @param wins Number of wins
 * @param losses Number of losses
 * @param draws Number of draws
 * @returns Win rate as a percentage (0-100), rounded to nearest integer
 */
export function calculateWinRate(
  wins: number,
  losses: number,
  draws: number
): number {
  const total = wins + losses + draws;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}
