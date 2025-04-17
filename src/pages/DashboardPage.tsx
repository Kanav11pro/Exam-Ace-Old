
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudyStats } from '@/context/StudyStatsContext';
import { useJEEData } from '@/context/jee'; // Changed from '@/context/JEEDataContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeakChaptersList } from '@/components/WeakChaptersList';
import { Progress } from '@/components/ui/progress';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  Legend, Area, AreaChart
} from 'recharts';
import { ChevronLeft, Calendar, Clock, BookOpen, TrendingUp, Award } from 'lucide-react';

const DashboardPage = () => {
  const { getSubjectProgress, getTotalProgress, getWeakChapters } = useJEEData();
  const { studyStreak, studyTimes, pomodoroSessions, getTotalStudyTime, getStudyTimeByDay } = useStudyStats();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Progress data for subjects
  const subjectsProgress = [
    { subject: 'Maths', progress: getSubjectProgress('Maths'), color: '#0891b2' },
    { subject: 'Physics', progress: getSubjectProgress('Physics'), color: '#15803d' },
    { subject: 'Chemistry', progress: getSubjectProgress('Chemistry'), color: '#f97316' }
  ];
  
  // Weekly study data
  const weeklyData = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const dailyData = getStudyTimeByDay(days);
    
    return Object.entries(dailyData).map(([date, minutes]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      minutes: minutes
    })).reverse();
  };
  
  // Subject distribution data
  const subjectDistribution = () => {
    const subjects: Record<string, number> = {};
    
    studyTimes.forEach(time => {
      if (!subjects[time.subject]) {
        subjects[time.subject] = 0;
      }
      subjects[time.subject] += time.minutes;
    });
    
    return Object.entries(subjects).map(([subject, minutes]) => ({
      subject,
      minutes,
      percentage: Math.round((minutes / getTotalStudyTime()) * 100)
    }));
  };
  
  // Proficiency level data
  const proficiencyData = () => {
    const weakChapters = getWeakChapters();
    const levels = {
      'Weak': weakChapters.length,
      'Medium': 15,
      'Strong': 25
    };
    
    return Object.entries(levels).map(([level, chapters]) => ({
      level,
      chapters
    }));
  };
  
  // Time of day study pattern
  const timeOfDayData = [
    { name: 'Morning (6-12)', hours: 12 },
    { name: 'Afternoon (12-5)', hours: 8 },
    { name: 'Evening (5-9)', hours: 15 },
    { name: 'Night (9-12)', hours: 5 }
  ];
  
  // Streak history data
  const streakHistoryData = [
    { day: 'Mon', streak: 1 },
    { day: 'Tue', streak: 2 },
    { day: 'Wed', streak: 3 },
    { day: 'Thu', streak: 4 },
    { day: 'Fri', streak: 5 },
    { day: 'Sat', streak: 6 },
    { day: 'Sun', streak: studyStreak.current }
  ];
  
  // COLORS for charts
  const COLORS = ['#0891b2', '#15803d', '#f97316', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="container max-w-6xl py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-2">Study Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Track your progress and optimize your JEE preparation</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Study Streak</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">{studyStreak.current}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">days</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Longest: {studyStreak.longest} days</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Study Time</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">{Math.round(getTotalStudyTime() / 60 * 10) / 10}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">hours</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getTotalStudyTime()} minutes logged</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pomodoro Sessions</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">{pomodoroSessions.length}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">completed</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {pomodoroSessions.reduce((acc, session) => acc + session.totalMinutes, 0)} total minutes
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-900/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Overall Progress</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold">
                    {Math.round((getSubjectProgress('Maths') + getSubjectProgress('Physics') + getSubjectProgress('Chemistry')) / 3)}%
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average across subjects</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Study Time History</CardTitle>
              <CardDescription>Daily study minutes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-2">
                <Tabs defaultValue="week" onValueChange={(value) => setTimeRange(value as any)}>
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData()}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickFormatter={(value) => {
                        if (timeRange === 'week') return value.split(',')[0];
                        return value.split(' ').slice(0, 2).join(' ');
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Completion percentage by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectsProgress.map((subject) => (
                  <div key={subject.subject}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm text-gray-500">{subject.progress}%</span>
                    </div>
                    <Progress 
                      value={subject.progress} 
                      className={`h-2 ${
                        subject.subject === 'Maths' ? 'bg-slate-200 dark:bg-slate-800' :
                        subject.subject === 'Physics' ? 'bg-slate-200 dark:bg-slate-800' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                    data={subjectDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="minutes"
                    nameKey="subject"
                  >
                    {subjectDistribution().map((entry, index) => (
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
        
        <Card>
          <CardHeader>
            <CardTitle>Proficiency Levels</CardTitle>
            <CardDescription>Chapters by proficiency level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proficiencyData()}>
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="chapters" fill="#8884d8">
                    {proficiencyData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.level === 'Weak' ? '#ef4444' :
                        entry.level === 'Medium' ? '#f59e0b' : '#10b981'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time of Day Pattern</CardTitle>
            <CardDescription>When you study the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Streak History</CardTitle>
            <CardDescription>Your study streak over the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streakHistoryData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="streak" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Weak Areas Focus</CardTitle>
              <CardDescription>Chapters that need more attention</CardDescription>
            </div>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <WeakChaptersList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
