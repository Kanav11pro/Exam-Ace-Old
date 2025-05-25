
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define a type for the profile data that matches our database
type Profile = {
  id: string;
  username: string;
  created_at?: string;
  updated_at?: string;
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
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      console.log("Profile data:", data);
      return data as Profile;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state change listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session);
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          } else {
            setProfile(null);
          }
        }
      );
      
      // Then check for existing session
      try {
        console.log("Checking for existing session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Found existing session:", session.user);
          setSession(session);
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          console.log("No existing session found");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
      
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const login = async (username: string, passwordAttempt: string): Promise<boolean> => {
    if (loginAttempts >= 3) {
      console.log("Max login attempts reached.");
      return false;
    }

    setIsLoading(true);
    try {
      // Try login with email format, in case it's an email address
      const isEmail = username.includes('@');
      const email = isEmail ? username : `${username}@example.com`;
      
      console.log("Attempting login with:", { email, password: passwordAttempt });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordAttempt,
      });

      if (error) {
        console.error("Login error:", error);
        setLoginAttempts(prevAttempts => prevAttempts + 1);
        return false;
      }

      if (data?.user) {
        console.log("Login successful:", data.user);
        setUser(data.user);
        setSession(data.session);
        
        // Fetch the user profile
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
        setLoginAttempts(0);
        return true;
      } else {
        console.log("Login failed: No user data returned");
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
      setSession(null);
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
