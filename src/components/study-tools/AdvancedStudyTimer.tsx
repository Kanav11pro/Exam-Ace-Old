
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings, 
  Brain,
  Timer,
  Coffee,
  Target,
  TrendingUp,
  Volume2,
  VolumeX,
  Clock,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useStudyStats } from '@/context/StudyStatsContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type TimerMode = 'focus' | 'pomodoro' | 'study';

interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakAfter: number;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  backgroundSounds: string;
}

interface Session {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
  subject?: string;
}

export const AdvancedStudyTimer = () => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [currentSession, setCurrentSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [subject, setSubject] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [dailySessions, setDailySessions] = useState<Session[]>([]);
  
  const { addStudyTime, addPomodoroSession } = useStudyStats();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [settings, setSettings] = useState<TimerSettings>({
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfter: 4,
    autoStartBreaks: false,
    autoStartSessions: false,
    soundEnabled: true,
    soundVolume: 50,
    backgroundSounds: 'none'
  });

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playSound();
    
    if (mode === 'pomodoro') {
      if (isBreak) {
        // Break completed, start next work session
        setIsBreak(false);
        setCurrentSession(prev => prev + 1);
        setTimeLeft(settings.focusMinutes * 60);
        setTotalTime(settings.focusMinutes * 60);
        if (settings.autoStartSessions) {
          setIsRunning(true);
        }
      } else {
        // Work session completed
        const completedSession: Session = {
          id: Date.now().toString(),
          mode,
          duration: settings.focusMinutes,
          completedAt: new Date(),
          subject
        };
        
        setDailySessions(prev => [...prev, completedSession]);
        setSessionsCompleted(prev => prev + 1);
        
        // Add to study stats
        if (subject) {
          addStudyTime(subject, settings.focusMinutes);
        }
        addPomodoroSession(settings.focusMinutes, subject || 'General');
        
        // Start break
        setIsBreak(true);
        const isLongBreak = sessionsCompleted > 0 && (sessionsCompleted + 1) % settings.longBreakAfter === 0;
        const breakDuration = isLongBreak ? settings.longBreakMinutes : settings.shortBreakMinutes;
        setTimeLeft(breakDuration * 60);
        setTotalTime(breakDuration * 60);
        
        if (settings.autoStartBreaks) {
          setIsRunning(true);
        }
      }
    } else {
      // Focus or Study mode completed
      const completedSession: Session = {
        id: Date.now().toString(),
        mode,
        duration: Math.floor(totalTime / 60),
        completedAt: new Date(),
        subject
      };
      
      setDailySessions(prev => [...prev, completedSession]);
      setSessionsCompleted(prev => prev + 1);
      
      if (subject) {
        addStudyTime(subject, Math.floor(totalTime / 60));
      }
    }
  };

  const playSound = () => {
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.volume = settings.soundVolume / 100;
      audioRef.current.play().catch(console.error);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setIsBreak(false);
    setCurrentSession(1);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setIsBreak(false);
    setCurrentSession(1);
    
    switch (newMode) {
      case 'pomodoro':
        setTimeLeft(settings.focusMinutes * 60);
        setTotalTime(settings.focusMinutes * 60);
        break;
      case 'focus':
        setTimeLeft(50 * 60); // 50 minutes default
        setTotalTime(50 * 60);
        break;
      case 'study':
        setTimeLeft(90 * 60); // 90 minutes default
        setTotalTime(90 * 60);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'pomodoro':
        return {
          name: 'Pomodoro',
          description: 'Focused 25-minute work sessions with breaks',
          color: '#ef4444',
          icon: <Timer className="h-5 w-5" />
        };
      case 'focus':
        return {
          name: 'Deep Focus',
          description: 'Extended focused work sessions',
          color: '#8b5cf6',
          icon: <Brain className="h-5 w-5" />
        };
      case 'study':
        return {
          name: 'Study Session',
          description: 'Comprehensive study periods',
          color: '#10b981',
          icon: <Target className="h-5 w-5" />
        };
    }
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todaySessions = dailySessions.filter(
      session => session.completedAt.toDateString() === today
    );
    
    return {
      totalSessions: todaySessions.length,
      totalMinutes: todaySessions.reduce((sum, session) => sum + session.duration, 0),
      focusSessions: todaySessions.filter(s => s.mode === 'focus').length,
      pomodoroSessions: todaySessions.filter(s => s.mode === 'pomodoro').length,
      studySessions: todaySessions.filter(s => s.mode === 'study').length
    };
  };

  const modeConfig = getModeConfig();
  const todayStats = getTodayStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Advanced Study Timer
        </h1>
        <p className="text-muted-foreground">
          Powerful study timer combining Pomodoro, Deep Focus, and Study Sessions
        </p>
      </div>

      {/* Mode Selection */}
      <Tabs value={mode} onValueChange={(value) => changeMode(value as TimerMode)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pomodoro" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Pomodoro
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Deep Focus
          </TabsTrigger>
          <TabsTrigger value="study" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Study Session
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="text-center space-y-6">
                {/* Current Mode Display */}
                <div className="flex items-center justify-center gap-3">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${modeConfig.color}20` }}
                  >
                    <div style={{ color: modeConfig.color }}>
                      {modeConfig.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold">{modeConfig.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {mode === 'pomodoro' && isBreak ? 'Break Time' : modeConfig.description}
                    </p>
                  </div>
                </div>

                {/* Circular Progress Timer */}
                <div className="w-64 h-64 mx-auto">
                  <CircularProgressbar
                    value={getProgress()}
                    text={formatTime(timeLeft)}
                    styles={buildStyles({
                      textSize: '14px',
                      pathColor: modeConfig.color,
                      textColor: modeConfig.color,
                      trailColor: '#f3f4f6',
                      backgroundColor: '#f8fafc',
                    })}
                  />
                </div>

                {/* Session Info */}
                {mode === 'pomodoro' && (
                  <div className="flex items-center justify-center gap-4">
                    <Badge variant={isBreak ? "secondary" : "default"}>
                      {isBreak ? 'Break' : 'Focus'} Session
                    </Badge>
                    <Badge variant="outline">
                      Session {currentSession}
                    </Badge>
                  </div>
                )}

                {/* Subject Selection */}
                <div className="max-w-xs mx-auto">
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No subject</SelectItem>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="General">General Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!isRunning ? (
                    <Button 
                      onClick={startTimer} 
                      size="lg"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseTimer} 
                      size="lg"
                      variant="secondary"
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetTimer} size="lg" variant="outline">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>

                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button size="lg" variant="outline">
                        <Settings className="h-5 w-5 mr-2" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Timer Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Focus Duration (minutes)</label>
                          <Slider
                            value={[settings.focusMinutes]}
                            onValueChange={([value]) => 
                              setSettings(prev => ({ ...prev, focusMinutes: value }))
                            }
                            max={60}
                            min={15}
                            step={5}
                            className="mt-2"
                          />
                          <span className="text-sm text-muted-foreground">{settings.focusMinutes} minutes</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Sound Notifications</label>
                          <Switch
                            checked={settings.soundEnabled}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, soundEnabled: checked }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Auto-start Breaks</label>
                          <Switch
                            checked={settings.autoStartBreaks}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, autoStartBreaks: checked }))
                            }
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{todayStats.totalSessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{todayStats.totalMinutes}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🍅 Pomodoro</span>
                    <span>{todayStats.pomodoroSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>🧠 Focus</span>
                    <span>{todayStats.focusSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>📚 Study</span>
                    <span>{todayStats.studySessions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Focus Streak</div>
                    <div className="text-xs text-muted-foreground">{sessionsCompleted} sessions today</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Study Time</div>
                    <div className="text-xs text-muted-foreground">{todayStats.totalMinutes} min today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};
