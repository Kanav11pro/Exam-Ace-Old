
import { cn } from '@/lib/utils';

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
        <div 
          className={cn(
            "progress-bar-fill",
            `progress-bar-fill-${variant}`,
            animated && "animate-progress-fill"
          )}
          style={{ 
            "--progress-width": `${clampedProgress}%`,
            width: `${clampedProgress}%` 
          } as React.CSSProperties}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-right font-medium">{Math.round(clampedProgress)}%</p>
      )}
    </div>
  );
}
