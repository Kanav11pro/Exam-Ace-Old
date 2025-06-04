
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

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:justify-center gap-4">
          {/* Site Title */}
          <motion.div 
            className="flex items-center gap-2 lg:absolute lg:left-4"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Exam-Ace
            </h1>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div 
            className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 shadow-inner backdrop-blur-sm"
            variants={itemVariants}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                    ${tab.isActive 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.1 }
                  }}
                >
                  {/* Active indicator */}
                  {tab.isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <Icon className={`h-4 w-4 ${tab.isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  
                  <span className="hidden sm:inline relative z-10">
                    {tab.label}
                  </span>
                  
                  {tab.isExternal && (
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  )}
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 to-purple-500/0 hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300"
                    whileHover={{
                      background: "linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))"
                    }}
                  />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            className="hidden lg:flex absolute right-4 items-center gap-2"
            variants={itemVariants}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-300" />
            <div className="w-1 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse delay-700" />
          </motion.div>
        </div>
      </div>

      {/* Subtle gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
    </motion.nav>
  );
};

export default TopNavbar;
