
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useStudyStats } from '@/context/StudyStatsContext';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Focus, 
  Clock, 
  Settings, 
  TrendingUp,
  Target,
  Award,
  Zap,
  Brain,
  Coffee,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StudyMode = 'focus' | 'pomodoro' | 'custom';
type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

interface StudySession {
  id: string;
  subject: string;
  chapter?: string;
  mode: StudyMode;
  duration: number;
  date: Date;
  completedCycles?: number;
}

export function AdvancedStudyTimer() {
  // Core timer states
  const [mode, setMode] = useState<StudyMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  
  // Pomodoro specific states
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [completedCycles, setCompletedCycles] = useState(0);
  const [cycleTarget, setCycleTarget] = useState(4);
  
  // Session configuration
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [focusGoal, setFocusGoal] = useState('');
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [customDuration, setCustomDuration] = useState(30);
  
  // UI states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartWork, setAutoStartWork] = useState(false);
  const [playTickSound, setPlayTickSound] = useState(false);
  
  // Motivational content
  const [currentQuote, setCurrentQuote] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  
  // Analytics
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(1200); // minutes
  
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { addStudyTime, recordPomodoroSession, studyTimes } = useStudyStats();
  
  const motivationalQuotes = [
    "The expert in anything was once a beginner.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't wish it were easier; wish you were better.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Believe you can and you're halfway there.",
    "It always seems impossible until it's done.",
    "Your time is limited, don't waste it living someone else's life.",
    "Education is the passport to the future."
  ];
  
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

  // Initialize timer based on mode
  useEffect(() => {
    let duration = workDuration * 60;
    
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'shortBreak') duration = shortBreakDuration * 60;
      else if (pomodoroPhase === 'longBreak') duration = longBreakDuration * 60;
    } else if (mode === 'custom') {
      duration = customDuration * 60;
    }
    
    setTimeLeft(duration);
    setTotalTime(duration);
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [mode, pomodoroPhase, workDuration, shortBreakDuration, longBreakDuration, customDuration]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  // Motivational quotes rotation
  useEffect(() => {
    if (motivationalQuotes.length > 0) {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      
      const quoteInterval = setInterval(() => {
        setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      }, 30000);
      
      return () => clearInterval(quoteInterval);
    }
  }, []);

  // Calculate today's study stats
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayMinutes = studyTimes
      .filter(entry => entry.date.split('T')[0] === today)
      .reduce((total, entry) => total + entry.minutes, 0);
    setTodayStudyTime(todayMinutes);
  }, [studyTimes]);

  const handleTimerComplete = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    
    if (mode === 'pomodoro' && pomodoroPhase === 'work') {
      const newCycles = completedCycles + 1;
      setCompletedCycles(newCycles);
      
      if (subject) {
        recordPomodoroSession(subject, 1, workDuration);
      }
      
      const nextPhase = newCycles % 4 === 0 ? 'longBreak' : 'shortBreak';
      setPomodoroPhase(nextPhase);
      
      toast({
        title: nextPhase === 'longBreak' ? "Long Break Time!" : "Break Time!",
        description: `You've completed ${newCycles} focus session${newCycles > 1 ? 's' : ''}. Take a well-deserved break!`,
      });
      
      if (autoStartBreaks) {
        setTimeout(() => setIsActive(true), 3000);
      }
    } else if (mode === 'pomodoro' && pomodoroPhase !== 'work') {
      setPomodoroPhase('work');
      toast({
        title: "Break Over!",
        description: "Time to get back to focused work!",
      });
      
      if (autoStartWork) {
        setTimeout(() => setIsActive(true), 3000);
      }
    } else {
      // Focus or custom mode completion
      const studyMinutes = Math.floor(totalTime / 60);
      if (subject && studyMinutes > 0) {
        addStudyTime(subject, chapter || focusGoal || 'Deep Focus', studyMinutes);
      }
      
      toast({
        title: "Session Complete!",
        description: `Great job! You've completed ${studyMinutes} minutes of focused study.`,
      });
    }
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const toggleTimer = () => {
    if (!subject && (mode === 'pomodoro' || (mode === 'focus' && pomodoroPhase === 'work'))) {
      toast({
        title: "Subject Required",
        description: "Please select a subject before starting your study session.",
        variant: "destructive"
      });
      return;
    }
    
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    
    let duration = workDuration * 60;
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'shortBreak') duration = shortBreakDuration * 60;
      else if (pomodoroPhase === 'longBreak') duration = longBreakDuration * 60;
    } else if (mode === 'custom') {
      duration = customDuration * 60;
    }
    
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const resetSession = () => {
    resetTimer();
    setCompletedCycles(0);
    setPomodoroPhase('work');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error(`Error attempting to enable fullscreen: ${err.message}`));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(`Error attempting to exit fullscreen: ${err.message}`));
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (): number => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeIcon = () => {
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') return <Brain className="h-6 w-6" />;
      return <Coffee className="h-6 w-6" />;
    }
    if (mode === 'focus') return <Focus className="h-6 w-6" />;
    return <Timer className="h-6 w-6" />;
  };

  const getModeTitle = () => {
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') return '🧠 Focus Sprint';
      if (pomodoroPhase === 'shortBreak') return '☕ Quick Break';
      return '🌿 Long Rest';
    }
    if (mode === 'focus') return '🎯 Deep Focus';
    return '⏰ Custom Timer';
  };

  const getStreakBadge = () => {
    if (completedCycles >= 8) return { text: "Focus Master", color: "bg-purple-500" };
    if (completedCycles >= 4) return { text: "Momentum", color: "bg-blue-500" };
    if (completedCycles >= 2) return { text: "Building", color: "bg-green-500" };
    return { text: "Starting", color: "bg-gray-500" };
  };

  return (
    <div 
      ref={containerRef}
      className={`transition-all duration-500 animate-fade-in ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center overflow-hidden' 
          : 'bg-white dark:bg-gray-800 rounded-lg shadow-lg'
      }`}
    >
      <audio ref={audioRef} src="/notification.mp3" />
      
      {/* Header Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowStats(!showStats)}
          className={isFullscreen ? "text-white hover:bg-white/10" : ""}
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className={isFullscreen ? "text-white hover:bg-white/10" : ""}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleFullscreen}
          className={isFullscreen ? "text-white hover:bg-white/10" : ""}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      {isFullscreen ? (
        // Fullscreen Focus Mode
        <div className="text-center text-white p-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              {getModeIcon()}
              {getModeTitle()}
            </h1>
            {subject && (
              <p className="text-xl text-white/80">{subject}{chapter && ` - ${chapter}`}</p>
            )}
          </motion.div>
          
          <motion.div
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            className="text-8xl font-mono font-bold mb-8 tracking-wider"
          >
            {formatTime(timeLeft)}
          </motion.div>
          
          <Progress value={calculateProgress()} className="w-full max-w-md mx-auto h-3 mb-8" />
          
          {focusGoal && mode === 'focus' && (
            <div className="mb-8 px-6 py-3 bg-white/10 rounded-full inline-block">
              <p className="text-lg">{focusGoal}</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-6 mb-8">
            <Button 
              onClick={toggleTimer}
              size="lg"
              className={`px-8 py-4 text-lg transition-transform hover:scale-105 ${
                isActive 
                  ? 'bg-amber-500 hover:bg-amber-600' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isActive ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            
            <Button 
              onClick={resetTimer} 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10"
            >
              <RotateCcw className="mr-2 h-6 w-6" />
              Reset
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-white/80 italic text-lg">"{currentQuote}"</p>
          </motion.div>
        </div>
      ) : (
        // Normal Card Mode
        <Card className="w-full max-w-4xl mx-auto overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {getModeIcon()}
                Advanced Study Timer
              </CardTitle>
              <div className="flex items-center gap-2">
                {mode === 'pomodoro' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {completedCycles}/{cycleTarget} cycles
                  </Badge>
                )}
                <Badge className={`${getStreakBadge().color} text-white`}>
                  {getStreakBadge().text}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={mode} onValueChange={(value) => setMode(value as StudyMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="focus" className="flex items-center gap-2">
                  <Focus className="h-4 w-4" />
                  Deep Focus
                </TabsTrigger>
                <TabsTrigger value="pomodoro" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Custom
                </TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timer Display */}
                <div className="lg:col-span-2">
                  <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      {getModeTitle()}
                    </h3>
                    
                    <motion.div
                      animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      className="text-5xl font-mono font-bold my-6 tracking-wider"
                    >
                      {formatTime(timeLeft)}
                    </motion.div>
                    
                    <Progress value={calculateProgress()} className="w-full h-3 mb-6" />
                    
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={toggleTimer}
                        size="lg"
                        className={`transition-transform hover:scale-105 ${
                          isActive 
                            ? 'bg-amber-500 hover:bg-amber-600' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                        {isActive ? 'Pause' : 'Start'}
                      </Button>
                      
                      <Button 
                        onClick={resetTimer} 
                        variant="outline" 
                        size="lg"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Reset
                      </Button>
                      
                      {mode === 'pomodoro' && (
                        <Button 
                          onClick={resetSession} 
                          variant="outline" 
                          size="lg"
                        >
                          <Target className="mr-2 h-5 w-5" />
                          Reset Session
                        </Button>
                      )}
                    </div>
                  </Card>
                  
                  {/* Session Configuration */}
                  <Card className="mt-4 p-4">
                    <TabsContent value="focus" className="m-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <Select value={subject} onValueChange={setSubject} disabled={isActive}>
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
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Focus Goal</label>
                          <Textarea
                            value={focusGoal}
                            onChange={(e) => setFocusGoal(e.target.value)}
                            placeholder="What are you focusing on? (e.g., 'Solve 10 physics problems' or 'Complete organic chemistry notes')"
                            disabled={isActive}
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                          <Input
                            type="number"
                            min="5"
                            max="180"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(Math.max(5, Math.min(180, parseInt(e.target.value) || 25)))}
                            disabled={isActive}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pomodoro" className="m-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <Select value={subject} onValueChange={setSubject} disabled={isActive}>
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
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Work (min)</label>
                            <Input
                              type="number"
                              min="15"
                              max="60"
                              value={workDuration}
                              onChange={(e) => setWorkDuration(Math.max(15, Math.min(60, parseInt(e.target.value) || 25)))}
                              disabled={isActive}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Short Break</label>
                            <Input
                              type="number"
                              min="3"
                              max="15"
                              value={shortBreakDuration}
                              onChange={(e) => setShortBreakDuration(Math.max(3, Math.min(15, parseInt(e.target.value) || 5)))}
                              disabled={isActive}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Long Break</label>
                            <Input
                              type="number"
                              min="10"
                              max="30"
                              value={longBreakDuration}
                              onChange={(e) => setLongBreakDuration(Math.max(10, Math.min(30, parseInt(e.target.value) || 15)))}
                              disabled={isActive}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium">Auto-start breaks</span>
                          <Switch checked={autoStartBreaks} onCheckedChange={setAutoStartBreaks} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium">Auto-start work sessions</span>
                          <Switch checked={autoStartWork} onCheckedChange={setAutoStartWork} />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom" className="m-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <Select value={subject} onValueChange={setSubject} disabled={isActive}>
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
                            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                            <Input
                              type="number"
                              min="1"
                              max="300"
                              value={customDuration}
                              onChange={(e) => setCustomDuration(Math.max(1, Math.min(300, parseInt(e.target.value) || 30)))}
                              disabled={isActive}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Session Goal</label>
                          <Textarea
                            value={focusGoal}
                            onChange={(e) => setFocusGoal(e.target.value)}
                            placeholder="What do you want to accomplish in this session?"
                            disabled={isActive}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Card>
                </div>
                
                {/* Stats Panel */}
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Today's Progress
                    </h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Math.floor(todayStudyTime / 60)}h {todayStudyTime % 60}m</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Study Time</div>
                      </div>
                      
                      {mode === 'pomodoro' && (
                        <div className="text-center">
                          <div className="text-xl font-bold">{completedCycles}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Cycles</div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <Badge variant="secondary" className="flex items-center gap-1 justify-center">
                          <Award className="h-3 w-3" />
                          {todayStudyTime >= 240 ? "Study Champion" : 
                           todayStudyTime >= 120 ? "Focus Master" : 
                           todayStudyTime >= 60 ? "Good Progress" : "Keep Going!"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Quick Settings
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sound alerts</span>
                        <Switch checked={!isMuted} onCheckedChange={(checked) => setIsMuted(!checked)} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tick sound</span>
                        <Switch checked={playTickSound} onCheckedChange={setPlayTickSound} />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Advanced
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Motivation
                    </h4>
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                      "{currentQuote}"
                    </p>
                  </Card>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Completion Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-green-500 text-white p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Session completed!</p>
                <p className="text-sm opacity-90">Great work staying focused!</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
