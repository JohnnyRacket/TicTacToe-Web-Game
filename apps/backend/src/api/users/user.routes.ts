import { Router } from 'express';

import { UserNotFoundError } from './user.errors.js';
import { UserService } from './user.service.js';

import type {
  CreateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@tic-tac-toe-web-game/tic-tac-toe-lib';

const router = Router();
const userService = new UserService();

/**
 * POST /api/user/create
 * Create a new user
 */
router.post('/create', async (req, res, next) => {
  try {
    const body: CreateUserRequest = req.body;
    const user = await userService.createUser(body.name);

    const response: CreateUserResponse = { user };

    // Set user ID in cookie for future requests
    res.cookie('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year, TODO: make cookie refresh on visit
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/user/:id
 * Get a user by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    const response: GetUserResponse = { user };

    res.json(response);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({
        error: {
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        },
      });
      return;
    }
    next(error);
  }
});

/**
 * PUT /api/user/:id
 * Update user name and/or color
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body: UpdateUserRequest = req.body;

    const user = await userService.updateUser(id, body);
    const response: UpdateUserResponse = { user };

    res.json(response);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({
        error: {
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
        },
      });
      return;
    }
    next(error);
  }
});

export default router;
