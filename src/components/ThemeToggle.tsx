
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette, Droplet, Leaf } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  // Map of theme icons
  const themeIcons = {
    'light': <Sun className="h-5 w-5 text-amber-500" />,
    'dark': <Moon className="h-5 w-5 text-indigo-300" />,
    'purple': <Palette className="h-5 w-5 text-purple-400" />,
    'green': <Leaf className="h-5 w-5 text-green-400" />,
    'ocean': <Droplet className="h-5 w-5 text-blue-400" />
  };
  
  // Map of theme labels
  const themeLabels = {
    'light': 'Light',
    'dark': 'Dark',
    'purple': 'Purple',
    'green': 'Nature',
    'ocean': 'Ocean'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
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
            {themeIcons[theme]}
          </motion.div>
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem] p-2">
        {Object.entries(themeLabels).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            className={`flex items-center gap-2 cursor-pointer ${theme === key ? 'bg-accent' : ''}`}
            onClick={() => setTheme(key as any)}
          >
            <div className="flex-shrink-0">
              {themeIcons[key as keyof typeof themeIcons]}
            </div>
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
