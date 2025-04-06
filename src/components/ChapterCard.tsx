
import { Link } from 'react-router-dom';
import { useJEEData } from '@/context/JEEDataContext';
import { ProgressBar } from './ProgressBar';
import { chapterIcons } from '@/data/jeeData';

interface ChapterCardProps {
  subject: string;
  chapter: string;
}

export function ChapterCard({ subject, chapter }: ChapterCardProps) {
  const { getChapterProgress } = useJEEData();
  const progress = getChapterProgress(subject, chapter);
  
  // Determine the progress color based on the subject
  const progressVariant = 
    subject === 'Maths' ? 'maths' :
    subject === 'Physics' ? 'physics' :
    'chemistry';

  return (
    <Link
      to={`/subject/${subject}/${encodeURIComponent(chapter)}`}
      className="chapter-card bg-white dark:bg-gray-800 p-4 h-40 flex flex-col justify-between hover:translate-y-[-5px] hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold line-clamp-2 pr-2">{chapter}</h3>
        <span className="text-3xl" role="img" aria-label={chapter}>
          {chapterIcons[chapter] || '📝'}
        </span>
      </div>
      
      <div className="mt-auto">
        <ProgressBar 
          progress={progress} 
          variant={progressVariant} 
          showPercentage 
        />
      </div>
    </Link>
  );
}
