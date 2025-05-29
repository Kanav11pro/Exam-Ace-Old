
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Timer, 
  BookOpen, 
  Target, 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Award, 
  Clock,
  Focus,
  HelpCircle,
  Zap,
  PenTool,
  Coffee,
  Music,
  Eye,
  Calendar,
  FileText,
  Bookmark,
  BarChart3,
  CheckSquare,
  Layers,
  Heart,
  Users,
  Shuffle
} from 'lucide-react';

import { AdvancedStudyTimer } from '@/components/study-tools/AdvancedStudyTimer';
import { StudyToolsGuide } from '@/components/study-tools/StudyToolsGuide';
import { NoteTaker } from '@/components/study-tools/NoteTaker';
import { Flashcards } from '@/components/study-tools/Flashcards';
import { FormulaSheet } from '@/components/study-tools/FormulaSheet';
import { DailyQuiz } from '@/components/study-tools/DailyQuiz';
import { MockTests } from '@/components/study-tools/MockTests';
import { GoalTracker } from '@/components/study-tools/GoalTracker';
import { WeeklyPlanner } from '@/components/study-tools/WeeklyPlanner';
import { RevisionReminder } from '@/components/study-tools/RevisionReminder';
import { StudyMusic } from '@/components/study-tools/StudyMusic';
import { EyeRestTimer } from '@/components/study-tools/EyeRestTimer';
import { Mindfulness } from '@/components/study-tools/Mindfulness';
import { ErrorLog } from '@/components/study-tools/ErrorLog';
import { BookmarkManager } from '@/components/study-tools/BookmarkManager';
import { BacklogManagement } from '@/components/study-tools/BacklogManagement';
import { QuestionGenerator } from '@/components/study-tools/QuestionGenerator';

