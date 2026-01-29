import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from '../components/ErrorBoundary';
import { Layout } from '../components/Layout';

// Lazy load route components for code splitting
const HomePage = lazy(() => import('./routes/HomePage'));
const LeaderboardPage = lazy(() => import('./routes/LeaderboardPage'));
const GamePage = lazy(() => import('./routes/GamePage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/game/:id" element={<GamePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
