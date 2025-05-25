
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
    
    // Apply theme-specific CSS custom properties for better contrast
    const themeStyles = {
      light: {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--muted': '210 40% 98%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--primary': '222.2 47.4% 11.2%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--accent': '210 40% 96%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--ring': '222.2 84% 4.9%',
      },
      dark: {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--popover': '222.2 84% 4.9%',
        '--popover-foreground': '210 40% 98%',
        '--card': '222.2 84% 4.9%',
        '--card-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--primary': '210 40% 98%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--ring': '212.7 26.8% 83.9%',
      },
      purple: {
        '--background': '270 20% 98%',
        '--foreground': '270 15% 9%',
        '--muted': '270 20% 94%',
        '--muted-foreground': '270 7% 46%',
        '--popover': '270 20% 98%',
        '--popover-foreground': '270 15% 9%',
        '--card': '270 20% 98%',
        '--card-foreground': '270 15% 9%',
        '--border': '270 20% 90%',
        '--input': '270 20% 90%',
        '--primary': '262 83% 58%',
        '--primary-foreground': '270 20% 98%',
        '--secondary': '270 20% 94%',
        '--secondary-foreground': '270 15% 9%',
        '--accent': '270 20% 94%',
        '--accent-foreground': '270 15% 9%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '270 20% 98%',
        '--ring': '262 83% 58%',
      },
      green: {
        '--background': '120 20% 98%',
        '--foreground': '120 15% 9%',
        '--muted': '120 20% 94%',
        '--muted-foreground': '120 7% 46%',
        '--popover': '120 20% 98%',
        '--popover-foreground': '120 15% 9%',
        '--card': '120 20% 98%',
        '--card-foreground': '120 15% 9%',
        '--border': '120 20% 90%',
        '--input': '120 20% 90%',
        '--primary': '142 76% 36%',
        '--primary-foreground': '120 20% 98%',
        '--secondary': '120 20% 94%',
        '--secondary-foreground': '120 15% 9%',
        '--accent': '120 20% 94%',
        '--accent-foreground': '120 15% 9%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '120 20% 98%',
        '--ring': '142 76% 36%',
      },
      ocean: {
        '--background': '200 30% 98%',
        '--foreground': '200 15% 9%',
        '--muted': '200 30% 94%',
        '--muted-foreground': '200 10% 46%',
        '--popover': '200 30% 98%',
        '--popover-foreground': '200 15% 9%',
        '--card': '200 30% 98%',
        '--card-foreground': '200 15% 9%',
        '--border': '200 30% 90%',
        '--input': '200 30% 90%',
        '--primary': '199 89% 48%',
        '--primary-foreground': '200 30% 98%',
        '--secondary': '200 30% 94%',
        '--secondary-foreground': '200 15% 9%',
        '--accent': '200 30% 94%',
        '--accent-foreground': '200 15% 9%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '200 30% 98%',
        '--ring': '199 89% 48%',
      },
      neon: {
        '--background': '180 100% 97%',
        '--foreground': '180 15% 9%',
        '--muted': '180 30% 94%',
        '--muted-foreground': '180 10% 46%',
        '--popover': '180 100% 97%',
        '--popover-foreground': '180 15% 9%',
        '--card': '180 100% 97%',
        '--card-foreground': '180 15% 9%',
        '--border': '180 30% 90%',
        '--input': '180 30% 90%',
        '--primary': '180 100% 44%',
        '--primary-foreground': '180 100% 97%',
        '--secondary': '180 30% 94%',
        '--secondary-foreground': '180 15% 9%',
        '--accent': '180 30% 94%',
        '--accent-foreground': '180 15% 9%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '180 100% 97%',
        '--ring': '180 100% 44%',
      },
      sunset: {
        '--background': '25 25% 98%',
        '--foreground': '25 15% 9%',
        '--muted': '25 25% 94%',
        '--muted-foreground': '25 7% 46%',
        '--popover': '25 25% 98%',
        '--popover-foreground': '25 15% 9%',
        '--card': '25 25% 98%',
        '--card-foreground': '25 15% 9%',
        '--border': '25 25% 90%',
        '--input': '25 25% 90%',
        '--primary': '21 90% 48%',
        '--primary-foreground': '25 25% 98%',
        '--secondary': '25 25% 94%',
        '--secondary-foreground': '25 15% 9%',
        '--accent': '25 25% 94%',
        '--accent-foreground': '25 15% 9%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '25 25% 98%',
        '--ring': '21 90% 48%',
      },
      midnight: {
        '--background': '240 10% 4%',
        '--foreground': '240 10% 98%',
        '--muted': '240 10% 15%',
        '--muted-foreground': '240 5% 65%',
        '--popover': '240 10% 4%',
        '--popover-foreground': '240 10% 98%',
        '--card': '240 10% 4%',
        '--card-foreground': '240 10% 98%',
        '--border': '240 10% 15%',
        '--input': '240 10% 15%',
        '--primary': '263 70% 50%',
        '--primary-foreground': '240 10% 98%',
        '--secondary': '240 10% 15%',
        '--secondary-foreground': '240 10% 98%',
        '--accent': '240 10% 15%',
        '--accent-foreground': '240 10% 98%',
        '--destructive': '0 75% 60%',
        '--destructive-foreground': '240 10% 98%',
        '--ring': '263 70% 50%',
      },
      forest: {
        '--background': '140 30% 97%',
        '--foreground': '140 15% 9%',
        '--muted': '140 30% 94%',
        '--muted-foreground': '140 10% 46%',
        '--popover': '140 30% 97%',
        '--popover-foreground': '140 15% 9%',
        '--card': '140 30% 97%',
        '--card-foreground': '140 15% 9%',
        '--border': '140 30% 90%',
        '--input': '140 30% 90%',
        '--primary': '140 60% 24%',
        '--primary-foreground': '140 30% 97%',
        '--secondary': '140 30% 94%',
        '--secondary-foreground': '140 15% 9%',
        '--accent': '140 30% 94%',
        '--accent-foreground': '140 15% 9%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '140 30% 97%',
        '--ring': '140 60% 24%',
      },
      cyber: {
        '--background': '300 20% 6%',
        '--foreground': '300 20% 98%',
        '--muted': '300 20% 15%',
        '--muted-foreground': '300 10% 65%',
        '--popover': '300 20% 6%',
        '--popover-foreground': '300 20% 98%',
        '--card': '300 20% 6%',
        '--card-foreground': '300 20% 98%',
        '--border': '300 20% 15%',
        '--input': '300 20% 15%',
        '--primary': '322 84% 60%',
        '--primary-foreground': '300 20% 6%',
        '--secondary': '300 20% 15%',
        '--secondary-foreground': '300 20% 98%',
        '--accent': '300 20% 15%',
        '--accent-foreground': '300 20% 98%',
        '--destructive': '0 75% 60%',
        '--destructive-foreground': '300 20% 98%',
        '--ring': '322 84% 60%',
      }
    };

    // Apply the theme-specific CSS variables
    const currentThemeStyles = themeStyles[theme];
    Object.entries(currentThemeStyles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    localStorage.setItem('jee-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
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
