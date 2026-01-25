import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import apiRoutes from './api/index.js';
import { initializeDatabase } from './database/index.js';
import { errorHandler } from './middleware/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter((origin): origin is string => Boolean(origin)),
    credentials: true,
  })
);

// Routes
app.get('/', (req, res) => {
  res.send({ message: 'Tic-Tac-Toe API' });
});

app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

// Initialize database and run migrations before starting server
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

initializeDatabase()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
