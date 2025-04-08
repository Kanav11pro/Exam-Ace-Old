
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useStudyStats } from '@/context/StudyStatsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';

// Pomodoro settings
const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_SHORT_BREAK = 5;
const DEFAULT_LONG_BREAK = 15;
const LONG_BREAK_INTERVAL = 4;

export function PomodoroTimer() {
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [timerMode, setTimerMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(DEFAULT_SHORT_BREAK);
  const [longBreakMinutes, setLongBreakMinutes] = useState(DEFAULT_LONG_BREAK);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const timer = useRef<number | null>(null);
  const { toast } = useToast();
  const { recordPomodoroSession } = useStudyStats();

  // Reset timer when mode changes
  useEffect(() => {
    let minutes = workMinutes;
    if (timerMode === 'shortBreak') minutes = shortBreakMinutes;
    if (timerMode === 'longBreak') minutes = longBreakMinutes;
    
    setTimeLeft(minutes * 60);
    // Stop timer when changing modes
    setIsActive(false);
    stopTimer();
  }, [timerMode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timer.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            stopTimer();
            
            // Timer completed
            if (timerMode === 'work') {
              const newCompletedSessions = completedSessions + 1;
              setCompletedSessions(newCompletedSessions);
              
              // Record completed work session
              if (activeSubject) {
                recordPomodoroSession(activeSubject, 1, workMinutes);
              }
              
              // Determine next break type
              if (newCompletedSessions % LONG_BREAK_INTERVAL === 0) {
                setTimerMode('longBreak');
                toast({
                  title: "Long break time!",
                  description: `You've completed ${newCompletedSessions} sessions. Take a ${longBreakMinutes}-minute break.`,
                });
              } else {
                setTimerMode('shortBreak');
                toast({
                  title: "Break time!",
                  description: `Session complete! Take a ${shortBreakMinutes}-minute break.`,
                });
              }
            } else {
              // Break completed
              setTimerMode('work');
              toast({
                title: "Break over!",
                description: "Time to get back to work!",
              });
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isActive, timerMode, completedSessions, workMinutes, shortBreakMinutes, longBreakMinutes, toast, activeSubject, recordPomodoroSession]);

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setIsActive(false);
  };

  const toggleTimer = () => {
    if (!activeSubject && timerMode === 'work') {
      toast({
        title: "Subject required",
        description: "Please select a subject before starting a work session.",
        variant: "destructive"
      });
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    stopTimer();
    let minutes = workMinutes;
    if (timerMode === 'shortBreak') minutes = shortBreakMinutes;
    if (timerMode === 'longBreak') minutes = longBreakMinutes;
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (): number => {
    let totalSeconds = workMinutes * 60;
    if (timerMode === 'shortBreak') totalSeconds = shortBreakMinutes * 60;
    if (timerMode === 'longBreak') totalSeconds = longBreakMinutes * 60;
    
    const percentComplete = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    return percentComplete;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col items-center justify-center space-y-3">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {timerMode === 'work' ? '🧠 Focus Time' : timerMode === 'shortBreak' ? '☕ Short Break' : '🌿 Long Break'}
        </h2>
        
        {timerMode === 'work' && (
          <div className="w-full mb-4">
            <Select
              value={activeSubject}
              onValueChange={setActiveSubject}
              disabled={isActive}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maths">Maths</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="text-6xl font-mono font-bold tracking-widest mb-6 text-center">
          {formatTime(timeLeft)}
        </div>
        
        <Progress value={calculateProgress()} className="w-full h-2 mb-8" />
        
        <div className="flex space-x-3">
          <Button 
            onClick={toggleTimer} 
            size="lg"
            className="transition-transform hover:scale-105 animate-pulse"
          >
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button 
            onClick={resetTimer} 
            variant="outline" 
            size="lg"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex justify-center space-x-2 mt-4">
          <Button 
            onClick={() => setTimerMode('work')} 
            variant={timerMode === 'work' ? 'default' : 'outline'}
            size="sm"
          >
            Focus
          </Button>
          <Button 
            onClick={() => setTimerMode('shortBreak')} 
            variant={timerMode === 'shortBreak' ? 'default' : 'outline'}
            size="sm"
          >
            Short Break
          </Button>
          <Button 
            onClick={() => setTimerMode('longBreak')} 
            variant={timerMode === 'longBreak' ? 'default' : 'outline'}
            size="sm"
          >
            Long Break
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Completed Sessions: <span className="font-bold">{completedSessions}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4"
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </Button>
        
        {showSettings && (
          <div className="w-full grid grid-cols-3 gap-4 mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-slide-in">
            <div>
              <label className="block text-sm font-medium mb-1">Work (min)</label>
              <Select
                value={workMinutes.toString()}
                onValueChange={(val) => setWorkMinutes(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="25" />
                </SelectTrigger>
                <SelectContent>
                  {[15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(min => (
                    <SelectItem key={min} value={min.toString()}>{min}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Short Break (min)</label>
              <Select
                value={shortBreakMinutes.toString()}
                onValueChange={(val) => setShortBreakMinutes(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10].map(min => (
                    <SelectItem key={min} value={min.toString()}>{min}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Long Break (min)</label>
              <Select
                value={longBreakMinutes.toString()}
                onValueChange={(val) => setLongBreakMinutes(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="15" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 25, 30].map(min => (
                    <SelectItem key={min} value={min.toString()}>{min}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
