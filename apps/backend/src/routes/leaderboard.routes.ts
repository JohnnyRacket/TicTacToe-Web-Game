import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

export default router;
