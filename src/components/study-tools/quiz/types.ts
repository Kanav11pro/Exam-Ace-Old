
// Types for the quiz components
export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  date: string; // ISO string
  subject: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  isCompleted: boolean;
  lastQuestionIndex?: number;
  answers?: (number | null)[];
  questionStatuses?: QuestionStatus[];
}

export type QuestionStatusType = 'not-visited' | 'not-answered' | 'answered' | 'marked-review' | 'answered-marked';

export interface QuestionStatus {
  index: number;
  status: QuestionStatusType;
}
