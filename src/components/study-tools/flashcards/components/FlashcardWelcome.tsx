
import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Feather, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardWelcomeProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

export function FlashcardWelcome({ showWelcome, setShowWelcome }: FlashcardWelcomeProps) {
  if (!showWelcome) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 max-w-md rounded-xl p-6 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring" }}
      >
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <BookMarked className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Welcome to Flashcards!</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Create and review flashcards to improve your memory retention for JEE concepts.
        </p>
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
              <Feather className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm">Tap a card to flip it and reveal the answer</p>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
              <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm">Rate your confidence to track your progress</p>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
              <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm">Add your own flashcards on any subject</p>
          </div>
        </div>
        <Button 
          className="w-full" 
          onClick={() => {
            setShowWelcome(false);
            localStorage.setItem('flashcards-visited', 'true');
          }}
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
}
