
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { CategorySection } from '@/components/CategorySection';
import { useJEEData } from '@/context/jee';
import { chapterIcons, categoryGroups } from '@/data/jeeData';
import { useToast } from '@/components/ui/use-toast';

const ChapterPage = () => {
  const { subject, chapter } = useParams<{ subject: string; chapter: string }>();
  const { getProgressByChapter, resetChapter, updateChapterData } = useJEEData();
  const { toast } = useToast();
  
  if (!subject || !chapter) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Chapter not found</h1>
        <p className="mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Return to home
          </Link>
        </p>
      </div>
    );
  }
  
  const progress = getProgressByChapter(subject, chapter);
  
  // Determine the progress color based on the subject
  const progressVariant = 
    subject === 'Maths' ? 'maths' :
    subject === 'Physics' ? 'physics' :
    'chemistry';
  
  const handleResetChapter = () => {
    resetChapter();
    toast({
      title: "Chapter reset",
      description: "All progress for this chapter has been reset.",
    });
  };
  
  const handleMarkComplete = () => {
    // Mark all fields as complete
    const fields = [
      'notes', 'shortNotes', 'modules', 'ncert', 
      'pyqMains', 'pyqAdv', 'testMains', 'testAdv',
      'revisedMains', 'revisedAdv'
    ];
    
    fields.forEach(field => {
      updateChapterData(subject, chapter, field, true);
    });
    
    toast({
      title: "Chapter completed",
      description: "All tasks for this chapter have been marked as complete.",
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      <Link 
        to={`/subject/${subject}`} 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to {subject}
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-3" role="img" aria-label={chapter}>
              {chapterIcons[chapter] || '📝'}
            </span>
            <h1 className="text-2xl font-bold">{chapter}</h1>
          </div>
          
          <div className="w-full sm:w-1/3">
            <ProgressBar 
              progress={progress} 
              variant={progressVariant}
              showPercentage 
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChapter}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
          >
            Reset Chapter
          </Button>
          <Button
            size="sm"
            onClick={handleMarkComplete}
          >
            Mark All as Complete
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <CategorySection 
          subject={subject} 
          chapter={chapter} 
          category="learn" 
          fields={categoryGroups.learn}
          isOpen={true}
        />
        
        <CategorySection 
          subject={subject} 
          chapter={chapter} 
          category="practice" 
          fields={categoryGroups.practice}
          isOpen={false}
        />
        
        <CategorySection 
          subject={subject} 
          chapter={chapter} 
          category="tests" 
          fields={categoryGroups.tests}
          isOpen={false}
        />
        
        <CategorySection 
          subject={subject} 
          chapter={chapter} 
          category="revise" 
          fields={categoryGroups.revise}
          isOpen={false}
        />
      </div>
    </div>
  );
};

export default ChapterPage;
