import { randomUUID } from 'crypto';

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../database/index.js', () => ({
  getDatabase: vi.fn(),
}));

import { getDatabase } from '../database/index.js';
import { UserNotFoundError } from '../errors/index.js';

import { UserService } from './user.service.js';

import type { User } from '@tic-tac-toe-web-game/types';

describe('UserService', () => {
  let userService: UserService;
  let mockDb: any;

  beforeEach(() => {
    userService = new UserService();
    mockDb = {
      insertInto: vi.fn().mockReturnThis(),
      selectFrom: vi.fn().mockReturnThis(),
      updateTable: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      selectAll: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      returningAll: vi.fn().mockReturnThis(),
      execute: vi.fn(),
      executeTakeFirst: vi.fn(),
    };
    vi.mocked(getDatabase).mockReturnValue(mockDb as any);
  });

  describe('createUser', () => {
    it('should use provided name when given', async () => {
      const mockUser: User = {
        id: randomUUID(),
        name: 'Test User',
        color: '#a1b2c3',
        wins: 0,
        losses: 0,
        draws: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockUser]);

      await userService.createUser('Test User');

      const valuesCall = mockDb.values.mock.calls[0][0];
      expect(valuesCall.name).toBe('Test User');
    });

    it('should generate UUID name when name not provided', async () => {
      const mockUser: User = {
        id: randomUUID(),
        name: randomUUID(),
        color: '#a1b2c3',
        wins: 0,
        losses: 0,
        draws: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockUser]);

      await userService.createUser();

      const valuesCall = mockDb.values.mock.calls[0][0];
      // UUID format: 8-4-4-4-12 hex characters
      expect(valuesCall.name).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it('should generate a valid hex color', async () => {
      const mockUser: User = {
        id: randomUUID(),
        name: 'Test',
        color: '#ff0000',
        wins: 0,
        losses: 0,
        draws: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockUser]);

      await userService.createUser('Test');

      const valuesCall = mockDb.values.mock.calls[0][0];
      expect(valuesCall.color).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should set default stats to zero', async () => {
      const mockUser: User = {
        id: randomUUID(),
        name: 'Test',
        color: '#a1b2c3',
        wins: 0,
        losses: 0,
        draws: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.execute.mockResolvedValue([mockUser]);

      await userService.createUser('Test');

      const valuesCall = mockDb.values.mock.calls[0][0];
      expect(valuesCall.wins).toBe(0);
      expect(valuesCall.losses).toBe(0);
      expect(valuesCall.draws).toBe(0);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = randomUUID();
      const mockUser: User = {
        id: userId,
        name: 'Test User',
        color: '#a1b2c3',
        wins: 0,
        losses: 0,
        draws: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.executeTakeFirst.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundError with correct message when user not found', async () => {
      const userId = randomUUID();
      mockDb.executeTakeFirst.mockResolvedValue(undefined);

      await expect(userService.getUserById(userId)).rejects.toThrow(
        UserNotFoundError
      );
      await expect(userService.getUserById(userId)).rejects.toThrow(
        `User with id ${userId} not found`
      );
    });
  });

  describe('updateUser', () => {
    it('should only update provided fields', async () => {
      const userId = randomUUID();
      const existingUser: User = {
        id: userId,
        name: 'Old Name',
        color: '#a1b2c3',
        wins: 5,
        losses: 2,
        draws: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedUser: User = {
        ...existingUser,
        name: 'New Name',
        updated_at: new Date(),
      };

      mockDb.executeTakeFirst.mockResolvedValue(existingUser);
      mockDb.execute.mockResolvedValue([updatedUser]);

      await userService.updateUser(userId, { name: 'New Name' });

      const setCall = mockDb.set.mock.calls[0][0];
      // Should only update name, not color or stats
      expect(setCall.name).toBe('New Name');
      expect(setCall.color).toBeUndefined();
      expect(setCall.wins).toBeUndefined();
      expect(setCall.updated_at).toBeInstanceOf(Date);
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = randomUUID();
      mockDb.executeTakeFirst.mockResolvedValue(undefined);

      await expect(
        userService.updateUser(userId, { name: 'New Name' })
      ).rejects.toThrow(UserNotFoundError);
    });
  });
});
