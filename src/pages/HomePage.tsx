
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubjectCard } from '@/components/SubjectCard';
import { useStudyStats } from '@/context/StudyStatsContext';
import { useJEEData } from '@/context/jee';
import { ProgressBar } from '@/components/ProgressBar';
import { BookOpen, Flame, Clock, Target, Calculator, BookCheck, BrainCircuit, LineChart, BellRing, Zap, Calendar, BookMarked, BarChart4 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user } = useAuth();
  const { studyStreak, getTotalStudyTime, getStudyTimeByDay } = useStudyStats();
  const { getTotalProgress, getWeakChapters } = useJEEData();
  
  const totalProgress = getTotalProgress();
  const weakChapters = getWeakChapters();
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
  
  const upcomingEvents = [
    { title: "Chemistry Test", date: "Apr 12", subject: "Chemistry", urgent: true },
    { title: "Trigonometry Revision", date: "Apr 15", subject: "Maths", urgent: false },
    { title: "Mock JEE", date: "Apr 20", subject: "All Subjects", urgent: true }
  ];
  
  const quickTools = [
    { name: "Pomodoro Timer", icon: <Clock className="h-5 w-5" />, path: "/tools/pomodoro-timer" },
    { name: "Formula Sheet", icon: <Calculator className="h-5 w-5" />, path: "/tools/formula-sheet" },
    { name: "Flashcards", icon: <BookCheck className="h-5 w-5" />, path: "/tools/flashcards" },
    { name: "Focus Mode", icon: <BrainCircuit className="h-5 w-5" />, path: "/tools/focus-mode" }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <div className="container max-w-6xl py-6 animate-fade-in relative">
      {/* Decorative elements for 3D effect */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
      
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 shadow-sm relative overflow-hidden">
          {/* 3D decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#6366F1" d="M39.5,-65.3C52.9,-58.7,66.8,-50.6,75.2,-38.5C83.6,-26.4,86.4,-10.2,83.2,4.3C80,18.8,70.8,31.6,60.4,42.6C49.9,53.6,38.2,62.9,24.4,69C10.7,75.2,-5.1,78.2,-19.2,75.1C-33.2,72,-45.6,62.8,-55.8,51.2C-66,39.6,-74,25.7,-77.9,10.2C-81.8,-5.2,-81.6,-22.1,-74.6,-35.6C-67.6,-49,-53.8,-59,-39.3,-65.7C-24.9,-72.3,-9.9,-75.6,2.2,-79.3C14.4,-83,28.8,-87.1,39.5,-83.4C50.3,-79.7,59.4,-68.3,59.5,-56.9C59.7,-45.6,50.8,-34.3,39.5,-65.3Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                Welcome back, {user?.email?.split('@')[0] || 'Student'}!
              </motion.h1>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Let's continue your JEE preparation journey.
              </motion.p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.97 }}
              >
                <Button asChild className="transition-all hover:shadow-lg hover:shadow-blue-500/20">
                  <Link to="/tools">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study Tools
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.97 }}
              >
                <Button asChild variant="outline" className="transition-all hover:shadow-md">
                  <Link to="/prepometer">
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Prepometer
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden hover-lift">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-amber-800 dark:text-amber-300 font-medium text-sm">Study Streak</h3>
                  <div className="relative">
                    <div className="absolute inset-0 text-amber-500 animate-ping opacity-30">
                      <Flame className="h-5 w-5" />
                    </div>
                    <Flame className="h-5 w-5 text-amber-500 relative z-10" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-1">{studyStreak.current} days</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Best: {studyStreak.longest} days
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden hover-lift">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-blue-800 dark:text-blue-300 font-medium text-sm">Total Study</h3>
                  <div className="study-icon-3d">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-1">{Math.round(getTotalStudyTime() / 60 * 10) / 10}h</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {getTotalStudyTime()} minutes logged
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden hover-lift">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/40 dark:to-emerald-950/40 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-green-800 dark:text-green-300 font-medium text-sm">Today's Goal</h3>
                  <div className="study-icon-3d">
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{todayGoalStatus.percentage}%</p>
                  {todayGoalStatus.achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 15 
                      }}
                    >
                      <Badge className="bg-green-500 text-white text-xs">Achieved!</Badge>
                    </motion.div>
                  )}
                </div>
                <div className="mt-2">
                  <ProgressBar 
                    progress={todayGoalStatus.percentage} 
                    variant="dashboard" 
                    animated={true} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden hover-lift">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-950/40 dark:to-violet-950/40 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-purple-800 dark:text-purple-300 font-medium text-sm">Overall Progress</h3>
                  <div className="study-icon-3d">
                    <LineChart className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-1">{Math.round(totalProgress)}%</p>
                <div className="mt-2">
                  <ProgressBar 
                    progress={totalProgress} 
                    variant="dashboard" 
                    animated={true} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-3">All Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div whileHover={{ y: -5 }} whileTap={{ y: 0 }}>
              <SubjectCard subject="Maths" variant="maths" />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ y: 0 }}>
              <SubjectCard subject="Physics" variant="physics" />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ y: 0 }}>
              <SubjectCard subject="Chemistry" variant="chemistry" />
            </motion.div>
          </div>
          
          <h2 className="text-xl font-bold flex items-center mt-8 mb-3">
            <BookMarked className="h-5 w-5 mr-2 text-blue-600" />
            Quick Access Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickTools.map((tool, index) => (
              <motion.div 
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={tool.path}>
                  <Card className="hover:shadow-md transition-all hover:-translate-y-1 hover:shadow-indigo-500/10 cursor-pointer h-24 group">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center p-3">
                      <motion.div 
                        className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {tool.icon}
                      </motion.div>
                      <p className="text-sm font-medium">{tool.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <h2 className="text-xl font-bold flex items-center mb-3 text-rose-600">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Needs Attention
            </h2>
            <Card className="hover-lift">
              <CardContent className="px-3 py-4">
                {weakChapters.length > 0 ? (
                  <ul className="space-y-2">
                    {weakChapters.slice(0, 3).map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link to={`/subject/${item.subject}/${encodeURIComponent(item.chapter)}`} className="flex items-center justify-between hover:text-blue-600 transition-colors">
                          <span className="font-medium text-sm">{item.chapter}</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                            Weak
                          </Badge>
                        </Link>
                        <p className="text-xs text-gray-500">{item.subject}</p>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center py-2 text-indigo-600 text-base font-bold">
                    No weak chapters found
                  </p>
                )}
                {weakChapters.length > 3 && (
                  <div className="text-center mt-3">
                    <Button variant="link" size="sm" asChild>
                      <Link to="/dashboard">View all {weakChapters.length} weak chapters</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-bold flex items-center mb-3">
              <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
              Upcoming Events
            </h2>
            <Card className="hover-lift">
              <CardContent className="px-3 py-4">
                <ul className="space-y-2">
                  {upcomingEvents.map((event, index) => (
                    <motion.li 
                      key={index} 
                      className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{event.title}</span>
                            {event.urgent && (
                              <Badge className="bg-red-500 animate-pulse">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{event.subject}</p>
                        </div>
                        <Badge variant="outline">{event.date}</Badge>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="text-center mt-3">
                  <Button variant="link" size="sm" asChild>
                    <Link to="/tools">Set reminders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-bold flex items-center mb-3">
              <BellRing className="h-5 w-5 mr-2 text-rose-500" />
              Notifications
            </h2>
            <Card className="hover-lift">
              <CardContent className="px-3 py-4">
                <div className="space-y-2">
                  <motion.div 
                    className="border-l-4 border-blue-500 pl-3 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm font-medium">New Study Tool Added</p>
                    <p className="text-xs text-gray-500">Explore our new Flashcards tool</p>
                  </motion.div>
                  <motion.div 
                    className="border-l-4 border-green-500 pl-3 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm font-medium">Achievement Unlocked</p>
                    <p className="text-xs text-gray-500">5-day study streak!</p>
                  </motion.div>
                  <motion.div 
                    className="border-l-4 border-amber-500 pl-3 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm font-medium">Revision Due</p>
                    <p className="text-xs text-gray-500">Chemistry: Periodic Table</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-0 animate-fade-in hover-lift relative overflow-hidden">
          {/* 3D decorative elements */}
          <div className="absolute top-0 right-0 w-28 h-28 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-indigo-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <CardContent className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-4">Ready to study?</h2>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                  <Link to="/tools/pomodoro-timer">
                    <Clock className="mr-2 h-4 w-4" />
                    Start Pomodoro
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" className="border-indigo-200 dark:border-indigo-800">
                  <Link to="/tools/flashcards">
                    <BookCheck className="mr-2 h-4 w-4" />
                    Review Flashcards
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="secondary">
                  <Link to="/tools/mock-tests">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Take a Mock Test
                  </Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HomePage;
