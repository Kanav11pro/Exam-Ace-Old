
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, BarChart2, Award, Brain, FileText } from 'lucide-react';
import { getSubjectBadgeColor } from '../utils/helpers';
import { Question } from '../types';

interface TestResult {
  testTitle: string;
  score: {
    maths: number;
    physics: number;
    chemistry: number;
    total: number;
  };
  totalTime: number;
  answers: {
    questionId: string;
    selectedAnswer: number | null;
  }[];
  questionDetails: Question[];
  difficultyBreakdown: {
    easy: { total: number; correct: number };
    medium: { total: number; correct: number };
    hard: { total: number; correct: number };
  };
  speedMetrics: {
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
  };
  improvementAreas: string[];
}

interface ResultsViewProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult | null;
  onRetry: () => void;
  onReturn: () => void;
  detailedReport: boolean;
  setDetailedReport: (value: boolean) => void;
}

export function ResultsView({
  isOpen,
  onClose,
  result,
  onRetry,
  onReturn,
  detailedReport,
  setDetailedReport
}: ResultsViewProps) {
  if (!result) return null;
  
  const calculatePercentage = (correct: number, total: number) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };
  
  const getPerformanceLabel = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Above Average";
    if (percentage >= 50) return "Average";
    if (percentage >= 40) return "Below Average";
    if (percentage >= 30) return "Needs Improvement";
    return "Needs Significant Work";
  };
  
  const overallPerformance = calculatePercentage(result.score.total, result.questionDetails.length);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Award className="h-6 w-6 mr-2 text-primary" />
            Quiz Results: {result.testTitle}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="summary" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{overallPerformance}%</div>
                <div className="text-lg mb-1">Overall Score</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getPerformanceLabel(overallPerformance)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{result.score.total}/{result.questionDetails.length}</div>
                <div className="text-lg mb-1">Correct Answers</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.questionDetails.length - result.score.total} incorrect
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{result.totalTime} min</div>
                <div className="text-lg mb-1">Total Time</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ~{result.speedMetrics.averageTimePerQuestion} sec per question
                </div>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-2">Subject Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {result.score.maths > 0 || result.score.physics > 0 || result.score.chemistry > 0 ? (
                <>
                  <SubjectScore 
                    subject="Mathematics" 
                    score={result.score.maths} 
                    total={result.questionDetails.filter(q => q.subject === 'Maths').length}
                  />
                  <SubjectScore 
                    subject="Physics" 
                    score={result.score.physics} 
                    total={result.questionDetails.filter(q => q.subject === 'Physics').length}
                  />
                  <SubjectScore 
                    subject="Chemistry" 
                    score={result.score.chemistry} 
                    total={result.questionDetails.filter(q => q.subject === 'Chemistry').length}
                  />
                </>
              ) : (
                <div className="col-span-3 text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  This quiz focused on {result.testTitle} only
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-lg mb-2">Areas for Improvement</h3>
            <ul className="list-disc list-inside space-y-1 mb-6">
              {result.improvementAreas.map((area, index) => (
                <li key={index} className="text-gray-800 dark:text-gray-200">
                  {area}
                </li>
              ))}
            </ul>
            
            <h3 className="font-medium text-lg mb-2">Difficulty Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <DifficultyScore 
                level="Easy" 
                correct={result.difficultyBreakdown.easy.correct}
                total={result.difficultyBreakdown.easy.total}
                variant="success"
              />
              <DifficultyScore 
                level="Medium" 
                correct={result.difficultyBreakdown.medium.correct}
                total={result.difficultyBreakdown.medium.total}
                variant="warning"
              />
              <DifficultyScore 
                level="Hard" 
                correct={result.difficultyBreakdown.hard.correct}
                total={result.difficultyBreakdown.hard.total}
                variant="danger"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="p-4">
            <h3 className="font-medium text-lg mb-3">Performance Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="flex items-center font-medium mb-3">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Analysis
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Average time per question:</span>
                    <span className="font-medium">{result.speedMetrics.averageTimePerQuestion} seconds</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total quiz duration:</span>
                    <span className="font-medium">{result.totalTime} minutes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="flex items-center font-medium mb-3">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Question Difficulty
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Easy questions:</span>
                    <span className="font-medium">
                      {result.difficultyBreakdown.easy.correct}/{result.difficultyBreakdown.easy.total} correct
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Medium questions:</span>
                    <span className="font-medium">
                      {result.difficultyBreakdown.medium.correct}/{result.difficultyBreakdown.medium.total} correct
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hard questions:</span>
                    <span className="font-medium">
                      {result.difficultyBreakdown.hard.correct}/{result.difficultyBreakdown.hard.total} correct
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-3">
              <Brain className="h-5 w-5 inline-block mr-2" />
              Recommendations
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <ul className="list-disc list-inside space-y-2">
                {result.improvementAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="p-4">
            <div className="mb-4">
              <FileText className="h-5 w-5 inline-block mr-2" />
              <span className="text-lg font-medium">Question Review</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Review all questions with their correct answers and your responses
              </p>
            </div>
            
            <div className="space-y-4">
              {result.questionDetails.map((question, index) => {
                const userAnswer = result.answers.find(a => a.questionId === question.id)?.selectedAnswer;
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Badge className={`${getSubjectBadgeColor(question.subject)} mr-2`}>
                          {question.subject}
                        </Badge>
                        {question.difficulty && (
                          <Badge variant={question.difficulty === 'easy' ? 'outline' : 
                                  question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                            {question.difficulty}
                          </Badge>
                        )}
                      </div>
                      <Badge variant={isCorrect ? "success" : "destructive"}>
                        {isCorrect ? (
                          <><Check className="h-3 w-3 mr-1" /> Correct</>
                        ) : (
                          <><X className="h-3 w-3 mr-1" /> Incorrect</>
                        )}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium mb-2">{question.text}</h4>
                    
                    <div className="mb-2 space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`p-2 rounded text-sm ${
                            optIndex === question.correctAnswer
                              ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700'
                              : optIndex === userAnswer && optIndex !== question.correctAnswer
                                ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700'
                                : 'bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                          }`}
                        >
                          {optIndex === question.correctAnswer && (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400 inline-block mr-1" />
                          )}
                          {optIndex === userAnswer && optIndex !== question.correctAnswer && (
                            <X className="h-4 w-4 text-red-600 dark:text-red-400 inline-block mr-1" />
                          )}
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    {!isCorrect && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-sm rounded-md border border-blue-200 dark:border-blue-800">
                        <h5 className="font-medium mb-1">Explanation:</h5>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onReturn}>
            Return to Home
          </Button>
          <Button onClick={onRetry}>
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubjectScore({ subject, score, total }: { subject: string, score: number, total: number }) {
  if (total === 0) return null;
  
  const percentage = Math.round((score / total) * 100);
  let color = "text-red-500";
  
  if (percentage >= 80) color = "text-green-500";
  else if (percentage >= 60) color = "text-amber-500";
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 className="font-medium mb-2">{subject}</h4>
      <div className="flex justify-between items-center">
        <div>{score}/{total} correct</div>
        <div className={`font-bold text-lg ${color}`}>{percentage}%</div>
      </div>
    </div>
  );
}

function DifficultyScore({ 
  level, 
  correct, 
  total, 
  variant 
}: { 
  level: string, 
  correct: number, 
  total: number, 
  variant: 'success' | 'warning' | 'danger' 
}) {
  if (total === 0) return null;
  
  const percentage = Math.round((correct / total) * 100);
  let bgColor = "bg-gray-50 dark:bg-gray-800";
  let textColor = "text-gray-800 dark:text-gray-200";
  
  if (variant === 'success') {
    bgColor = "bg-green-50 dark:bg-green-900/20";
    textColor = "text-green-800 dark:text-green-300";
  } else if (variant === 'warning') {
    bgColor = "bg-amber-50 dark:bg-amber-900/20";
    textColor = "text-amber-800 dark:text-amber-300";
  } else if (variant === 'danger') {
    bgColor = "bg-red-50 dark:bg-red-900/20";
    textColor = "text-red-800 dark:text-red-300";
  }
  
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <h4 className="font-medium mb-2">{level} Questions</h4>
      <div className="flex justify-between items-center">
        <div>{correct}/{total} correct</div>
        <div className={`font-bold text-lg ${textColor}`}>{percentage}%</div>
      </div>
    </div>
  );
}
