
/**
 * Utility functions for creating reliable timers that work in background tabs
 */

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedAt: number | null;
  pausedDuration: number;
  totalDuration: number;
  timeLeft: number;
}

/**
 * Creates a reliable timer that works even when the browser tab is not active.
 * Uses performance.now() instead of Date.now() for more accurate timing.
 */
export const createReliableTimer = (
  duration: number, // in seconds
  onTick: (timeLeft: number) => void,
  onComplete: () => void,
  tickInterval = 500 // ms
): {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  saveState: () => TimerState;
  loadState: (state: TimerState) => void;
  getTimeLeft: () => number;
} => {
  let state: TimerState = {
    isActive: false,
    isPaused: false,
    startTime: null,
    pausedAt: null,
    pausedDuration: 0,
    totalDuration: duration * 1000, // convert to ms
    timeLeft: duration * 1000, // convert to ms
  };

  let timerId: number | null = null;

  // Calculate time left based on current state
  const calculateTimeLeft = (): number => {
    if (!state.isActive) return state.totalDuration;
    if (state.isPaused) return state.timeLeft;

    const now = performance.now();
    const startTime = state.startTime || now;
    const elapsed = now - startTime - state.pausedDuration;
    const timeLeft = Math.max(0, state.totalDuration - elapsed);
    
    return timeLeft;
  };

  // Function to be called on each tick
  const tick = () => {
    if (!state.isActive || state.isPaused) return;

    const timeLeftMs = calculateTimeLeft();
    state.timeLeft = timeLeftMs;
    
    // Convert ms to seconds for the callback
    onTick(Math.ceil(timeLeftMs / 1000));

    if (timeLeftMs <= 0) {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
      state.isActive = false;
      onComplete();
    }
  };

  // Start the timer
  const start = () => {
    if (state.isActive) return;

    state.isActive = true;
    state.isPaused = false;
    state.startTime = performance.now();
    state.pausedDuration = 0;
    state.timeLeft = state.totalDuration;

    if (timerId) window.clearInterval(timerId);
    timerId = window.setInterval(tick, tickInterval);
    tick(); // Initial tick
  };

  // Pause the timer
  const pause = () => {
    if (!state.isActive || state.isPaused) return;

    state.isPaused = true;
    state.pausedAt = performance.now();
    state.timeLeft = calculateTimeLeft();

    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  // Resume the timer
  const resume = () => {
    if (!state.isActive || !state.isPaused) return;

    state.isPaused = false;
    // Calculate how long we were paused
    if (state.pausedAt) {
      state.pausedDuration += performance.now() - state.pausedAt;
      state.pausedAt = null;
    }

    if (timerId) window.clearInterval(timerId);
    timerId = window.setInterval(tick, tickInterval);
    tick(); // Initial tick after resume
  };

  // Reset the timer
  const reset = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }

    state = {
      isActive: false,
      isPaused: false,
      startTime: null,
      pausedAt: null,
      pausedDuration: 0,
      totalDuration: duration * 1000,
      timeLeft: duration * 1000,
    };
    
    onTick(duration);
  };

  // Save current timer state (for localStorage)
  const saveState = (): TimerState => {
    // Update timeLeft before saving
    if (state.isActive && !state.isPaused) {
      state.timeLeft = calculateTimeLeft();
    }
    return { ...state };
  };

  // Load saved timer state
  const loadState = (savedState: TimerState) => {
    state = { ...savedState };
    
    if (state.isActive) {
      if (state.isPaused) {
        // If paused, just update the UI
        onTick(Math.ceil(state.timeLeft / 1000));
      } else {
        // If active, restart the timer with correct elapsed time
        state.startTime = performance.now() - (state.totalDuration - state.timeLeft) - state.pausedDuration;
        
        if (timerId) window.clearInterval(timerId);
        timerId = window.setInterval(tick, tickInterval);
        tick(); // Initial tick
      }
    } else {
      // If not active, just update the UI
      onTick(Math.ceil(state.timeLeft / 1000));
    }
  };

  // Get current time left
  const getTimeLeft = (): number => {
    return Math.ceil(calculateTimeLeft() / 1000);
  };

  // Clean up on unmount
  const cleanup = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  // Add event listener for page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // When page becomes visible again, update the timer immediately
      if (state.isActive && !state.isPaused) {
        tick();
      }
    }
  });

  // Clean up on beforeunload
  window.addEventListener('beforeunload', cleanup);

  return {
    start,
    pause,
    resume,
    reset,
    saveState,
    loadState,
    getTimeLeft
  };
};

/**
 * Request notification permissions and show a notification
 */
export const showNotification = async (title: string, body: string, icon?: string): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon });
    return true;
  } 
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, { body, icon });
      return true;
    }
  }

  return false;
};

/**
 * Play a sound with error handling and volume control
 */
export const playSound = (url: string, volume = 1.0): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.volume = Math.min(1, Math.max(0, volume));
    
    audio.onended = () => resolve();
    audio.onerror = (error) => {
      console.error('Error playing sound:', error);
      reject(error);
    };
    
    audio.play().catch(error => {
      console.warn('Failed to play sound:', error);
      reject(error);
    });
  });
};

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
