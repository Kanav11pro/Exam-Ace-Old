
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  className?: string;
  variant?: 'maths' | 'physics' | 'chemistry' | 'dashboard';
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  className = "", 
  variant = "maths", 
  showPercentage = false,
  animated = true
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="space-y-1">
      <div className={cn("progress-bar", className)}>
        <motion.div 
          className={cn(
            "progress-bar-fill",
            `progress-bar-fill-${variant}`
          )}
          initial={animated ? { width: 0 } : { width: `${clampedProgress}%` }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <motion.p 
          className="text-xs text-right font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(clampedProgress)}%
        </motion.p>
      )}
    </div>
  );
}
