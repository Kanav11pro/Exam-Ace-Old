import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  Target, 
  BookOpen, 
  Calculator, 
  Lightbulb,
  Timer,
  Music,
  Eye,
  ListTodo,
  Bookmark,
  MessageSquare,
  Calendar,
  TrendingUp,
  Zap,
  Heart,
  Settings,
  CreditCard,
  TestTube
} from 'lucide-react';

// Import study tool components
import { PomodoroTimer } from '@/components/study-tools/PomodoroTimer';
import { StudyTimer } from '@/components/study-tools/StudyTimer';
import { Flashcards } from '@/components/study-tools/Flashcards';
import { DailyQuiz } from '@/components/study-tools/DailyQuiz';
import { FormulaSheet } from '@/components/study-tools/FormulaSheet';
import { NoteTaker } from '@/components/study-tools/NoteTaker';
import { StudyMusic } from '@/components/study-tools/StudyMusic';
import { EyeRestTimer } from '@/components/study-tools/EyeRestTimer';
import { BacklogManagement } from '@/components/study-tools/BacklogManagement';
import { BookmarkManager } from '@/components/study-tools/BookmarkManager';
import { ErrorLog } from '@/components/study-tools/ErrorLog';
import { WeeklyPlanner } from '@/components/study-tools/WeeklyPlanner';
import { GoalTracker } from '@/components/study-tools/GoalTracker';
import { FocusMode } from '@/components/study-tools/FocusMode';
import { Mindfulness } from '@/components/study-tools/Mindfulness';
import { RevisionReminder } from '@/components/study-tools/RevisionReminder';
import { MockTests } from '@/components/study-tools/MockTests';

const studyTools = [
  // Core Study Tools
  {
    id: 'flashcards',
    title: 'Smart Flashcards',
    description: 'Advanced spaced repetition with AI-powered insights',
    icon: <CreditCard className="h-6 w-6" />,
    component: Flashcards,
    category: 'Core',
    color: 'from-purple-500 to-pink-500',
    badge: 'Enhanced',
    features: ['Spaced Repetition', 'Progress Tracking', '3D Animations', 'Smart Wizard']
  },
  {
    id: 'daily-quiz',
    title: 'Daily Quiz',
    description: 'Test your knowledge with curated questions',
    icon: <TestTube className="h-6 w-6" />,
    component: DailyQuiz,
    category: 'Core',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Updated',
    features: ['Random Questions', 'Instant Feedback', 'Performance Analytics']
  },
  {
    id: 'formula-sheet',
    title: 'Formula Sheet',
    description: 'Quick access to important formulas',
    icon: <Calculator className="h-6 w-6" />,
    component: FormulaSheet,
    category: 'Core',
    color: 'from-green-500 to-emerald-500',
    features: ['Search & Filter', 'LaTeX Support', 'Categorized']
  },
  
  // Time Management
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    description: 'Focus sessions with built-in breaks',
    icon: <Timer className="h-6 w-6" />,
    component: PomodoroTimer,
    category: 'Time Management',
    color: 'from-red-500 to-orange-500',
    features: ['25-min Focus', 'Break Reminders', 'Session Tracking']
  },
  {
    id: 'study-timer',
    title: 'Study Timer',
    description: 'Track your study sessions',
    icon: <Clock className="h-6 w-6" />,
    component: StudyTimer,
    category: 'Time Management',
    color: 'from-indigo-500 to-purple-500',
    features: ['Session Tracking', 'Subject-wise Time', 'Daily Goals']
  },
  {
    id: 'weekly-planner',
    title: 'Weekly Planner',
    description: 'Plan your study schedule',
    icon: <Calendar className="h-6 w-6" />,
    component: WeeklyPlanner,
    category: 'Time Management',
    color: 'from-teal-500 to-blue-500',
    features: ['Weekly View', 'Task Management', 'Progress Tracking']
  },
  
  // Organization
  {
    id: 'backlog-management',
    title: 'Backlog Management',
    description: 'Organize your study tasks and priorities',
    icon: <ListTodo className="h-6 w-6" />,
    component: BacklogManagement,
    category: 'Organization',
    color: 'from-amber-500 to-yellow-500',
    badge: 'New',
    features: ['Task Prioritization', 'Progress Tracking', 'Deadline Management']
  },
  {
    id: 'notes',
    title: 'Note Taker',
    description: 'Digital note-taking with rich formatting',
    icon: <BookOpen className="h-6 w-6" />,
    component: NoteTaker,
    category: 'Organization',
    color: 'from-slate-500 to-gray-600',
    features: ['Rich Text', 'Auto-save', 'Search Notes']
  },
  {
    id: 'bookmarks',
    title: 'Bookmark Manager',
    description: 'Save and organize important topics',
    icon: <Bookmark className="h-6 w-6" />,
    component: BookmarkManager,
    category: 'Organization',
    color: 'from-yellow-500 to-amber-500',
    features: ['Quick Save', 'Category Tags', 'Smart Search']
  },
  {
    id: 'error-log',
    title: 'Error Log',
    description: 'Track and learn from mistakes',
    icon: <MessageSquare className="h-6 w-6" />,
    component: ErrorLog,
    category: 'Organization',
    color: 'from-red-500 to-pink-500',
    features: ['Mistake Tracking', 'Pattern Analysis', 'Improvement Tips']
  },
  
  // Wellness & Focus
  {
    id: 'focus-mode',
    title: 'Focus Mode',
    description: 'Eliminate distractions while studying',
    icon: <Target className="h-6 w-6" />,
    component: FocusMode,
    category: 'Wellness',
    color: 'from-green-500 to-teal-500',
    features: ['Distraction Blocking', 'Ambient Sounds', 'Focus Metrics']
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    description: 'Meditation and breathing exercises',
    icon: <Heart className="h-6 w-6" />,
    component: Mindfulness,
    category: 'Wellness',
    color: 'from-pink-500 to-rose-500',
    features: ['Guided Meditation', 'Breathing Exercises', 'Stress Relief']
  },
  {
    id: 'eye-rest',
    title: 'Eye Rest Timer',
    description: 'Protect your eyes with regular breaks',
    icon: <Eye className="h-6 w-6" />,
    component: EyeRestTimer,
    category: 'Wellness',
    color: 'from-cyan-500 to-blue-500',
    features: ['20-20-20 Rule', 'Break Reminders', 'Eye Exercises']
  },
  {
    id: 'study-music',
    title: 'Study Music',
    description: 'Focus-enhancing background music',
    icon: <Music className="h-6 w-6" />,
    component: StudyMusic,
    category: 'Wellness',
    color: 'from-violet-500 to-purple-500',
    features: ['Focus Playlists', 'Nature Sounds', 'Binaural Beats']
  },
  
  // Advanced Tools
  {
    id: 'goal-tracker',
    title: 'Goal Tracker',
    description: 'Set and track study goals',
    icon: <TrendingUp className="h-6 w-6" />,
    component: GoalTracker,
    category: 'Advanced',
    color: 'from-emerald-500 to-green-500',
    features: ['SMART Goals', 'Progress Analytics', 'Milestone Rewards']
  },
  {
    id: 'revision-reminder',
    title: 'Revision Reminder',
    description: 'Smart reminders for topic revision',
    icon: <Zap className="h-6 w-6" />,
    component: RevisionReminder,
    category: 'Advanced',
    color: 'from-orange-500 to-red-500',
    features: ['Spaced Intervals', 'Smart Notifications', 'Priority Based']
  },
  {
    id: 'mock-tests',
    title: 'Mock Tests',
    description: 'Practice with full-length test papers',
    icon: <Settings className="h-6 w-6" />,
    component: MockTests,
    category: 'Advanced',
    color: 'from-gray-500 to-slate-600',
    features: ['Timed Tests', 'Detailed Analysis', 'Performance Insights']
  }
];

