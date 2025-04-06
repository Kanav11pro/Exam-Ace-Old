
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ChapterCard } from '@/components/ChapterCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useJEEData } from '@/context/JEEDataContext';
import { subjectIcons } from '@/data/jeeData';

const SubjectPage = () => {
  const { subject } = useParams<{ subject: string }>();
  const { studyData, getSubjectProgress } = useJEEData();
  
  if (!subject || !studyData[subject]) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Subject not found</h1>
        <p className="mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Return to home
          </Link>
        </p>
      </div>
    );
  }
  
  const chapters = Object.keys(studyData[subject]);
  const progress = getSubjectProgress(subject);
  
  // Determine the progress color based on the subject
  const progressVariant = 
    subject === 'Maths' ? 'maths' :
    subject === 'Physics' ? 'physics' :
    'chemistry';

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-4xl mr-3" role="img" aria-label={subject}>
              {subjectIcons[subject as keyof typeof subjectIcons]}
            </span>
            <h1 className="text-3xl font-bold">{subject}</h1>
          </div>
          
          <div className="w-full md:w-1/3">
            <ProgressBar 
              progress={progress} 
              variant={progressVariant}
              showPercentage 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter} subject={subject} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
