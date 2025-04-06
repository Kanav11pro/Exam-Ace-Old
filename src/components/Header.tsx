
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-bold text-xl flex items-center">
          <span className="mr-2">📊</span>
          <span>JEE Prepometer</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {user && (
            <>
              <p className="text-sm mr-4">
                Welcome, <span className="font-medium">{user.username}</span>
              </p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                title="Logout"
                className="rounded-full"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
