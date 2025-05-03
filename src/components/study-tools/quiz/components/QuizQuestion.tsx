
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Flag, Check, X, ArrowRight } from 'lucide-react';
import { Question } from '../types';

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
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-6">
          {question.text}
        </h2>
        
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
          className="space-y-3"
          disabled={isAnswered || isPaused}
        >
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-2 border p-3 rounded-lg ${
                isAnswered && index === question.correctAnswer
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                  : isAnswered && index === selectedAnswer && index !== question.correctAnswer
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                    : ''
              }`}
            >
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`} 
                className="mr-2"
              />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
              {isAnswered && index === question.correctAnswer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {isAnswered && index === selectedAnswer && index !== question.correctAnswer && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {isAnswered && showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-medium mb-1">Explanation:</h4>
            <p className="text-sm">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {!isAnswered ? (
          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              onClick={() => toggleMarkedForReview(currentQuestionIndex)}
              disabled={isPaused}
            >
              {markedForReview.includes(currentQuestionIndex) ? (
                <>Remove Flag <Flag className="ml-2 h-4 w-4 text-amber-500" /></>
              ) : (
                <>Flag for Review <Flag className="ml-2 h-4 w-4" /></>
              )}
            </Button>
              
            <Button
              onClick={submitAnswer}
              disabled={selectedAnswer === null || isPaused}
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
              >
                Show Explanation
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={() => toggleMarkedForReview(currentQuestionIndex)}
                disabled={isPaused}
              >
                {markedForReview.includes(currentQuestionIndex) ? (
                  <>Remove Flag <Flag className="ml-2 h-4 w-4 text-amber-500" /></>
                ) : (
                  <>Flag for Review <Flag className="ml-2 h-4 w-4" /></>
                )}
              </Button>
                
              <Button
                onClick={nextQuestion}
                disabled={isPaused}
              >
                Next Question <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
