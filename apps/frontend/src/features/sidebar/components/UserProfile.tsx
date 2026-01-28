import { useState, useEffect } from 'react';

import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
// TODO: Import useUser hook when available
// import { useUser } from '../../../hooks/useUser';

export function UserProfile() {
  // TODO: Replace with React Query hook
  // const { data: user, isLoading } = useUser();
  // const updateUserMutation = useUpdateUser();
  
  // Mock data - will be replaced with hook
  const mockUser = {
    id: 'user-123',
    name: 'Player One',
    color: '#3b82f6',
    wins: 5,
    losses: 2,
    draws: 1,
  };
  const user = mockUser;
  const isLoading = false;

  const [name, setName] = useState(user.name);
  const [color, setColor] = useState(user.color || '#3b82f6');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setColor(user.color || '#3b82f6');
    }
  }, [user]);

  const handleSave = () => {
    // TODO: Wire up to mutation
    // updateUserMutation.mutate({ name, color });
    console.log('Saving:', { name, color });
    setIsOpen(false);
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-full text-left p-4 rounded-lg hover:bg-accent transition-colors">
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {user.wins}W / {user.losses}L / {user.draws}D
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
