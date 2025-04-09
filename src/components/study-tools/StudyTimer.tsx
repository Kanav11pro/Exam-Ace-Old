
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useStudyStats } from '@/context/StudyStatsContext';
import { Play, Pause, RotateCcw, Clock, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StudyTimer() {
  const [subject, setSubject] = useState<string>('');
  const [chapter, setChapter] = useState<string>('');
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [todayStudyTime, setTodayStudyTime] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { addStudyTime, studyTimes } = useStudyStats();
  
  // List of chapters by subject
  const chaptersBySubject: Record<string, string[]> = {
    'Maths': [
      'Sets & Relations', 'Complex Numbers', 'Quadratic Equations', 
      'Sequences & Series', 'Permutations & Combinations', 'Binomial Theorem',
      'Trigonometry', 'Inverse Trigonometry', 'Straight Lines', 
      'Circles', 'Conic Sections', 'Limits & Continuity', 
      'Differentiation', 'Integration', 'Differential Equations',
      'Vectors', 'Probability', 'Statistics'
    ],
    'Physics': [
      'Motion in 1D', 'Motion in 2D', 'Laws of Motion', 
      'Work & Energy', 'Rotational Motion', 'Gravitation', 
      'Fluid Mechanics', 'Thermal Properties', 'Thermodynamics',
      'Electrostatics', 'Current Electricity', 'Magnetism',
      'EM Induction', 'Ray Optics', 'Wave Optics',
      'Modern Physics', 'Nuclear Physics', 'Semiconductor Physics'
    ],
    'Chemistry': [
      'Basic Concepts', 'States of Matter', 'Atomic Structure',
      'Chemical Bonding', 'Thermodynamics', 'Chemical Equilibrium',
      'Redox Reactions', 'Chemical Kinetics', 'Periodic Table',
      'Coordination Compounds', 'p-Block Elements', 'd-Block Elements',
      'Hydrocarbons', 'Haloalkanes', 'Alcohols & Phenols',
      'Aldehydes & Ketones', 'Carboxylic Acids', 'Biomolecules'
    ]
  };

  // Calculate today's study time
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayMinutes = studyTimes
      .filter(entry => entry.date.split('T')[0] === today)
      .reduce((total, entry) => total + entry.minutes, 0);
      
    setTodayStudyTime(todayMinutes);
  }, [studyTimes]);

  // Format time to display as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Start or pause the timer
  const toggleTimer = () => {
    if (!subject) {
      toast({
        title: "Subject required",
        description: "Please select a subject before starting the timer",
        variant: "destructive"
      });
      return;
    }

    if (isActive) {
      // Pause timer
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Record the study time if paused and time > 0
      if (time > 0) {
        // Convert seconds to minutes for recording
        const studyMinutes = Math.floor(time / 60);
        if (studyMinutes > 0) {
          addStudyTime(subject, chapter || 'General Study', studyMinutes);
          toast({
            title: "Study session recorded",
            description: `Added ${studyMinutes} minutes of study for ${subject}${chapter ? ` - ${chapter}` : ''}`,
          });
          setTime(0); // Reset the timer after recording
        }
      }
    } else {
      // Start timer
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    setIsActive(!isActive);
  };

  // Reset the timer
  const resetTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setTime(0);
  };

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset chapter when subject changes
  useEffect(() => {
    setChapter('');
  }, [subject]);

  // Check if we've reached a milestone
  const getMilestone = (minutes: number): string | null => {
    if (minutes >= 240) return "Study Champion";
    if (minutes >= 180) return "Focus Master";
    if (minutes >= 120) return "Dedication Award";
    if (minutes >= 60) return "Study Enthusiast";
    if (minutes >= 30) return "Getting Started";
    return null;
  };

  const milestone = getMilestone(todayStudyTime);

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Clock className="h-6 w-6 mr-2 text-blue-600" />
              Study Timer
            </CardTitle>
            <CardDescription>
              Track your study sessions and build consistency
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowStats(!showStats)}
            title={showStats ? "Hide stats" : "Show stats"}
          >
            <BarChart3 className={`h-5 w-5 transition-transform ${showStats ? 'text-blue-600' : 'text-gray-500'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-0">
        {showStats && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg">
            <h3 className="text-md font-semibold mb-2 text-blue-700 dark:text-blue-300">Today's Study Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-xl font-bold">{Math.floor(todayStudyTime / 60)}h {todayStudyTime % 60}m</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                {milestone ? (
                  <div className="flex justify-center mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Award className="h-3 w-3" />
                      {milestone}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm font-medium mt-1">Keep studying!</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Select
                value={subject}
                onValueChange={setSubject}
                disabled={isActive}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maths">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="General">General Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Chapter (Optional)</label>
              <Select
                value={chapter}
                onValueChange={setChapter}
                disabled={isActive || !subject || subject === 'General'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {subject && subject !== 'General' && chaptersBySubject[subject]?.map((chap) => (
                    <SelectItem key={chap} value={chap}>{chap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-6xl font-mono font-bold tracking-widest my-6 py-6 ${
              isActive ? 'animate-pulse text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {formatTime(time)}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <Button 
          onClick={toggleTimer}
          size="lg"
          className={`w-32 transition-all hover:scale-105 ${
            isActive 
              ? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start
            </>
          )}
        </Button>
        
        <Button 
          onClick={resetTimer} 
          variant="outline" 
          size="lg"
          className="w-32"
          disabled={time === 0 && !isActive}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </CardFooter>
      
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 p-3 border-t border-gray-100 dark:border-gray-800">
        <p>Your study time will be automatically recorded when you pause the timer.</p>
      </div>
    </Card>
  );
}
