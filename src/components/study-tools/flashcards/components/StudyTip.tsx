
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export function StudyTip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">Study Tip</h3>
          <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-1">
            Flashcards are most effective when you actively recall information before flipping. 
            Try to answer each question in your mind before checking the answer.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
