
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, BarChart3, CheckCircle, Save } from 'lucide-react';
import { ChapterCard } from '@/components/ChapterCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useJEEData } from '@/context/JEEDataContext';
import { subjectIcons } from '@/data/jeeData';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudyStats } from '@/context/StudyStatsContext';
import { useToast } from '@/components/ui/use-toast';

const SubjectPage = () => {
  const { subject } = useParams<{ subject: string }>();
  const { studyData, getSubjectProgress } = useJEEData();
  const { addStudyTime } = useStudyStats();
  const { toast } = useToast();
  
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [showQuickStats, setShowQuickStats] = useState(false);
  
  const timer = useRef<number | null>(null);
  
  useEffect(() => {
    if (isTimerActive && activeChapter) {
      timer.current = window.setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isTimerActive, activeChapter]);
  
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
    
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };
  
  const startTimer = (chapter: string) => {
    setActiveChapter(chapter);
    setIsTimerActive(true);
    setTimerSeconds(0);
    toast({
      title: "Study session started",
      description: `Tracking time for ${chapter}`,
    });
  };
  
  const stopTimer = () => {
    if (activeChapter && timerSeconds > 0) {
      // Convert seconds to minutes (rounded up)
      const minutes = Math.ceil(timerSeconds / 60);
      addStudyTime(subject, activeChapter, minutes);
      
      toast({
        title: "Study session saved",
        description: `Recorded ${formatTime(timerSeconds)} for ${activeChapter}`,
      });
    }
    
    setIsTimerActive(false);
    setActiveChapter(null);
    setTimerSeconds(0);
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-4xl mr-3 animate-scale-in" role="img" aria-label={subject}>
              {subjectIcons[subject as keyof typeof subjectIcons]}
            </span>
            <h1 className="text-3xl font-bold">{subject}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-full md:w-48">
              <ProgressBar 
                progress={progress} 
                variant={progressVariant}
                showPercentage 
                animated
              />
            </div>
            
            <Popover open={showQuickStats} onOpenChange={setShowQuickStats}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="animate-fade-in"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium">Quick Stats for {subject}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                      <div className="text-xs text-gray-500">Progress</div>
                      <div className="text-lg font-bold">{Math.round(progress)}%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                      <div className="text-xs text-gray-500">Chapters</div>
                      <div className="text-lg font-bold">{chapters.length}</div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      {isTimerActive && activeChapter && (
        <Card className="mb-6 border-green-200 dark:border-green-800 animate-pulse shadow-lg animate-fade-in">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  Studying: {activeChapter}
                </h3>
                <div className="text-2xl font-mono mt-1">{formatTime(timerSeconds)}</div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-200 hover:border-green-300 hover:bg-green-50"
                  onClick={stopTimer}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Save Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <div key={chapter} className="relative group">
            <ChapterCard key={chapter} subject={subject} chapter={chapter} />
            {!isTimerActive && (
              <button
                onClick={() => startTimer(chapter)}
                className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow"
                title="Start Study Session"
              >
                <Clock className="h-4 w-4 text-green-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
