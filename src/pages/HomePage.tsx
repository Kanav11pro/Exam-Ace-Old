import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubjectCard } from '@/components/SubjectCard';
import { useStudyStats } from '@/context/StudyStatsContext';
import { useJEEData } from '@/context/JEEDataContext';
import { ProgressBar } from '@/components/ProgressBar';
import { BookOpen, Flame, Clock, Target, Calculator, BookCheck, BrainCircuit, LineChart, BellRing, Zap, Calendar, BookMarked, BarChart4 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
const HomePage = () => {
  const {
    user
  } = useAuth();
  const {
    studyStreak,
    getTotalStudyTime,
    getStudyTimeByDay
  } = useStudyStats();
  const {
    getTotalProgress,
    getWeakChapters
  } = useJEEData();
  const totalProgress = getTotalProgress();
  const weakChapters = getWeakChapters();

  // Get today's study time
  const today = new Date().toISOString().split('T')[0];
  const todayStudyTime = Object.values(getStudyTimeByDay(1))[0] || 0;
  const getStudyGoalStatus = (minutes: number) => {
    const dailyGoal = 120; // 2 hours
    const percentage = Math.min(100, Math.round(minutes / dailyGoal * 100));
    return {
      percentage,
      achieved: percentage >= 100
    };
  };
  const todayGoalStatus = getStudyGoalStatus(todayStudyTime);

  // Mock upcoming events
  const upcomingEvents = [{
    title: "Chemistry Test",
    date: "Apr 12",
    subject: "Chemistry",
    urgent: true
  }, {
    title: "Trigonometry Revision",
    date: "Apr 15",
    subject: "Maths",
    urgent: false
  }, {
    title: "Mock JEE",
    date: "Apr 20",
    subject: "All Subjects",
    urgent: true
  }];

  // Quick access tools
  const quickTools = [{
    name: "Pomodoro Timer",
    icon: <Clock className="h-5 w-5" />,
    path: "/tools"
  }, {
    name: "Formula Sheet",
    icon: <Calculator className="h-5 w-5" />,
    path: "/tools"
  }, {
    name: "Flashcards",
    icon: <BookCheck className="h-5 w-5" />,
    path: "/tools"
  }, {
    name: "Focus Mode",
    icon: <BrainCircuit className="h-5 w-5" />,
    path: "/tools"
  }];
  return <div className="container max-w-6xl py-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Let's continue your JEE preparation journey.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild className="transition-transform hover:scale-105">
                <Link to="/tools">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Tools
                </Link>
              </Button>
              <Button asChild variant="outline" className="transition-transform hover:scale-105">
                <Link to="/prepometer">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Prepometer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-amber-800 dark:text-amber-300 font-medium text-sm">Study Streak</h3>
                <Flame className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold mt-1">{studyStreak.current} days</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Best: {studyStreak.longest} days
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-blue-800 dark:text-blue-300 font-medium text-sm">Total Study</h3>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-1">{Math.round(getTotalStudyTime() / 60 * 10) / 10}h</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {getTotalStudyTime()} minutes logged
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/40 dark:to-emerald-950/40 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-green-800 dark:text-green-300 font-medium text-sm">Today's Goal</h3>
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold">{todayGoalStatus.percentage}%</p>
                {todayGoalStatus.achieved && <Badge className="bg-green-500 text-white text-xs">Achieved!</Badge>}
              </div>
              <div className="mt-2">
                <ProgressBar progress={todayGoalStatus.percentage} variant="dashboard" animated={true} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-950/40 dark:to-violet-950/40 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-purple-800 dark:text-purple-300 font-medium text-sm">Overall Progress</h3>
                <LineChart className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold mt-1">{Math.round(totalProgress)}%</p>
              <div className="mt-2">
                <ProgressBar progress={totalProgress} variant="dashboard" animated={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Subject Cards */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold mb-3">Your Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SubjectCard subject="Maths" variant="maths" />
            <SubjectCard subject="Physics" variant="physics" />
            <SubjectCard subject="Chemistry" variant="chemistry" />
          </div>
          
          <h2 className="text-xl font-bold flex items-center mt-8 mb-3">
            <BookMarked className="h-5 w-5 mr-2 text-blue-600" />
            Quick Access Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickTools.map(tool => <Link key={tool.name} to={tool.path}>
                <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-24">
                  <CardContent className="flex flex-col items-center justify-center h-full text-center p-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mb-2">
                      {tool.icon}
                    </div>
                    <p className="text-sm font-medium">{tool.name}</p>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
        
        {/* Right Column - Data & Events */}
        <div className="space-y-6">
          {/* Need Attention */}
          <div>
            <h2 className="text-xl font-bold flex items-center mb-3">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Needs Attention
            </h2>
            <Card>
              <CardContent className="px-3 py-4">
                {weakChapters.length > 0 ? <ul className="space-y-2">
                    {weakChapters.slice(0, 3).map((item, index) => <li key={index} className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                        <Link to={`/subject/${item.subject}/${item.chapter}`} className="flex items-center justify-between hover:text-blue-600 transition-colors">
                          <span className="font-medium text-sm">{item.chapter}</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                            Weak
                          </Badge>
                        </Link>
                        <p className="text-xs text-gray-500">{item.subject}</p>
                      </li>)}
                  </ul> : <p className="text-center text-gray-500 dark:text-gray-400 py-2">
                    No weak chapters found
                  </p>}
                {weakChapters.length > 3 && <div className="text-center mt-3">
                    <Button variant="link" size="sm" asChild>
                      <Link to="/dashboard">View all {weakChapters.length} weak chapters</Link>
                    </Button>
                  </div>}
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-bold flex items-center mb-3">
              <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
              Upcoming Events
            </h2>
            <Card>
              <CardContent className="px-3 py-4">
                <ul className="space-y-2">
                  {upcomingEvents.map((event, index) => <li key={index} className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{event.title}</span>
                            {event.urgent && <Badge className="bg-red-500">Urgent</Badge>}
                          </div>
                          <p className="text-xs text-gray-500">{event.subject}</p>
                        </div>
                        <Badge variant="outline">{event.date}</Badge>
                      </div>
                    </li>)}
                </ul>
                <div className="text-center mt-3">
                  <Button variant="link" size="sm" asChild>
                    <Link to="/tools">Set reminders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Notifications */}
          <div>
            <h2 className="text-xl font-bold flex items-center mb-3">
              <BellRing className="h-5 w-5 mr-2 text-rose-500" />
              Notifications
            </h2>
            <Card>
              <CardContent className="px-3 py-4">
                <div className="space-y-2">
                  <div className="border-l-4 border-blue-500 pl-3 py-1">
                    <p className="text-sm font-medium">New Study Tool Added</p>
                    <p className="text-xs text-gray-500">Explore our new Flashcards tool</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="text-sm font-medium">Achievement Unlocked</p>
                    <p className="text-xs text-gray-500">5-day study streak!</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-3 py-1">
                    <p className="text-sm font-medium">Revision Due</p>
                    <p className="text-xs text-gray-500">Chemistry: Periodic Table</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6">
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-0 animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Ready to study?</h2>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <Link to="/tools">
                  <Clock className="mr-2 h-4 w-4" />
                  Start Pomodoro
                </Link>
              </Button>
              <Button asChild variant="outline">
                
              </Button>
              <Button asChild variant="secondary">
                
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default HomePage;