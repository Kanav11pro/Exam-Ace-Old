import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { isSameDay, parseISO, addDays } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Import refactored components
import { allQuestions } from './quiz/data/questions';
import { QuestionNavigator } from './quiz/components/QuestionNavigator';
import { QuizQuestion } from './quiz/components/QuizQuestion';
import { QuizHeader } from './quiz/components/QuizHeader';
import { QuizStartScreen } from './quiz/components/QuizStartScreen';
import { ResultsView } from './quiz/components/ResultsView';
import { ExitDialog, PauseDialog } from './quiz/components/QuizDialogs';
import { StudyTip } from './flashcards/components/StudyTip';

// Import types and utils
import { Question, QuizAttempt, QuestionStatus, QuestionStatusType } from './quiz/types';
import { shuffleArray, formatTime } from './quiz/utils/helpers';

export function DailyQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizSubject, setQuizSubject] = useState<string>('all');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [quizEndTime, setQuizEndTime] = useState<Date | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canTakeDailyQuiz, setCanTakeDailyQuiz] = useState(true);
  const [todayAttempt, setTodayAttempt] = useState<QuizAttempt | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [lastQuestionTime, setLastQuestionTime] = useState<Date | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  
  // Enhanced features
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [strictMode, setStrictMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseTime, setPauseTime] = useState<number>(0);
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>([]);
  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);
  const [showPauseDialog, setShowPauseDialog] = useState<boolean>(false);
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  
  const quizContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Handle full screen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter full screen
      if (quizContainerRef.current?.requestFullscreen) {
        quizContainerRef.current.requestFullscreen().then(() => {
          setIsFullScreen(true);
        }).catch(err => {
          toast({
            title: "Fullscreen Error",
            description: `Error attempting to enable full-screen mode: ${err.message}`,
            variant: "destructive"
          });
        });
      }
    } else {
      // Exit full screen
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        }).catch(err => {
          console.error(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      
      // If strict mode is on and user exits fullscreen, show warning
      if (strictMode && !document.fullscreenElement && isTestActive) {
        handleStrictModeViolation("Full screen mode was exited");
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [strictMode, isTestActive]);

  // Strict mode violation handler
  const handleStrictModeViolation = (reason: string) => {
    toast({
      title: "Warning: Test Integrity",
      description: `${reason}. This incident has been recorded.`,
      variant: "destructive"
    });
    
    // Record violation
    console.log(`Strict mode violation: ${reason} at ${new Date().toISOString()}`);
  };

  // Visibility change handler for strict mode
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (strictMode && isTestActive && document.visibilityState === 'hidden') {
        handleStrictModeViolation("Test window was minimized or changed");
        if (!isPaused) {
          setIsPaused(true);
          setPauseTime(new Date().getTime());
          setShowPauseDialog(true);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [strictMode, isTestActive, isPaused]);
  
  // Initialize question statuses when quiz starts
  useEffect(() => {
    if (quizStarted && quizQuestions.length > 0) {
      setQuestionStatuses(
        quizQuestions.map((_, index) => ({
          index,
          status: index === 0 ? 'not-answered' : 'not-visited'
        }))
      );
      setMarkedForReview([]);
    }
  }, [quizStarted, quizQuestions]);
  
  // Save current quiz state for resuming later
  const saveQuizState = () => {
    if (!quizStarted || !canTakeDailyQuiz) return;
    
    const currentState: QuizAttempt = {
      date: new Date().toISOString(),
      subject: quizSubject,
      score: 0, // Will be calculated on completion
      totalQuestions: quizQuestions.length,
      timeSpent: Math.floor((new Date().getTime() - (quizStartTime?.getTime() || 0)) / 1000) - pauseTime,
      isCompleted: false,
      lastQuestionIndex: currentQuestionIndex,
      answers: userAnswers,
      questionStatuses: questionStatuses
    };
    
    // Save to localStorage
    localStorage.setItem('jeeDailyQuizIncomplete', JSON.stringify(currentState));
    
    toast({
      title: "Quiz Progress Saved",
      description: "You can resume this quiz later from where you left off."
    });
  };
  
  // Check for incomplete quiz on load
  useEffect(() => {
    const savedIncompleteQuiz = localStorage.getItem('jeeDailyQuizIncomplete');
    if (savedIncompleteQuiz) {
      try {
        const incompleteQuiz: QuizAttempt = JSON.parse(savedIncompleteQuiz);
        const quizDate = parseISO(incompleteQuiz.date);
        
        // Only allow resume if quiz was started today
        if (isSameDay(quizDate, new Date())) {
          toast({
            title: "Incomplete Quiz Found",
            description: "You have an unfinished quiz. Would you like to resume?",
            action: (
              <Button onClick={() => resumeQuiz(incompleteQuiz)} variant="outline">
                Resume
              </Button>
            )
          });
        } else {
          // Clear old incomplete quiz
          localStorage.removeItem('jeeDailyQuizIncomplete');
        }
      } catch (e) {
        console.error('Error loading incomplete quiz:', e);
        localStorage.removeItem('jeeDailyQuizIncomplete');
      }
    }
  }, []);
  
  // Resume quiz from saved state
  const resumeQuiz = (savedQuiz: QuizAttempt) => {
    setQuizSubject(savedQuiz.subject);
    generateQuiz();
    
    setCurrentQuestionIndex(savedQuiz.lastQuestionIndex || 0);
    setUserAnswers(savedQuiz.answers || Array(quizQuestions.length).fill(null));
    setQuestionStatuses(savedQuiz.questionStatuses || []);
    
    setQuizStarted(true);
    setQuizStartTime(parseISO(savedQuiz.date));
    setPauseTime(savedQuiz.timeSpent);
    
    // Remove saved incomplete quiz
    localStorage.removeItem('jeeDailyQuizIncomplete');
    
    toast({
      title: "Quiz Resumed",
      description: "You can now continue your quiz from where you left off."
    });
  };
  
  // Handle test pausing
  const togglePauseTest = (shouldPause: boolean) => {
    setIsPaused(shouldPause);
    
    if (shouldPause) {
      // Store the current time when paused
      setPauseTime(prevTime => prevTime + (new Date().getTime() - (lastQuestionTime?.getTime() || new Date().getTime())));
      setShowPauseDialog(true);
    } else {
      // Update the last question time to now
      setLastQuestionTime(new Date());
      setShowPauseDialog(false);
    }
  };
  
  // Update question status when an answer is selected
  const updateQuestionStatus = (index: number, newStatus: QuestionStatusType) => {
    setQuestionStatuses(prevStatuses => 
      prevStatuses.map(status => 
        status.index === index ? { ...status, status: newStatus } : status
      )
    );
  };
  
  // Toggle marked for review
  const toggleMarkedForReview = (index: number) => {
    if (markedForReview.includes(index)) {
      setMarkedForReview(prev => prev.filter(i => i !== index));
      
      // Update status to either answered or not-answered
      const isAnswered = userAnswers[index] !== null;
      updateQuestionStatus(index, isAnswered ? 'answered' : 'not-answered');
    } else {
      setMarkedForReview(prev => [...prev, index]);
      
      // Update status to either answered-marked or marked-review
      const isAnswered = userAnswers[index] !== null;
      updateQuestionStatus(index, isAnswered ? 'answered-marked' : 'marked-review');
    }
  };
  
  // Load previous attempts from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('jeeDailyQuizAttempts');
    if (savedAttempts) {
      try {
        const attempts: QuizAttempt[] = JSON.parse(savedAttempts);
        setPreviousAttempts(attempts);
        
        // Check if there's an attempt for today
        const today = new Date().toISOString().split('T')[0];
        const todaysAttempt = attempts.find(attempt => {
          const attemptDate = parseISO(attempt.date).toISOString().split('T')[0];
          return attemptDate === today;
        });
        
        if (todaysAttempt) {
          setTodayAttempt(todaysAttempt);
          setCanTakeDailyQuiz(false);
        }
      } catch (e) {
        console.error('Error loading quiz attempts:', e);
      }
    }
  }, []);
  
  // Generate daily quiz questions
  const generateQuiz = () => {
    let availableQuestions = [...allQuestions];
    
    if (quizSubject !== 'all') {
      availableQuestions = availableQuestions.filter(q => q.subject === quizSubject);
    }
    
    // Shuffle questions
    availableQuestions = shuffleArray(availableQuestions);
    
    // Take 10 questions for the quiz
    const selectedQuestions = availableQuestions.slice(0, 10);
    setQuizQuestions(selectedQuestions);
    setUserAnswers(Array(selectedQuestions.length).fill(null));
  };
  
  // Start the quiz
  const startQuiz = () => {
    generateQuiz();
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setQuizStartTime(new Date());
    setQuizEndTime(null);
    setIsTestActive(true);
    setLastQuestionTime(new Date());
  };
  
  // Submit answer for current question
  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Update user answers
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);
    
    // Update question status to 'answered' or 'answered-marked'
    const isMarked = markedForReview.includes(currentQuestionIndex);
    updateQuestionStatus(currentQuestionIndex, isMarked ? 'answered-marked' : 'answered');
  };
  
  // Jump to a specific question
  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < quizQuestions.length) {
      setCurrentQuestionIndex(index);
      
      // Get the saved answer for this question, or reset to null
      const savedAnswer = userAnswers[index];
      setSelectedAnswer(savedAnswer !== undefined ? savedAnswer : null);
      setIsAnswered(savedAnswer !== null);
      setShowExplanation(false);
      
      // Update status if not visited before
      if (questionStatuses[index]?.status === 'not-visited') {
        updateQuestionStatus(index, 'not-answered');
      }
    }
  };
  
  // Next question handler
  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Get the saved answer for the next question, or reset to null
      const savedAnswer = userAnswers[nextIndex];
      setSelectedAnswer(savedAnswer !== undefined ? savedAnswer : null);
      setIsAnswered(savedAnswer !== null);
      setShowExplanation(false);
      
      // Update status of the next question if it was not visited before
      if (questionStatuses[nextIndex]?.status === 'not-visited') {
        updateQuestionStatus(nextIndex, 'not-answered');
      }
    } else {
      // Quiz completed
      const endTime = new Date();
      setQuizEndTime(endTime);
      setQuizComplete(true);
      setIsTestActive(false);
      
      // Save attempt
      if (quizStartTime) {
        const timeSpent = Math.floor((endTime.getTime() - quizStartTime.getTime()) / 1000);
        const newAttempt: QuizAttempt = {
          date: new Date().toISOString(),
          subject: quizSubject,
          score,
          totalQuestions: quizQuestions.length,
          timeSpent,
          isCompleted: true
        };
        
        const updatedAttempts = [...previousAttempts, newAttempt];
        setPreviousAttempts(updatedAttempts);
        localStorage.setItem('jeeDailyQuizAttempts', JSON.stringify(updatedAttempts));
        
        // If this was the daily quiz, set today's attempt
        if (canTakeDailyQuiz) {
          setTodayAttempt(newAttempt);
          setCanTakeDailyQuiz(false);
        }
      }
      
      setShowResultDialog(true);
      
      // Clear incomplete quiz
      localStorage.removeItem('jeeDailyQuizIncomplete');
    }
  };
  
  // Go to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      jumpToQuestion(currentQuestionIndex - 1);
    }
  };
  
  // Go to next question without submitting
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      jumpToQuestion(currentQuestionIndex + 1);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    return (userAnswers.filter(a => a !== null).length / quizQuestions.length) * 100;
  };
  
  // Handle exit request
  const handleExitRequest = () => {
    if (isTestActive && !quizComplete) {
      setShowExitDialog(true);
    } else {
      returnToHome();
    }
  };
  
  // Return to home screen
  const returnToHome = () => {
    setQuizStarted(false);
    setShowResultDialog(false);
    setIsTestActive(false);
  };
  
  // Get time spent on quiz
  const getTimeSpent = () => {
    if (!quizStartTime) return 0;
    if (!quizEndTime) return Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000);
    return Math.floor((quizEndTime.getTime() - quizStartTime.getTime()) / 1000);
  };
  
  // Generate test result data
  const getTestResult = () => {
    if (!quizQuestions.length) return null;
    
    // Calculate scores by subject
    let mathsScore = 0;
    let physicsScore = 0;
    let chemistryScore = 0;
    
    // Calculate difficulty breakdown
    const difficultyBreakdown = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    };
    
    // Analyze each question
    quizQuestions.forEach((question, index) => {
      // Count by difficulty
      if (question.difficulty === 'easy') difficultyBreakdown.easy.total++;
      if (question.difficulty === 'medium') difficultyBreakdown.medium.total++;
      if (question.difficulty === 'hard') difficultyBreakdown.hard.total++;
      
      // Count correct answers
      if (userAnswers[index] === question.correctAnswer) {
        if (question.subject === 'Maths') mathsScore++;
        if (question.subject === 'Physics') physicsScore++;
        if (question.subject === 'Chemistry') chemistryScore++;
        
        if (question.difficulty === 'easy') difficultyBreakdown.easy.correct++;
        if (question.difficulty === 'medium') difficultyBreakdown.medium.correct++;
        if (question.difficulty === 'hard') difficultyBreakdown.hard.correct++;
      }
    });
    
    // Identify improvement areas
    const improvementAreas: string[] = [];
    
    // Subject-based improvement areas
    const mathsQuestions = quizQuestions.filter(q => q.subject === 'Maths').length;
    const physicsQuestions = quizQuestions.filter(q => q.subject === 'Physics').length;
    const chemistryQuestions = quizQuestions.filter(q => q.subject === 'Chemistry').length;
    
    const mathsPerformance = mathsQuestions > 0 ? mathsScore / mathsQuestions : 1;
    const physicsPerformance = physicsQuestions > 0 ? physicsScore / physicsQuestions : 1;
    const chemistryPerformance = chemistryQuestions > 0 ? chemistryScore / chemistryQuestions : 1;
    
    const subjectsToImprove: string[] = [];
    if (mathsPerformance < 0.6 && mathsQuestions > 0) {
      subjectsToImprove.push('Mathematics');
    }
    if (physicsPerformance < 0.6 && physicsQuestions > 0) {
      subjectsToImprove.push('Physics');
    }
    if (chemistryPerformance < 0.6 && chemistryQuestions > 0) {
      subjectsToImprove.push('Chemistry');
    }
    
    if (subjectsToImprove.length > 0) {
      improvementAreas.push(`Focus on strengthening core concepts in ${subjectsToImprove.join(', ')}`);
    }
    
    return {
      testTitle: quizSubject === 'all' ? 'All Subjects' : quizSubject,
      score: {
        maths: mathsScore,
        physics: physicsScore,
        chemistry: chemistryScore,
        total: score
      },
      totalTime: Math.ceil(getTimeSpent() / 60),
      answers: quizQuestions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: userAnswers[index]
      })),
      questionDetails: quizQuestions,
      difficultyBreakdown,
      speedMetrics: {
        averageTimePerQuestion: Math.round(getTimeSpent() / quizQuestions.length),
        fastestQuestion: 0,
        slowestQuestion: 0
      },
      improvementAreas: improvementAreas.length > 0 ? improvementAreas : ['Keep up the good work and continue practicing regularly']
    };
  };
  
  // Handle trying the quiz again
  const handleTryAgain = () => {
    setShowResultDialog(false);
    startQuiz();
  };
  
  return (
    <div ref={quizContainerRef} className={`relative ${isFullScreen ? 'bg-white dark:bg-gray-950 min-h-screen' : ''}`}>
      <div className="container max-w-4xl py-6">
        {!quizStarted ? (
          <QuizStartScreen 
            canTakeDailyQuiz={canTakeDailyQuiz}
            todayAttempt={todayAttempt}
            previousAttempts={previousAttempts}
            quizSubject={quizSubject}
            setQuizSubject={setQuizSubject}
            startQuiz={startQuiz}
            strictMode={strictMode}
            setStrictMode={setStrictMode}
            isFullScreen={isFullScreen}
            setIsFullScreen={setIsFullScreen}
          />
        ) : (
          <div>
            {!quizComplete ? (
              <div className="space-y-6">
                {/* Header with controls */}
                <QuizHeader 
                  subject={quizQuestions[currentQuestionIndex]?.subject || ''}
                  difficulty={quizQuestions[currentQuestionIndex]?.difficulty}
                  isPaused={isPaused}
                  isFullScreen={isFullScreen}
                  timeSpent={getTimeSpent()}
                  pauseTime={pauseTime}
                  togglePauseTest={togglePauseTest}
                  toggleFullScreen={toggleFullScreen}
                  handleExitRequest={handleExitRequest}
                  quizComplete={quizComplete}
                />
                
                {/* Progress and navigation */}
                <div className="flex justify-between items-center gap-4 mb-2">
                  <div className="text-sm">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </div>
                  
                  <Progress
                    value={calculateProgress()}
                    className="h-2 flex-1"
                  />
                  
                  <div className="text-sm font-medium">
                    {Math.round(calculateProgress())}% complete
                  </div>
                </div>
                
                {/* Question navigator */}
                <QuestionNavigator 
                  questionStatuses={questionStatuses}
                  currentQuestionIndex={currentQuestionIndex}
                  jumpToQuestion={jumpToQuestion}
                />
                
                {/* Test summary */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div>Total: {quizQuestions.length}</div>
                    <div>Answered: {userAnswers.filter(a => a !== null).length}</div>
                    <div>Marked: {markedForReview.length}</div>
                    <div>Remaining: {quizQuestions.length - userAnswers.filter(a => a !== null).length}</div>
                  </div>
                </div>
                
                {/* Question component */}
                {quizQuestions[currentQuestionIndex] && (
                  <QuizQuestion 
                    question={quizQuestions[currentQuestionIndex]}
                    selectedAnswer={selectedAnswer}
                    isAnswered={isAnswered}
                    showExplanation={showExplanation}
                    isPaused={isPaused}
                    markedForReview={markedForReview}
                    currentQuestionIndex={currentQuestionIndex}
                    submitAnswer={submitAnswer}
                    toggleMarkedForReview={toggleMarkedForReview}
                    setSelectedAnswer={setSelectedAnswer}
                    setShowExplanation={setShowExplanation}
                    nextQuestion={nextQuestion}
                  />
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0 || isPaused}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous Question
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === quizQuestions.length - 1 || isPaused}
                  >
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Study tip */}
                {!isPaused && (
                  <StudyTip 
                    title="Test Taking Tip" 
                    tip="If you're unsure about a question, flag it for review and come back to it later. Focus on answering questions you're confident about first."
                    variant="info"
                  />
                )}
                
                {/* Dialogs */}
                <PauseDialog 
                  open={showPauseDialog}
                  onOpenChange={setShowPauseDialog}
                  pauseTime={pauseTime}
                  questionsAnswered={userAnswers.filter(a => a !== null).length}
                  totalQuestions={quizQuestions.length}
                  isStrictMode={strictMode}
                  onExitTest={() => setShowExitDialog(true)}
                  onResumeTest={() => togglePauseTest(false)}
                />
                
                <ExitDialog 
                  open={showExitDialog}
                  onOpenChange={setShowExitDialog}
                  onSaveAndExit={() => {
                    saveQuizState();
                    setShowExitDialog(false);
                    returnToHome();
                  }}
                  onAbandonTest={() => {
                    setShowExitDialog(false);
                    returnToHome();
                  }}
                />
              </div>
            ) : null}
            
            {/* Results view */}
            <ResultsView 
              isOpen={showResultDialog}
              onClose={() => setShowResultDialog(false)}
              result={getTestResult()}
              onRetry={handleTryAgain}
              onReturn={returnToHome}
              detailedReport={detailedReport}
              setDetailedReport={setDetailedReport}
            />
          </div>
        )}
      </div>
    </div>
  );
}
