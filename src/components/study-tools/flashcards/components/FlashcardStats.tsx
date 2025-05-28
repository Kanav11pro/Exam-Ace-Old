
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Brain, Clock, Star, Award } from 'lucide-react';

interface FlashcardStatsProps {
  totalCards: number;
  masteredCards: number;
  needPracticeCards: number;
  totalStudyTime: number;
  streak: number;
  bookmarkedCards: number;
}

export function FlashcardStats({
  totalCards,
  masteredCards,
  needPracticeCards,
  totalStudyTime,
  streak,
  bookmarkedCards
}: FlashcardStatsProps) {
  const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;
  
  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const stats = [
    {
      title: "Total Cards",
      value: totalCards,
      icon: <Brain className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Mastered",
      value: masteredCards,
      icon: <Award className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Need Practice",
      value: needPracticeCards,
      icon: <Target className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Study Time",
      value: formatStudyTime(totalStudyTime),
      icon: <Clock className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Current Streak",
      value: streak,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Bookmarked",
      value: bookmarkedCards,
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Progress */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-6 w-6" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Mastery Level</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {Math.round(masteryPercentage)}%
              </Badge>
            </div>
            <Progress value={masteryPercentage} className="h-3 bg-white/20" />
            <p className="text-sm text-blue-100">
              You've mastered {masteredCards} out of {totalCards} cards. Keep going! 🚀
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-4">
                <div className={`${stat.bgColor} rounded-lg p-3 mb-3`}>
                  <div className={`${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {streak >= 7 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg"
              >
                <div className="text-2xl">🔥</div>
                <div>
                  <p className="font-semibold text-orange-700 dark:text-orange-300">
                    Week Warrior!
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {streak} days study streak
                  </p>
                </div>
              </motion.div>
            )}
            
            {masteryPercentage >= 50 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg"
              >
                <div className="text-2xl">🎯</div>
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300">
                    Halfway Hero!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Mastered over 50% of cards
                  </p>
                </div>
              </motion.div>
            )}
            
            {bookmarkedCards >= 10 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
              >
                <div className="text-2xl">⭐</div>
                <div>
                  <p className="font-semibold text-purple-700 dark:text-purple-300">
                    Bookmark Master!
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {bookmarkedCards} bookmarked cards
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
