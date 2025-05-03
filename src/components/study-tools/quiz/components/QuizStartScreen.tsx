
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, BookOpen, RefreshCw, ShieldQuestion, History, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { QuizAttempt } from '../types';
import { formatTime, getSubjectBadgeColor } from '../utils/helpers';

interface QuizStartScreenProps {
  canTakeDailyQuiz: boolean;
  todayAttempt: QuizAttempt | null;
  previousAttempts: QuizAttempt[];
  quizSubject: string;
  setQuizSubject: (subject: string) => void;
  startQuiz: () => void;
  strictMode: boolean;
  setStrictMode: (mode: boolean) => void;
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
}

export function QuizStartScreen({
  canTakeDailyQuiz,
  todayAttempt,
  previousAttempts,
  quizSubject,
  setQuizSubject,
  startQuiz,
  strictMode,
  setStrictMode,
  isFullScreen,
  setIsFullScreen
}: QuizStartScreenProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Daily Quiz</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test your knowledge with 10 new questions every day
        </p>
      </div>
      
      {/* Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldQuestion className="h-5 w-5 mr-2" />
            Test Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="strict-mode" className="font-medium">Strict Mode</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Prevents tab switching and monitors for test integrity
              </p>
            </div>
            <Switch 
              id="strict-mode" 
              checked={strictMode} 
              onCheckedChange={setStrictMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fullscreen-mode" className="font-medium">Full Screen Mode</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Take test in distraction-free environment
              </p>
            </div>
            <Switch 
              id="fullscreen-mode" 
              checked={isFullScreen} 
              onCheckedChange={setIsFullScreen}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Take Daily Quiz */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldQuestion className="h-5 w-5 mr-2" />
            Take Today's Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          {canTakeDailyQuiz ? (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Ready to test your JEE preparation? Take the daily quiz to keep your knowledge sharp.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="quiz-subject">Select Subject</Label>
                <Select
                  value={quizSubject}
                  onValueChange={setQuizSubject}
                >
                  <SelectTrigger id="quiz-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Maths">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-medium">Today's Quiz Completed!</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Score:</span>
                  <span className="font-medium">{todayAttempt?.score}/{todayAttempt?.totalQuestions}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Subject:</span>
                  <span className="font-medium">{todayAttempt?.subject === 'all' ? 'All Subjects' : todayAttempt?.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{formatTime(todayAttempt?.timeSpent || 0)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You've already taken today's quiz. Come back tomorrow for a new set of questions!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {canTakeDailyQuiz && (
            <Button className="w-full" onClick={startQuiz}>
              Start Daily Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Practice Quiz */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Want more practice? Take an additional quiz anytime.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="practice-subject">Select Subject</Label>
            <Select
              value={quizSubject}
              onValueChange={setQuizSubject}
            >
              <SelectTrigger id="practice-subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Maths">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={startQuiz}>
            Start Practice Quiz
          </Button>
        </CardFooter>
      </Card>
      
      {/* Previous Attempts */}
      {previousAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Previous Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousAttempts.slice(-5).reverse().map((attempt, index) => (
                <motion.div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(parseISO(attempt.date), 'MMM d, yyyy')}
                      </span>
                      <Badge className={getSubjectBadgeColor(attempt.subject)}>
                        {attempt.subject === 'all' ? 'All' : attempt.subject}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{attempt.score}/{attempt.totalQuestions}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatTime(attempt.timeSpent)}</span>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <div className="text-lg font-bold">
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
