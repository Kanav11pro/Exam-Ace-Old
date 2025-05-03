
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface StudyTipProps {
  tip?: string;
  title?: string;
  variant?: 'default' | 'warning' | 'info' | 'success';
}

export function StudyTip({ 
  tip = "Flashcards are most effective when you actively recall information before flipping. Try to answer each question in your mind before checking the answer.",
  title = "Study Tip",
  variant = 'default'
}: StudyTipProps) {
  // Define variant-based styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/10 border-amber-100 dark:border-amber-800/50 [&_h3]:text-amber-800 [&_h3]:dark:text-amber-200 [&_p]:text-amber-700/80 [&_p]:dark:text-amber-300/80 [&_.icon-bg]:bg-amber-200 [&_.icon-bg]:dark:bg-amber-700/50 [&_.icon]:text-amber-600 [&_.icon]:dark:text-amber-300";
      case 'info':
        return "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 border-blue-100 dark:border-blue-800/50 [&_h3]:text-blue-800 [&_h3]:dark:text-blue-200 [&_p]:text-blue-700/80 [&_p]:dark:text-blue-300/80 [&_.icon-bg]:bg-blue-200 [&_.icon-bg]:dark:bg-blue-700/50 [&_.icon]:text-blue-600 [&_.icon]:dark:text-blue-300";
      case 'success':
        return "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10 border-green-100 dark:border-green-800/50 [&_h3]:text-green-800 [&_h3]:dark:text-green-200 [&_p]:text-green-700/80 [&_p]:dark:text-green-300/80 [&_.icon-bg]:bg-green-200 [&_.icon-bg]:dark:bg-green-700/50 [&_.icon]:text-green-600 [&_.icon]:dark:text-green-300";
      default:
        return "from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/10 border-indigo-100 dark:border-indigo-800/50 [&_h3]:text-indigo-800 [&_h3]:dark:text-indigo-200 [&_p]:text-indigo-700/80 [&_p]:dark:text-indigo-300/80 [&_.icon-bg]:bg-indigo-200 [&_.icon-bg]:dark:bg-indigo-700/50 [&_.icon]:text-indigo-600 [&_.icon]:dark:text-indigo-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`mt-8 p-5 bg-gradient-to-br ${getVariantStyles()} rounded-lg border shadow-sm`}
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full icon-bg flex items-center justify-center flex-shrink-0 shadow-inner">
          <Lightbulb className="h-5 w-5 icon" />
        </div>
        <div>
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-sm mt-2 leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
