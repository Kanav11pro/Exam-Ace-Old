
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'dark';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<ThemeType>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes and set dark as default
    root.classList.remove('light', 'dark', 'cyber', 'midnight');
    root.classList.add('dark');
  }, []);

  const setTheme = () => {
    // Theme is fixed to dark, so this does nothing
  };

  const toggleTheme = () => {
    // Theme is fixed to dark, so this does nothing
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
