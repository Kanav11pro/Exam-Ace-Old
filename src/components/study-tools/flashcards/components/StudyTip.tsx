
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface StudyTipProps {
  tip?: string;
  title?: string;
}

export function StudyTip({ 
  tip = "Flashcards are most effective when you actively recall information before flipping. Try to answer each question in your mind before checking the answer.",
  title = "Study Tip"
}: StudyTipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/50 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-indigo-200 dark:bg-indigo-700/50 flex items-center justify-center flex-shrink-0 shadow-inner">
          <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div>
          <h3 className="font-medium text-indigo-800 dark:text-indigo-200 text-base">{title}</h3>
          <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mt-2 leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
