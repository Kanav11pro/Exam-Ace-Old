
import { Button } from '@/components/ui/button';
import { Moon, Sun, Cpu, Star } from 'lucide-react';
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
    'cyber': <Cpu className="h-5 w-5 text-pink-400" />,
    'midnight': <Star className="h-5 w-5 text-purple-300" />
  };
  
  // Map of theme labels
  const themeLabels = {
    'light': 'Light',
    'dark': 'Dark',
    'cyber': 'Cyber',
    'midnight': 'Midnight'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full relative overflow-hidden hover:bg-accent/50 hover:scale-110 transition-all duration-300"
        >
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
      <DropdownMenuContent align="end" className="min-w-[8rem] p-2 backdrop-blur-md bg-background/80">
        <div className="grid grid-cols-1 gap-1">
          {Object.entries(themeLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all hover:scale-105 ${
                theme === key ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30' : ''
              }`}
              onClick={() => setTheme(key as any)}
            >
              <div className="flex-shrink-0">
                {themeIcons[key as keyof typeof themeIcons]}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
