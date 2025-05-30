import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudyStats } from '@/context/StudyStatsContext';
import { useJEEData } from '@/context/jee';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeakChaptersList } from '@/components/WeakChaptersList';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  Legend, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  ChevronLeft, Calendar, Clock, BookOpen, TrendingUp, Award, 
  Brain, Target, Lightbulb, AlertTriangle, CheckCircle, Star,
  Zap, Trophy, BookCheck, Users, Flame, BarChart3
} from 'lucide-react';

const DashboardPage = () => {
  const { getProgressBySubject, getTotalProgress, getWeakChapters } = useJEEData();
  const { studyStreak, studyTimes, pomodoroSessions, getTotalStudyTime, getStudyTimeByDay } = useStudyStats();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Enhanced analytics calculations
  const getStudyEfficiency = () => {
    const totalMinutes = getTotalStudyTime();
    const totalSessions = pomodoroSessions.length;
    if (totalSessions === 0) return 0;
    return Math.round((totalMinutes / totalSessions) * 100) / 100;
  };

  const getWeeklyGrowth = () => {
    const thisWeek = getStudyTimeByDay(7);
    const lastWeek = getStudyTimeByDay(14);
    
    const thisWeekTotal = Object.values(thisWeek).reduce((sum, minutes) => sum + minutes, 0);
    const lastWeekTotal = Object.values(lastWeek).reduce((sum, minutes) => sum + minutes, 0) - thisWeekTotal;
    
    if (lastWeekTotal === 0) return thisWeekTotal > 0 ? 100 : 0;
    return Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
  };

  const getSubjectMastery = () => {
    return [
      { subject: 'Maths', mastery: getProgressBySubject('Maths'), weakChapters: getWeakChapters().filter(ch => ch.subject === 'Maths').length },
      { subject: 'Physics', mastery: getProgressBySubject('Physics'), weakChapters: getWeakChapters().filter(ch => ch.subject === 'Physics').length },
      { subject: 'Chemistry', mastery: getProgressBySubject('Chemistry'), weakChapters: getWeakChapters().filter(ch => ch.subject === 'Chemistry').length }
    ];
  };

  const getPersonalizedRecommendations = () => {
    const weakChapters = getWeakChapters();
    const totalStudyTime = getTotalStudyTime();
    const currentStreak = studyStreak.current;
    
    const recommendations = [];
    
    if (weakChapters.length > 5) {
      recommendations.push({
        type: 'warning',
        title: 'Focus on Weak Areas',
        description: `You have ${weakChapters.length} weak chapters. Consider spending 60% of your study time on these topics.`,
        action: 'Review weak chapters',
        priority: 'high'
      });
    }
    
    if (currentStreak === 0) {
      recommendations.push({
        type: 'motivation',
        title: 'Start Your Study Streak',
        description: 'Begin a study streak today! Even 15 minutes of focused study can make a difference.',
        action: 'Start studying now',
        priority: 'high'
      });
    } else if (currentStreak >= 7) {
      recommendations.push({
        type: 'celebration',
        title: 'Amazing Streak!',
        description: `You've maintained a ${currentStreak}-day study streak! Keep up the excellent work.`,
        action: 'Continue streak',
        priority: 'low'
      });
    }
    
    if (totalStudyTime < 180) { // Less than 3 hours total
      recommendations.push({
        type: 'improvement',
        title: 'Increase Study Time',
        description: 'Try to reach at least 2-3 hours of daily study time for optimal JEE preparation.',
        action: 'Plan study schedule',
        priority: 'medium'
      });
    }
    
    return recommendations;
  };

  const getStudyHeatmap = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStudyTime = getStudyTimeByDay(30)[dateStr] || 0;
      
      data.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: dayStudyTime,
        intensity: dayStudyTime > 120 ? 4 : dayStudyTime > 90 ? 3 : dayStudyTime > 60 ? 2 : dayStudyTime > 30 ? 1 : 0
      });
    }
    return data;
  };

  // Progress data for subjects
  const subjectsProgress = [
    { subject: 'Maths', progress: getProgressBySubject('Maths'), color: '#0891b2' },
    { subject: 'Physics', progress: getProgressBySubject('Physics'), color: '#15803d' },
    { subject: 'Chemistry', progress: getProgressBySubject('Chemistry'), color: '#f97316' }
  ];

  const weeklyGrowth = getWeeklyGrowth();
  const studyEfficiency = getStudyEfficiency();
  const recommendations = getPersonalizedRecommendations();
  const subjectMastery = getSubjectMastery();
  const studyHeatmap = getStudyHeatmap();

  // COLORS for charts
  const COLORS = ['#0891b2', '#15803d', '#f97316', '#8b5cf6', '#ec4899'];

  return (
    <div className="container max-w-7xl py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Study Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Advanced insights and recommendations for your JEE preparation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {studyStreak.current} day streak
          </Badge>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Study Efficiency</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">{studyEfficiency}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">min/session</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average focus time</p>
              </div>
              <div className="relative">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Weekly Growth</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">{weeklyGrowth > 0 ? '+' : ''}{weeklyGrowth}%</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">vs last week</p>
              </div>
              <TrendingUp className={`h-8 w-8 ${weeklyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Overall Mastery</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">
                    {Math.round(subjectMastery.reduce((sum, s) => sum + s.mastery, 0) / 3)}%
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average across subjects</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Focus Sessions</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">{pomodoroSessions.length}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">total</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(getTotalStudyTime() / 60 * 10) / 10} hours studied
                </p>
              </div>
              <Zap className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights to optimize your study strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' :
                    'border-green-500 bg-green-50 dark:bg-green-900/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${
                      rec.type === 'warning' ? 'bg-red-100 text-red-600' :
                      rec.type === 'improvement' ? 'bg-yellow-100 text-yellow-600' :
                      rec.type === 'motivation' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {rec.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                       rec.type === 'improvement' ? <Target className="h-4 w-4" /> :
                       rec.type === 'motivation' ? <Zap className="h-4 w-4" /> :
                       <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                      <Button size="sm" variant="outline" className="mt-2 text-xs">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Study Patterns</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Mastery Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Mastery Analysis</CardTitle>
                <CardDescription>Comprehensive view of your preparation level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={subjectMastery}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Mastery"
                        dataKey="mastery"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Study Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>30-Day Study Activity</CardTitle>
                <CardDescription>Your study consistency over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-1">
                  {studyHeatmap.map((day, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-sm ${
                        day.intensity === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                        day.intensity === 1 ? 'bg-green-200 dark:bg-green-900' :
                        day.intensity === 2 ? 'bg-green-300 dark:bg-green-800' :
                        day.intensity === 3 ? 'bg-green-400 dark:bg-green-700' :
                        'bg-green-500 dark:bg-green-600'
                      }`}
                      title={`${day.date}: ${day.value} minutes`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                    <div className="w-2 h-2 bg-green-200 dark:bg-green-900 rounded-sm"></div>
                    <div className="w-2 h-2 bg-green-300 dark:bg-green-800 rounded-sm"></div>
                    <div className="w-2 h-2 bg-green-400 dark:bg-green-700 rounded-sm"></div>
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-600 rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weak Areas Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Areas Needing Attention</CardTitle>
                <CardDescription>Focus on these topics to improve your overall score</CardDescription>
              </div>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <WeakChaptersList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          {/* Subject Progress Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {subjectMastery.map((subject) => (
              <Card key={subject.subject}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {subject.subject}
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>Mastery Level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-center">{subject.mastery}%</div>
                  <Progress value={subject.mastery} className="h-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Weak Chapters:</span>
                    <span className="text-sm font-medium">{subject.weakChapters}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Review {subject.subject}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          {/* Study Pattern Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Study Time</CardTitle>
                <CardDescription>Distribution of study time over the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studyHeatmap}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Time spent on each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectMastery}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="mastery"
                        nameKey="subject"
                      >
                        {subjectMastery.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals and Progress Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Goal</CardTitle>
                <CardDescription>Set your weekly study goal</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming Soon: Set your weekly study time goal and track your progress.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
                <CardDescription>Track your achievements and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming Soon: View your earned badges for completing study milestones.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
