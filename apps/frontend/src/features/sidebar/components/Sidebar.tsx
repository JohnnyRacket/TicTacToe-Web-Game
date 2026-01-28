import { Link, useLocation } from 'react-router-dom';

import { cn } from '../../../lib/utils';

import { CurrentGamesList } from './CurrentGamesList';
import { UserProfile } from './UserProfile';

const navigation = [
  { name: 'Lobby', href: '/', icon: '🎮' },
  { name: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-64 border-r bg-background">
      {/* User Profile Block */}
      <div className="border-b p-2">
        <UserProfile />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Current Games List */}
      <div className="border-t flex-1 overflow-hidden flex flex-col">
        <CurrentGamesList />
      </div>
    </div>
  );
}