const studyTools = [
  {
    id: 'advanced-timer',
    name: 'Advanced Study Timer',
    description: 'Integrated timer combining deep focus, Pomodoro technique, and custom sessions with advanced productivity features',
    icon: <Timer className="h-6 w-6 text-blue-600" />,
    category: 'time',
    isPremium: false,
    isNew: true,
    component: AdvancedStudyTimer,
    detailedDescription: 'The Advanced Study Timer is a comprehensive time management tool that combines three powerful study techniques: Deep Focus sessions for uninterrupted concentration, Pomodoro Technique for structured work-break cycles, and Custom Timer for flexible study periods. It features fullscreen focus mode, motivational quotes, progress tracking, and smart notifications.',
    usageGuide: [
      'Choose your study mode: Deep Focus for long sessions, Pomodoro for structured cycles, or Custom for flexible timing',
      'Select your subject and chapter (optional) for accurate progress tracking',
      'Set your focus goal or what you want to accomplish in the session',
      'Click Start to begin your study session - the timer will track your progress',
      'Use fullscreen mode for distraction-free studying',
      'Enable auto-start features for seamless Pomodoro cycles',
      'Review your daily progress and maintain study streaks'
    ],
    benefits: [
      'Combines proven time management techniques in one tool',
      'Tracks study time automatically across subjects',
      'Provides motivational quotes and progress feedback',
      'Supports both focused deep work and structured breaks',
      'Offers fullscreen distraction-free mode',
      'Smart notifications and audio alerts',
      'Detailed analytics and progress tracking'
    ]
  },
  {
    id: 'note-taker',
    name: 'Smart Note Taker',
    description: 'Organized note-taking with templates, auto-save, and smart categorization by subjects',
    icon: <PenTool className="h-6 w-6 text-green-600" />,
    category: 'content',
    isPremium: false,
    component: NoteTaker,
    detailedDescription: 'Smart Note Taker helps you create, organize, and manage your study notes efficiently. It provides subject-wise organization, various note templates, and powerful search capabilities to help you find information quickly.',
    usageGuide: [
      'Select your subject and chapter to organize notes properly',
      'Choose from various note templates or start with a blank note',
      'Use the rich text editor to format your notes with headings, lists, and highlights',
      'Add tags to make notes easily searchable',
      'Use the search function to quickly find specific notes or topics',
      'Export notes as PDF or share them with study groups'
    ],
    benefits: [
      'Automatic organization by subject and chapter',
      'Rich text formatting for better note structure',
      'Quick search and filtering capabilities',
      'Multiple export options',
      'Auto-save prevents data loss',
      'Template library for different note types'
    ]
  },
  {
    id: 'flashcards',
    name: 'Interactive Flashcards',
    description: 'Create, study, and review flashcards with spaced repetition algorithm for better retention',
    icon: <Layers className="h-6 w-6 text-purple-600" />,
    category: 'practice',
    isPremium: false,
    component: Flashcards,
    detailedDescription: 'Interactive Flashcards use scientifically-proven spaced repetition to help you memorize and retain information more effectively. Create custom flashcards for any subject and let the algorithm schedule optimal review times.',
    usageGuide: [
      'Create flashcards by adding questions and answers',
      'Organize flashcards by subject, chapter, or custom categories',
      'Study using the spaced repetition algorithm',
      'Rate your confidence level after each card review',
      'Focus on cards you find difficult with targeted practice',
      'Track your progress and retention rates over time'
    ],
    benefits: [
      'Spaced repetition algorithm for optimal learning',
      'Progress tracking and analytics',
      'Customizable categories and tags',
      'Confidence-based review scheduling',
      'Export and import flashcard sets',
      'Study statistics and performance insights'
    ]
  },
  {
    id: 'formula-sheet',
    name: 'Formula Reference',
    description: 'Quick access to important formulas and concepts organized by subjects and chapters',
    icon: <FileText className="h-6 w-6 text-orange-600" />,
    category: 'content',
    isPremium: false,
    component: FormulaSheet,
    detailedDescription: 'Formula Reference provides instant access to important formulas, equations, and key concepts. Organized by subject and chapter, it serves as your quick reference guide during study sessions.',
    usageGuide: [
      'Browse formulas by subject (Maths, Physics, Chemistry)',
      'Use search to quickly find specific formulas',
      'Add your own custom formulas and notes',
      'Bookmark frequently used formulas for quick access',
      'Practice with built-in formula examples',
      'Export formula sheets for offline reference'
    ],
    benefits: [
      'Comprehensive formula database',
      'Quick search and filtering',
      'Custom formula addition',
      'Bookmark important formulas',
      'Example problems and solutions',
      'Offline access capability'
    ]
  },
  {
    id: 'daily-quiz',
    name: 'Daily Practice Quiz',
    description: 'Daily quizzes with adaptive difficulty to test and improve your knowledge consistently',
    icon: <Brain className="h-6 w-6 text-red-600" />,
    category: 'practice',
    isPremium: false,
    component: DailyQuiz,
    detailedDescription: 'Daily Practice Quiz provides fresh questions every day to test your knowledge and identify areas for improvement. The adaptive difficulty system adjusts to your performance level.',
    usageGuide: [
      'Take daily quizzes to test your current knowledge',
      'Choose specific subjects or take mixed topic quizzes',
      'Review detailed explanations for each answer',
      'Track your performance trends over time',
      'Focus on weak areas identified by the quiz',
      'Set daily quiz goals to maintain consistency'
    ],
    benefits: [
      'Fresh questions daily',
      'Adaptive difficulty based on performance',
      'Detailed answer explanations',
      'Performance analytics and trends',
      'Weak area identification',
      'Consistent practice routine'
    ]
  },
  {
    id: 'mock-tests',
    name: 'Mock Test Series',
    description: 'Full-length practice tests with detailed analysis and performance insights',
    icon: <Target className="h-6 w-6 text-indigo-600" />,
    category: 'practice',
    isPremium: true,
    component: MockTests,
    detailedDescription: 'Mock Test Series provides comprehensive practice tests that simulate real exam conditions. Get detailed performance analysis, time management insights, and subject-wise breakdowns.',
    usageGuide: [
      'Choose from various test patterns and durations',
      'Take tests under timed conditions',
      'Review detailed performance analysis',
      'Identify strong and weak areas',
      'Track improvement over multiple attempts',
      'Compare your performance with peers'
    ],
    benefits: [
      'Real exam simulation',
      'Comprehensive performance analysis',
      'Time management training',
      'Peer comparison and ranking',
      'Subject-wise detailed reports',
      'Progress tracking over time'
    ]
  },
  {
    id: 'goal-tracker',
    name: 'Goal & Progress Tracker',
    description: 'Set study goals, track milestones, and visualize your academic progress over time',
    icon: <TrendingUp className="h-6 w-6 text-cyan-600" />,
    category: 'organization',
    isPremium: false,
    component: GoalTracker,
    detailedDescription: 'Goal & Progress Tracker helps you set realistic study goals, break them into manageable milestones, and track your progress visually. Stay motivated with achievement badges and progress celebrations.',
    usageGuide: [
      'Set SMART goals for your studies (Specific, Measurable, Achievable, Relevant, Time-bound)',
      'Break large goals into smaller, manageable milestones',
      'Track daily and weekly progress toward your goals',
      'Celebrate achievements and learn from setbacks',
      'Adjust goals based on your progress and circumstances',
      'Share goals with study partners for accountability'
    ],
    benefits: [
      'SMART goal setting framework',
      'Visual progress tracking',
      'Milestone celebrations',
      'Goal adjustment flexibility',
      'Accountability features',
      'Achievement badges and rewards'
    ]
  },
  {
    id: 'weekly-planner',
    name: 'Study Planner',
    description: 'Comprehensive weekly and monthly study planning with calendar integration',
    icon: <Calendar className="h-6 w-6 text-pink-600" />,
    category: 'organization',
    isPremium: false,
    component: WeeklyPlanner,
    detailedDescription: 'Study Planner provides comprehensive scheduling tools to organize your study time effectively. Plan weekly and monthly study schedules, set reminders, and balance different subjects.',
    usageGuide: [
      'Create weekly study schedules with time blocks',
      'Assign subjects and topics to specific time slots',
      'Set study reminders and notifications',
      'Balance study time across different subjects',
      'Plan for exams and important deadlines',
      'Review and adjust your schedule regularly'
    ],
    benefits: [
      'Visual weekly and monthly planning',
      'Time block scheduling',
      'Subject balance optimization',
      'Reminder and notification system',
      'Deadline tracking',
      'Schedule flexibility and adjustments'
    ]
  },
  {
    id: 'revision-reminder',
    name: 'Revision Scheduler',
    description: 'Smart revision reminders based on forgetting curve and spaced repetition principles',
    icon: <Clock className="h-6 w-6 text-amber-600" />,
    category: 'organization',
    isPremium: false,
    component: RevisionReminder,
    detailedDescription: 'Revision Scheduler uses scientific principles of memory retention to schedule optimal revision times. Never forget to review important topics with smart, personalized reminders.',
    usageGuide: [
      'Mark topics as studied to start the revision schedule',
      'Receive smart reminders based on the forgetting curve',
      'Rate your confidence level after each revision',
      'Adjust revision frequency based on difficulty',
      'Track revision streaks and consistency',
      'Plan revision sessions around your schedule'
    ],
    benefits: [
      'Scientific forgetting curve algorithm',
      'Personalized revision schedules',
      'Confidence-based adjustments',
      'Streak tracking for motivation',
      'Flexible scheduling options',
      'Long-term retention optimization'
    ]
  },
  {
    id: 'study-music',
    name: 'Focus Music Player',
    description: 'Curated background music and nature sounds designed to enhance concentration',
    icon: <Music className="h-6 w-6 text-violet-600" />,
    category: 'wellness',
    isPremium: false,
    component: StudyMusic,
    detailedDescription: 'Focus Music Player offers carefully curated playlists of background music, white noise, and nature sounds scientifically proven to enhance concentration and reduce stress during study sessions.',
    usageGuide: [
      'Choose from various music categories: classical, ambient, nature sounds, or white noise',
      'Adjust volume levels to complement your study environment',
      'Use timer features to automatically stop music after study sessions',
      'Create custom playlists for different subjects or moods',
      'Enable focus mode to minimize distractions from the player',
      'Track which music types work best for your concentration'
    ],
    benefits: [
      'Scientifically curated focus-enhancing audio',
      'Multiple audio categories and styles',
      'Timer integration with study sessions',
      'Custom playlist creation',
      'Minimal distraction interface',
      'Concentration tracking and optimization'
    ]
  },
  {
    id: 'eye-rest',
    name: 'Eye Rest Timer',
    description: 'Protect your eyes with regular break reminders and eye exercise guides',
    icon: <Eye className="h-6 w-6 text-teal-600" />,
    category: 'wellness',
    isPremium: false,
    component: EyeRestTimer,
    detailedDescription: 'Eye Rest Timer helps protect your vision during long study sessions by reminding you to take regular breaks and providing guided eye exercises based on the 20-20-20 rule.',
    usageGuide: [
      'Enable automatic eye rest reminders (recommended every 20 minutes)',
      'Follow guided eye exercises during break periods',
      'Adjust reminder frequency based on your comfort',
      'Track your eye rest compliance over time',
      'Learn about proper study posture and screen distance',
      'Set custom break durations and exercise routines'
    ],
    benefits: [
      'Prevents digital eye strain',
      'Guided eye exercise routines',
      'Customizable reminder schedules',
      'Health compliance tracking',
      'Posture and ergonomics tips',
      'Long-term vision protection'
    ]
  },
  {
    id: 'mindfulness',
    name: 'Study Mindfulness',
    description: 'Meditation and breathing exercises to reduce stress and improve focus',
    icon: <Heart className="h-6 w-6 text-rose-600" />,
    category: 'wellness',
    isPremium: false,
    component: Mindfulness,
    detailedDescription: 'Study Mindfulness provides guided meditation, breathing exercises, and stress reduction techniques specifically designed for students to improve focus, reduce anxiety, and enhance overall well-being.',
    usageGuide: [
      'Start with short 5-minute guided meditation sessions',
      'Practice breathing exercises before stressful study sessions',
      'Use quick stress relief techniques during exam preparation',
      'Build a daily mindfulness routine for better mental health',
      'Track your mood and stress levels over time',
      'Access emergency calm-down exercises when overwhelmed'
    ],
    benefits: [
      'Reduces study-related stress and anxiety',
      'Improves focus and concentration',
      'Builds emotional resilience',
      'Better sleep quality',
      'Enhanced overall well-being',
      'Coping strategies for exam pressure'
    ]
  },
  {
    id: 'error-log',
    name: 'Mistake Tracker',
    description: 'Log and analyze your mistakes to avoid repeating them in exams',
    icon: <CheckSquare className="h-6 w-6 text-red-500" />,
    category: 'practice',
    isPremium: false,
    component: ErrorLog,
    detailedDescription: 'Mistake Tracker helps you systematically record, analyze, and learn from your errors. By understanding your mistake patterns, you can avoid repeating them in actual exams.',
    usageGuide: [
      'Record mistakes immediately after practice sessions or mock tests',
      'Categorize errors by type (conceptual, calculation, careless, etc.)',
      'Add detailed explanations and correct solutions',
      'Review mistake patterns regularly to identify weak areas',
      'Create targeted practice sessions for frequent mistake types',
      'Track improvement over time as mistake frequency decreases'
    ],
    benefits: [
      'Systematic mistake tracking and analysis',
      'Pattern recognition for common errors',
      'Targeted improvement strategies',
      'Reduced error repetition in exams',
      'Better understanding of weak concepts',
      'Progress tracking and confidence building'
    ]
  },
  {
    id: 'bookmarks',
    name: 'Study Bookmarks',
    description: 'Save and organize important study resources, links, and references',
    icon: <Bookmark className="h-6 w-6 text-yellow-600" />,
    category: 'organization',
    isPremium: false,
    component: BookmarkManager,
    detailedDescription: 'Study Bookmarks helps you organize and quickly access important study resources, including websites, videos, PDFs, and reference materials, all categorized by subject and topic.',
    usageGuide: [
      'Save important websites, videos, and online resources',
      'Organize bookmarks by subject, chapter, and custom tags',
      'Add notes and descriptions to each bookmark',
      'Create bookmark collections for specific topics',
      'Share useful resources with study groups',
      'Export bookmark lists for offline reference'
    ],
    benefits: [
      'Centralized resource organization',
      'Quick access to study materials',
      'Collaborative resource sharing',
      'Custom categorization and tagging',
      'Search and filter capabilities',
      'Cross-platform accessibility'
    ]
  },
  {
    id: 'backlog',
    name: 'Study Backlog',
    description: 'Manage pending topics, assignments, and study tasks with priority scheduling',
    icon: <BarChart3 className="h-6 w-6 text-gray-600" />,
    category: 'organization',
    isPremium: false,
    component: BacklogManagement,
    detailedDescription: 'Study Backlog helps you track and prioritize pending study tasks, assignments, and topics that need attention. Never lose track of what needs to be studied next.',
    usageGuide: [
      'Add pending topics, assignments, and study tasks to your backlog',
      'Set priority levels and due dates for each item',
      'Break large tasks into smaller, manageable subtasks',
      'Schedule backlog items into your study plan',
      'Track completion progress and update priorities',
      'Review and adjust your backlog regularly'
    ],
    benefits: [
      'Comprehensive task tracking',
      'Priority-based organization',
      'Progress monitoring',
      'Deadline management',
      'Task breakdown capabilities',
      'Integration with study planning'
    ]
  },
  {
    id: 'question-generator',
    name: 'Question Generator',
    description: 'AI-powered question generation from your study materials for practice',
    icon: <Shuffle className="h-6 w-6 text-blue-500" />,
    category: 'practice',
    isPremium: true,
    component: QuestionGenerator,
    detailedDescription: 'Question Generator uses AI to create practice questions from your study materials, helping you test your understanding and prepare for exams with unlimited practice opportunities.',
    usageGuide: [
      'Upload or input your study material (text, notes, or topics)',
      'Select question types (MCQ, short answer, essay questions)',
      'Choose difficulty levels and number of questions',
      'Generate practice questions instantly',
      'Take practice tests with generated questions',
      'Review answers and explanations'
    ],
    benefits: [
      'Unlimited practice question generation',
      'Multiple question formats',
      'Adaptive difficulty levels',
      'Instant feedback and explanations',
      'Covers all study material comprehensively',
      'Saves time on creating practice tests'
    ]
  }
];

