import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Volume2, VolumeX, PlayCircle, PauseCircle, SkipForward, SkipBack, TimerReset, Music, Waves, Brain, Timer } from 'lucide-react';

// Define music track types
interface Track {
  id: string;
  title: string;
  type: 'focus' | 'ambient' | 'binaural';
  duration: number; // in seconds
  url: string;
  description: string;
}

// Sample tracks data
const tracks: Track[] = [
  {
    id: 'focus1',
    title: 'Deep Focus',
    type: 'focus',
    duration: 3600, // 60 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_417f254764.mp3?filename=lofi-study-112191.mp3',
    description: 'Instrumental focus music to help you concentrate'
  },
  {
    id: 'focus2',
    title: 'Productivity Boost',
    type: 'focus',
    duration: 2700, // 45 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_28f50674bc.mp3?filename=lofi-chill-14093.mp3',
    description: 'Upbeat instrumental to increase your productivity'
  },
  {
    id: 'focus3',
    title: 'Study Session',
    type: 'focus',
    duration: 2400, // 40 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c9d43cf074.mp3?filename=lofi-study-beats-14092.mp3',
    description: 'Lo-fi beats perfect for study sessions'
  },
  {
    id: 'ambient1',
    title: 'Nature Sounds',
    type: 'ambient',
    duration: 3000, // 50 minutes
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb7b89a226.mp3?filename=birds-in-forest-with-flowing-stream-nature-sounds-8052.mp3',
    description: 'Calming forest sounds with birds and flowing water'
  },
  {
    id: 'ambient2',
    title: 'Rainy Evening',
    type: 'ambient',
    duration: 2700, // 45 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d2e1996d0f.mp3?filename=light-rain-ambient-114354.mp3',
    description: 'Gentle rain sounds for relaxed concentration'
  },
  {
    id: 'ambient3',
    title: 'Cafe Atmosphere',
    type: 'ambient',
    duration: 2400, // 40 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_7816bc67a1.mp3?filename=coffee-shop-ambience-16110.mp3',
    description: 'Coffee shop ambience with soft conversations'
  },
  {
    id: 'binaural1',
    title: 'Alpha Waves',
    type: 'binaural',
    duration: 3600, // 60 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_31c5ee0da1.mp3?filename=healing-meditation-10-min-theta-binauralbeat-121520.mp3',
    description: '8-12 Hz binaural beats for focused attention'
  },
  {
    id: 'binaural2',
    title: 'Theta Waves',
    type: 'binaural',
    duration: 1800, // 30 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_31c5ee0da1.mp3?filename=healing-meditation-10-min-theta-binauralbeat-121520.mp3',
    description: '4-8 Hz binaural beats for deep concentration'
  },
  {
    id: 'binaural3',
    title: 'Gamma Focus',
    type: 'binaural',
    duration: 2700, // 45 minutes
    url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_31c5ee0da1.mp3?filename=healing-meditation-10-min-theta-binauralbeat-121520.mp3',
    description: '30-50 Hz binaural beats for peak mental activity'
  }
];

