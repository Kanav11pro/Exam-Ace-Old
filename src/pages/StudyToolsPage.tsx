import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, BookMinus, Brain, Target, Calculator, Calendar, BookMarked, Music2, Bookmark, Eye, Trophy, FileQuestion, BookCheck, Sparkles, BellRing, PenLine, BookOpen, Star, Filter, BrainCircuit, ClipboardCheck, ArrowLeft, ArrowRight, Lightbulb, Info, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudyToolsGuide } from '@/components/study-tools/StudyToolsGuide';

// Study tool interface
interface StudyTool {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  usageGuide: string[];
  benefits: string[];
  icon: React.ReactNode;
  category: 'time' | 'content' | 'practice' | 'wellness' | 'organization';
  favorite?: boolean;
  lastUsed?: Date;
}

const StudyToolsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tools, setTools] = useState<StudyTool[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [recentlyUsedTools, setRecentlyUsedTools] = useState<StudyTool[]>([]);

  // Define study tools with detailed descriptions
  const studyTools: StudyTool[] = [
    // Time Management Category
    {
      id: 'pomodoro-timer',
      name: 'Pomodoro Timer',
      description: 'Focus with time-boxed intervals and breaks',
      detailedDescription: 'The Pomodoro Technique is a time management method that uses a timer to break work into focused intervals, traditionally 25 minutes, separated by short breaks. This technique helps maintain concentration and prevents burnout.',
      usageGuide: [
        'Set a 25-minute timer for focused study',
        'Take a 5-minute break after each session',
        'After 4 sessions, take a longer 15-30 minute break',
        'Choose your subject before starting'
      ],
      benefits: [
        'Improved focus and concentration',
        'Better time management',
        'Reduced mental fatigue',
        'Increased productivity'
      ],
      icon: <Clock className="h-6 w-6 text-red-500" />,
      category: 'time'
    },
    {
      id: 'study-timer',
      name: 'Study Timer',
      description: 'Track your study sessions and statistics',
      detailedDescription: 'A comprehensive timer that tracks your study sessions across different subjects, providing detailed analytics and insights into your study patterns and productivity.',
      usageGuide: [
        'Select your subject and topic',
        'Start the timer when you begin studying',
        'Pause when taking breaks',
        'Review your daily and weekly statistics'
      ],
      benefits: [
        'Track study time per subject',
        'Identify productive hours',
        'Set daily study goals',
        'Monitor progress over time'
      ],
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      category: 'time'
    },
    {
      id: 'eye-rest-timer',
      name: 'Eye Rest Timer',
      description: '20-20-20 rule timer for eye strain relief',
      detailedDescription: 'Follows the 20-20-20 rule to reduce eye strain during long study sessions. Every 20 minutes, look at something 20 feet away for 20 seconds.',
      usageGuide: [
        'Timer reminds you every 20 minutes',
        'Look at something 20 feet away',
        'Hold the gaze for 20 seconds',
        'Return to studying refreshed'
      ],
      benefits: [
        'Reduces eye strain and fatigue',
        'Prevents dry eyes',
        'Maintains visual health',
        'Improves long-term focus'
      ],
      icon: <Eye className="h-6 w-6 text-teal-500" />,
      category: 'wellness'
    },
    
    // Content & Notes Category
    {
      id: 'note-taker',
      name: 'Note Taker',
      description: 'Take organized notes while studying',
      detailedDescription: 'A digital note-taking tool designed for students, with features like text formatting, formula insertion, drawing capabilities, and organization by subjects and chapters.',
      usageGuide: [
        'Create notes organized by subject and chapter',
        'Use formatting tools for better readability',
        'Insert mathematical formulas and diagrams',
        'Search through your notes quickly'
      ],
      benefits: [
        'Well-organized digital notes',
        'Easy search and retrieval',
        'Multimedia support',
        'Sync across devices'
      ],
      icon: <PenLine className="h-6 w-6 text-violet-500" />,
      category: 'content'
    },
    {
      id: 'formula-sheet',
      name: 'Formula Sheet',
      description: 'Quick access to essential formulas',
      detailedDescription: 'A comprehensive collection of important formulas for Physics, Chemistry, and Mathematics, organized by chapters with quick search functionality.',
      usageGuide: [
        'Browse formulas by subject and chapter',
        'Use search to find specific formulas',
        'Bookmark frequently used formulas',
        'Download PDF versions for offline use'
      ],
      benefits: [
        'Quick formula reference',
        'Organized by chapters',
        'Searchable database',
        'Offline access available'
      ],
      icon: <Calculator className="h-6 w-6 text-rose-500" />,
      category: 'content'
    },
    {
      id: 'learning-resources',
      name: 'Learning Resources',
      description: 'Curated resources for each chapter',
      detailedDescription: 'Access curated learning materials including video lectures, practice problems, mock tests, and revision notes for every JEE chapter.',
      usageGuide: [
        'Select your subject and chapter',
        'Choose from Learn, Practice, Test, or Revise',
        'Access video lectures and study materials',
        'Track your progress through each chapter'
      ],
      benefits: [
        'Comprehensive study materials',
        'Structured learning path',
        'Multiple resource types',
        'Progress tracking'
      ],
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      category: 'content'
    },
    
    // Practice & Revision Category
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Create and practice with digital flashcards',
      detailedDescription: 'Create custom flashcards for quick revision and memory retention. Uses spaced repetition algorithm to optimize learning efficiency.',
      usageGuide: [
        'Create flashcards for important concepts',
        'Use the spaced repetition system',
        'Mark difficult cards for extra practice',
        'Review statistics to track improvement'
      ],
      benefits: [
        'Enhanced memory retention',
        'Spaced repetition learning',
        'Custom card creation',
        'Progress analytics'
      ],
      icon: <BookCheck className="h-6 w-6 text-emerald-500" />,
      category: 'practice'
    },
    {
      id: 'error-log',
      name: 'Error Log',
      description: 'Track and review your mistakes',
      detailedDescription: 'Maintain a log of mistakes and errors to identify weak areas and prevent repeated errors. Includes analysis and improvement suggestions.',
      usageGuide: [
        'Log errors immediately after practice',
        'Categorize by subject and topic',
        'Review error patterns regularly',
        'Create targeted practice sessions'
      ],
      benefits: [
        'Identify weak areas',
        'Prevent repeated mistakes',
        'Targeted improvement',
        'Error pattern analysis'
      ],
      icon: <ClipboardCheck className="h-6 w-6 text-red-500" />,
      category: 'practice'
    },
    {
      id: 'daily-quiz',
      name: 'Daily Quiz',
      description: 'Test your knowledge with quick quizzes',
      detailedDescription: 'Daily quizzes covering different topics to keep your knowledge fresh and identify areas that need more attention.',
      usageGuide: [
        'Take daily quizzes in your weak subjects',
        'Review explanations for wrong answers',
        'Track your daily quiz performance',
        'Set reminders for consistent practice'
      ],
      benefits: [
        'Daily knowledge reinforcement',
        'Consistent practice habit',
        'Immediate feedback',
        'Performance tracking'
      ],
      icon: <BookMinus className="h-6 w-6 text-green-500" />,
      category: 'practice'
    },
    {
      id: 'question-generator',
      name: 'Question Generator',
      description: 'Generate practice questions by topic',
      detailedDescription: 'AI-powered tool that generates practice questions based on specific topics and difficulty levels, providing unlimited practice opportunities.',
      usageGuide: [
        'Select subject and specific topics',
        'Choose difficulty level',
        'Generate custom question sets',
        'Practice with instant feedback'
      ],
      benefits: [
        'Unlimited practice questions',
        'Customizable difficulty',
        'Topic-specific practice',
        'Instant feedback'
      ],
      icon: <FileQuestion className="h-6 w-6 text-indigo-500" />,
      category: 'practice'
    },
    {
      id: 'mock-tests',
      name: 'Mock Tests',
      description: 'Full JEE simulation with timer',
      detailedDescription: 'Complete JEE Main and Advanced mock tests with real exam interface, timing, and detailed performance analysis.',
      usageGuide: [
        'Choose JEE Main or Advanced format',
        'Complete the test within time limits',
        'Review detailed performance analysis',
        'Identify areas for improvement'
      ],
      benefits: [
        'Real exam experience',
        'Time management practice',
        'Performance analysis',
        'Exam strategy development'
      ],
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      category: 'practice'
    },
    
    // Wellness & Focus Category
    {
      id: 'focus-mode',
      name: 'Focus Mode',
      description: 'Eliminate distractions and stay focused',
      detailedDescription: 'A distraction-free environment that blocks social media and other distracting websites while you study, with ambient sounds for better concentration.',
      usageGuide: [
        'Activate focus mode before studying',
        'Set study duration and subjects',
        'Choose ambient sounds if needed',
        'Take scheduled breaks'
      ],
      benefits: [
        'Eliminates digital distractions',
        'Improved concentration',
        'Better study environment',
        'Increased productivity'
      ],
      icon: <BrainCircuit className="h-6 w-6 text-indigo-500" />,
      category: 'wellness'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness',
      description: 'Guided meditation for better focus',
      detailedDescription: 'Guided meditation sessions specifically designed for students to reduce stress, improve focus, and enhance mental clarity.',
      usageGuide: [
        'Choose meditation duration (5-20 minutes)',
        'Find a quiet, comfortable space',
        'Follow the guided instructions',
        'Practice regularly for best results'
      ],
      benefits: [
        'Reduced stress and anxiety',
        'Improved focus and clarity',
        'Better emotional regulation',
        'Enhanced overall well-being'
      ],
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      category: 'wellness'
    },
    {
      id: 'study-music',
      name: 'Study Music',
      description: 'Concentration music & binaural beats',
      detailedDescription: 'Curated playlist of study music, binaural beats, and ambient sounds scientifically proven to enhance concentration and cognitive performance.',
      usageGuide: [
        'Choose from different music categories',
        'Adjust volume to comfortable levels',
        'Use with headphones for binaural beats',
        'Experiment to find what works best'
      ],
      benefits: [
        'Enhanced concentration',
        'Improved cognitive performance',
        'Reduced distractions',
        'Better mood while studying'
      ],
      icon: <Music2 className="h-6 w-6 text-blue-500" />,
      category: 'wellness'
    },
    {
      id: 'achievements',
      name: 'Achievements & Badges',
      description: 'Earn badges for your study accomplishments',
      detailedDescription: 'Gamified system that rewards consistent study habits, milestone achievements, and improvement with badges and certificates.',
      usageGuide: [
        'Complete daily study goals',
        'Maintain study streaks',
        'Achieve chapter completion milestones',
        'Share achievements with friends'
      ],
      benefits: [
        'Increased motivation',
        'Habit formation',
        'Progress visualization',
        'Sense of accomplishment'
      ],
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      category: 'wellness'
    },
    
    // Organization Category
    {
      id: 'goal-tracker',
      name: 'Goal Tracker',
      description: 'Set and track your study goals',
      detailedDescription: 'Set SMART goals for your JEE preparation and track progress with visual indicators, deadlines, and milestone celebrations.',
      usageGuide: [
        'Set specific, measurable goals',
        'Break large goals into smaller tasks',
        'Track daily and weekly progress',
        'Adjust goals based on performance'
      ],
      benefits: [
        'Clear direction and focus',
        'Measurable progress tracking',
        'Motivation through achievements',
        'Better time management'
      ],
      icon: <Target className="h-6 w-6 text-orange-500" />,
      category: 'organization'
    },
    {
      id: 'weekly-planner',
      name: 'Weekly Planner',
      description: 'Plan your study schedule for the week',
      detailedDescription: 'Comprehensive weekly planner that helps you schedule study sessions, track commitments, and maintain a balanced study routine.',
      usageGuide: [
        'Plan your week every Sunday',
        'Allocate time for each subject',
        'Include breaks and leisure time',
        'Review and adjust daily'
      ],
      benefits: [
        'Better time management',
        'Balanced study schedule',
        'Reduced stress',
        'Improved productivity'
      ],
      icon: <Calendar className="h-6 w-6 text-cyan-500" />,
      category: 'organization'
    },
    {
      id: 'revision-reminder',
      name: 'Revision Reminder',
      description: 'Spaced repetition based on forgetting curve',
      detailedDescription: 'Smart reminder system based on the forgetting curve that prompts you to revise topics at optimal intervals for maximum retention.',
      usageGuide: [
        'Mark topics as learned',
        'Receive automated revision reminders',
        'Follow the spaced repetition schedule',
        'Track retention rates'
      ],
      benefits: [
        'Optimal retention timing',
        'Automated reminders',
        'Efficient revision',
        'Long-term memory formation'
      ],
      icon: <BellRing className="h-6 w-6 text-purple-500" />,
      category: 'organization'
    },
    {
      id: 'bookmark-manager',
      name: 'Bookmark Manager',
      description: 'Save important topics and questions',
      detailedDescription: 'Organize and manage bookmarks for important topics, questions, formulas, and resources with tags and quick access.',
      usageGuide: [
        'Bookmark important content while studying',
        'Organize with tags and categories',
        'Create quick access collections',
        'Export bookmarks for offline use'
      ],
      benefits: [
        'Quick access to important content',
        'Organized resource management',
        'Easy content retrieval',
        'Efficient study sessions'
      ],
      icon: <Bookmark className="h-6 w-6 text-yellow-500" />,
      category: 'organization'
    }
  ];

  // Load favorites and recently used from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteStudyTools');
    const savedRecentlyUsed = localStorage.getItem('recentlyUsedStudyTools');
    
    let favoriteIds: string[] = [];
    let recentlyUsedData: Array<{id: string, lastUsed: string}> = [];
    
    if (savedFavorites) {
      favoriteIds = JSON.parse(savedFavorites);
    }
    
    if (savedRecentlyUsed) {
      recentlyUsedData = JSON.parse(savedRecentlyUsed);
    }
    
    const toolsWithFavorites = studyTools.map(tool => ({
      ...tool,
      favorite: favoriteIds.includes(tool.id),
      lastUsed: recentlyUsedData.find(item => item.id === tool.id) 
        ? new Date(recentlyUsedData.find(item => item.id === tool.id)!.lastUsed)
        : undefined
    }));
    
    setTools(toolsWithFavorites);
    
    // Set recently used tools (last 5)
    const recentTools = recentlyUsedData
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, 5)
      .map(item => toolsWithFavorites.find(tool => tool.id === item.id))
      .filter(Boolean) as StudyTool[];
    
    setRecentlyUsedTools(recentTools);
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (updatedTools: StudyTool[]) => {
    const favoriteIds = updatedTools.filter(tool => tool.favorite).map(tool => tool.id);
    localStorage.setItem('favoriteStudyTools', JSON.stringify(favoriteIds));
  };

  // Save recently used to localStorage
  const saveRecentlyUsed = (toolId: string) => {
    const savedRecentlyUsed = localStorage.getItem('recentlyUsedStudyTools');
    let recentlyUsedData: Array<{id: string, lastUsed: string}> = [];
    
    if (savedRecentlyUsed) {
      recentlyUsedData = JSON.parse(savedRecentlyUsed);
    }
    
    // Remove existing entry for this tool
    recentlyUsedData = recentlyUsedData.filter(item => item.id !== toolId);
    
    // Add to beginning
    recentlyUsedData.unshift({
      id: toolId,
      lastUsed: new Date().toISOString()
    });
    
    // Keep only last 10
    recentlyUsedData = recentlyUsedData.slice(0, 10);
    
    localStorage.setItem('recentlyUsedStudyTools', JSON.stringify(recentlyUsedData));
    
    // Update recently used tools display
    const recentTools = recentlyUsedData
      .slice(0, 5)
      .map(item => tools.find(tool => tool.id === item.id))
      .filter(Boolean) as StudyTool[];
    
    setRecentlyUsedTools(recentTools);
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
    saveRecentlyUsed(id);
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
      className="relative container max-w-7xl py-4 sm:py-8 px-4 sm:px-6"
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
            className={`absolute opacity-20 ${item.size} hidden sm:block`}
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
            className="text-2xl sm:text-3xl font-bold relative" 
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
          className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Enhance your JEE preparation with these specialized tools designed to streamline your study process, 
          improve retention, and boost your productivity.
        </motion.p>
      </div>

      {/* Study Tools Guide Button */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Study Tools Guide
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Complete guide to all study tools with detailed usage instructions and tips
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowGuide(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Info className="mr-2 h-4 w-4" />
                Open Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)} 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            {Object.entries(categoryLabels).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </motion.div>
      
      {/* Tools Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-800 shadow-sm w-full overflow-x-auto">
          <TabsTrigger value="categories" className="min-w-max">By Category</TabsTrigger>
          <TabsTrigger value="all" className="min-w-max">All Tools</TabsTrigger>
          <TabsTrigger value="favorites" className="min-w-max">
            Favorites ({favoriteTools.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="min-w-max">
            Recently Used ({recentlyUsedTools.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-8">
          {Object.keys(categoryLabels).filter(cat => cat !== 'all').map((category) => (
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {getFilteredTools(category).slice(0, 3).map(tool => (
                  <motion.div key={tool.id} variants={item}>
                    <Card 
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 h-full hover:-translate-y-2 relative"
                      onClick={() => navigateToTool(tool.id)}
                    >
                      <CardContent className="p-0 h-full">
                        <div className={`flex h-full bg-gradient-to-br ${getCategoryGradient(tool.category)} relative`}>
                          <div className="w-2 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                          <div className="flex flex-col p-6 flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {tool.icon}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:scale-110 transition-transform opacity-70 hover:opacity-100" 
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleFavorite(tool.id);
                                }}
                              >
                                <Star className={`h-5 w-5 ${tool.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
                                {tool.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                {tool.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-3">
                                {tool.detailedDescription}
                              </p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            </motion.div>
          ))}
        </TabsContent>
        
        {/* All Tools Tab */}
        <TabsContent value="all" className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {getFilteredTools(selectedCategory).map(tool => (
              <motion.div key={tool.id} variants={item}>
                <Card 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:-translate-y-2" 
                  onClick={() => navigateToTool(tool.id)}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {tool.icon}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:scale-110 transition-transform opacity-70 hover:opacity-100" 
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                      >
                        <Star className={`h-5 w-5 ${tool.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-3 mb-4">
                        {tool.detailedDescription}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Badge className={`text-xs ${getCategoryStyle(tool.category)}`}>
                        {categoryLabels[tool.category]}
                      </Badge>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {favoriteTools.map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Card 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:-translate-y-2" 
                    onClick={() => navigateToTool(tool.id)}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          {tool.icon}
                        </div>
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
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-3">
                          {tool.detailedDescription}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Badge className={`text-xs ${getCategoryStyle(tool.category)}`}>
                          {categoryLabels[tool.category]}
                        </Badge>
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
          {recentlyUsedTools.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {recentlyUsedTools.map(tool => (
                <motion.div key={tool.id} variants={item}>
                  <Card 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:-translate-y-2" 
                    onClick={() => navigateToTool(tool.id)}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          {tool.icon}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:scale-110 transition-transform opacity-70 hover:opacity-100" 
                            onClick={e => {
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                          >
                            <Star className={`h-5 w-5 ${tool.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-3">
                          {tool.detailedDescription}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <Badge className={`text-xs ${getCategoryStyle(tool.category)}`}>
                          {categoryLabels[tool.category]}
                        </Badge>
                        {tool.lastUsed && (
                          <span className="text-xs text-gray-400">
                            {tool.lastUsed.toLocaleDateString()}
                          </span>
                        )}
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
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recent tools</h3>
              <p className="text-gray-500">Your recently used tools will appear here</p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Study Tools Guide Modal */}
      <StudyToolsGuide 
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        tools={studyTools}
      />
    </motion.div>
  );
};

export default StudyToolsPage;
