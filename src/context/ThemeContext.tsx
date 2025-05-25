
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'light' | 'dark' | 'purple' | 'green' | 'ocean' | 'neon' | 'sunset' | 'midnight' | 'forest' | 'cyber';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('jee-theme');
    return (savedTheme as ThemeType) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'purple', 'green', 'ocean', 'neon', 'sunset', 'midnight', 'forest', 'cyber');
    root.classList.add(theme);
    
    localStorage.setItem('jee-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Rotate through themes in this order
    const themes: ThemeType[] = ['light', 'dark', 'purple', 'green', 'ocean', 'neon', 'sunset', 'midnight', 'forest', 'cyber'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
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
