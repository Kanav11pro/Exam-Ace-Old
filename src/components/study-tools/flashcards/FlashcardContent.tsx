
import React from 'react';
import { Card } from '@/components/ui/card';
import { FlashCard } from './types';

interface FlashcardContentProps {
  card: FlashCard;
  showAnswer: boolean;
  currentIndex: number;
  totalCards: number;
  toggleAnswer: () => void;
}

export function FlashcardContent({
  card,
  showAnswer,
  currentIndex,
  totalCards,
  toggleAnswer
}: FlashcardContentProps) {
  return (
    <div className="relative h-80 mb-4 perspective-1000">
      <Card 
        className={`absolute inset-0 flex flex-col justify-center p-6 cursor-pointer transition-all duration-500 transform-style-3d ${
          showAnswer ? 'rotate-y-180' : ''
        }`}
        onClick={toggleAnswer}
      >
        <div className={`absolute inset-0 p-6 backface-hidden ${showAnswer ? 'rotate-y-180 pointer-events-none' : ''}`}>
          <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {currentIndex + 1} / {totalCards}
          </div>
          <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {card.subject}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium mb-6">Question:</h3>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
              <p className="text-lg">{card.question}</p>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Click to see the answer
            </p>
          </div>
        </div>
        
        <div className={`absolute inset-0 p-6 backface-hidden rotate-y-180 ${!showAnswer ? 'pointer-events-none' : ''}`}>
          <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {currentIndex + 1} / {totalCards}
          </div>
          <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {card.subject}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium mb-6">Answer:</h3>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
              <p className="text-lg">{card.answer}</p>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Click to see the question
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
