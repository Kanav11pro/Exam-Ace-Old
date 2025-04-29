
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
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const sidebarItems = [
    { 
      icon: <Home className="h-5 w-5" />, 
      label: 'Home', 
      path: '/' 
    },
    { 
      icon: <BarChart4 className="h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: <BookOpen className="h-5 w-5" />, 
      label: 'Subjects', 
      path: '/subject/Maths',
      subItems: [
        { label: 'Mathematics', path: '/subject/Maths' },
        { label: 'Physics', path: '/subject/Physics' },
        { label: 'Chemistry', path: '/subject/Chemistry' }
      ]
    },
    { 
      icon: <Brain className="h-5 w-5" />, 
      label: 'Study Tools', 
      path: '/tools',
      subItems: [
        { label: 'Pomodoro Timer', path: '/tools/pomodoro-timer' },
        { label: 'Flashcards', path: '/tools/flashcards' },
        { label: 'Formula Sheet', path: '/tools/formula-sheet' }
      ]
    },
    { 
      icon: <Library className="h-5 w-5" />, 
      label: 'Resources', 
      path: '/resources' 
    }
  ];
  
  const sidebarVariants = {
    expanded: { width: 240, transition: { duration: 0.3 } },
    collapsed: { width: 72, transition: { duration: 0.3 } }
  };
  
  const itemVariants = {
    expanded: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    collapsed: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div 
      className="fixed left-0 top-14 bottom-0 bg-gray-50 dark:bg-gray-900 border-r h-[calc(100vh-3.5rem)] z-10 shadow-sm hidden md:flex flex-col"
      variants={sidebarVariants}
      initial={isExpanded ? "expanded" : "collapsed"}
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      <div className="flex-1 py-4 flex flex-col overflow-hidden">
        <ul className="space-y-2 px-2">
          {sidebarItems.map((item, index) => (
            <motion.li key={index} className="relative">
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive(item.path) 
                    ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-100" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <div className="relative">
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute inset-0 bg-indigo-200 dark:bg-indigo-700 rounded-full"
                      layoutId="activeBackground"
                      initial={false}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      style={{ opacity: 0.3 }}
                    />
                  )}
                  <div className="relative z-10">{item.icon}</div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      className="ml-3 truncate"
                      variants={itemVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              
              {isExpanded && item.subItems && (
                <AnimatePresence>
                  <motion.ul
                    className="mt-1 ml-8 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <motion.li 
                        key={subIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIndex * 0.05 }}
                      >
                        <Link 
                          to={subItem.path}
                          className={cn(
                            "flex items-center py-1 px-2 text-sm rounded-md transition-colors",
                            isActive(subItem.path) 
                              ? "text-indigo-700 dark:text-indigo-400 font-medium" 
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
      
      <div className="p-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-center" 
          onClick={toggleSidebar}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};
