import { Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout';

import { GamePage } from './routes/GamePage';
import { HomePage } from './routes/HomePage';
import { LeaderboardPage } from './routes/LeaderboardPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
