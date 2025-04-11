
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  BookOpen,
  List,
  Calendar,
  PenLine,
  MusicIcon,
  Timer,
  BookMarked,
  TimerOff,
  FileQuestion,
  Calculator,
  Eye,
  BrainCircuit,
  ListTodo,
  Bell,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';

const tools = [
  {
    title: 'Pomodoro Timer',
    description: 'Focus with timed study sessions',
    icon: <Clock className="h-6 w-6" />,
    route: 'pomodoro-timer',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  },
  {
    title: 'Flashcards',
    description: 'Test your knowledge with flashcards',
    icon: <BookOpen className="h-6 w-6" />,
    route: 'flashcards',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    title: 'Formula Sheet',
    description: 'Quick reference for JEE formulas',
    icon: <Calculator className="h-6 w-6" />,
    route: 'formula-sheet',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
  },
  {
    title: 'Study Timer',
    description: 'Track your study hours',
    icon: <Timer className="h-6 w-6" />,
    route: 'study-timer',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    title: 'Weekly Planner',
    description: 'Organize your study schedule',
    icon: <Calendar className="h-6 w-6" />,
    route: 'weekly-planner',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  },
  {
    title: 'Note Taker',
    description: 'Take and organize your notes',
    icon: <PenLine className="h-6 w-6" />,
    route: 'note-taker',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  {
    title: 'Study Music',
    description: 'Focus-enhancing background music',
    icon: <MusicIcon className="h-6 w-6" />,
    route: 'study-music',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
  },
  {
    title: 'Bookmark Manager',
    description: 'Save and organize useful resources',
    icon: <BookMarked className="h-6 w-6" />,
    route: 'bookmark-manager',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  },
  {
    title: 'Focus Mode',
    description: 'Distraction-free study environment',
    icon: <LayoutDashboard className="h-6 w-6" />,
    route: 'focus-mode',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  },
  {
    title: 'Eye Rest Timer',
    description: 'Reminders to rest your eyes',
    icon: <Eye className="h-6 w-6" />,
    route: 'eye-rest-timer',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
  },
  {
    title: 'Mindfulness',
    description: 'Reduce study stress with mindfulness',
    icon: <BrainCircuit className="h-6 w-6" />,
    route: 'mindfulness',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  {
    title: 'Backlog Management',
    description: 'Track and manage pending tasks',
    icon: <ListTodo className="h-6 w-6" />,
    route: 'backlog-management',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    title: 'Daily Quiz',
    description: 'Test your knowledge daily',
    icon: <HelpCircle className="h-6 w-6" />,
    route: 'daily-quiz',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  },
  {
    title: 'Revision Reminder',
    description: 'Spaced repetition for effective learning',
    icon: <Bell className="h-6 w-6" />,
    route: 'revision-reminder',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
  },
  {
    title: 'Error Log',
    description: 'Track and learn from your mistakes',
    icon: <List className="h-6 w-6" />,
    route: 'error-log',
    color: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400'
  },
  {
    title: 'Mock Tests',
    description: 'Practice with full-length exams',
    icon: <FileQuestion className="h-6 w-6" />,
    route: 'mock-tests',
    color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
  },
  {
    title: 'Question Generator',
    description: 'Generate practice questions',
    icon: <HelpCircle className="h-6 w-6" />,
    route: 'question-generator',
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
  }
];

export default function StudyToolsPage() {
  const navigate = useNavigate();
  
  // Check if we're on the main study tools page or a specific tool
  const isMainPage = window.location.pathname === '/study-tools';
  
  if (!isMainPage) {
    // If we're in a specific tool, render that tool via the Outlet
    return <Outlet />;
  }
  
  return (
    <div className="container py-8 max-w-6xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Study Tools</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Boost your JEE preparation with these specialized study tools
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-md ${tool.color}`}>
                  {tool.icon}
                </div>
                <div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate(tool.route)}
              >
                Open Tool
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
