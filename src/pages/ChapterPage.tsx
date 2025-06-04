
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FolderCheck, RefreshCw, Book, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { CategorySection } from '@/components/CategorySection';
import { useJEEData } from '@/context/jee';
import { chapterIcons, categoryGroups } from '@/data/jeeData';
import { useToast } from '@/components/ui/use-toast';

const ChapterPage = () => {
  const { subject, chapter } = useParams<{ subject: string; chapter: string }>();
  const { getProgressByChapter, updateChapterData, resetData } = useJEEData();
  const { toast } = useToast();
  
  if (!subject || !chapter) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Chapter not found</h1>
        <p className="mt-4">
          <Link to="/" className="text-primary hover:underline">
            Return to Prepometer
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
    // Since there is no direct resetChapter function, we'll simulate it by setting all fields to false
    const fields = [
      'notes', 'shortNotes', 'modules', 'ncert', 
      'pyqMains', 'pyqAdv', 'testMains', 'testAdv',
      'revisedMains', 'revisedAdv'
    ];
    
    fields.forEach(field => {
      updateChapterData(subject, chapter, field, false);
    });
    updateChapterData(subject, chapter, 'tag', '');
    updateChapterData(subject, chapter, 'remarks', '');
    
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container max-w-4xl py-8">
        <Link 
          to={`/subject/${subject}`} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {subject}
        </Link>
        
        <div className="bg-card rounded-lg shadow-md p-6 mb-8 border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <span 
                className="text-5xl mr-4" 
                role="img" 
                aria-label={chapter}
              >
                {chapterIcons[chapter] || '📝'}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">{chapter}</h1>
                <p className="text-sm text-muted-foreground">{subject}</p>
              </div>
            </div>
            
            <div className="w-full sm:w-1/3">
              <ProgressBar 
                progress={progress} 
                variant={progressVariant}
                showPercentage
                animated
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
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Chapter
            </Button>
            <Button
              size="sm"
              onClick={handleMarkComplete}
            >
              <FolderCheck className="h-4 w-4 mr-2" />
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
        
        <div className="mt-12 p-6 bg-muted rounded-lg border">
          <h2 className="text-xl font-bold mb-4 flex items-center text-foreground">
            <Book className="h-5 w-5 mr-2 text-blue-500" />
            Study Tips For This Chapter
          </h2>
          <div className="space-y-3">
            <p className="text-muted-foreground">• Focus on understanding the core concepts first</p>
            <p className="text-muted-foreground">• Practice with a variety of problems to build confidence</p>
            <p className="text-muted-foreground">• Review frequently with spaced repetition</p>
            <p className="text-muted-foreground">• Create mind maps to connect related topics</p>
            <p className="text-muted-foreground">• Use the formula sheet to quickly reference important equations</p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
