import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp, Library, Clock, Brain, Calendar, FileCog, BookOpen, ArrowLeft } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Header() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const showBackButton = location.pathname !== '/';
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const mobileMenu = <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-[275px] sm:w-[300px]">
      <nav className="flex flex-col gap-4 mt-8">
        <Link to="/" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/subject/Maths" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Mathematics
        </Link>
        <Link to="/subject/Physics" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Physics
        </Link>
        <Link to="/subject/Chemistry" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Chemistry
        </Link>
        <Link to="/dashboard" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Dashboard
        </Link>
        
        <div className="px-2 py-1 font-medium text-lg mt-4">Study Tools</div>
        <Link to="/tools" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          All Tools
        </Link>
        <Link to="/tools/pomodoro-timer" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Pomodoro Timer
        </Link>
        <Link to="/tools/flashcards" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Flashcards
        </Link>
        <Link to="/tools/focus-mode" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Focus Mode
        </Link>
        <Link to="/tools/formula-sheet" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Formula Sheet
        </Link>
        <Link to="/tools/error-log" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Error Log
        </Link>
        <Link to="/tools/weekly-planner" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Weekly Planner
        </Link>
        <Link to="/tools/revision-reminder" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Revision Reminder
        </Link>
        <Link to="/tools/mindfulness" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Mindfulness
        </Link>
        <Link to="/tools/daily-quiz" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Daily Quiz
        </Link>
        <Link to="/tools/bookmark-manager" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Bookmark Manager
        </Link>
        <Link to="/tools/eye-rest-timer" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Eye Rest Timer
        </Link>
        <Link to="/tools/study-music" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Study Music
        </Link>
        <Link to="/tools/mock-tests" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Mock Tests
        </Link>
        <Link to="/tools/backlog-management" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Backlog Management
        </Link>
        
        <Link to="/resources" className="px-2 py-1 hover:bg-accent rounded-md" onClick={() => setIsOpen(false)}>
          Learning Resources
        </Link>
      </nav>
    </SheetContent>
  </Sheet>;
  
  return <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Link to="/" className="font-bold text-xl flex items-center">
          <span className="mr-2">📊</span>
          <span className="hidden sm:inline">JEE Prepometer</span>
          <span className="sm:hidden">Prepometer</span>
        </Link>
      </div>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger>Subjects</NavigationMenuTrigger>
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
            <NavigationMenuTrigger>Study Tools</NavigationMenuTrigger>
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
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/resources">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Resources
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isMobile && mobileMenu}
      </div>
    </div>
  </header>;
}
