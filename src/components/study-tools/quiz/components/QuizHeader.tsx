
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, X, PauseCircle, Play, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubjectBadgeColor, formatTime } from '../utils/helpers';

interface QuizHeaderProps {
  subject: string;
  difficulty?: string;
  isPaused: boolean;
  isFullScreen: boolean;
  timeSpent: number;
  pauseTime: number;
  togglePauseTest: (pauseState: boolean) => void;
  toggleFullScreen: () => void;
  handleExitRequest: () => void;
  quizComplete: boolean;
}

export function QuizHeader({
  subject,
  difficulty,
  isPaused,
  isFullScreen,
  timeSpent,
  pauseTime,
  togglePauseTest,
  toggleFullScreen,
  handleExitRequest,
  quizComplete
}: QuizHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-4"
    >
      <div className="flex gap-2">
        <Badge className={getSubjectBadgeColor(subject)}>
          {subject}
        </Badge>
        
        {difficulty && (
          <Badge variant={difficulty === 'easy' ? 'outline' : 
                  difficulty === 'medium' ? 'secondary' : 'destructive'}>
            {difficulty}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {formatTime(isPaused ? pauseTime : timeSpent - pauseTime)}
        </div>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => togglePauseTest(!isPaused)}
          disabled={quizComplete}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={toggleFullScreen}
        >
          {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleExitRequest}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
