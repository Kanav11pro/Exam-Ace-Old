
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  GraduationCap,
  ExternalLink 
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const TopNavbar = () => {
  const location = useLocation();
  
  const tabs = [
    {
      id: 'prepometer',
      label: 'Prepometer',
      icon: BarChart3,
      href: '/prepometer',
      isActive: location.pathname === '/prepometer' || location.pathname === '/',
      isExternal: false
    },
    {
      id: 'hours-challenge',
      label: 'Hours Challenge',
      icon: Clock,
      href: 'https://hourschallenge.netlify.app/',
      isActive: false,
      isExternal: true
    },
    {
      id: 'daily-planner',
      label: 'Daily Planner',
      icon: Calendar,
      href: 'https://planjee.netlify.app/',
      isActive: false,
      isExternal: true
    }
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.isExternal) {
      window.open(tab.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = tab.href;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Site Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exam-Ace
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 shadow-inner backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300
                    ${tab.isActive 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${tab.isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  
                  <span className="whitespace-nowrap">
                    {tab.label}
                  </span>
                  
                  {tab.isExternal && (
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
