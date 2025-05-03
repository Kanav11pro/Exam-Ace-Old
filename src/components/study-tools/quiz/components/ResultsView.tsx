
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trophy, Clock, ThumbsUp, Check, X, Star, AlertCircle, RefreshCw, AlertTriangle, FileQuestion, Flag, Timer } from 'lucide-react';
import { StudyTip } from '@/components/study-tools/flashcards/components/StudyTip';
import { Question } from '../types';
import { getStreakMessage, formatTime, getSubjectBadgeColor } from '../utils/helpers';

interface DifficultyBreakdown {
  easy: { total: number; correct: number };
  medium: { total: number; correct: number };
  hard: { total: number; correct: number };
}

interface SpeedMetrics {
  averageTimePerQuestion: number;
  fastestQuestion: number;
  slowestQuestion: number;
}

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
  questionDetails?: Question[];
  difficultyBreakdown?: DifficultyBreakdown;
  speedMetrics?: SpeedMetrics;
  improvementAreas?: string[];
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

  const questionsCount = result.questionDetails?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Quiz Results
          </DialogTitle>
          <DialogDescription>
            Here's how you did on the quiz!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-2 max-h-[70vh] overflow-y-auto pr-1">
          {/* Score summary */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-gray-800 flex items-center justify-center relative">
              <div className="text-3xl font-bold">
                {result.score.total}/{questionsCount}
              </div>
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200 dark:text-gray-700" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="42" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className="text-primary" 
                  strokeWidth="8" 
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * result.score.total) / questionsCount} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="42" 
                  cx="50" 
                  cy="50" 
                />
              </svg>
            </div>
            
            <div className="flex-1 space-y-4">
              <p className="text-center md:text-left font-medium text-lg">
                {getStreakMessage(result.score.total, questionsCount)}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time taken</div>
                  <div className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    {formatTime(result.totalTime * 60)}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</div>
                  <div className="font-medium flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                    {Math.round((result.score.total / questionsCount) * 100)}%
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</div>
                  <div className="font-medium">
                    {result.testTitle}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attempted</div>
                  <div className="font-medium">
                    {result.answers.filter(a => a.selectedAnswer !== null).length}/{questionsCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Advanced report tabs */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Score by Difficulty</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/10">Easy</Badge>
                          <div className="text-sm">{
                            result.difficultyBreakdown?.easy.correct
                          }/{
                            result.difficultyBreakdown?.easy.total
                          }</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">Medium</Badge>
                          <div className="text-sm">{
                            result.difficultyBreakdown?.medium.correct
                          }/{
                            result.difficultyBreakdown?.medium.total
                          }</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="destructive">Hard</Badge>
                          <div className="text-sm">{
                            result.difficultyBreakdown?.hard.correct
                          }/{
                            result.difficultyBreakdown?.hard.total
                          }</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Avg. time per question</div>
                          <div className="text-sm font-medium">
                            {formatTime(result.speedMetrics?.averageTimePerQuestion || 0)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Unattempted questions</div>
                          <div className="text-sm font-medium">
                            {questionsCount - result.answers.filter(a => a.selectedAnswer !== null).length}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Performance rating</div>
                          <div className="text-sm font-medium flex items-center">
                            {result.score.total / questionsCount >= 0.8 ? (
                              <>Excellent <Star className="h-4 w-4 text-yellow-500 ml-1" /></>
                            ) : result.score.total / questionsCount >= 0.6 ? (
                              <>Good <ThumbsUp className="h-4 w-4 text-blue-500 ml-1" /></>
                            ) : result.score.total / questionsCount >= 0.4 ? (
                              <>Average <Check className="h-4 w-4 text-green-500 ml-1" /></>
                            ) : (
                              <>Needs improvement <AlertCircle className="h-4 w-4 text-red-500 ml-1" /></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">[Time analysis graph would be displayed here]</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-between items-center">
                  <h3 className="font-medium">Question Analysis</h3>
                  <div className="text-sm text-gray-500">Total: {questionsCount}</div>
                </div>
                
                <div className="divide-y">
                  {result.questionDetails?.map((question, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Badge className={getSubjectBadgeColor(question.subject)} className="mr-2">
                            {question.subject}
                          </Badge>
                          {question.difficulty && (
                            <Badge variant={question.difficulty === 'easy' ? 'outline' : 
                                    question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                              {question.difficulty}
                            </Badge>
                          )}
                        </div>
                        
                        {result.answers[index].selectedAnswer === question.correctAnswer ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Correct <Check className="ml-1 h-3 w-3" />
                          </Badge>
                        ) : result.answers[index].selectedAnswer !== null ? (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            Wrong <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Not Attempted
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-2">{index + 1}. {question.text}</p>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.answers[index].selectedAnswer !== null ? (
                          <>Your answer: {question.options[result.answers[index].selectedAnswer || 0]}</>
                        ) : (
                          <>You did not answer this question</>
                        )}
                      </div>
                      
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Correct answer: {question.options[question.correctAnswer]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="subjects" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Math performance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                        Math
                      </Badge>
                      <div className="text-base">
                        {Math.round(
                          (result.score.maths / 
                          Math.max(1, result.questionDetails?.filter(q => q.subject === 'Maths').length || 1)) * 100
                        )}%
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Questions</span>
                        <span>{result.questionDetails?.filter(q => q.subject === 'Maths').length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct Answers</span>
                        <span>{result.score.maths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wrong Answers</span>
                        <span>{(result.questionDetails?.filter(q => q.subject === 'Maths').length || 0) - result.score.maths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unattempted</span>
                        <span>{result.questionDetails?.filter((q, i) => q.subject === 'Maths' && 
                          result.answers[i].selectedAnswer === null).length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Physics performance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                        Physics
                      </Badge>
                      <div className="text-base">
                        {Math.round(
                          (result.score.physics / 
                          Math.max(1, result.questionDetails?.filter(q => q.subject === 'Physics').length || 1)) * 100
                        )}%
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Questions</span>
                        <span>{result.questionDetails?.filter(q => q.subject === 'Physics').length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct Answers</span>
                        <span>{result.score.physics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wrong Answers</span>
                        <span>{(result.questionDetails?.filter(q => q.subject === 'Physics').length || 0) - result.score.physics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unattempted</span>
                        <span>{result.questionDetails?.filter((q, i) => q.subject === 'Physics' && 
                          result.answers[i].selectedAnswer === null).length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Chemistry performance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-2">
                        Chemistry
                      </Badge>
                      <div className="text-base">
                        {Math.round(
                          (result.score.chemistry / 
                          Math.max(1, result.questionDetails?.filter(q => q.subject === 'Chemistry').length || 1)) * 100
                        )}%
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Questions</span>
                        <span>{result.questionDetails?.filter(q => q.subject === 'Chemistry').length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct Answers</span>
                        <span>{result.score.chemistry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wrong Answers</span>
                        <span>{(result.questionDetails?.filter(q => q.subject === 'Chemistry').length || 0) - result.score.chemistry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unattempted</span>
                        <span>{result.questionDetails?.filter((q, i) => q.subject === 'Chemistry' && 
                          result.answers[i].selectedAnswer === null).length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="improvements" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Improvement Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {(result.improvementAreas || []).map((area, index) => (
                      <div key={`improvement-${index}`} className="flex items-start gap-2">
                        {area.toLowerCase().includes('focus') ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        ) : area.toLowerCase().includes('time') ? (
                          <Timer className="h-5 w-5 text-amber-500 mt-0.5" />
                        ) : area.toLowerCase().includes('attempt') ? (
                          <FileQuestion className="h-5 w-5 text-amber-500 mt-0.5" />
                        ) : (
                          <Flag className="h-5 w-5 text-amber-500 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">{area.split(':')[0] || "Improvement Area"}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {area}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {(!result.improvementAreas || result.improvementAreas.length === 0) && (
                      <div className="flex items-start gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Great Performance!</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            You're doing well! Continue practicing regularly to maintain and improve your performance.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* General advice */}
                  <StudyTip 
                    title="Continued Improvement" 
                    tip="Regular practice is key to success in competitive exams. Try to take at least 1-2 practice tests every week and analyze your mistakes carefully."
                    variant="success"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onReturn}>
            Return to Home
          </Button>
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
