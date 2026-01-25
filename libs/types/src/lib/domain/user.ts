/**
 * User domain model
 */
export interface User {
  id: string; // UUID
  name: string;
  color: string | null;
  wins: number;
  losses: number;
  draws: number;
  created_at: Date;
  updated_at: Date;
}
