
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
  isLoading: boolean;
};

const VALID_CREDENTIALS = [
  { username: 'kanhabro', password: 'password123' },
  { username: 'ombro123', password: 'password123' },
  { username: 'Kanav123', password: 'password123' },
];

const MAX_LOGIN_ATTEMPTS = 3;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from session storage
    const storedUser = sessionStorage.getItem('jee-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      return false;
    }

    const foundUser = VALID_CREDENTIALS.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (foundUser) {
      const userObj = { username: foundUser.username };
      setUser(userObj);
      sessionStorage.setItem('jee-user', JSON.stringify(userObj));
      setLoginAttempts(0);
      return true;
    } else {
      setLoginAttempts((prev) => prev + 1);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('jee-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAttempts, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
