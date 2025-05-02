
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, BookMinus, Brain, Target, Calculator, Calendar, BookMarked, Music2, Bookmark, Eye, Trophy, FileQuestion, BookCheck, Sparkles, BellRing, PenLine, BookOpen, Star, Filter, BrainCircuit, ClipboardCheck, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

// Study tool interface
interface StudyTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'time' | 'content' | 'practice' | 'wellness' | 'organization';
  favorite?: boolean;
}

const StudyToolsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tools, setTools] = useState<StudyTool[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<string[]>(['all']);

  // Define study tools
  const studyTools: StudyTool[] = [
    // Time Management Category
    {
      id: 'pomodoro-timer',
      name: 'Pomodoro Timer',
      description: 'Focus with time-boxed intervals and breaks',
      icon: <Clock className="h-6 w-6 text-red-500" />,
      category: 'time'
    }, 
    {
      id: 'study-timer',
      name: 'Study Timer',
      description: 'Track your study sessions and statistics',
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      category: 'time'
    },
    {
      id: 'eye-rest-timer',
      name: 'Eye Rest Timer',
      description: '20-20-20 rule timer for eye strain relief',
      icon: <Eye className="h-6 w-6 text-teal-500" />,
      category: 'wellness'
    },
    
    // Content & Notes Category
    {
      id: 'note-taker',
      name: 'Note Taker',
      description: 'Take organized notes while studying',
      icon: <PenLine className="h-6 w-6 text-violet-500" />,
      category: 'content'
    },
    {
      id: 'formula-sheet',
      name: 'Formula Sheet',
      description: 'Quick access to essential formulas',
      icon: <Calculator className="h-6 w-6 text-rose-500" />,
      category: 'content'
    },
    {
      id: 'learning-resources',
      name: 'Learning Resources',
      description: 'Curated resources for each chapter',
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      category: 'content'
    },
    
    // Practice & Revision Category
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Create and practice with digital flashcards',
      icon: <BookCheck className="h-6 w-6 text-emerald-500" />,
      category: 'practice'
    },
    {
      id: 'error-log',
      name: 'Error Log',
      description: 'Track and review your mistakes',
      icon: <ClipboardCheck className="h-6 w-6 text-red-500" />,
      category: 'practice'
    },
    {
      id: 'daily-quiz',
      name: 'Daily Quiz',
      description: 'Test your knowledge with quick quizzes',
      icon: <BookMinus className="h-6 w-6 text-green-500" />,
      category: 'practice'
    },
    {
      id: 'question-generator',
      name: 'Question Generator',
      description: 'Generate practice questions by topic',
      icon: <FileQuestion className="h-6 w-6 text-indigo-500" />,
      category: 'practice'
    },
    {
      id: 'mock-tests',
      name: 'Mock Tests',
      description: 'Full JEE simulation with timer',
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      category: 'practice'
    },
    
    // Wellness & Focus Category
    {
      id: 'focus-mode',
      name: 'Focus Mode',
      description: 'Eliminate distractions and stay focused',
      icon: <BrainCircuit className="h-6 w-6 text-indigo-500" />,
      category: 'wellness'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness',
      description: 'Guided meditation for better focus',
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      category: 'wellness'
    },
    {
      id: 'study-music',
      name: 'Study Music',
      description: 'Concentration music & binaural beats',
      icon: <Music2 className="h-6 w-6 text-blue-500" />,
      category: 'wellness'
    },
    {
      id: 'achievements',
      name: 'Achievements & Badges',
      description: 'Earn badges for your study accomplishments',
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      category: 'wellness'
    },
    
    // Organization Category
    {
      id: 'goal-tracker',
      name: 'Goal Tracker',
      description: 'Set and track your study goals',
      icon: <Target className="h-6 w-6 text-orange-500" />,
      category: 'organization'
    },
    {
      id: 'weekly-planner',
      name: 'Weekly Planner',
      description: 'Plan your study schedule for the week',
      icon: <Calendar className="h-6 w-6 text-cyan-500" />,
      category: 'organization'
    },
    {
      id: 'revision-reminder',
      name: 'Revision Reminder',
      description: 'Spaced repetition based on forgetting curve',
      icon: <BellRing className="h-6 w-6 text-purple-500" />,
      category: 'organization'
    },
    {
      id: 'bookmark-manager',
      name: 'Bookmark Manager',
      description: 'Save important topics and questions',
      icon: <Bookmark className="h-6 w-6 text-yellow-500" />,
      category: 'organization'
    }
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteStudyTools');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites) as string[];
      const toolsWithFavorites = studyTools.map(tool => ({
        ...tool,
        favorite: favoriteIds.includes(tool.id)
      }));
      setTools(toolsWithFavorites);
    } else {
      setTools(studyTools);
    }
    
    // Initialize visible categories
    setVisibleCategories(['time', 'practice', 'content', 'organization', 'wellness']);
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (updatedTools: StudyTool[]) => {
    const favoriteIds = updatedTools.filter(tool => tool.favorite).map(tool => tool.id);
    localStorage.setItem('favoriteStudyTools', JSON.stringify(favoriteIds));
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const updatedTools = tools.map(tool => tool.id === id ? {
      ...tool,
      favorite: !tool.favorite
    } : tool);
    setTools(updatedTools);
    saveFavorites(updatedTools);
  };

  // Filter tools based on search term and category
  const getFilteredTools = (category: string) => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || tool.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  // Get favorites
  const favoriteTools = tools.filter(tool => tool.favorite);

  // Navigate to the selected tool
  const navigateToTool = (id: string) => {
    navigate(`/tools/${id}`);
  };

  // Category labels
  const categoryLabels: Record<string, string> = {
    'all': 'All Tools',
    'time': 'Time Management',
    'content': 'Content & Notes',
    'practice': 'Practice & Revision',
    'wellness': 'Wellness & Focus',
    'organization': 'Organization'
  };

  // Category styles
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      'time': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
      'content': 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-300',
      'practice': 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
      'wellness': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
      'organization': 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-300'
    };
    return styles[category] || '';
  };

  // Category background gradients
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'time': 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
      'content': 'from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/20',
      'practice': 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20',
      'wellness': 'from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20',
      'organization': 'from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-800/20'
    };
    return gradients[category] || '';
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const floatingIcons = [
    { icon: <Calculator className="text-blue-300 dark:text-blue-700" />, delay: 0, size: "h-10 w-10" },
    { icon: <BookOpen className="text-green-300 dark:text-green-700" />, delay: 2, size: "h-12 w-12" },
    { icon: <Brain className="text-purple-300 dark:text-purple-700" />, delay: 4, size: "h-14 w-14" },
    { icon: <Clock className="text-amber-300 dark:text-amber-700" />, delay: 1, size: "h-8 w-8" },
    { icon: <Lightbulb className="text-yellow-300 dark:text-yellow-700" />, delay: 3, size: "h-9 w-9" },
    { icon: <Target className="text-red-300 dark:text-red-700" />, delay: 5, size: "h-11 w-11" },
  ];
  
  return (
    <motion.div 
      className="relative container max-w-6xl py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Floating study icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute opacity-20 ${item.size}`}
            style={{
              top: `${Math.random() * 70 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0, -10, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: Math.random() * 5 + 15,
              repeat: Infinity,
              delay: item.delay,
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Gradient blobs */}
        <div className="study-blob study-blob-1"></div>
        <div className="study-blob study-blob-2"></div>
        <div className="study-blob study-blob-3"></div>
        
        {/* Circle patterns */}
        <svg width="100%" height="100%" className="absolute top-0 left-0 opacity-5 dark:opacity-10">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="none" stroke="currentColor" strokeWidth="1"></circle>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      {/* Page Header */}
      <div className="relative">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <motion.h1 
            className="text-3xl font-bold relative" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Study Tools
            <motion.span 
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            ></motion.span>
          </motion.h1>
        </div>
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Enhance your JEE preparation with these specialized tools designed to streamline your study process, 
          improve retention, and boost your productivity.
        </motion.p>
      </div>
      
      {/* Search and Filter */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center mb-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search tools..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)} 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
          >
            {Object.entries(categoryLabels).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </motion.div>
      
      {/* Tools Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-800 shadow-sm">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-8">
          {visibleCategories.filter(cat => cat !== 'all').map((category) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  {category === 'time' && <Clock className="h-5 w-5 text-blue-500" />}
                  {category === 'content' && <BookOpen className="h-5 w-5 text-violet-500" />}
                  {category === 'practice' && <Brain className="h-5 w-5 text-green-500" />}
                  {category === 'wellness' && <Sparkles className="h-5 w-5 text-amber-500" />}
                  {category === 'organization' && <Calendar className="h-5 w-5 text-cyan-500" />}
                  {categoryLabels[category]}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCategory(category)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {getFilteredTools(category).slice(0, 3).map(tool => (
                  <motion.div key={tool.id} variants={item}>
                    <Card 
                      className="overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800 h-full hover:-translate-y-1 hover:shadow-lg"
                      onClick={() => navigateToTool(tool.id)}
                    >
                      <CardContent className="p-0 h-full">
                        <div className={`flex h-full bg-gradient-to-br ${getCategoryGradient(tool.category)}`}>
                          <div className="w-2 h-full"></div>
                          <div className="flex items-start p-4 flex-1">
                            <div className="mr-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              {tool.icon}
                            </div>
                            <div className="flex-1 flex flex-col h-full">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{tool.name}</h3>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 hover:scale-110 transition-transform" 
                                  onClick={e => {
                                    e.stopPropagation();
                                    toggleFavorite(tool.id);
                                  }}
                                >
                                  <Star className={`h-5 w-5 ${tool.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </TabsContent>
        
        {/* All Tools Tab */}
        <TabsContent value="all" className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {getFilteredTools(selectedCategory).map(tool => (
              <motion.div key={tool.id} variants={item}>
                <Card 
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800 h-full hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => navigateToTool(tool.id)}
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex items-start p-4 h-full">
                      <div className="mr-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        {tool.icon}
                      </div>
                      <div className="flex-1 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{tool.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:scale-110 transition-transform" 
                            onClick={e => {
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                          >
                            <Star className={`h-5 w-5 ${tool.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                        <div className="mt-auto pt-2">
                          <Badge className={`text-xs ${getCategoryStyle(tool.category)}`}>
                            {categoryLabels[tool.category]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {getFilteredTools(selectedCategory).length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tools found</h3>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </motion.div>
          )}
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites">
          {favoriteTools.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {favoriteTools.map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Card 
                    className="overflow-hidden hover:shadow-md transition-all cursor-pointer h-full hover:-translate-y-1 hover:shadow-lg" 
                    onClick={() => navigateToTool(tool.id)}
                  >
                    <CardContent className="p-0 h-full">
                      <div className="flex items-start p-4 h-full">
                        <div className="mr-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                          {tool.icon}
                        </div>
                        <div className="flex-1 flex flex-col h-full">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{tool.name}</h3>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:scale-110 transition-transform" 
                              onClick={e => {
                                e.stopPropagation();
                                toggleFavorite(tool.id);
                              }}
                            >
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                          <div className="mt-auto pt-2">
                            <Badge className={`text-xs ${getCategoryStyle(tool.category)}`}>
                              {categoryLabels[tool.category]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-gray-500">Star your favorite tools to see them here</p>
            </motion.div>
          )}
        </TabsContent>
        
        {/* Recently Used Tab */}
        <TabsContent value="recent">
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-pulse-slow" />
            <h3 className="text-lg font-medium mb-2">No recent tools</h3>
            <p className="text-gray-500">Your recently used tools will appear here</p>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Tool Matrix - Productivity Guide */}
      <motion.section 
        className="mt-16 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-center mb-6">Study Tools Selection Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">When you need to focus</h3>
                  <p className="text-sm text-gray-500">Use Pomodoro Timer or Focus Mode</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">To improve retention</h3>
                  <p className="text-sm text-gray-500">Try Flashcards or Question Generator</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">For better planning</h3>
                  <p className="text-sm text-gray-500">Use Weekly Planner or Goal Tracker</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">When studying content</h3>
                  <p className="text-sm text-gray-500">Use Note Taker or Formula Sheet</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-center text-gray-500">Combining tools creates a comprehensive study system that addresses all aspects of your JEE preparation</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default StudyToolsPage;
