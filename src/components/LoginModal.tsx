
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, loginAttempts } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginAttempts >= 3) {
      toast({
        variant: "destructive",
        title: "Account locked",
        description: "Too many failed attempts. Please try again later.",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const success = await login(username, password);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: `Invalid credentials. Attempts remaining: ${3 - (loginAttempts + 1)}`,
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            JEE Prepometer 📊
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your study tracker
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="kanhabro, ombro123, Kanav123, etc."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                disabled={loginAttempts >= 3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loginAttempts >= 3}
              />
            </div>
            {loginAttempts > 0 && (
              <p className="text-sm text-red-500">
                Invalid credentials. Attempts remaining: {3 - loginAttempts}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoggingIn || loginAttempts >= 3}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
