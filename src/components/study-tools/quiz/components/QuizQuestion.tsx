
import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Flag, Check, X, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Question } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  isAnswered: boolean;
  showExplanation: boolean;
  isPaused: boolean;
  markedForReview: number[];
  currentQuestionIndex: number;
  submitAnswer: () => void;
  toggleMarkedForReview: (index: number) => void;
  setSelectedAnswer: (value: number) => void;
  setShowExplanation: (value: boolean) => void;
  nextQuestion: () => void;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  isAnswered,
  showExplanation,
  isPaused,
  markedForReview,
  currentQuestionIndex,
  submitAnswer,
  toggleMarkedForReview,
  setSelectedAnswer,
  setShowExplanation,
  nextQuestion
}: QuizQuestionProps) {
  // Reset selected answer when question changes (this fixes the persistence issue)
  useEffect(() => {
    if (!isAnswered) {
      setSelectedAnswer(-1); // Reset to invalid value first
      setTimeout(() => setSelectedAnswer(-1), 0); // Then clear it
    }
  }, [currentQuestionIndex, setSelectedAnswer, isAnswered]);

  const isMarkedForReview = markedForReview.includes(currentQuestionIndex);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Question {currentQuestionIndex + 1}
                </h2>
                {isMarkedForReview && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full text-xs"
                  >
                    <Flag className="h-3 w-3" />
                    Flagged
                  </motion.div>
                )}
                {isPaused && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-xs"
                  >
                    <Clock className="h-3 w-3" />
                    Paused
                  </motion.div>
                )}
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {question.text}
              </p>
            </div>
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            <RadioGroup
              value={selectedAnswer !== null && selectedAnswer >= 0 ? selectedAnswer.toString() : undefined}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              className="space-y-3"
              disabled={isAnswered || isPaused}
            >
              {question.options.map((option, index) => {
                const isCorrect = isAnswered && index === question.correctAnswer;
                const isIncorrect = isAnswered && index === selectedAnswer && index !== question.correctAnswer;
                const isSelected = selectedAnswer === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 border-2 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                      isCorrect
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                        : isIncorrect
                          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                          : isSelected && !isAnswered
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`} 
                      className="mr-2"
                      disabled={isAnswered || isPaused}
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className={`flex-1 cursor-pointer text-base ${isPaused ? 'cursor-not-allowed' : ''}`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Label>
                    
                    {/* Result indicators */}
                    <AnimatePresence>
                      {isCorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-green-500 rounded-full p-1"
                        >
                          <Check className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                      {isIncorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-red-500 rounded-full p-1"
                        >
                          <X className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </RadioGroup>
          </div>
          
          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Explanation:
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 bg-gray-50/50 dark:bg-gray-800/50">
          {!isAnswered ? (
            <div className="w-full flex justify-between">
              <Button
                variant="outline"
                onClick={() => toggleMarkedForReview(currentQuestionIndex)}
                disabled={isPaused}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                {isMarkedForReview ? (
                  <>
                    Remove Flag 
                    <Flag className="h-4 w-4 text-amber-500 fill-current" />
                  </>
                ) : (
                  <>
                    Flag for Review 
                    <Flag className="h-4 w-4" />
                  </>
                )}
              </Button>
                
              <Button
                onClick={submitAnswer}
                disabled={selectedAnswer === null || selectedAnswer < 0 || isPaused}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Submit Answer
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-between gap-2">
              {!showExplanation && (
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(true)}
                  className="hover:scale-105 transition-transform"
                >
                  Show Explanation
                </Button>
              )}
              
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => toggleMarkedForReview(currentQuestionIndex)}
                  disabled={isPaused}
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  {isMarkedForReview ? (
                    <>
                      Remove Flag 
                      <Flag className="h-4 w-4 text-amber-500 fill-current" />
                    </>
                  ) : (
                    <>
                      Flag for Review 
                      <Flag className="h-4 w-4" />
                    </>
                  )}
                </Button>
                  
                <Button
                  onClick={nextQuestion}
                  disabled={isPaused}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  Next Question 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
