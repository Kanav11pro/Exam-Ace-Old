
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useStudyStats } from '@/context/StudyStatsContext';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export function StudyTimer() {
  const [subject, setSubject] = useState<string>('');
  const [chapter, setChapter] = useState<string>('');
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { addStudyTime } = useStudyStats();
  
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Clock className="h-6 w-6" />
        Study Timer
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Select
              value={subject}
              onValueChange={setSubject}
              disabled={isActive}
            >
              <SelectTrigger>
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
              <SelectTrigger>
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
          <div className="text-6xl font-mono font-bold tracking-widest my-6 animate-pulse">
            {formatTime(time)}
          </div>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button 
              onClick={toggleTimer}
              size="lg"
              className={`w-32 transition-transform hover:scale-105 ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
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
              disabled={time === 0}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        <p>Your study time will be automatically recorded when you pause or stop the timer.</p>
      </div>
    </div>
  );
}
