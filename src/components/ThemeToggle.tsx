
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} 
      className="rounded-full relative overflow-hidden hover:bg-accent/50 hover:scale-105 transition-transform"
    >
      <motion.div 
        className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 opacity-0 rounded-full"
        animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />
      
      <motion.div
        initial={{ rotate: -30, scale: 0, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 30, scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        key={theme}
        className="absolute inset-0 flex items-center justify-center rounded-none bg-transparent"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500" />
        )}
      </motion.div>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
