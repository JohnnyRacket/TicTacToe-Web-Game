import { useState, useEffect } from 'react';

import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { useUser } from '../../../hooks/useUser';
import { useUpdateUser } from '../../../lib/api/user';

export function UserProfile() {
  const { user, isLoading, isError } = useUser();
  const updateUserMutation = useUpdateUser();

  const [name, setName] = useState(user?.name || '');
  const [color, setColor] = useState(user?.color || '#3b82f6');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setColor(user.color || '#3b82f6');
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    
    updateUserMutation.mutate(
      {
        userId: user.id,
        data: { name, color: color || null },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Handle case when user is not available AND there's an actual error
  // Don't show error if we're still loading or if user creation is in progress
  if (!user && isError) {
    return (
      <div className="w-full p-4">
        <div className="text-sm text-muted-foreground">
          <div className="font-semibold text-lg mb-1">Unable to Load User</div>
          <div className="text-xs">Please try again in a few minutes</div>
        </div>
      </div>
    );
  }

  // If no user but no error, show loading state (shouldn't happen, but be safe)
  if (!user) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-full text-left p-2 md:p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <div className="font-semibold text-sm md:text-lg truncate">{user.name || 'Anonymous'}</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
            {user.wins || 0}W / {user.losses || 0}L / {user.draws || 0}D
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
