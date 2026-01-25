import { randomUUID } from 'crypto';

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../database/index.js', () => ({
  getDatabase: vi.fn(),
}));

import { getDatabase } from '../../database/index.js';

import { LeaderboardService } from './leaderboard.service.js';

import type { User } from '@tic-tac-toe-web-game/types';

describe('LeaderboardService', () => {
  let leaderboardService: LeaderboardService;
  let mockDb: any;

  beforeEach(() => {
    leaderboardService = new LeaderboardService();
    mockDb = {
      selectFrom: vi.fn().mockReturnThis(),
      selectAll: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      execute: vi.fn(),
    };
    vi.mocked(getDatabase).mockReturnValue(mockDb as any);
  });

  describe('getTopPlayers', () => {
    it('should return top 5 players ordered by wins, draws, losses, updated_at', async () => {
      const mockUsers: User[] = [
        {
          id: randomUUID(),
          name: 'Player 1',
          color: '#ff0000',
          wins: 10,
          losses: 2,
          draws: 1,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01'),
        },
        {
          id: randomUUID(),
          name: 'Player 2',
          color: '#00ff00',
          wins: 8,
          losses: 3,
          draws: 0,
          created_at: new Date('2024-01-02'),
          updated_at: new Date('2024-01-02'),
        },
        {
          id: randomUUID(),
          name: 'Player 3',
          color: '#0000ff',
          wins: 5,
          losses: 5,
          draws: 2,
          created_at: new Date('2024-01-03'),
          updated_at: new Date('2024-01-03'),
        },
        {
          id: randomUUID(),
          name: 'Player 4',
          color: '#ffff00',
          wins: 3,
          losses: 7,
          draws: 1,
          created_at: new Date('2024-01-04'),
          updated_at: new Date('2024-01-04'),
        },
        {
          id: randomUUID(),
          name: 'Player 5',
          color: '#ff00ff',
          wins: 1,
          losses: 9,
          draws: 0,
          created_at: new Date('2024-01-05'),
          updated_at: new Date('2024-01-05'),
        },
      ];

      mockDb.execute.mockResolvedValue(mockUsers);

      const result = await leaderboardService.getTopPlayers();

      expect(result).toHaveLength(5);
      expect(result[0].rank).toBe(1);
      expect(result[0].user.wins).toBe(10);
      expect(result[1].rank).toBe(2);
      expect(result[1].user.wins).toBe(8);
      expect(result[2].rank).toBe(3);
      expect(result[2].user.wins).toBe(5);
      expect(result[3].rank).toBe(4);
      expect(result[3].user.wins).toBe(3);
      expect(result[4].rank).toBe(5);
      expect(result[4].user.wins).toBe(1);

      // Verify query builder calls
      expect(mockDb.selectFrom).toHaveBeenCalledWith('users');
      expect(mockDb.selectAll).toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalledWith('wins', 'desc');
      expect(mockDb.orderBy).toHaveBeenCalledWith('losses', 'asc');
      expect(mockDb.orderBy).toHaveBeenCalledWith('draws', 'desc');
      expect(mockDb.orderBy).toHaveBeenCalledWith('updated_at', 'asc');
      expect(mockDb.limit).toHaveBeenCalledWith(5);
    });

    it('should break ties by losses when wins are equal', async () => {
      const mockUsers: User[] = [
        {
          id: randomUUID(),
          name: 'Player 1',
          color: '#ff0000',
          wins: 10,
            losses: 1,
          draws: 1,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-10'),
        },
        {
          id: randomUUID(),
          name: 'Player 2',
          color: '#00ff00',
          wins: 10,
          losses: 3,
          draws: 1,
          created_at: new Date('2024-01-02'),
          updated_at: new Date('2024-01-05'),
        },
      ];

      mockDb.execute.mockResolvedValue(mockUsers);

      const result = await leaderboardService.getTopPlayers(2);

      expect(result[0].user.losses).toBe(1);
      expect(result[1].user.losses).toBe(3);
    });

    it('should break ties by draws when wins and losses are equal', async () => {
      const mockUsers: User[] = [
        {
          id: randomUUID(),
          name: 'Player 1',
          color: '#ff0000',
          wins: 10,
          losses: 2,
          draws: 3,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-10'),
        },
        {
          id: randomUUID(),
          name: 'Player 2',
          color: '#00ff00',
          wins: 10,
          losses: 2,
          draws: 1,
          created_at: new Date('2024-01-02'),
          updated_at: new Date('2024-01-05'),
        },
      ];

      mockDb.execute.mockResolvedValue(mockUsers);

      const result = await leaderboardService.getTopPlayers(2);

      expect(result[0].user.draws).toBe(3);
      expect(result[1].user.draws).toBe(1);
    });

    it('should break ties by updated_at when wins, losses, and draws are equal', async () => {
      const mockUsers: User[] = [
        {
          id: randomUUID(),
          name: 'Player 1',
          color: '#ff0000',
          wins: 10,
          losses: 2,
          draws: 1,
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-05'),
        },
        {
          id: randomUUID(),
          name: 'Player 2',
          color: '#00ff00',
          wins: 10,
          losses: 2,
          draws: 1,
          created_at: new Date('2024-01-02'),
          updated_at: new Date('2024-01-10'),
        },
      ];

      mockDb.execute.mockResolvedValue(mockUsers);

      const result = await leaderboardService.getTopPlayers(2);

      expect(result[0].user.updated_at.getTime()).toBeLessThan(
        result[1].user.updated_at.getTime()
      );
    });

    it('should return empty array when no users exist', async () => {
      mockDb.execute.mockResolvedValue([]);

      const result = await leaderboardService.getTopPlayers();

      expect(result).toHaveLength(0);
      expect(mockDb.limit).toHaveBeenCalledWith(5);
    });
  });
});