const categories = ['All', 'Core', 'Time Management', 'Organization', 'Wellness', 'Advanced'];

export default function StudyToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = selectedCategory === 'All' 
    ? studyTools 
    : studyTools.filter(tool => tool.category === selectedCategory);

  const SelectedComponent = selectedTool 
    ? studyTools.find(tool => tool.id === selectedTool)?.component 
    : null;

  if (selectedTool && SelectedComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              onClick={() => setSelectedTool(null)}
              className="mb-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              ← Back to Study Tools
            </Button>
          </motion.div>
          <SelectedComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Tools Arsenal
              </h1>
              <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                Supercharge your JEE preparation with our comprehensive suite of study tools
              </p>
            </motion.div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-200 ${
                      selectedCategory === category 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg" 
                        : "hover:shadow-md"
                    }`}
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`bg-gradient-to-r ${tool.color} rounded-xl p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        {tool.icon}
                      </div>
                      {tool.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`${
                            tool.badge === 'New' ? 'bg-green-100 text-green-800' :
                            tool.badge === 'Enhanced' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-200">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, featureIndex) => (
                        <Badge 
                          key={featureIndex} 
                          variant="outline" 
                          className="text-xs group-hover:border-purple-300 transition-colors"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className={`w-full bg-gradient-to-r ${tool.color} hover:shadow-lg transition-all duration-200 text-white border-0 group-hover:scale-105`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      Launch Tool
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl p-8 text-white text-center shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">🚀 Boost Your Productivity</h2>
            <p className="text-lg mb-6 text-white/90">
              Combine multiple tools for maximum efficiency. Try the Pomodoro Timer with Focus Mode, 
              or use Flashcards with the Goal Tracker for structured learning!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Brain className="h-4 w-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                JEE-Focused
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Lightbulb className="h-4 w-4 mr-2" />
                Research-Based
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
