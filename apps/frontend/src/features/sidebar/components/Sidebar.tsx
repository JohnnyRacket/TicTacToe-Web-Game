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
    <>
      {/* Mobile: Horizontal Top Bar */}
      <div className="md:hidden flex flex-col border-b bg-background">
        {/* Top Row: User Profile and Navigation */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex-1 min-w-0">
            <UserProfile />
          </div>
          <nav className="flex items-center gap-1 ml-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  title={item.name}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        {/* Current Games List - Horizontal Scroll */}
        <div className="border-t overflow-x-auto max-h-32">
          <CurrentGamesList />
        </div>
      </div>

      {/* Desktop: Vertical Sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 border-r bg-background">
        {/* User Profile Block */}
        <div className="border-b p-2">
          <UserProfile />
        </div>

        {/* Navigation Links */}
        <nav className="px-2 py-2 space-y-1 flex-shrink-0">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
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
    </>
  );
}
