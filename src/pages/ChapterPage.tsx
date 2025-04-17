
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FolderCheck, RefreshCw, Book, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { CategorySection } from '@/components/CategorySection';
import { useJEEData } from '@/context/jee';
import { chapterIcons, categoryGroups } from '@/data/jeeData';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const ChapterPage = () => {
  const { subject, chapter } = useParams<{ subject: string; chapter: string }>();
  const { getChapterProgress, markChapterComplete, resetChapter } = useJEEData();
  const { toast } = useToast();
  
  if (!subject || !chapter) {
    return (
      <motion.div 
        className="container py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Chapter not found</h1>
        <p className="mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Return to home
          </Link>
        </p>
      </motion.div>
    );
  }
  
  const progress = getChapterProgress(subject, chapter);
  
  // Determine the progress color based on the subject
  const progressVariant = 
    subject === 'Maths' ? 'maths' :
    subject === 'Physics' ? 'physics' :
    'chemistry';
  
  const handleResetChapter = () => {
    resetChapter(subject, chapter);
    toast({
      title: "Chapter reset",
      description: "All progress for this chapter has been reset.",
    });
  };
  
  const handleMarkComplete = () => {
    markChapterComplete(subject, chapter);
    
    toast({
      title: "Chapter completed",
      description: "All tasks for this chapter have been marked as complete.",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="container max-w-4xl py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Link 
          to={`/subject/${subject}`} 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 hover-scale"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {subject}
        </Link>
      </motion.div>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700"
        variants={item}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <motion.span 
              className="text-5xl mr-4" 
              role="img" 
              aria-label={chapter}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {chapterIcons[chapter] || '📝'}
            </motion.span>
            <div>
              <h1 className="text-2xl font-bold">{chapter}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subject}</p>
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
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950 hover-scale"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Chapter
          </Button>
          <Button
            size="sm"
            onClick={handleMarkComplete}
            className="hover-scale"
          >
            <FolderCheck className="h-4 w-4 mr-2" />
            Mark All as Complete
          </Button>
        </div>
      </motion.div>
      
      <motion.div className="space-y-6" variants={item}>
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
      </motion.div>
      
      <motion.div 
        className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
        variants={item}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Book className="h-5 w-5 mr-2 text-blue-500" />
          Study Tips For This Chapter
        </h2>
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-300">• Focus on understanding the core concepts first</p>
          <p className="text-gray-600 dark:text-gray-300">• Practice with a variety of problems to build confidence</p>
          <p className="text-gray-600 dark:text-gray-300">• Review frequently with spaced repetition</p>
          <p className="text-gray-600 dark:text-gray-300">• Create mind maps to connect related topics</p>
          <p className="text-gray-600 dark:text-gray-300">• Use the formula sheet to quickly reference important equations</p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="hover-scale">
            <Send className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChapterPage;
