// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Route, Routes, Link } from 'react-router-dom';

import { Button } from '../components/ui/button';

export function App() {
  return (
    <div>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-8 space-y-4">
              <h1 className="text-2xl font-bold">Welcome to Tic Tac Toe</h1>
              <p>This is the generated root route.</p>
              <div className="flex gap-4 flex-wrap">
                <Button>Default Button</Button>
              </div>
              <Link to="/page-2">
                <Button variant="outline">Go to Page 2</Button>
              </Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
