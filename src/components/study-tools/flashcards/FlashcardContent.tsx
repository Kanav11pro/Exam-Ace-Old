
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FlashCard } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import './FlashcardContent.css';

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
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to handle animation errors
  const handleAnimationError = () => {
    console.error("Flashcard animation failed, using fallback mode");
    setIsFallbackMode(true);
  };

  // Handle click with debounce to prevent multiple flips
  const handleCardClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    toggleAnswer();
    setTimeout(() => setIsAnimating(false), 500); // Animation duration + buffer
  };

  // Fallback mode - simple toggle without animations
  if (isFallbackMode) {
    return (
      <div className="relative h-80 mb-4">
        <div 
          className="w-full h-full cursor-pointer" 
          onClick={toggleAnswer}
          role="button"
          aria-label="Flip card"
        >
          {!showAnswer ? (
            <Card className="w-full h-full flex flex-col justify-center p-6 shadow-lg border-2 border-indigo-100 dark:border-indigo-900">
              <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-md">
                {currentIndex + 1} / {totalCards}
              </div>
              <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-md">
                {card.subject}
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-lg font-medium mb-6 text-indigo-600 dark:text-indigo-400">Question:</h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
                  <p className="text-lg">{card.question}</p>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Click to see the answer
                </p>
              </div>
            </Card>
          ) : (
            <Card className="w-full h-full flex flex-col justify-center p-6 shadow-lg border-2 border-green-100 dark:border-green-900">
              <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-green-50 dark:bg-green-900/40 rounded-md">
                {currentIndex + 1} / {totalCards}
              </div>
              <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-green-50 dark:bg-green-900/40 rounded-md">
                {card.subject}
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-lg font-medium mb-6 text-green-600 dark:text-green-400">Answer:</h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
                  <p className="text-lg">{card.answer}</p>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Click to see the question
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Enhanced animated card with proper error handling
  return (
    <div className="relative h-80 mb-4 perspective-1000">
      <div 
        className="w-full h-full cursor-pointer card-container" 
        onClick={handleCardClick}
        role="button"
        aria-label="Flip card"
      >
        <AnimatePresence initial={false} mode="wait">
          {!showAnswer ? (
            <motion.div
              key="front"
              className="absolute inset-0"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onAnimationComplete={() => {
                if (!showAnswer && isAnimating) setIsAnimating(false);
              }}
              onError={() => handleAnimationError()}
            >
              {/* Question Side */}
              <Card className="w-full h-full flex flex-col justify-center p-6 shadow-lg border-2 border-indigo-100 dark:border-indigo-900 will-change-transform">
                <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-md">
                  {currentIndex + 1} / {totalCards}
                </div>
                <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-md">
                  {card.subject}
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-lg font-medium mb-6 text-indigo-600 dark:text-indigo-400">Question:</h3>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
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
            </motion.div>
          ) : (
            <motion.div
              key="back"
              className="absolute inset-0"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onAnimationComplete={() => {
                if (showAnswer && isAnimating) setIsAnimating(false);
              }}
              onError={() => handleAnimationError()}
            >
              {/* Answer Side */}
              <Card className="w-full h-full flex flex-col justify-center p-6 shadow-lg border-2 border-green-100 dark:border-green-900 will-change-transform">
                <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-green-50 dark:bg-green-900/40 rounded-md">
                  {currentIndex + 1} / {totalCards}
                </div>
                <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-green-50 dark:bg-green-900/40 rounded-md">
                  {card.subject}
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-lg font-medium mb-6 text-green-600 dark:text-green-400">Answer:</h3>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
