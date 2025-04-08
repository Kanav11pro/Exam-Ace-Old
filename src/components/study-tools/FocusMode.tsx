
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useStudyStats } from '@/context/StudyStatsContext';
import { Focus, MessageSquare, Volume2, VolumeX, Clock, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function FocusMode() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [focusMessage, setFocusMessage] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [motivationalQuotes, setMotivationalQuotes] = useState<string[]>([
    "The expert in anything was once a beginner.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The secret of success is to do the common things uncommonly well.",
    "Don't wish it were easier; wish you were better.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Believe you can and you're halfway there.",
    "It always seems impossible until it's done.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Your time is limited, don't waste it living someone else's life.",
    "The best way to predict the future is to create it."
  ]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showDND, setShowDND] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { addStudyTime } = useStudyStats();
  const intervalRef = useRef<number | null>(null);
  
  // Change quote periodically
  useEffect(() => {
    if (motivationalQuotes.length > 0) {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      
      const quoteInterval = setInterval(() => {
        setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      }, 30000); // Change quote every 30 seconds
      
      return () => clearInterval(quoteInterval);
    }
  }, [motivationalQuotes]);
  
  // Handle fullscreen
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
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      // Timer completed
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      
      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      
      // Play sound if not muted
      if (!isMuted && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      
      // Record focus session
      addStudyTime("Focus Session", focusMessage || "Deep Focus", timerMinutes);
      
      toast({
        title: "Focus session completed!",
        description: `You've completed ${timerMinutes} minutes of focused study.`,
      });
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, secondsLeft, isMuted, timerMinutes, focusMessage, addStudyTime, toast]);
  
  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start or pause timer
  const toggleTimer = () => {
    if (isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      // If timer was reset, initialize seconds
      if (secondsLeft === 0) {
        setSecondsLeft(timerMinutes * 60);
      }
    }
    setIsActive(!isActive);
    setShowSettings(false);
  };
  
  // Reset timer
  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setSecondsLeft(timerMinutes * 60);
    setShowSettings(true);
  };
  
  // Update timer when minutes change
  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(timerMinutes * 60);
    }
  }, [timerMinutes, isActive]);
  
  return (
    <div 
      ref={containerRef} 
      className={`bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-lg shadow-xl transition-all duration-500 animate-fade-in ${
        isFullscreen ? 'fixed inset-0 z-50 flex items-center justify-center overflow-hidden rounded-none' : 'min-h-[500px] relative'
      }`}
    >
      <audio ref={audioRef} src="/notification.mp3" />
      
      <div className="absolute top-4 right-4 flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:bg-white/10"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/10"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Focus className="h-8 w-8" />
            Focus Mode
          </h2>
          <p className="text-white/70">Eliminate distractions and enhance your concentration</p>
        </div>
        
        {showSettings && (
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Focus Session Duration (minutes)</label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 25)))}
                  className="bg-white/20 border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-white">What are you focusing on?</label>
                <Textarea
                  value={focusMessage}
                  onChange={(e) => setFocusMessage(e.target.value)}
                  placeholder="E.g., 'Solving Physics problems' or 'Studying Organic Chemistry'"
                  className="bg-white/20 border-white/20 text-white min-h-[100px]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="dnd-mode"
                  checked={showDND}
                  onCheckedChange={setShowDND}
                />
                <label htmlFor="dnd-mode" className="text-sm text-white cursor-pointer">
                  Show "Do Not Disturb" message
                </label>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          {isActive && showDND && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Card className="bg-red-500/20 border-red-500/30 backdrop-blur-sm p-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-300" />
                <span className="text-sm">Do Not Disturb - Focus Session in Progress</span>
              </Card>
            </motion.div>
          )}
          
          <motion.div
            animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
            className="text-7xl font-mono font-bold mb-8 tracking-widest"
          >
            {formatTime(secondsLeft)}
          </motion.div>
          
          {focusMessage && isActive && (
            <div className="mb-6 px-4 py-2 bg-white/10 rounded-full inline-block animate-fade-in">
              <p className="text-sm">{focusMessage}</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              onClick={toggleTimer}
              size="lg"
              className={`w-32 transition-transform hover:scale-105 ${
                isActive 
                  ? 'bg-amber-500 hover:bg-amber-600' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isActive ? 'Pause' : secondsLeft === timerMinutes * 60 ? 'Start' : 'Resume'}
            </Button>
            
            <Button 
              onClick={resetTimer} 
              variant="outline" 
              size="lg"
              className="w-32 border-white/30 text-white hover:bg-white/10"
            >
              Reset
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-md mx-auto"
          >
            <p className="text-white/80 italic text-sm">"{currentQuote}"</p>
          </motion.div>
        </div>
      </div>
      
      {/* Completion notification */}
      {showNotification && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="bg-green-500 text-white p-4 flex items-center gap-3">
            <Clock className="h-5 w-5" />
            <div>
              <p className="font-medium">Focus session completed!</p>
              <p className="text-sm opacity-90">Great job staying focused for {timerMinutes} minutes.</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
