
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Timer, 
  Brain, 
  Target, 
  BookOpen, 
  Calculator, 
  PenTool, 
  Zap,
  Clock,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const studyTools = [
  {
    id: 'advanced-study-timer',
    title: 'Advanced Study Timer',
    description: 'Powerful timer combining Pomodoro, Deep Focus, and Study Sessions',
    icon: <Timer className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['Pomodoro Technique', 'Deep Focus Mode', 'Study Sessions', 'Break Reminders'],
    category: 'Time Management',
    path: '/tools/advanced-study-timer'
  },
  {
    id: 'flashcards',
    title: 'Smart Flashcards',
    description: 'Create and study with intelligent spaced repetition flashcards',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-500',
    features: ['Spaced Repetition', 'Subject Categories', 'Progress Tracking', 'Custom Cards'],
    category: 'Learning',
    path: '/tools/flashcards'
  },
  {
    id: 'formula-sheet',
    title: 'Formula Sheet',
    description: 'Comprehensive collection of formulas for Physics, Chemistry, and Math',
    icon: <Calculator className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500',
    features: ['Subject-wise Organization', 'Search & Filter', 'Custom Formulas', 'Quick Reference'],
    category: 'Reference',
    path: '/tools/formula-sheet'
  },
  {
    id: 'daily-quiz',
    title: 'Daily Quiz',
    description: 'Test your knowledge with daily practice questions',
    icon: <Target className="h-6 w-6" />,
    color: 'from-orange-500 to-red-500',
    features: ['Daily Questions', 'Performance Analytics', 'Subject-wise Tests', 'Progress Reports'],
    category: 'Practice',
    path: '/tools/daily-quiz'
  },
  {
    id: 'mock-tests',
    title: 'Mock Tests',
    description: 'Full-length practice tests with detailed analysis',
    icon: <PenTool className="h-6 w-6" />,
    color: 'from-indigo-500 to-purple-500',
    features: ['Timed Tests', 'Detailed Solutions', 'Performance Analysis', 'Ranking System'],
    category: 'Assessment',
    path: '/tools/mock-tests'
  }
];

const categories = [
  { name: 'Time Management', count: 1, icon: <Clock className="h-4 w-4" /> },
  { name: 'Learning', count: 1, icon: <Brain className="h-4 w-4" /> },
  { name: 'Reference', count: 1, icon: <BookOpen className="h-4 w-4" /> },
  { name: 'Practice', count: 1, icon: <Target className="h-4 w-4" /> },
  { name: 'Assessment', count: 1, icon: <Users className="h-4 w-4" /> }
];

export const StudyToolsOverview = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Study Tools Hub
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Supercharge your JEE preparation with our comprehensive suite of study tools designed to boost productivity and learning efficiency.
        </motion.p>
      </div>

      {/* Categories Overview */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <Card key={category.name} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
                <Badge variant="secondary">{category.count} tool{category.count > 1 ? 's' : ''}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Tools Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Available Tools</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>5 tools available</span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {studyTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}>
                      {tool.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold mt-4">{tool.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{tool.description}</p>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-1">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={tool.path}>
                    <Button className="w-full group-hover:scale-105 transition-transform">
                      Launch Tool
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Start Tips */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Quick Start Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">🎯 Start with Timer</h4>
            <p className="text-muted-foreground">Begin your study session with the Advanced Study Timer to maintain focus and track your progress.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">📚 Create Flashcards</h4>
            <p className="text-muted-foreground">Build custom flashcards for difficult concepts and use spaced repetition for better retention.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800 dark:text-green-300">📊 Take Mock Tests</h4>
            <p className="text-muted-foreground">Regular practice with mock tests helps identify weak areas and improves exam performance.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
