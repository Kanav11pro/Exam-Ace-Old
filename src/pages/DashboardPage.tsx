
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudyStats } from '@/context/StudyStatsContext';
import { useJEEData } from '@/context/jee';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeakChaptersList } from '@/components/WeakChaptersList';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  Legend, Area, AreaChart, RadialBarChart, RadialBar
} from 'recharts';
import { 
  ChevronLeft, Calendar, Clock, BookOpen, TrendingUp, Award, 
  Target, Brain, Zap, Trophy, Users, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { getProgressBySubject, getTotalProgress, getWeakChapters, jeeData } = useJEEData();
  const { studyStreak, studyTimes, pomodoroSessions, getTotalStudyTime, getStudyTimeByDay } = useStudyStats();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate real progress data
  const subjectsProgress = [
    { 
      subject: 'Maths', 
      progress: Math.round(getProgressBySubject('Maths')), 
      color: '#0891b2',
      chapters: Object.keys(jeeData.subjects.Maths || {}).length,
      completedChapters: Object.entries(jeeData.subjects.Maths || {}).filter(([_, data]) => {
        const booleanFields = Object.entries(data).filter(([key, value]) => typeof value === 'boolean').length;
        const completedFields = Object.entries(data).filter(([key, value]) => typeof value === 'boolean' && value).length;
        return (completedFields / booleanFields) >= 0.8;
      }).length
    },
    { 
      subject: 'Physics', 
      progress: Math.round(getProgressBySubject('Physics')), 
      color: '#15803d',
      chapters: Object.keys(jeeData.subjects.Physics || {}).length,
      completedChapters: Object.entries(jeeData.subjects.Physics || {}).filter(([_, data]) => {
        const booleanFields = Object.entries(data).filter(([key, value]) => typeof value === 'boolean').length;
        const completedFields = Object.entries(data).filter(([key, value]) => typeof value === 'boolean' && value).length;
        return (completedFields / booleanFields) >= 0.8;
      }).length
    },
    { 
      subject: 'Chemistry', 
      progress: Math.round(getProgressBySubject('Chemistry')), 
      color: '#f97316',
      chapters: Object.keys(jeeData.subjects.Chemistry || {}).length,
      completedChapters: Object.entries(jeeData.subjects.Chemistry || {}).filter(([_, data]) => {
        const booleanFields = Object.entries(data).filter(([key, value]) => typeof value === 'boolean').length;
        const completedFields = Object.entries(data).filter(([key, value]) => typeof value === 'boolean' && value).length;
        return (completedFields / booleanFields) >= 0.8;
      }).length
    }
  ];
  
  // Real weekly study data
  const weeklyData = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const dailyData = getStudyTimeByDay(days);
    
    return Object.entries(dailyData).map(([date, minutes]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      minutes: minutes,
      hours: Math.round((minutes / 60) * 10) / 10
    })).reverse();
  };
  
  // Real subject distribution data
  const subjectDistribution = () => {
    const subjects: Record<string, number> = {};
    
    studyTimes.forEach(time => {
      if (!subjects[time.subject]) {
        subjects[time.subject] = 0;
      }
      subjects[time.subject] += time.minutes;
    });
    
    const total = getTotalStudyTime();
    return Object.entries(subjects).map(([subject, minutes]) => ({
      subject,
      minutes,
      hours: Math.round((minutes / 60) * 10) / 10,
      percentage: total > 0 ? Math.round((minutes / total) * 100) : 0
    }));
  };
  
  // Real performance metrics
  const performanceMetrics = () => {
    const totalChapters = Object.values(jeeData.subjects).reduce((acc, subject) => acc + Object.keys(subject).length, 0);
    const totalCompleted = subjectsProgress.reduce((acc, subject) => acc + subject.completedChapters, 0);
    const averageProgress = Math.round(getTotalProgress());
    
    return {
      totalChapters,
      completedChapters: totalCompleted,
      averageProgress,
      studyHours: Math.round((getTotalStudyTime() / 60) * 10) / 10,
      currentStreak: studyStreak.current,
      longestStreak: studyStreak.longest
    };
  };
  
  const metrics = performanceMetrics();
  
  // Achievement data
  const achievements = [
    { name: 'Study Streak Master', earned: studyStreak.current >= 7, icon: '🔥' },
    { name: 'Chapter Champion', earned: metrics.completedChapters >= 10, icon: '📚' },
    { name: 'Time Manager', earned: metrics.studyHours >= 50, icon: '⏰' },
    { name: 'Progress Pioneer', earned: metrics.averageProgress >= 30, icon: '🚀' }
  ];
  
  const COLORS = ['#0891b2', '#15803d', '#f97316', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Study Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Track your progress and optimize your JEE preparation journey</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10">
            {metrics.averageProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30">
            {studyStreak.current} Day Streak
          </Badge>
        </div>
      </motion.div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Study Streak</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-300">{studyStreak.current}</h3>
                    <span className="text-sm text-blue-500 mb-1">days</span>
                  </div>
                  <p className="text-xs text-blue-500">Best: {studyStreak.longest} days</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Study Hours</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-green-700 dark:text-green-300">{metrics.studyHours}</h3>
                    <span className="text-sm text-green-500 mb-1">hours</span>
                  </div>
                  <p className="text-xs text-green-500">{getTotalStudyTime()} minutes total</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Chapters Done</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-amber-700 dark:text-amber-300">{metrics.completedChapters}</h3>
                    <span className="text-sm text-amber-500 mb-1">/ {metrics.totalChapters}</span>
                  </div>
                  <p className="text-xs text-amber-500">
                    {Math.round((metrics.completedChapters / metrics.totalChapters) * 100)}% complete
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Overall Progress</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-300">{metrics.averageProgress}%</h3>
                  </div>
                  <p className="text-xs text-purple-500">Average across subjects</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Time Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Activity</CardTitle>
                  <CardDescription>Your daily study time over the selected period</CardDescription>
                </div>
                <Tabs defaultValue="week" onValueChange={(value) => setTimeRange(value as any)}>
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData()}>
                    <defs>
                      <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickFormatter={(value) => value.split(',')[0]}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-purple-600">
                                {payload[0].value} minutes ({Math.round((payload[0].value as number) / 60 * 10) / 10} hours)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="#8b5cf6" 
                      fillOpacity={1} 
                      fill="url(#studyGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your completion status by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectsProgress.map((subject, index) => (
                <motion.div 
                  key={subject.subject}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.subject}</span>
                    <Badge variant="outline">{subject.progress}%</Badge>
                  </div>
                  <Progress value={subject.progress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{subject.completedChapters} chapters done</span>
                    <span>{subject.chapters} total</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>How you spend your study time across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="minutes"
                    nameKey="subject"
                  >
                    {subjectDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.subject}</p>
                            <p>{data.hours} hours ({data.percentage}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your study milestones and badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    achievement.earned 
                      ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-800/50 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <p className="text-sm font-medium">{achievement.name}</p>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-yellow-500 text-yellow-50">Earned</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weak Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Focus Areas
          </CardTitle>
          <CardDescription>Chapters that need more attention based on your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <WeakChaptersList />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
