
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Home, 
  Calendar, 
  Library, 
  Brain, 
  ChevronLeft, 
  ChevronRight, 
  BarChart4, 
  BookCheck, 
  Calculator,
  Target,
  Rocket,
  Sparkles,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const sidebarItems = [
    { 
      icon: <Home className="h-5 w-5" />, 
      label: 'Home', 
      path: '/',
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/25'
    },
    { 
      icon: <Rocket className="h-5 w-5" />, 
      label: 'Prepometer', 
      path: '/prepometer',
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/25'
    },
    { 
      icon: <BarChart4 className="h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/dashboard',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/25'
    },
    { 
      icon: <BookOpen className="h-5 w-5" />, 
      label: 'Subjects', 
      path: '/subject/Maths',
      gradient: 'from-orange-500 to-red-500',
      glow: 'shadow-orange-500/25',
      subItems: [
        { label: 'Mathematics', path: '/subject/Maths', icon: '📐' },
        { label: 'Physics', path: '/subject/Physics', icon: '⚛️' },
        { label: 'Chemistry', path: '/subject/Chemistry', icon: '🧪' }
      ]
    },
    { 
      icon: <Brain className="h-5 w-5" />, 
      label: 'Study Tools', 
      path: '/tools',
      gradient: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-500/25',
      subItems: [
        { label: 'Pomodoro Timer', path: '/tools/pomodoro-timer', icon: '⏱️' },
        { label: 'Flashcards', path: '/tools/flashcards', icon: '🗂️' },
        { label: 'Formula Sheet', path: '/tools/formula-sheet', icon: '📊' }
      ]
    },
    { 
      icon: <Library className="h-5 w-5" />, 
      label: 'Resources', 
      path: '/resources',
      gradient: 'from-teal-500 to-cyan-500',
      glow: 'shadow-teal-500/25'
    }
  ];

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Header with sparkle effect */}
      <div className="p-4 border-b border-border/30 relative">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <AnimatePresence>
            {(isExpanded || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                JEE Prep
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Scrollable content area */}
      <ScrollArea className="flex-1 py-6">
        <div className="px-3">
          <motion.ul className="space-y-3">
            {sidebarItems.map((item, index) => (
              <motion.li key={index} className="relative">
                <Link 
                  to={item.path}
                  onClick={onLinkClick}
                  className={cn(
                    "relative flex items-center py-3 px-4 rounded-2xl transition-all duration-500 group overflow-hidden",
                    "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]",
                    isActive(item.path) 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl ${item.glow} shadow-2xl` 
                      : "hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 hover:shadow-lg"
                  )}
                >
                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"
                      layoutId="activeBackground"
                      initial={false}
                      transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 300 
                      }}
                    />
                  )}

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <motion.div 
                    className="relative z-10 flex items-center w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative">
                      {item.icon}
                      {/* Icon glow effect */}
                      <motion.div
                        className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                        style={{
                          background: isActive(item.path) ? 'rgba(255,255,255,0.3)' : 'rgba(59,130,246,0.3)'
                        }}
                      />
                    </div>
                    
                    <AnimatePresence>
                      {(isExpanded || isMobile) && (
                        <motion.div 
                          className="ml-4 font-medium relative z-10 flex-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          {item.label}
                          {/* Text shimmer effect for active items */}
                          {isActive(item.path) && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{
                                x: ['-100%', '100%']
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Floating indicator */}
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
                
                {/* Enhanced Submenu */}
                {(isExpanded || isMobile) && item.subItems && (
                  <AnimatePresence>
                    <motion.ul
                      className="mt-3 ml-6 space-y-2 relative"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      {/* Connecting line */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
                      
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.li 
                          key={subIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: subIndex * 0.05,
                            duration: 0.3
                          }}
                        >
                          <Link 
                            to={subItem.path}
                            onClick={onLinkClick}
                            className={cn(
                              "flex items-center py-2 px-3 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden",
                              "hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 hover:shadow-md hover:scale-105",
                              isActive(subItem.path) 
                                ? "text-primary font-semibold bg-primary/10 shadow-lg border border-primary/20" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <motion.span 
                              className="text-lg mr-2"
                              whileHover={{ 
                                scale: 1.2,
                                rotate: 10
                              }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {subItem.icon}
                            </motion.span>
                            <span className="relative z-10">{subItem.label}</span>
                            
                            {/* Hover effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100"
                              transition={{ duration: 0.2 }}
                            />
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                )}
              </motion.li>
            ))}
          </motion.ul>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {/* Enhanced Toggle Button (Desktop only) */}
      {!isMobile && (
        <div className="p-3 border-t border-border/30 relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 group relative overflow-hidden" 
              onClick={toggleSidebar}
            >
              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200
                }}
                className="relative z-10"
              >
                {isExpanded ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </motion.div>

              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded border-2 border-primary/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );

  // Mobile Sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Trigger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-16 left-4 z-50 md:hidden bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Sheet Sidebar */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent 
            side="left" 
            className="w-80 p-0 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl border-r border-border/50"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </div>
            
            <SidebarContent onLinkClick={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop Sidebar
  const sidebarVariants = {
    expanded: { 
      width: 280, 
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      } 
    },
    collapsed: { 
      width: 72, 
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    }
  };

  return (
    <motion.div 
      className="fixed left-0 top-14 bottom-0 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl border-r border-border/50 z-20 shadow-2xl hidden md:flex flex-col"
      variants={sidebarVariants}
      initial={isExpanded ? "expanded" : "collapsed"}
      animate={isExpanded ? "expanded" : "collapsed"}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        borderImage: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1)) 1',
        height: 'calc(100vh - 3.5rem)'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <SidebarContent />
    </motion.div>
  );
};
