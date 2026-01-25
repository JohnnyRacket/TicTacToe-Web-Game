import { randomUUID } from 'crypto';

import { generateRandomHexColor } from '@tic-tac-toe-web-game/types';

import { getDatabase } from '../../database/index.js';

import { UserNotFoundError } from './user.errors.js';

import type { User , UpdateUserRequest } from '@tic-tac-toe-web-game/types';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(name?: string): Promise<User> {
    const db = getDatabase();
    const finalName = name || randomUUID();
    const color = generateRandomHexColor();

    const [user] = await db
      .insertInto('users')
      .values({
        name: finalName,
        color,
        wins: 0,
        losses: 0,
        draws: 0,
      } as any)
      .returningAll()
      .execute();

    return user;
  }

  /**
   * Get a user by ID
   * @throws UserNotFoundError if user doesn't exist
   */
  async getUserById(id: string): Promise<User> {
    const db = getDatabase();

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }

  /**
   * Update a user's name and/or color
   * @throws UserNotFoundError if user doesn't exist
   */
  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    const db = getDatabase();

    // Check if user exists, throws if not
    await this.getUserById(id);

    // Build update object
    const updateData: Partial<User> = {};
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    if (updates.color !== undefined) {
      updateData.color = updates.color;
    }

    // Update user
    const [user] = await db
      .updateTable('users')
      .set({
        ...updateData,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returningAll()
      .execute();

    return user;
  }
}
