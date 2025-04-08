
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Filter, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PomodoroTimer } from '@/components/study-tools/PomodoroTimer';
import { Flashcards } from '@/components/study-tools/Flashcards';
import { StudyTimer } from '@/components/study-tools/StudyTimer';
import { NoteTaker } from '@/components/study-tools/NoteTaker';
import { FocusMode } from '@/components/study-tools/FocusMode';
import { GoalTracker } from '@/components/study-tools/GoalTracker';
import { studyTools } from '@/data/jeeData';
import { useStudyStats } from '@/context/StudyStatsContext';
import { motion } from 'framer-motion';

const StudyToolsPage = () => {
  const [activeToolId, setActiveToolId] = useState<string>('pomodoro');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favoriteTools, setFavoriteTools] = useState<string[]>(() => {
    const saved = localStorage.getItem('jeeFavoriteTools');
    return saved ? JSON.parse(saved) : ['pomodoro', 'flashcards'];
  });
  
  const { studyStreak, getTotalStudyTime, getStudyTimeByDay } = useStudyStats();
  
  // Get study time for today
  const weeklyData = getStudyTimeByDay(1);
  const todayMinutes = Object.values(weeklyData)[0] || 0;
  
  const handleToolClick = (toolId: string) => {
    setActiveToolId(toolId);
  };
  
  const toggleFavorite = (toolId: string) => {
    const newFavorites = favoriteTools.includes(toolId)
      ? favoriteTools.filter(id => id !== toolId)
      : [...favoriteTools, toolId];
    
    setFavoriteTools(newFavorites);
    localStorage.setItem('jeeFavoriteTools', JSON.stringify(newFavorites));
  };
  
  // Filter tools based on search and category
  const filteredTools = studyTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories from tools
  const categories = ['all', ...Array.from(new Set(studyTools.map(tool => tool.category)))];
  
  // Render the active tool component
  const renderActiveTool = () => {
    switch (activeToolId) {
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'flashcards':
        return <Flashcards />;
      case 'studyTimer':
        return <StudyTimer />;
      case 'noteTaker':
        return <NoteTaker />;
      case 'focusMode':
        return <FocusMode />;
      case 'goalTracker':
        return <GoalTracker />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">{studyTools.find(tool => tool.id === activeToolId)?.icon || '🛠️'}</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {activeToolId !== 'pomodoro' && activeToolId !== 'flashcards' && 
               activeToolId !== 'studyTimer' && activeToolId !== 'noteTaker' && 
               activeToolId !== 'focusMode' && activeToolId !== 'goalTracker' 
                ? "This tool is coming soon! Check back later." 
                : "Select a tool to begin"}
            </p>
            <Button variant="outline">Get notified when it's ready</Button>
          </div>
        );
    }
  };
  
  return (
    <div className="container max-w-6xl py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Study Tools
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
              <CardDescription>Select a tool to enhance your study experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools..."
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 pb-2">
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              {favoriteTools.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Favorites
                  </h3>
                  <div className="space-y-2">
                    {studyTools
                      .filter(tool => favoriteTools.includes(tool.id))
                      .map((tool) => (
                        <button
                          key={`fav-${tool.id}`}
                          onClick={() => handleToolClick(tool.id)}
                          className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-all ${
                            activeToolId === tool.id 
                              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02] animate-scale-in' 
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-xl" role="img" aria-label={tool.name}>
                            {tool.icon}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-xs opacity-90">{tool.description}</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                          >
                            <span className="text-yellow-500">★</span>
                          </Button>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
              
              <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-none">
                <div className="space-y-2">
                  {filteredTools
                    .filter(tool => !favoriteTools.includes(tool.id))
                    .map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-all ${
                          activeToolId === tool.id 
                            ? 'bg-primary text-primary-foreground shadow-md scale-[1.02] animate-scale-in' 
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl" role="img" aria-label={tool.name}>
                          {tool.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs opacity-90">{tool.description}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                        >
                          <span className="text-gray-300 hover:text-yellow-500">☆</span>
                        </Button>
                      </button>
                    ))
                  }
                  
                  {filteredTools.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No tools match your search
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="animate-fade-in flex items-center gap-2">
                <span className="text-2xl">{studyTools.find(tool => tool.id === activeToolId)?.icon}</span>
                <span>{studyTools.find(tool => tool.id === activeToolId)?.name || 'Select a Tool'}</span>
              </CardTitle>
              <CardDescription className="animate-fade-in">
                {studyTools.find(tool => tool.id === activeToolId)?.description || 'Choose a tool from the list to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderActiveTool()}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Insights</CardTitle>
                <CardDescription>Track your progress and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="time">
                  <TabsList className="mb-4">
                    <TabsTrigger value="time">Time Tracking</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="habits">Habits</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="time" className="p-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Today's Focus</h3>
                        <div className="text-3xl font-bold">{todayMinutes} min</div>
                        <p className="text-xs text-gray-500 mt-1">Try using the Pomodoro Timer</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Study Streak</h3>
                        <div className="text-3xl font-bold">{studyStreak.current} days 🔥</div>
                        <p className="text-xs text-gray-500 mt-1">Longest streak: {studyStreak.longest} days</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Total Study Time</h3>
                        <div className="text-3xl font-bold">{Math.round(getTotalStudyTime() / 60 * 10) / 10}h</div>
                        <p className="text-xs text-gray-500 mt-1">{getTotalStudyTime()} minutes logged</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Efficiency Rating</h3>
                        <div className="text-3xl font-bold">67% 📈</div>
                        <p className="text-xs text-gray-500 mt-1">Based on your study sessions</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="progress" className="p-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium text-gray-500 mb-1">Maths</div>
                        <div className="relative w-24 h-24 mx-auto">
                          <svg className="w-24 h-24" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#0891b2" strokeWidth="2" strokeDasharray="100" strokeDashoffset="35" transform="rotate(-90 18 18)"></circle>
                            <text x="18" y="18" textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="bold">65%</text>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium text-gray-500 mb-1">Physics</div>
                        <div className="relative w-24 h-24 mx-auto">
                          <svg className="w-24 h-24" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#15803d" strokeWidth="2" strokeDasharray="100" strokeDashoffset="48" transform="rotate(-90 18 18)"></circle>
                            <text x="18" y="18" textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="bold">52%</text>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium text-gray-500 mb-1">Chemistry</div>
                        <div className="relative w-24 h-24 mx-auto">
                          <svg className="w-24 h-24" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="100" strokeDashoffset="27" transform="rotate(-90 18 18)"></circle>
                            <text x="18" y="18" textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="bold">73%</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="habits" className="p-4 animate-fade-in">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Weekly Study Pattern</h3>
                        <div className="flex justify-between items-center h-16">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <div key={day} className="flex flex-col items-center">
                              <div className={`w-6 bg-primary rounded-t-sm animate-slide-in-right`} style={{ 
                                height: `${[30, 45, 20, 60, 35, 15, 10][i]}%`,
                                animationDelay: `${i * 0.1}s` 
                              }}></div>
                              <div className="text-xs mt-1">{day}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Best Study Time</h3>
                          <div className="text-xl font-bold">6:00 PM - 8:00 PM</div>
                          <p className="text-xs text-gray-500 mt-1">Based on your most productive sessions</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Consistency Score</h3>
                          <div className="text-xl font-bold">7.5/10</div>
                          <p className="text-xs text-gray-500 mt-1">Try to maintain regular study times</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyToolsPage;
