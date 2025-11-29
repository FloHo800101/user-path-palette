import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export function UserSwitch() {
  const { currentUser, setCurrentUser, users } = useRole();
  const navigate = useNavigate();

  const handleUserSwitch = (user: typeof users[0]) => {
    setCurrentUser(user);
    // Navigate to appropriate start page
    if (user.role === 'client') {
      navigate('/mandant/dashboard');
    } else {
      navigate('/');
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent transition-smooth"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate w-full">
              {currentUser.name}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {currentUser.roleLabel}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {users.map((user) => (
          <DropdownMenuItem
            key={`${user.name}-${user.role}`}
            onClick={() => handleUserSwitch(user)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.roleLabel}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