export default function StudyToolsPage() {
  const [selectedTool, setSelectedTool] = useState<string>('advanced-timer');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showGuide, setShowGuide] = useState(false);

  const categories = [
    { id: 'all', name: 'All Tools', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'time', name: 'Time Management', icon: <Clock className="h-4 w-4" /> },
    { id: 'content', name: 'Content & Notes', icon: <PenTool className="h-4 w-4" /> },
    { id: 'practice', name: 'Practice & Tests', icon: <Target className="h-4 w-4" /> },
    { id: 'wellness', name: 'Health & Wellness', icon: <Heart className="h-4 w-4" /> },
    { id: 'organization', name: 'Organization', icon: <Layers className="h-4 w-4" /> }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? studyTools 
    : studyTools.filter(tool => tool.category === selectedCategory);

  const selectedToolData = studyTools.find(tool => tool.id === selectedTool);
  const SelectedComponent = selectedToolData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-blue-600" />
            Advanced Study Tools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Supercharge your learning with our comprehensive suite of study tools designed to enhance focus, 
            improve retention, and boost academic performance.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              onClick={() => setShowGuide(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Study Tools Guide
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tool Categories and List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Tool Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {/* Category Filter */}
                    <div className="space-y-2 mb-4">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.icon}
                          <span className="ml-2">{category.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {category.id === 'all' ? studyTools.length : studyTools.filter(t => t.category === category.id).length}
                          </Badge>
                        </Button>
                      ))}
                    </div>

                    {/* Tool List */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Available Tools ({filteredTools.length})
                      </h4>
                      {filteredTools.map(tool => (
                        <Button
                          key={tool.id}
                          variant={selectedTool === tool.id ? 'default' : 'ghost'}
                          className="w-full justify-start p-3 h-auto"
                          onClick={() => setSelectedTool(tool.id)}
                        >
                          <div className="flex items-start gap-3 text-left">
                            {tool.icon}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm truncate">{tool.name}</span>
                                {tool.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                                {tool.isPremium && <Badge className="text-xs bg-amber-500">Pro</Badge>}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedToolData && (
              <div className="space-y-6">
                {/* Tool Header */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedToolData.icon}
                        <div>
                          <CardTitle className="text-2xl flex items-center gap-2">
                            {selectedToolData.name}
                            {selectedToolData.isNew && <Badge variant="secondary">New</Badge>}
                            {selectedToolData.isPremium && <Badge className="bg-amber-500">Pro</Badge>}
                          </CardTitle>
                          <CardDescription className="text-base mt-1">
                            {selectedToolData.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {selectedToolData.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tool Component */}
                <div className="animate-fade-in">
                  {SelectedComponent && <SelectedComponent />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Study Tools Guide Modal */}
      <StudyToolsGuide 
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        tools={studyTools}
      />
    </div>
  );
}
