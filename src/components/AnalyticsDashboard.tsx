
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useJEEData } from '@/context/jee';
import { useStudyStats } from '@/context/StudyStatsContext';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  BookOpen, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  Timer
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const { getProgressBySubject, getTotalProgress } = useJEEData();
  const { studyStreak, getTotalStudyTime, getStudyTimeByDay } = useStudyStats();

  const subjects = ['Maths', 'Physics', 'Chemistry'];
  const subjectProgress = subjects.map(subject => ({
    subject,
    progress: getProgressBySubject(subject)
  }));

  const totalStudyTime = getTotalStudyTime();
  const recentStudyData = getStudyTimeByDay(7);
  const totalProgress = getTotalProgress();

  // Calculate study insights
  const averageProgress = subjectProgress.reduce((acc, s) => acc + s.progress, 0) / 3;
  const strongestSubject = subjectProgress.reduce((max, current) => 
    current.progress > max.progress ? current : max
  );
  const weakestSubject = subjectProgress.reduce((min, current) => 
    current.progress < min.progress ? current : min
  );

  // Study time insights
  const dailyAverage = totalStudyTime / 30; // assuming 30 days
  const weeklyTotal = Object.values(recentStudyData).reduce((sum, time) => sum + time, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your JEE Analytics
        </h2>
        <p className="text-muted-foreground">
          Track your progress, identify strengths, and improve your preparation strategy
        </p>
      </motion.div>

      {/* Key Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalProgress.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Study Streak</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{studyStreak.current} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total Study Time</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(totalStudyTime / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Best Streak</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{studyStreak.longest} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Analysis */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Subject-wise Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectProgress.map((subject, index) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject.subject}</span>
                  <Badge variant={subject.progress > 75 ? 'default' : subject.progress > 50 ? 'secondary' : 'outline'}>
                    {subject.progress.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Strength Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700 dark:text-green-300">Strongest Subject</span>
              </div>
              <p className="text-lg font-bold text-green-800 dark:text-green-200">{strongestSubject.subject}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{strongestSubject.progress.toFixed(1)}% completed</p>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-700 dark:text-red-300">Needs Attention</span>
              </div>
              <p className="text-lg font-bold text-red-800 dark:text-red-200">{weakestSubject.subject}</p>
              <p className="text-sm text-red-600 dark:text-red-400">{weakestSubject.progress.toFixed(1)}% completed</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Study Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Study Rhythm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <span className="font-medium">{Math.round(dailyAverage)} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-medium">{Math.round(weeklyTotal / 60)} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Consistency</span>
              <Badge variant={studyStreak.current > 7 ? 'default' : studyStreak.current > 3 ? 'secondary' : 'outline'}>
                {studyStreak.current > 7 ? 'Excellent' : studyStreak.current > 3 ? 'Good' : 'Build Habit'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Preparation Level</p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {averageProgress > 75 ? 'Advanced' : averageProgress > 50 ? 'Intermediate' : 'Beginner'}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Focus Area</p>
              <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                {weakestSubject.progress < 30 ? 'Basics' : weakestSubject.progress < 60 ? 'Practice' : 'Revision'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Study Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Target</span>
                <span className="text-muted-foreground">25h</span>
              </div>
              <Progress value={(weeklyTotal / 60 / 25) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(weeklyTotal / 60)}/25 hours this week
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Progress</span>
                <span className="text-muted-foreground">80%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Keep up the momentum!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">📚 Study More</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Focus on {weakestSubject.subject} - allocate 2 extra hours this week
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🎯 Practice Tests</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Take 3 mock tests this week to improve test-taking skills
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">🔄 Revision</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Revise {strongestSubject.subject} concepts to maintain your lead
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
