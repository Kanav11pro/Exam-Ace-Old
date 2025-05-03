
import { Question, QuestionStatus, QuestionStatusType } from '../types';

// Helper function to shuffle array
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Format time from seconds to mm:ss
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get streak message based on score
export const getStreakMessage = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return "Excellent! You're mastering the material!";
  if (percentage >= 70) return "Good job! Keep practicing!";
  if (percentage >= 50) return "Nice effort! Review the topics you missed.";
  return "Keep studying, you'll improve with practice!";
};

// Get progress color based on score
export const getProgressColor = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-yellow-500";
  if (percentage >= 40) return "bg-orange-500";
  return "bg-red-500";
};

// Get subject badge color
export const getSubjectBadgeColor = (subject: string) => {
  switch (subject) {
    case 'Maths':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'Physics':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'Chemistry':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Get question status color
export const getQuestionStatusColor = (status: QuestionStatusType) => {
  switch (status) {
    case 'not-visited':
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    case 'not-answered':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'answered':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'marked-review':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'answered-marked':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Get question status icon
export const getQuestionStatusIcon = (status: QuestionStatusType) => {
  switch (status) {
    case 'not-visited':
      return null;
    case 'not-answered':
      return 'Eye';
    case 'answered':
      return 'Check';
    case 'marked-review':
      return 'Flag';
    case 'answered-marked':
      return 'BookmarkCheck';
    default:
      return null;
  }
};
