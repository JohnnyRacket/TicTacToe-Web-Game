import { Router } from 'express';

import gameRoutes from './games/game.routes.js';
import leaderboardRoutes from './leaderboard/leaderboard.routes.js';
import userRoutes from './users/user.routes.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/game', gameRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;
