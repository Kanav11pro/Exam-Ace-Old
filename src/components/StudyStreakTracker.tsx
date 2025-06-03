
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudyStats } from '@/context/StudyStatsContext';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';

const StudyStreakTracker = () => {
  const { studyStreak, getStudyTimeByDay } = useStudyStats();
  const recentDays = getStudyTimeByDay(7);

  // Get last 7 days for streak visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    return {
      date: dateStr,
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      studyTime: recentDays[dateStr] || 0,
      hasStudied: (recentDays[dateStr] || 0) > 0
    };
  });

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-orange-600">{studyStreak.current}</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-orange-500">{studyStreak.longest}</p>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Last 7 Days</p>
          <div className="flex justify-between gap-1">
            {last7Days.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    day.hasStudied
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {day.hasStudied ? '✓' : '-'}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Badge variant={studyStreak.current >= 7 ? 'default' : 'secondary'} className="gap-1">
            <Trophy className="h-3 w-3" />
            {studyStreak.current >= 30 ? 'Master' : 
             studyStreak.current >= 14 ? 'Expert' : 
             studyStreak.current >= 7 ? 'Champion' : 'Building'}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Target className="h-3 w-3" />
            Goal: 30 days
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStreakTracker;
