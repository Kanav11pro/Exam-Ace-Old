import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp, Library, Clock, Brain, Calendar, FileCog, BookOpen, ArrowLeft } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const menuIcon = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-primary transition-all duration-300" />
      ) : (
        <Menu className="h-6 w-6 text-primary transition-all duration-300" />
      )}
    </motion.div>
  );
  
  const mobileMenu = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative group">
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 opacity-0 group-hover:opacity-100 animate-ping" />
          {menuIcon}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[275px] sm:w-[300px] overflow-y-auto bg-gradient-to-b from-background to-background/90 backdrop-blur-sm">
        <div className="w-full h-full relative">
          {/* Decorative elements */}
          <div className="absolute top-5 right-5 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
          
          <motion.nav 
            className="flex flex-col gap-4 mt-8 relative z-10"
            initial="hidden"
            animate="visible"
            variants={menuVariants}
          >
            <motion.div variants={itemVariants}>
              <Link to="/" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Home</span>
              </Link>
            </motion.div>
            
            {/* More menu items - subjects */}
            <motion.p variants={itemVariants} className="px-2 font-medium text-lg mt-4 text-primary/80">Subjects</motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/subject/Maths" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">π</span>
                </div>
                <span>Mathematics</span>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/subject/Physics" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">F</span>
                </div>
                <span>Physics</span>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/subject/Chemistry" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">H<sub>2</sub>O</span>
                </div>
                <span>Chemistry</span>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/dashboard" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-sm">📊</span>
                </div>
                <span>Dashboard</span>
              </Link>
            </motion.div>
            
            {/* Study Tools */}
            <motion.p variants={itemVariants} className="px-2 font-medium text-lg mt-4 text-primary/80">Study Tools</motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/tools" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <span>All Tools</span>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/tools/pomodoro-timer" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <span>Pomodoro Timer</span>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/tools/flashcards" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-sm">🃏</span>
                </div>
                <span>Flashcards</span>
              </Link>
            </motion.div>
            
            {/* Add more study tools with similar styling */}
            
            <motion.div variants={itemVariants}>
              <Link to="/resources" className="px-2 py-1 hover:bg-accent rounded-md flex items-center space-x-2 transition-all hover:translate-x-1" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <Library className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <span>Learning Resources</span>
              </Link>
            </motion.div>
          </motion.nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleGoBack} 
                className="mr-2" 
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          
          <Link to="/" className="font-bold text-xl flex items-center group">
            <motion.div 
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              className="mr-2 text-2xl"
            >
              📊
            </motion.div>
            <motion.span 
              className="hidden sm:inline bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              JEE Prepometer
            </motion.span>
            <motion.span 
              className="sm:hidden bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Prepometer
            </motion.span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group")}>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block"
                  >
                    <span>Home</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                  </motion.span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="rounded-none group">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  <span>Prepometer</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </motion.span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/subject/Maths">
                        <Library className="h-6 w-6 mb-2" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          All Subjects
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Explore all JEE subjects and topics organized by chapters
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link to="/subject/Maths" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Mathematics</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Algebra, Calculus, Trigonometry and more
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/subject/Physics" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Physics</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Mechanics, Electromagnetism, Modern Physics and more
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/subject/Chemistry" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Chemistry</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Organic, Inorganic, Physical Chemistry and more
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="group">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  <span>Study Tools</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </motion.span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/tools">
                        <Brain className="h-6 w-6 mb-2" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          All Study Tools
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Explore all our specialized tools to enhance your JEE preparation
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link to="/tools/pomodoro-timer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Pomodoro Timer</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Focus with time-boxed intervals
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/tools/flashcards" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Flashcards</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Test your knowledge interactively
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/tools/mock-tests" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Mock Tests</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Full JEE exam simulations
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/tools/formula-sheet" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Formula Sheet</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Quick access to important formulas
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group")}>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block"
                  >
                    <span>Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                  </motion.span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/resources">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "group")}>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block"
                  >
                    <span>Resources</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                  </motion.span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {isMobile && mobileMenu}
        </div>
      </div>
    </header>
  );
}
