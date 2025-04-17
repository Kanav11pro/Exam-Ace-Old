
import { useJEEData } from '@/context/jee';
import { Link } from 'react-router-dom';
import { chapterIcons } from '@/data/jeeData';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WeakChapter {
  subject: string;
  chapter: string;
  progress: number;
}

export function WeakChaptersList() {
  const { getWeakChapters, getChapterProgress } = useJEEData();
  // Get weak chapters and add progress information
  const weakChaptersInfo = getWeakChapters().map(item => ({
    subject: item.subject,
    chapter: item.chapter,
    progress: getChapterProgress(item.subject, item.chapter)
  }));

  if (weakChaptersInfo.length === 0) {
    return (
      <motion.div 
        className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-green-700 dark:text-green-300 font-medium">
          Great job! No weak chapters identified. 🎉
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {weakChaptersInfo.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <Link
            to={`/subject/${item.subject}/${encodeURIComponent(item.chapter)}`}
            className="flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-200 dark:border-red-800"
          >
            <div className="mr-3 relative">
              <span className="text-2xl" role="img" aria-label={item.chapter}>
                {chapterIcons[item.chapter] || '📝'}
              </span>
              <AlertTriangle className="absolute -top-2 -right-2 h-4 w-4 text-red-500 animate-pulse-slow" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-700 dark:text-red-300">{item.chapter}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-red-600 dark:text-red-400">{item.subject}</p>
                <p className="text-xs bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded-full">
                  {Math.round(item.progress)}% complete
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
