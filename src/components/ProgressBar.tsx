
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  variant?: 'default' | 'dashboard' | 'maths' | 'physics' | 'chemistry';
  animated?: boolean;
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean; // Added this prop
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'default',
  animated = false,
  height = 'md',
  showPercentage = false // Set default value
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Ensure progress is always between 0 and 100
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  useEffect(() => {
    if (animated) {
      // Start with 0 then animate to actual progress
      setAnimatedProgress(0);
      const timer = setTimeout(() => {
        setAnimatedProgress(safeProgress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(safeProgress);
    }
  }, [safeProgress, animated]);

  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[height];

  const getVariantClasses = () => {
    switch (variant) {
      case 'maths':
        return 'bg-gradient-to-r from-blue-400 to-cyan-400';
      case 'physics':
        return 'bg-gradient-to-r from-green-400 to-emerald-400';
      case 'chemistry':
        return 'bg-gradient-to-r from-orange-400 to-amber-400';
      case 'dashboard':
        return 'bg-gradient-to-r from-indigo-400 to-purple-400';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  return (
    <div className="w-full">
      <div className={cn(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        heightClass
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full',
            getVariantClasses()
          )}
          initial={{ width: '0%' }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ 
            duration: animated ? 1 : 0, 
            ease: [0.34, 1.56, 0.64, 1] 
          }}
        />
      </div>
      
      {showPercentage && (
        <div className="text-xs text-right mt-1 text-gray-600 dark:text-gray-400">
          {Math.round(safeProgress)}%
        </div>
      )}
    </div>
  );
};
