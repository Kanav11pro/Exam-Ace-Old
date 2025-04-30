
import { Link } from 'react-router-dom';
import { useJEEData } from '@/context/jee'; // Changed from '@/context/JEEDataContext'
import { ProgressBar } from './ProgressBar';
import { chapterIcons } from '@/data/jeeData';
import { motion } from 'framer-motion';

interface ChapterCardProps {
  subject: string;
  chapter: string;
}

export function ChapterCard({
  subject,
  chapter
}: ChapterCardProps) {
  const { getProgressByChapter } = useJEEData();
  const progress = getProgressByChapter(subject, chapter);

  // Determine the progress color based on the subject
  const progressVariant = subject === 'Maths' ? 'maths' : subject === 'Physics' ? 'physics' : 'chemistry';
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/subject/${subject}/${encodeURIComponent(chapter)}`} 
        className="chapter-card bg-white dark:bg-gray-800 p-4 h-40 flex flex-col justify-between transition-all rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2 pr-2">{chapter}</h3>
          <motion.span 
            role="img" 
            aria-label={chapter} 
            className="text-5xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {chapterIcons[chapter] || '📝'}
          </motion.span>
        </div>
        
        <div className="mt-auto">
          <ProgressBar progress={progress} variant={progressVariant} showPercentage />
        </div>
      </Link>
    </motion.div>
  );
}
