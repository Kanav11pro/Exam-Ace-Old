
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Define a type for the profile data that matches our database
type Profile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
};

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();

        if (supaUser) {
          setUser(supaUser);
          
          // Fetch the user profile
          const profileData = await fetchProfile(supaUser.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
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
        setUser(data.user);
        
        // Fetch the user profile
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
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
      setProfile(null);
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
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
