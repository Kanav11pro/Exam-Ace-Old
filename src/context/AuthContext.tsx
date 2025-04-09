import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type User = Tables<'profiles'>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginAttempts: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();

        if (supaUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supaUser.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            setUser(null);
          } else if (profile) {
            setUser(profile as User);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, passwordAttempt: string): Promise<boolean> => {
    if (loginAttempts >= 3) {
      console.log("Max login attempts reached.");
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username + "@example.com", // Dummy email
        password: passwordAttempt,
      });

      if (error) {
        console.error("Login error:", error);
        setLoginAttempts(prevAttempts => prevAttempts + 1);
        return false;
      }

      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setUser(null);
        } else if (profile) {
          setUser(profile as User);
        } else {
          setUser(null);
        }
        setLoginAttempts(0);
        return true;
      } else {
        setLoginAttempts(prevAttempts => prevAttempts + 1);
        return false;
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    loginAttempts,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