export function StudyMusic() {
  const [activeTab, setActiveTab] = useState<string>('focus');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25); // in minutes
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [playHistory, setPlayHistory] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  
  // Filter tracks by type
  const filteredTracks = tracks.filter(track => track.type === activeTab);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Add event listeners
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', handleTrackEnd);
      
      // Set initial volume
      audioRef.current.volume = volume / 100;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);
  
  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('jeeStudyMusicState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setActiveTab(state.activeTab || 'focus');
        setVolume(state.volume || 80);
        setAutoplayEnabled(state.autoplayEnabled !== undefined ? state.autoplayEnabled : true);
        setPlayHistory(state.playHistory || []);
        
        if (state.currentTrackId) {
          const track = tracks.find(t => t.id === state.currentTrackId);
          if (track) {
            setCurrentTrack(track);
            // Don't autoplay, just set up the track
            if (audioRef.current) {
              audioRef.current.src = track.url;
              audioRef.current.currentTime = state.currentTime || 0;
              setCurrentTime(state.currentTime || 0);
            }
          }
        }
      } catch (e) {
        console.error('Error loading study music state:', e);
      }
    }
  }, []);
  
  // Save state to localStorage
  useEffect(() => {
    if (currentTrack) {
      const state = {
        activeTab,
        volume,
        currentTrackId: currentTrack.id,
        currentTime,
        autoplayEnabled,
        playHistory
      };
      localStorage.setItem('jeeStudyMusicState', JSON.stringify(state));
    }
  }, [activeTab, volume, currentTrack, currentTime, autoplayEnabled, playHistory]);
  
  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  // Handler for track end
  const handleTrackEnd = () => {
    if (autoplayEnabled) {
      playNextTrack();
    } else {
      setIsPlaying(false);
    }
  };
  
  // Update progress bar and currentTime
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Format time (seconds) to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Play a specific track
  const playTrack = (track: Track) => {
    if (currentTrack && currentTrack.id === track.id) {
      // Toggle play/pause of current track
      togglePlayPause();
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.currentTime = 0;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setCurrentTrack(track);
            setCurrentTime(0);
            setDuration(track.duration);
            
            // Add to play history
            setPlayHistory(prev => {
              const newHistory = [...prev];
              // Remove the track if it's already in history
              const existingIndex = newHistory.indexOf(track.id);
              if (existingIndex !== -1) {
                newHistory.splice(existingIndex, 1);
              }
              // Add to the beginning of history
              newHistory.unshift(track.id);
              // Keep only last 10 tracks
              return newHistory.slice(0, 10);
            });
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            toast({
              title: "Playback error",
              description: "Could not play the selected track.",
              variant: "destructive",
            });
          });
      }
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast({
            title: "Playback error",
            description: "Could not play the track.",
            variant: "destructive",
          });
        });
    }
  };
  
  // Play next track
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    playTrack(filteredTracks[nextIndex]);
  };
  
  // Play previous track
  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
    playTrack(filteredTracks[prevIndex]);
  };
  
  // Seek to position in track
  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Start sleep timer
  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    const seconds = timerDuration * 60;
    setTimerRemaining(seconds);
    setTimerActive(true);
    
    timerIntervalRef.current = window.setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          // Timer finished
          clearInterval(timerIntervalRef.current!);
          setTimerActive(false);
          
          // Stop music
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          
          toast({
            title: "Timer Completed",
            description: "Music playback has stopped.",
          });
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast({
      title: "Timer Started",
      description: `Music will stop in ${timerDuration} minutes.`,
    });
  };
  
  // Cancel sleep timer
  const cancelTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerActive(false);
    
    toast({
      title: "Timer Cancelled",
      description: "Sleep timer has been cancelled.",
    });
  };
  
  // Format timer display
  const formatTimerDisplay = () => {
    const minutes = Math.floor(timerRemaining / 60);
    const seconds = timerRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container max-w-5xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Study Music</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Enhance your focus and concentration with specially curated audio tracks
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Audio Player</CardTitle>
              <CardDescription>
                Select a track from the categories below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="focus" className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      <span className="hidden sm:inline">Focus Music</span>
                      <span className="sm:hidden">Focus</span>
                    </TabsTrigger>
                    <TabsTrigger value="ambient" className="flex items-center gap-2">
                      <Waves className="h-4 w-4" />
                      <span className="hidden sm:inline">Ambient Sounds</span>
                      <span className="sm:hidden">Ambient</span>
                    </TabsTrigger>
                    <TabsTrigger value="binaural" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="hidden sm:inline">Binaural Beats</span>
                      <span className="sm:hidden">Binaural</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="focus" className="mt-4">
                    <div className="space-y-3">
                      {filteredTracks.map(track => (
                        <Card 
                          key={track.id} 
                          className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                            currentTrack?.id === track.id ? 'border-primary' : ''
                          }`}
                          onClick={() => playTrack(track)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center mr-3">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <PauseCircle className="h-6 w-6 text-primary" />
                                ) : (
                                  <PlayCircle className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{track.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {track.description}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(track.duration)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ambient" className="mt-4">
                    <div className="space-y-3">
                      {filteredTracks.map(track => (
                        <Card 
                          key={track.id} 
                          className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                            currentTrack?.id === track.id ? 'border-primary' : ''
                          }`}
                          onClick={() => playTrack(track)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center mr-3">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <PauseCircle className="h-6 w-6 text-primary" />
                                ) : (
                                  <PlayCircle className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{track.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {track.description}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(track.duration)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="binaural" className="mt-4">
                    <div className="space-y-3">
                      {filteredTracks.map(track => (
                        <Card 
                          key={track.id} 
                          className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                            currentTrack?.id === track.id ? 'border-primary' : ''
                          }`}
                          onClick={() => playTrack(track)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center mr-3">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <PauseCircle className="h-6 w-6 text-primary" />
                                ) : (
                                  <PlayCircle className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{track.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {track.description}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(track.duration)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Player controls */}
              <Card className="bg-gradient-to-r from-accent to-accent/40">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">
                      {currentTrack ? currentTrack.title : 'Select a track to play'}
                    </h3>
                    {currentTrack && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentTrack.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 1}
                      step={1}
                      onValueChange={seekTo}
                      disabled={!currentTrack}
                      className="flex-1 mx-2"
                    />
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="h-9 w-9"
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
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playPreviousTrack}
                        disabled={!currentTrack}
                        className="h-9 w-9"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        size="icon"
                        onClick={togglePlayPause}
                        disabled={!currentTrack}
                        className="h-12 w-12 rounded-full"
                      >
                        {isPlaying ? (
                          <PauseCircle className="h-8 w-8" />
                        ) : (
                          <PlayCircle className="h-8 w-8" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playNextTrack}
                        disabled={!currentTrack}
                        className="h-9 w-9"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {timerActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelTimer}
                          className="text-xs"
                        >
                          <TimerReset className="h-3 w-3 mr-1" />
                          {formatTimerDisplay()}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startTimer()}
                          disabled={!isPlaying}
                          className="text-xs"
                        >
                          <Timer className="h-3 w-3 mr-1" />
                          Sleep Timer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Music for Studying: Science-Backed Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Focus Music</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Instrumental music without lyrics can help maintain concentration by providing background 
                    stimulation without the distraction of words. Studies show that instrumental music can
                    increase focus and productivity during study sessions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Ambient Sounds</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Natural sounds like rainfall or gentle forest ambience can mask distracting noises and
                    create a consistent audio environment. Research indicates that nature sounds can reduce
                    stress and enhance cognitive performance.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Binaural Beats</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    These auditory processing artifacts create the perception of a third "beat" when two
                    slightly different frequencies are played in each ear. Some studies suggest that 
                    they may enhance focus, reduce anxiety, and promote specific brainwave states.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Study Tips</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    For optimal results, keep the volume low (background level), use headphones for binaural beats,
                    and experiment to find what works best for you. Music affects everyone differently, so find your
                    personal study soundtrack.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Player Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="autoplay" className="cursor-pointer">Autoplay Next Track</Label>
                  <Switch
                    id="autoplay"
                    checked={autoplayEnabled}
                    onCheckedChange={setAutoplayEnabled}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically play the next track when current one ends
                </p>
              </div>
              
              {!timerActive && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="timer-duration">Sleep Timer</Label>
                    <span className="text-sm font-medium">{timerDuration} min</span>
                  </div>
                  <Slider
                    id="timer-duration"
                    min={5}
                    max={120}
                    step={5}
                    value={[timerDuration]}
                    onValueChange={(value) => setTimerDuration(value[0])}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startTimer()}
                    disabled={!isPlaying}
                    className="w-full mt-2"
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                </div>
              )}
              
              {timerActive && (
                <div className="bg-accent p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl">{formatTimerDisplay()}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Music will stop when timer ends
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={cancelTimer}
                    className="w-full"
                  >
                    <TimerReset className="h-4 w-4 mr-2" />
                    Cancel Timer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {playHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recently Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playHistory.map(trackId => {
                    const track = tracks.find(t => t.id === trackId);
                    if (!track) return null;
                    
                    return (
                      <div 
                        key={track.id} 
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => playTrack(track)}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 flex items-center justify-center mr-2">
                            {currentTrack?.id === track.id && isPlaying ? (
                              <PauseCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div className="text-sm">{track.title}</div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {track.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setPlayHistory([])}
                >
                  Clear History
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
