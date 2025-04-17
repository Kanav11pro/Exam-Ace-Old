
import React from 'react';
import { Card } from '@/components/ui/card';
import { FlashCard } from './types';
import { motion } from 'framer-motion';

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
    <div className="relative h-80 mb-4">
      <div className="perspective-1000 w-full h-full">
        <motion.div 
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateY: showAnswer ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Question Side */}
          <Card 
            className={`absolute inset-0 flex flex-col justify-center p-6 cursor-pointer`}
            onClick={toggleAnswer}
            style={{ backfaceVisibility: 'hidden' }}
          >
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
              <motion.p 
                className="mt-4 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Click to see the answer
              </motion.p>
            </div>
          </Card>
          
          {/* Answer Side */}
          <Card 
            className={`absolute inset-0 flex flex-col justify-center p-6 cursor-pointer`}
            onClick={toggleAnswer}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
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
              <motion.p 
                className="mt-4 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Click to see the question
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
