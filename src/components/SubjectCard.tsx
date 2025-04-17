
import { Link } from 'react-router-dom';
import { useJEEData } from '@/context/jee'; 
import { ProgressBar } from './ProgressBar';
import { subjectIcons } from '@/data/jeeData';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  subject: string;
  variant: 'maths' | 'physics' | 'chemistry' | 'dashboard';
}

export function SubjectCard({ subject, variant }: SubjectCardProps) {
  const { getProgressBySubject, getTotalProgress } = useJEEData();
  
  // Calculate the progress percentage based on subject or total
  const progress = subject === 'Dashboard' 
    ? getTotalProgress() 
    : getProgressBySubject(subject);

  return (
    <motion.div
      whileHover={{ 
        y: -8,
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <Link
        to={subject === 'Dashboard' ? '/dashboard' : `/subject/${subject}`}
        className={`subject-card subject-card-${variant} p-6 h-40 flex flex-col justify-between group relative overflow-hidden`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br opacity-70 from-transparent to-black/20 transition-opacity duration-300 group-hover:opacity-50" />
        
        {/* Animated particle effect */}
        <div className="absolute right-0 bottom-0 w-24 h-24 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute w-2 h-2 rounded-full bg-white animate-pulse-slow" style={{ top: '20%', left: '30%' }} />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow" style={{ top: '40%', left: '70%', animationDelay: '0.5s' }} />
          <div className="absolute w-1 h-1 rounded-full bg-white animate-pulse-slow" style={{ top: '70%', left: '20%', animationDelay: '1s' }} />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <h2 className="text-2xl font-bold">{subject}</h2>
          <motion.span 
            className="text-4xl" 
            role="img" 
            aria-label={subject}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {subjectIcons[subject as keyof typeof subjectIcons]}
          </motion.span>
        </div>
        
        <div className="mt-auto relative z-10">
          <ProgressBar 
            progress={progress} 
            variant={variant} 
            showPercentage 
          />
        </div>
      </Link>
    </motion.div>
  );
}
