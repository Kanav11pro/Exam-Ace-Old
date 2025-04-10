
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { 
  Sparkles, Clock, Volume2, VolumeX, Play, Pause, RotateCcw, 
  Brain, Leaf, Sun, Heart, Flame, Timer, History, Save, BarChart
} from 'lucide-react';

// Types
interface MeditationSession {
  id: string;
  date: string; // ISO string
  duration: number; // in minutes
  type: 'focus' | 'calm' | 'breathe' | 'gratitude' | 'custom';
  name: string;
  notes?: string;
}

interface MeditationPreset {
  id: string;
  name: string;
  description: string;
  type: 'focus' | 'calm' | 'breathe' | 'gratitude' | 'custom';
  duration: number; // in minutes
  backgroundSound?: string;
  icon: React.ReactNode;
}

export function Mindfulness() {
  // State for meditation session
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [totalTime, setTotalTime] = useState(5 * 60); // 5 minutes in seconds
  const [selectedPreset, setSelectedPreset] = useState<MeditationPreset | null>(null);
  const [activeTab, setActiveTab] = useState('presets');
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [pastSessions, setPastSessions] = useState<MeditationSession[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSessionName, setCustomSessionName] = useState('Custom Meditation');
  const [customDuration, setCustomDuration] = useState(5); // in minutes
  const [customType, setCustomType] = useState<'focus' | 'calm' | 'breathe' | 'gratitude' | 'custom'>('focus');
  const [customNotes, setCustomNotes] = useState('');
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [totalSessionMinutes, setTotalSessionMinutes] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Sample meditation presets
  const meditationPresets: MeditationPreset[] = [
    {
      id: 'focus1',
      name: 'Study Focus',
      description: 'Enhance concentration before study sessions',
      type: 'focus',
      duration: 5, // 5 minutes
      backgroundSound: 'https://cdn.pixabay.com/download/audio/2021/04/07/audio_8f4a08e239.mp3?filename=calming-meditation-music-68-min-5816.mp3',
      icon: <Brain className="h-5 w-5 text-purple-500" />
    },
    {
      id: 'calm1',
      name: 'Exam Calm',
      description: 'Reduce test anxiety and clear your mind',
      type: 'calm',
      duration: 7, // 7 minutes
      backgroundSound: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d2e1996d0f.mp3?filename=light-rain-ambient-114354.mp3',
      icon: <Sun className="h-5 w-5 text-amber-500" />
    },
    {
      id: 'breathe1',
      name: 'Deep Breathing',
      description: 'Simple breath awareness meditation',
      type: 'breathe',
      duration: 3, // 3 minutes
      backgroundSound: 'https://cdn.pixabay.com/download/audio/2020/10/11/audio_fe4a3bb15d.mp3?filename=calming-meditation-112818.mp3',
      icon: <Leaf className="h-5 w-5 text-green-500" />
    },
    {
      id: 'gratitude1',
      name: 'Gratitude Practice',
      description: 'Develop a positive mindset for better learning',
      type: 'gratitude',
      duration: 5, // 5 minutes
      backgroundSound: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f8efd8e.mp3?filename=mindfulness-relaxation-amp-meditation-music-22165.mp3',
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      id: 'focus2',
      name: 'Quick Refocus',
      description: 'Rapid centering exercise between study topics',
      type: 'focus',
      duration: 2, // 2 minutes
      backgroundSound: 'https://cdn.pixabay.com/download/audio/2021/04/07/audio_8f4a08e239.mp3?filename=calming-meditation-music-68-min-5816.mp3',
      icon: <Flame className="h-5 w-5 text-orange-500" />
    }
  ];
  
  // Load past sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('jeeMindfulnessSessions');
    if (savedSessions) {
      try {
        setPastSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error('Error loading mindfulness sessions:', e);
        setPastSessions([]);
      }
    }
    
    // Load streak data
    const savedStats = localStorage.getItem('jeeMindfulnessStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setTotalSessionMinutes(stats.totalMinutes || 0);
        setCurrentStreak(stats.currentStreak || 0);
      } catch (e) {
        console.error('Error loading mindfulness stats:', e);
      }
    }
  }, []);
  
  // Save sessions to localStorage
  useEffect(() => {
    if (pastSessions.length > 0) {
      localStorage.setItem('jeeMindfulnessSessions', JSON.stringify(pastSessions));
    }
  }, [pastSessions]);
  
  // Save stats to localStorage
  useEffect(() => {
    const stats = {
      totalMinutes: totalSessionMinutes,
      currentStreak
    };
    localStorage.setItem('jeeMindfulnessStats', JSON.stringify(stats));
  }, [totalSessionMinutes, currentStreak]);
  
  // Handle audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          
          // If time is up
          if (newTime >= totalTime) {
            clearInterval(intervalRef.current!);
            completeSession();
            return totalTime;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, totalTime]);
  
  // Handle selecting a preset
  const selectPreset = (preset: MeditationPreset) => {
    setSelectedPreset(preset);
    setTotalTime(preset.duration * 60); // Convert minutes to seconds
    setElapsedTime(0);
    setIsActive(false);
    setIsPaused(false);
    setIsSessionComplete(false);
    
    // Set audio if available
    if (preset.backgroundSound && audioRef.current) {
      audioRef.current.src = preset.backgroundSound;
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  };
  
  // Start or pause meditation session
  const toggleSession = () => {
    if (!isActive) {
      // Start session
      setIsActive(true);
      setIsPaused(false);
      
      // Play audio if available
      if (selectedPreset?.backgroundSound && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      
      toast({
        title: "Session Started",
        description: `${selectedPreset?.name || 'Meditation'} session has begun.`,
      });
    } else if (isPaused) {
      // Resume session
      setIsPaused(false);
      
      // Resume audio if available
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    } else {
      // Pause session
      setIsPaused(true);
      
      // Pause audio if available
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };
  
  // Reset meditation session
  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setElapsedTime(0);
    setIsSessionComplete(false);
    
    // Reset audio if available
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // Complete meditation session
  const completeSession = () => {
    setIsActive(false);
    setIsSessionComplete(true);
    
    // Fade out audio if available
    if (audioRef.current) {
      // Gradually decrease volume to create a fade effect
      const fadeAudio = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.1) {
          audioRef.current.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      }, 100);
    }
    
    // Save session
    const newSession: MeditationSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: selectedPreset?.duration || Math.ceil(totalTime / 60),
      type: selectedPreset?.type || customType,
      name: selectedPreset?.name || customSessionName,
      notes: customNotes || undefined
    };
    
    setPastSessions(prev => [newSession, ...prev]);
    
    // Update total minutes
    setTotalSessionMinutes(prev => prev + newSession.duration);
    
    // Update streak
    updateStreak();
    
    toast({
      title: "Session Complete",
      description: `You've completed your ${newSession.duration} minute meditation.`,
    });
  };
  
  // Update meditation streak
  const updateStreak = () => {
    if (pastSessions.length === 0) {
      setCurrentStreak(1);
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const lastSessionDate = new Date(pastSessions[0].date).toISOString().split('T')[0];
    
    // If already meditated today, don't update streak
    if (lastSessionDate === today) return;
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // If meditated yesterday, increment streak
    if (lastSessionDate === yesterdayStr) {
      setCurrentStreak(prev => prev + 1);
    } else {
      // Streak broken, reset to 1
      setCurrentStreak(1);
    }
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Get progress percentage
  const getProgress = () => {
    return (elapsedTime / totalTime) * 100;
  };
  
  // Start custom session
  const startCustomSession = () => {
    if (customDuration <= 0) {
      toast({
        title: "Invalid Duration",
        description: "Please set a valid duration greater than 0 minutes.",
        variant: "destructive"
      });
      return;
    }
    
    setTotalTime(customDuration * 60); // Convert minutes to seconds
    setElapsedTime(0);
    setIsActive(false);
    setIsPaused(false);
    setIsSessionComplete(false);
    setSelectedPreset(null);
    setShowCustomForm(false);
    
    // Set default audio
    if (audioRef.current) {
      audioRef.current.src = 'https://cdn.pixabay.com/download/audio/2021/04/07/audio_8f4a08e239.mp3?filename=calming-meditation-music-68-min-5816.mp3';
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    
    toast({
      title: "Custom Session Created",
      description: `${customSessionName} (${customDuration} min) is ready to start.`,
    });
  };
  
  // Get color for session type
  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'focus':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'calm':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'breathe':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'gratitude':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <audio ref={audioRef} loop />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mindfulness Meditation</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Reduce study stress and improve focus with guided meditation sessions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Active session display */}
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="mb-6 relative w-64 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold font-mono">
                    {formatTime(isActive ? totalTime - elapsedTime : totalTime)}
                  </div>
                </div>
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-gray-100 dark:text-gray-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * getProgress()) / 100}
                    className="text-primary"
                  />
                </svg>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-1">
                  {selectedPreset?.name || customSessionName || 'Meditation Session'}
                </h2>
                <div className="flex justify-center">
                  <Badge className={getSessionTypeColor(selectedPreset?.type || customType)}>
                    {selectedPreset?.type || customType}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-10 w-10"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="w-24"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={toggleSession}
                  disabled={isSessionComplete}
                  className={isActive && !isPaused ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  {!isActive ? (
                    <>
                      <Play className="mr-2 h-5 w-5" /> Start
                    </>
                  ) : isPaused ? (
                    <>
                      <Play className="mr-2 h-5 w-5" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-5 w-5" /> Pause
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetSession}
                  disabled={!isActive && !isPaused && elapsedTime === 0}
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
              </div>
              
              {isSessionComplete && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg text-center animate-fade-in">
                  <Sparkles className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium mb-1">Session Complete!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Great job taking time for your mental wellbeing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Session selection */}
          <Card>
            <CardHeader className="pb-3">
              <Tabs defaultValue="presets" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="presets">Meditation Presets</TabsTrigger>
                  <TabsTrigger value="history">Session History</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="presets" className="mt-0">
                <div className="space-y-4">
                  {showCustomForm ? (
                    <div className="bg-accent/20 p-4 rounded-lg animate-fade-in">
                      <h3 className="font-medium mb-4">Create Custom Meditation</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="session-name">Session Name</Label>
                          <Input
                            id="session-name"
                            value={customSessionName}
                            onChange={(e) => setCustomSessionName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="session-duration">Duration (minutes)</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Slider
                              id="session-duration"
                              min={1}
                              max={30}
                              step={1}
                              value={[customDuration]}
                              onValueChange={(value) => setCustomDuration(value[0])}
                              className="flex-1"
                            />
                            <span className="font-medium w-10 text-right">{customDuration}</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="session-type">Session Type</Label>
                          <select
                            id="session-type"
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value as any)}
                            className="w-full mt-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded px-3 py-2"
                          >
                            <option value="focus">Focus</option>
                            <option value="calm">Calm</option>
                            <option value="breathe">Breathing</option>
                            <option value="gratitude">Gratitude</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="session-notes">Notes (Optional)</Label>
                          <Input
                            id="session-notes"
                            value={customNotes}
                            onChange={(e) => setCustomNotes(e.target.value)}
                            placeholder="What would you like to focus on in this session?"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" onClick={() => setShowCustomForm(false)}>
                            Cancel
                          </Button>
                          <Button onClick={startCustomSession}>
                            Create Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Select a meditation session</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowCustomForm(true)}
                        >
                          Create Custom
                        </Button>
                      </div>
                      
                      {meditationPresets.map(preset => (
                        <Card 
                          key={preset.id} 
                          className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                            selectedPreset?.id === preset.id ? 'border-primary' : ''
                          }`}
                          onClick={() => selectPreset(preset)}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                {preset.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{preset.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {preset.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className={getSessionTypeColor(preset.type)}>
                                {preset.duration} min
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                {pastSessions.length > 0 ? (
                  <div className="space-y-3">
                    {pastSessions.slice(0, 10).map(session => (
                      <div 
                        key={session.id} 
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{session.name}</h4>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(session.date)}</span>
                              <span className="mx-1">•</span>
                              <span>{session.duration} min</span>
                            </div>
                          </div>
                          <Badge className={getSessionTypeColor(session.type)}>
                            {session.type}
                          </Badge>
                        </div>
                        
                        {session.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 italic">
                            "{session.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                    
                    {pastSessions.length > 10 && (
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        +{pastSessions.length - 10} more sessions
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <History className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-sm font-medium mb-1">No sessions yet</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your completed meditation sessions will appear here
                    </p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Meditation Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Current Streak:</span>
                <span className="font-medium">{currentStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Sessions:</span>
                <span className="font-medium">{pastSessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Time:</span>
                <span className="font-medium">{totalSessionMinutes} minutes</span>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                {pastSessions.length > 0 ? (
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - i));
                      const dateStr = date.toISOString().split('T')[0];
                      
                      const sessionOnDate = pastSessions.some(session => 
                        session.date.split('T')[0] === dateStr
                      );
                      
                      return (
                        <div 
                          key={i} 
                          className={`h-6 rounded-sm ${
                            sessionOnDate 
                              ? 'bg-green-500' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          title={dateStr}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No activity yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mindfulness Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Improved Focus</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Regular meditation enhances attention span and concentration
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Sun className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Reduced Stress</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Lower anxiety levels and better emotional regulation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Better Memory</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Improved retention and recall of study material
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Flame className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Exam Performance</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Reduced test anxiety and clearer thinking during exams
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full text-xs" size="sm">
                Learn more about mindfulness benefits
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                Quick Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Need a quick meditation break? Choose a duration:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 5].map(mins => (
                    <Button 
                      key={mins} 
                      variant="outline"
                      onClick={() => {
                        setTotalTime(mins * 60);
                        setElapsedTime(0);
                        setIsActive(false);
                        setIsPaused(false);
                        setIsSessionComplete(false);
                        setSelectedPreset(null);
                        setCustomSessionName(`${mins} Minute Break`);
                        setCustomType('focus');
                        
                        toast({
                          title: `${mins} Minute Session Ready`,
                          description: "Press start when you're ready to begin.",
                        });
                      }}
                    >
                      {mins} min
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Mindfulness for Students</CardTitle>
            <CardDescription>
              Practicing mindfulness can significantly improve your academic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">How to Practice</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Find a quiet place where you won't be disturbed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Sit comfortably with your back straight</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Close your eyes or maintain a soft gaze</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Focus on your breath, noticing each inhale and exhale</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">5.</span>
                    <span>When your mind wanders, gently bring your attention back to your breath</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">When to Practice</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Before beginning a study session to clear your mind</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>During breaks between difficult topics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>When feeling overwhelmed or experiencing information overload</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Before exams or tests to reduce anxiety</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>At the end of the day to improve sleep quality</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
