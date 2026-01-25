import { Router } from 'express';

const router = Router();

router.post('/create', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

router.post('/:id/join', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

router.get('/list', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

router.get('/:id', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

router.put('/:id', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

router.delete('/:id', async (req, res) => {
  res.status(501).json({
    error: {
      error: 'Not Implemented',
      message: 'Not Implemented',
      statusCode: 501,
    },
  });
});

export default router;
