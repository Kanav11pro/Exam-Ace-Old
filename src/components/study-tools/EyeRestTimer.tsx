
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Eye, Bell, Volume2, VolumeX, Clock, PlayCircle, PauseCircle, RotateCcw, Calculator } from 'lucide-react';

export function EyeRestTimer() {
  // 20-20-20 rule settings
  const DEFAULT_WORK_MINUTES = 20;
  const DEFAULT_REST_SECONDS = 20;
  const DEFAULT_LOOK_DISTANCE_FEET = 20;
  
  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK_MINUTES * 60);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST_SECONDS);
  const [lookDistanceFeet, setLookDistanceFeet] = useState(DEFAULT_LOOK_DISTANCE_FEET);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [totalCycles, setTotalCycles] = useState(0);
  const [totalWorkMinutes, setTotalWorkMinutes] = useState(0);
  
  // Timer refs
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  
  // Load timer settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('jeeEyeRestTimerSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setWorkMinutes(settings.workMinutes || DEFAULT_WORK_MINUTES);
        setRestSeconds(settings.restSeconds || DEFAULT_REST_SECONDS);
        setLookDistanceFeet(settings.lookDistanceFeet || DEFAULT_LOOK_DISTANCE_FEET);
        setSoundEnabled(settings.soundEnabled !== undefined ? settings.soundEnabled : true);
        setNotificationsEnabled(settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : true);
        
        // Initialize timeLeft based on saved workMinutes
        setTimeLeft((settings.workMinutes || DEFAULT_WORK_MINUTES) * 60);
      } catch (e) {
        console.error('Error loading eye rest timer settings:', e);
      }
    }
  }, []);
  
  // Load timer stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('jeeEyeRestTimerStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setTotalCycles(stats.totalCycles || 0);
        setTotalWorkMinutes(stats.totalWorkMinutes || 0);
      } catch (e) {
        console.error('Error loading eye rest timer stats:', e);
      }
    }
  }, []);
  
  // Save timer settings to localStorage
  useEffect(() => {
    const settings = {
      workMinutes,
      restSeconds,
      lookDistanceFeet,
      soundEnabled,
      notificationsEnabled
    };
    localStorage.setItem('jeeEyeRestTimerSettings', JSON.stringify(settings));
  }, [workMinutes, restSeconds, lookDistanceFeet, soundEnabled, notificationsEnabled]);
  
  // Save timer stats to localStorage
  useEffect(() => {
    const stats = {
      totalCycles,
      totalWorkMinutes
    };
    localStorage.setItem('jeeEyeRestTimerStats', JSON.stringify(stats));
  }, [totalCycles, totalWorkMinutes]);
  
  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up
            clearInterval(intervalRef.current!);
            
            // Play sound if enabled
            if (soundEnabled && audioRef.current) {
              audioRef.current.play().catch(e => console.error("Failed to play audio:", e));
            }
            
            // Show notification if enabled
            if (notificationsEnabled) {
              if (isRestPhase) {
                toast({
                  title: "Rest Complete!",
                  description: "You can continue working now.",
                });
                
                // Start work phase
                setIsRestPhase(false);
                setTotalCycles(prev => prev + 1);
                return workMinutes * 60;
              } else {
                toast({
                  title: "Time to rest your eyes!",
                  description: `Look at something ${lookDistanceFeet} feet away for ${restSeconds} seconds.`,
                  duration: 5000,
                });
                
                // Start rest phase
                setIsRestPhase(true);
                setTotalWorkMinutes(prev => prev + workMinutes);
                return restSeconds;
              }
            }
            
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, isRestPhase, workMinutes, restSeconds, lookDistanceFeet, soundEnabled, notificationsEnabled, toast]);
  
  // Handle start/pause timer
  const toggleTimer = () => {
    if (!isActive) {
      // Starting the timer
      setIsActive(true);
      setIsPaused(false);
      setIsRestPhase(false);
      setTimeLeft(workMinutes * 60);
    } else if (isPaused) {
      // Resuming the timer
      setIsPaused(false);
    } else {
      // Pausing the timer
      setIsPaused(true);
    }
  };
  
  // Handle reset timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setIsPaused(false);
    setIsRestPhase(false);
    setTimeLeft(workMinutes * 60);
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Update workMinutes
  const updateWorkMinutes = (value: number[]) => {
    const newWorkMinutes = value[0];
    setWorkMinutes(newWorkMinutes);
    
    // If timer is not active, update the timeLeft as well
    if (!isActive) {
      setTimeLeft(newWorkMinutes * 60);
    }
  };
  
  // Get the timer label based on current state
  const getTimerLabel = () => {
    if (!isActive) return "Start Timer";
    if (isPaused) return "Resume";
    if (isRestPhase) return "Rest Time";
    return "Working";
  };
  
  // Calculate timer progress
  const calculateProgress = () => {
    const maxTime = isRestPhase ? restSeconds : workMinutes * 60;
    return ((maxTime - timeLeft) / maxTime) * 100;
  };
  
  // Request permission for notifications
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser does not support desktop notifications.",
        variant: "destructive",
      });
      return;
    }
    
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        toast({
          title: "Notifications enabled",
          description: "You will now receive eye rest reminders.",
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You will not receive eye rest reminders.",
          variant: "destructive",
        });
        setNotificationsEnabled(false);
      }
    }
  };
  
  // Enable notifications when the switch is toggled on
  useEffect(() => {
    if (notificationsEnabled) {
      requestNotificationPermission();
    }
  }, [notificationsEnabled]);
  
  // Convert feet to meters
  const feetToMeters = (feet: number) => {
    return (feet * 0.3048).toFixed(1);
  };
  
  return (
    <div className="container max-w-4xl py-6">
      <audio ref={audioRef} src="/notification.mp3" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Eye Rest Timer (20-20-20 Rule)</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Prevent eye strain by following the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-64 h-64 mb-6">
                <CircularProgressbar
                  value={calculateProgress()}
                  text={formatTime(timeLeft)}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: isRestPhase ? '#10b981' : '#3b82f6',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)',
                    pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                  })}
                />
              </div>
              
              <div className="text-center mb-6">
                <div className="text-lg font-semibold">
                  {isRestPhase ? (
                    <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                      <Eye className="mr-2 h-5 w-5" />
                      Eye Rest Time
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Clock className="mr-2 h-5 w-5" />
                      Work Time
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isRestPhase
                    ? `Look at something ${lookDistanceFeet} feet (${feetToMeters(lookDistanceFeet)} meters) away`
                    : `Next break in ${formatTime(timeLeft)}`}
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  className={isRestPhase ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {!isActive || isPaused ? (
                    <PlayCircle className="mr-2 h-5 w-5" />
                  ) : (
                    <PauseCircle className="mr-2 h-5 w-5" />
                  )}
                  {getTimerLabel()}
                </Button>
                <Button variant="outline" size="lg" onClick={resetTimer} disabled={!isActive}>
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="work-minutes">Work Minutes</Label>
                  <span className="text-sm font-medium">{workMinutes} min</span>
                </div>
                <Slider
                  id="work-minutes"
                  min={5}
                  max={60}
                  step={5}
                  value={[workMinutes]}
                  onValueChange={updateWorkMinutes}
                  disabled={isActive && !isPaused}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rest-seconds">Rest Seconds</Label>
                  <span className="text-sm font-medium">{restSeconds} sec</span>
                </div>
                <Slider
                  id="rest-seconds"
                  min={10}
                  max={60}
                  step={5}
                  value={[restSeconds]}
                  onValueChange={(value) => setRestSeconds(value[0])}
                  disabled={isActive && !isPaused}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="look-distance">Look Distance</Label>
                  <span className="text-sm font-medium">{lookDistanceFeet} ft</span>
                </div>
                <Slider
                  id="look-distance"
                  min={10}
                  max={40}
                  step={5}
                  value={[lookDistanceFeet]}
                  onValueChange={(value) => setLookDistanceFeet(value[0])}
                  disabled={isActive && !isPaused}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Look at something {lookDistanceFeet} feet ({feetToMeters(lookDistanceFeet)} meters) away during rest.
                </p>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="notifications" className="cursor-pointer">
                      Notifications
                    </Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-gray-500" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-gray-500" />
                    )}
                    <Label htmlFor="sound" className="cursor-pointer">
                      Sound Alerts
                    </Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Completed Cycles:</span>
                  <span className="font-medium">{totalCycles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Work Time:</span>
                  <span className="font-medium">{totalWorkMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Eye Rest Breaks:</span>
                  <span className="font-medium">{totalCycles}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setTotalCycles(0);
                  setTotalWorkMinutes(0);
                  toast({
                    title: "Stats Reset",
                    description: "Your eye rest timer statistics have been reset.",
                  });
                }}
              >
                Reset Stats
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About the 20-20-20 Rule</CardTitle>
          <CardDescription>
            Tips for reducing eye strain during long study sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Every 20 Minutes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Take a break from looking at your screen every 20 minutes of continuous work to prevent eye fatigue.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Eye className="mr-2 h-5 w-5 text-green-500" />
                Look 20 Feet Away
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Focus on an object at least 20 feet (6 meters) away to relax the focusing muscles in your eyes.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Bell className="mr-2 h-5 w-5 text-amber-500" />
                For 20 Seconds
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Keep looking at the distant object for at least 20 seconds to give your eyes sufficient rest time.
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="font-medium mb-2">Additional Eye Care Tips</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Ensure proper lighting to reduce screen glare
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Adjust your screen brightness to match your surroundings
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Position your screen about an arm's length away (20-26 inches)
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Blink frequently to keep your eyes moist
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Consider using blue light filtering glasses for extended screen time
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
