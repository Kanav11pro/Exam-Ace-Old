import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
export function ThemeToggle() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} className="rounded-full relative overflow-hidden">
      <motion.div initial={{
      opacity: 0,
      scale: 0
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0
    }} transition={{
      duration: 0.3
    }} key={theme} className="absolute inset-0 flex items-center justify-center bg-slate-300 rounded-none">
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>;
}