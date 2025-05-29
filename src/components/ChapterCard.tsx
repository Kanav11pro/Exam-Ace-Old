
import { Link } from 'react-router-dom';
import { useJEEData } from '@/context/jee';
import { ProgressBar } from './ProgressBar';
import { chapterIcons } from '@/data/jeeData';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

interface ChapterCardProps {
  subject: string;
  chapter: string;
}

export function ChapterCard({
  subject,
  chapter
}: ChapterCardProps) {
  const { getProgressByChapter } = useJEEData();
  const progress = getProgressByChapter(subject, chapter);

  // Determine the progress color based on the subject
  const progressVariant = subject === 'Maths' ? 'maths' : subject === 'Physics' ? 'physics' : 'chemistry';
  
  // Get subject-specific gradient colors
  const getSubjectGradient = () => {
    switch(subject) {
      case 'Maths':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'Physics':
        return 'from-purple-500/20 to-violet-500/20';
      case 'Chemistry':
        return 'from-green-500/20 to-emerald-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  };

  const getSubjectBorder = () => {
    switch(subject) {
      case 'Maths':
        return 'border-blue-500/30';
      case 'Physics':
        return 'border-purple-500/30';
      case 'Chemistry':
        return 'border-green-500/30';
      default:
        return 'border-gray-500/30';
    }
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        rotateY: 5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className="group relative"
    >
      {/* Floating sparkle effects */}
      <motion.div
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 z-10"
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="h-4 w-4 text-yellow-500" />
      </motion.div>

      <Link 
        to={`/subject/${subject}/${encodeURIComponent(chapter)}`} 
        className={`chapter-card relative bg-white dark:bg-gray-800/90 backdrop-blur-xl p-6 h-44 flex flex-col justify-between transition-all duration-500 overflow-hidden border-2 hover:shadow-2xl ${getSubjectBorder()}`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${getSubjectGradient()} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          initial={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {/* Header section */}
          <div className="flex justify-between items-start mb-4">
            <motion.h3 
              className="text-lg font-bold line-clamp-2 pr-2 group-hover:text-primary transition-colors duration-300"
              initial={{ y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {chapter}
            </motion.h3>
            
            <motion.div
              className="relative"
              whileHover={{ 
                scale: 1.3,
                rotate: 15,
                y: -5
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 10
              }}
            >
              <motion.span 
                role="img" 
                aria-label={chapter} 
                className="text-4xl filter drop-shadow-lg"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(0,0,0,0)",
                    "0 0 10px rgba(59,130,246,0.5)",
                    "0 0 0px rgba(0,0,0,0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {chapterIcons[chapter] || '📝'}
              </motion.span>
              
              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-70"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
          
          {/* Progress section */}
          <div className="space-y-3">
            {/* Progress bar with enhanced styling */}
            <div className="relative">
              <ProgressBar 
                progress={progress} 
                variant={progressVariant} 
                showPercentage={false}
                className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden"
              />
              
              {/* Progress glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Progress stats */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`font-bold text-lg ${getProgressColor()}`}
                >
                  {progress.toFixed(1)}%
                </motion.div>
                <span className="text-muted-foreground">complete</span>
              </div>
              
              <motion.div 
                className="flex items-center gap-1 text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                {progress >= 75 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600 font-medium">Excellent</span>
                  </>
                ) : progress >= 50 ? (
                  <>
                    <Target className="h-3 w-3 text-blue-500" />
                    <span className="text-blue-600 font-medium">Good</span>
                  </>
                ) : (
                  <>
                    <Target className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-600 font-medium">Keep Going</span>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating progress indicator */}
        {progress > 0 && (
          <motion.div
            className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ 
              scale: 1.2,
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)"
            }}
            transition={{ delay: 0.2 }}
          >
            ✓
          </motion.div>
        )}

        {/* Interactive border effect */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-transparent"
          whileHover={{
            borderColor: subject === 'Maths' ? '#3B82F6' : 
                        subject === 'Physics' ? '#8B5CF6' : '#10B981'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full"
          transition={{ duration: 0.6 }}
        />
      </Link>
    </motion.div>
  );
}
