
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { List, Eye, Check, Flag, BookmarkCheck, Clock, AlertTriangle } from 'lucide-react';
import { QuestionStatus, QuestionStatusType } from '../types';
import { getQuestionStatusColor } from '../utils/helpers';
import { motion } from 'framer-motion';

interface QuestionNavigatorProps {
  questionStatuses: QuestionStatus[];
  currentQuestionIndex: number;
  jumpToQuestion: (index: number) => void;
}

export function QuestionNavigator({ 
  questionStatuses, 
  currentQuestionIndex, 
  jumpToQuestion 
}: QuestionNavigatorProps) {
  // Get question status icon
  const getQuestionStatusIcon = (status: QuestionStatusType) => {
    switch (status) {
      case 'not-visited':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      case 'not-answered':
        return <Eye className="h-3 w-3" />;
      case 'answered':
        return <Check className="h-3 w-3" />;
      case 'marked-review':
        return <Flag className="h-3 w-3" />;
      case 'answered-marked':
        return <BookmarkCheck className="h-3 w-3" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      'not-visited': 0,
      'not-answered': 0,
      'answered': 0,
      'marked-review': 0,
      'answered-marked': 0
    };
    
    questionStatuses.forEach(status => {
      counts[status.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalQuestions = questionStatuses.length;
  const attemptedQuestions = statusCounts.answered + statusCounts['answered-marked'];
  const flaggedQuestions = statusCounts['marked-review'] + statusCounts['answered-marked'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20"
    >
      {/* Header with stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Question Navigator
          </h3>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <Check className="h-3 w-3 mr-1" />
            {attemptedQuestions}/{totalQuestions}
          </Badge>
          {flaggedQuestions > 0 && (
            <Badge variant="outline" className="text-xs text-amber-600">
              <Flag className="h-3 w-3 mr-1" />
              {flaggedQuestions} flagged
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{attemptedQuestions}</div>
          <div className="text-xs text-blue-600">Answered</div>
        </div>
        <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="text-lg font-bold text-amber-600">{flaggedQuestions}</div>
          <div className="text-xs text-amber-600">Flagged</div>
        </div>
        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-lg font-bold text-red-600">{statusCounts['not-answered']}</div>
          <div className="text-xs text-red-600">Viewed</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{statusCounts['not-visited']}</div>
          <div className="text-xs text-gray-600">Remaining</div>
        </div>
      </div>
      
      {/* Question Grid */}
      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Click a number to navigate to that question
        </div>
        
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questionStatuses.map((status, index) => (
            <motion.div
              key={`question-nav-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className={`
                  w-10 h-10 relative text-sm font-medium
                  ${getQuestionStatusColor(status.status)} 
                  ${index === currentQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                  transition-all duration-200 hover:shadow-md
                `}
                variant="outline"
                onClick={() => jumpToQuestion(index)}
              >
                <span className="relative z-10">{index + 1}</span>
                <div className="absolute -top-1 -right-1 z-20">
                  {getQuestionStatusIcon(status.status)}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Not Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Eye className="h-2.5 w-2.5 text-red-600" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Viewed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-green-600" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Flag className="h-2.5 w-2.5 text-amber-600" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BookmarkCheck className="h-2.5 w-2.5 text-purple-600" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Both</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {(statusCounts['not-answered'] > 0 || flaggedQuestions > 0) && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 justify-center">
            {statusCounts['not-answered'] > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextUnanswered = questionStatuses.findIndex(s => s.status === 'not-answered');
                  if (nextUnanswered !== -1) jumpToQuestion(nextUnanswered);
                }}
                className="text-xs flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                Next Unanswered
              </Button>
            )}
            {flaggedQuestions > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextFlagged = questionStatuses.findIndex(s => 
                    s.status === 'marked-review' || s.status === 'answered-marked'
                  );
                  if (nextFlagged !== -1) jumpToQuestion(nextFlagged);
                }}
                className="text-xs flex items-center gap-1"
              >
                <Flag className="h-3 w-3" />
                Next Flagged
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
