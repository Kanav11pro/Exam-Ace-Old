
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Clock, BookMinus, Brain, Target, Calculator, Calendar, BookMarked, Music2, Bookmark, Eye, Trophy, FileQuestion, BookCheck, Sparkles, BellRing, PenLine, BookOpen, Star, Filter, BrainCircuit, ClipboardCheck, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tools, setTools] = useState<StudyTool[]>([]);

  // Define study tools
  const studyTools: StudyTool[] = [{
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Focus with time-boxed intervals and breaks',
    icon: <Clock className="h-6 w-6 text-red-500" />,
    category: 'time'
  }, {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Create and practice with digital flashcards',
    icon: <BookCheck className="h-6 w-6 text-emerald-500" />,
    category: 'practice'
  }, {
    id: 'study-timer',
    name: 'Study Timer',
    description: 'Track your study sessions and statistics',
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    category: 'time'
  }, {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Take organized notes while studying',
    icon: <PenLine className="h-6 w-6 text-violet-500" />,
    category: 'content'
  }, {
    id: 'focus-mode',
    name: 'Focus Mode',
    description: 'Eliminate distractions and stay focused',
    icon: <BrainCircuit className="h-6 w-6 text-indigo-500" />,
    category: 'wellness'
  }, {
    id: 'goal-tracker',
    name: 'Goal Tracker',
    description: 'Set and track your study goals',
    icon: <Target className="h-6 w-6 text-orange-500" />,
    category: 'organization'
  }, {
    id: 'formula-sheet',
    name: 'Formula Sheet',
    description: 'Quick access to essential formulas',
    icon: <Calculator className="h-6 w-6 text-rose-500" />,
    category: 'content'
  }, {
    id: 'weekly-planner',
    name: 'Weekly Planner',
    description: 'Plan your study schedule for the week',
    icon: <Calendar className="h-6 w-6 text-cyan-500" />,
    category: 'organization'
  }, {
    id: 'error-log',
    name: 'Error Log',
    description: 'Track and review your mistakes',
    icon: <ClipboardCheck className="h-6 w-6 text-red-500" />,
    category: 'practice'
  }, {
    id: 'revision-reminder',
    name: 'Revision Reminder',
    description: 'Spaced repetition based on forgetting curve',
    icon: <BellRing className="h-6 w-6 text-purple-500" />,
    category: 'organization'
  }, {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Guided meditation for better focus',
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    category: 'wellness'
  }, {
    id: 'daily-quiz',
    name: 'Daily Quiz',
    description: 'Test your knowledge with quick quizzes',
    icon: <BookMinus className="h-6 w-6 text-green-500" />,
    category: 'practice'
  }, {
    id: 'study-music',
    name: 'Study Music',
    description: 'Concentration music & binaural beats',
    icon: <Music2 className="h-6 w-6 text-blue-500" />,
    category: 'wellness'
  }, {
    id: 'bookmark-manager',
    name: 'Bookmark Manager',
    description: 'Save important topics and questions',
    icon: <Bookmark className="h-6 w-6 text-yellow-500" />,
    category: 'organization'
  }, {
    id: 'eye-rest-timer',
    name: 'Eye Rest Timer',
    description: '20-20-20 rule timer for eye strain relief',
    icon: <Eye className="h-6 w-6 text-teal-500" />,
    category: 'wellness'
  }, {
    id: 'achievements',
    name: 'Achievements & Badges',
    description: 'Earn badges for your study accomplishments',
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    category: 'wellness'
  }, {
    id: 'question-generator',
    name: 'Question Generator',
    description: 'Generate practice questions by topic',
    icon: <FileQuestion className="h-6 w-6 text-indigo-500" />,
    category: 'practice'
  }, {
    id: 'mock-tests',
    name: 'Mock Tests',
    description: 'Full JEE simulation with timer',
    icon: <Brain className="h-6 w-6 text-blue-500" />,
    category: 'practice'
  }, {
    id: 'learning-resources',
    name: 'Learning Resources',
    description: 'Curated resources for each chapter',
    icon: <BookOpen className="h-6 w-6 text-green-500" />,
    category: 'content'
  }];

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
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get favorites
  const favoriteTools = tools.filter(tool => tool.favorite);

  // Navigate to the selected tool
  const navigateToTool = (id: string) => {
    // Implement navigation to specific tool components
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
  
  return (
    <motion.div 
      className="container max-w-6xl py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Study Tools</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Enhance your JEE preparation with these specialized tools</p>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search tools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm">
            {Object.entries(categoryLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
          </select>
        </div>
      </div>
      
      {/* Tools Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
        </TabsList>
        
        {/* All Tools Tab */}
        <TabsContent value="all" className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredTools.map(tool => (
              <motion.div key={tool.id} variants={item}>
                <Card 
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-800 h-full"
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
          
          {filteredTools.length === 0 && (
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
                    className="overflow-hidden hover:shadow-md transition-all cursor-pointer h-full" 
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
      
      {/* Featured Categories */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">Tool Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryLabels).filter(([key]) => key !== 'all').map(([key, label], index) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className="hover:shadow-md transition-all cursor-pointer overflow-hidden h-full" 
                onClick={() => setSelectedCategory(key)}
              >
                <CardContent className="p-0 h-full">
                  <div className={`bg-gradient-to-r ${key === 'time' ? 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20' : key === 'content' ? 'from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/20' : key === 'practice' ? 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20' : key === 'wellness' ? 'from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20' : 'from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-800/20'} p-6 h-full`}>
                    <h3 className="font-semibold text-lg">{label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {tools.filter(tool => tool.category === key).length} tools
                    </p>
                    <div className="mt-4 flex justify-end">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudyToolsPage;
