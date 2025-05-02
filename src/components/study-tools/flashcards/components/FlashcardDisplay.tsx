
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { FlashCard } from '../types';

interface FlashcardDisplayProps {
  card: FlashCard;
  currentIndex: number;
  totalCards: number;
  showAnswer: boolean;
  toggleAnswer: () => void;
  goToNextCard: () => void;
  goToPrevCard: () => void;
  startEditingCard: () => void;
  toggleBookmark: () => void;
  handleConfidenceClick: (level: 'low' | 'medium' | 'high') => void;
  confettiActive: boolean;
}

export function FlashcardDisplay({
  card,
  currentIndex,
  totalCards,
  showAnswer,
  toggleAnswer,
  goToNextCard,
  goToPrevCard,
  startEditingCard,
  toggleBookmark,
  handleConfidenceClick,
  confettiActive
}: FlashcardDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="mb-2 flex justify-between items-center text-sm text-gray-500">
        <p>Card {currentIndex + 1} of {totalCards}</p>
        <Badge variant="outline">
          {card.subject}
        </Badge>
      </div>
      
      {/* Flashcard Component with proper 3D flip */}
      <div
        className="flashcard-container h-[300px] sm:h-[260px] mb-6 cursor-pointer"
        onClick={toggleAnswer}
      >
        <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
          {/* Front - Question */}
          <div className="flashcard-front">
            <Card className="w-full h-full flex flex-col border-2 border-indigo-100 dark:border-indigo-900 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-600 dark:text-indigo-400">Question</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <p className="text-lg text-center">
                  {card.question}
                </p>
              </CardContent>
              <div className="p-4 pt-0 text-center text-sm text-gray-500">
                Tap to see answer
              </div>
            </Card>
          </div>
          
          {/* Back - Answer */}
          <div className="flashcard-back">
            <Card className="w-full h-full flex flex-col border-2 border-green-100 dark:border-green-900 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-600 dark:text-green-400">Answer</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <p className="text-lg text-center">
                  {card.answer}
                </p>
              </CardContent>
              <div className="p-4 pt-0 text-center text-sm text-gray-500">
                Tap to see question
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={goToPrevCard}
          disabled={currentIndex === 0}
          className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={startEditingCard}
            size="sm"
          >
            Edit
          </Button>
          <Button
            variant={card.bookmarked ? "secondary" : "outline"}
            onClick={toggleBookmark}
            size="sm"
            className={card.bookmarked ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400" : ""}
          >
            {card.bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={goToNextCard}
          disabled={currentIndex === totalCards - 1}
          className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Confidence Rating Section */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <p className="text-center mb-3 text-sm text-gray-600 dark:text-gray-400">
              How well did you know this?
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleConfidenceClick('low')}
              >
                Difficult
              </Button>
              <Button 
                variant="outline" 
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                onClick={() => handleConfidenceClick('medium')}
              >
                Medium
              </Button>
              <Button 
                variant="outline" 
                className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleConfidenceClick('high')}
              >
                Easy
              </Button>
            </div>
            
            {/* Study Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500" />
              <p>
                {card.confidence === 'low' ? 
                  "Try rewriting this concept in your own words to improve retention." :
                  "Rating cards helps the app show you difficult cards more frequently."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Confetti Effect */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="confetti-container">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i} 
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
