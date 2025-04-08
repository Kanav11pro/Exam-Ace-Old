
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for study statistics
type StudyTime = {
  date: string;
  subject: string;
  chapter: string;
  minutes: number;
};

type StudyMetric = {
  id: string;
  value: number;
  lastUpdated: string;
};

type StudyStreak = {
  current: number;
  longest: number;
  lastStudyDate: string;
};

type PomodoroSession = {
  date: string;
  subject: string;
  completedIntervals: number;
  totalMinutes: number;
};

type StudyStatsContextType = {
  studyTimes: StudyTime[];
  studyMetrics: Record<string, StudyMetric>;
  studyStreak: StudyStreak;
  pomodoroSessions: PomodoroSession[];
  addStudyTime: (subject: string, chapter: string, minutes: number) => void;
  updateMetric: (metricId: string, value: number) => void;
  recordPomodoroSession: (subject: string, intervals: number, minutes: number) => void;
  getTotalStudyTime: (subject?: string) => number;
  getStudyTimeByDay: (days: number) => Record<string, number>;
  resetStats: () => void;
};

const STATS_STORAGE_KEY = 'jeeStudyStats';

const defaultStudyStreak: StudyStreak = {
  current: 0,
  longest: 0,
  lastStudyDate: '',
};

const StudyStatsContext = createContext<StudyStatsContextType | undefined>(undefined);

export const StudyStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studyTimes, setStudyTimes] = useState<StudyTime[]>([]);
  const [studyMetrics, setStudyMetrics] = useState<Record<string, StudyMetric>>({});
  const [studyStreak, setStudyStreak] = useState<StudyStreak>(defaultStudyStreak);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);

  // Load saved stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStudyTimes(parsed.studyTimes || []);
        setStudyMetrics(parsed.studyMetrics || {});
        setStudyStreak(parsed.studyStreak || defaultStudyStreak);
        setPomodoroSessions(parsed.pomodoroSessions || []);
      } catch (e) {
        console.error('Error parsing study stats:', e);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    const statsToSave = {
      studyTimes,
      studyMetrics,
      studyStreak,
      pomodoroSessions,
    };
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(statsToSave));
  }, [studyTimes, studyMetrics, studyStreak, pomodoroSessions]);

  // Update study streak when adding study time
  useEffect(() => {
    const updateStreak = () => {
      if (studyTimes.length === 0) return;

      const today = new Date().toISOString().split('T')[0];
      const lastStudyDate = studyStreak.lastStudyDate;

      if (!lastStudyDate) {
        // First study session
        setStudyStreak({
          current: 1,
          longest: 1,
          lastStudyDate: today,
        });
        return;
      }

      if (lastStudyDate === today) {
        // Already studied today, no streak change
        return;
      }

      // Check if the last study date was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastStudyDate === yesterdayStr) {
        // Streak continues
        const newCurrent = studyStreak.current + 1;
        setStudyStreak({
          current: newCurrent,
          longest: Math.max(newCurrent, studyStreak.longest),
          lastStudyDate: today,
        });
      } else {
        // Streak broken
        setStudyStreak({
          current: 1,
          longest: studyStreak.longest,
          lastStudyDate: today,
        });
      }
    };

    updateStreak();
  }, [studyTimes, studyStreak]);

  const addStudyTime = (subject: string, chapter: string, minutes: number) => {
    const newStudyTime: StudyTime = {
      date: new Date().toISOString(),
      subject,
      chapter,
      minutes,
    };
    setStudyTimes(prev => [...prev, newStudyTime]);
  };

  const updateMetric = (metricId: string, value: number) => {
    setStudyMetrics(prev => ({
      ...prev,
      [metricId]: {
        id: metricId,
        value,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  const recordPomodoroSession = (subject: string, intervals: number, minutes: number) => {
    const newSession: PomodoroSession = {
      date: new Date().toISOString(),
      subject,
      completedIntervals: intervals,
      totalMinutes: minutes,
    };
    setPomodoroSessions(prev => [...prev, newSession]);
    addStudyTime(subject, 'Pomodoro Session', minutes);
  };

  const getTotalStudyTime = (subject?: string): number => {
    return studyTimes
      .filter(time => !subject || time.subject === subject)
      .reduce((total, time) => total + time.minutes, 0);
  };

  const getStudyTimeByDay = (days: number): Record<string, number> => {
    const result: Record<string, number> = {};
    const today = new Date();
    
    // Initialize the result with the last 'days' days
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result[dateStr] = 0;
    }

    // Add study times
    studyTimes.forEach(time => {
      const dateStr = time.date.split('T')[0];
      if (result[dateStr] !== undefined) {
        result[dateStr] += time.minutes;
      }
    });

    return result;
  };

  const resetStats = () => {
    setStudyTimes([]);
    setStudyMetrics({});
    setStudyStreak(defaultStudyStreak);
    setPomodoroSessions([]);
  };

  return (
    <StudyStatsContext.Provider
      value={{
        studyTimes,
        studyMetrics,
        studyStreak,
        pomodoroSessions,
        addStudyTime,
        updateMetric,
        recordPomodoroSession,
        getTotalStudyTime,
        getStudyTimeByDay,
        resetStats,
      }}
    >
      {children}
    </StudyStatsContext.Provider>
  );
};

export const useStudyStats = (): StudyStatsContextType => {
  const context = useContext(StudyStatsContext);
  if (context === undefined) {
    throw new Error('useStudyStats must be used within a StudyStatsProvider');
  }
  return context;
};
