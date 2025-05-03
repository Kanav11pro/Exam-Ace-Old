
import React from 'react';
import { Button } from '@/components/ui/button';
import { List, Eye, Check, Flag, BookmarkCheck } from 'lucide-react';
import { QuestionStatus, QuestionStatusType } from '../types';
import { getQuestionStatusColor } from '../utils/helpers';

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
        return <></>;
      case 'not-answered':
        return <Eye className="h-3 w-3" />;
      case 'answered':
        return <Check className="h-3 w-3" />;
      case 'marked-review':
        return <Flag className="h-3 w-3" />;
      case 'answered-marked':
        return <BookmarkCheck className="h-3 w-3" />;
      default:
        return <></>;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center">
          <List className="h-4 w-4 mr-1" />
          Question Navigator
        </h3>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Click a number to navigate
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {questionStatuses.map((status, index) => (
          <Button
            key={`question-nav-${index}`}
            size="icon"
            className={`w-8 h-8 relative ${getQuestionStatusColor(status.status)} ${index === currentQuestionIndex ? 'ring-2 ring-primary' : ''}`}
            variant="outline"
            onClick={() => jumpToQuestion(index)}
          >
            <span>{index + 1}</span>
            <span className="absolute -top-1 -right-1">
              {getQuestionStatusIcon(status.status)}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
          <span className="text-xs">Not Visited</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-2"></div>
          <span className="text-xs">Not Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-2"></div>
          <span className="text-xs">Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-2"></div>
          <span className="text-xs">Marked for Review</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-2"></div>
          <span className="text-xs">Answered & Marked</span>
        </div>
      </div>
    </div>
  );
}
