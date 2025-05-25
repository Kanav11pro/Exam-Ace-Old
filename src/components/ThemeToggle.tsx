
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette, Droplet, Leaf, Zap, Sunset, Star, TreePine, Cpu } from 'lucide-react';
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
    'ocean': <Droplet className="h-5 w-5 text-blue-400" />,
    'neon': <Zap className="h-5 w-5 text-cyan-400" />,
    'sunset': <Sunset className="h-5 w-5 text-orange-400" />,
    'midnight': <Star className="h-5 w-5 text-purple-300" />,
    'forest': <TreePine className="h-5 w-5 text-green-600" />,
    'cyber': <Cpu className="h-5 w-5 text-pink-400" />
  };
  
  // Map of theme labels
  const themeLabels = {
    'light': 'Light',
    'dark': 'Dark',
    'purple': 'Purple',
    'green': 'Nature',
    'ocean': 'Ocean',
    'neon': 'Neon',
    'sunset': 'Sunset',
    'midnight': 'Midnight',
    'forest': 'Forest',
    'cyber': 'Cyber'
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
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 rounded-full"
            animate={{ 
              scale: [0.8, 1.4, 1], 
              opacity: [0, 0.6, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 2 
            }}
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
      <DropdownMenuContent align="end" className="min-w-[10rem] p-3 backdrop-blur-md bg-background/80">
        <div className="grid grid-cols-2 gap-2">
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
