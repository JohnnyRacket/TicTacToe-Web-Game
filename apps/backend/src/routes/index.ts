import { Router } from 'express';

import gameRoutes from './game.routes.js';
import leaderboardRoutes from './leaderboard.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/game', gameRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;
