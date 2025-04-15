
import { useJEEData } from '@/context/jee'; // Updated import path
import { Link } from 'react-router-dom';
import { chapterIcons } from '@/data/jeeData';

export function WeakChaptersList() {
  const { getWeakChapters } = useJEEData();
  const weakChapters = getWeakChapters();

  if (weakChapters.length === 0) {
    return (
      <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
        <p className="text-green-700 dark:text-green-300 font-medium">
          Great job! No weak chapters identified. 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {weakChapters.map(({ subject, chapter }) => (
        <Link
          key={`${subject}-${chapter}`}
          to={`/subject/${subject}/${encodeURIComponent(chapter)}`}
          className="flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          <span className="text-2xl mr-3" role="img" aria-label={chapter}>
            {chapterIcons[chapter] || '📝'}
          </span>
          <div className="flex-1">
            <p className="font-medium text-red-700 dark:text-red-300">{chapter}</p>
            <p className="text-sm text-red-600 dark:text-red-400">{subject}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
