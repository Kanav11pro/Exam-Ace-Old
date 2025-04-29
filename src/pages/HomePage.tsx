
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  BookCheck,
  Clock, 
  Calculator,
  BookMarked,
  BrainCircuit,
  ArrowRight,
  BookOpen,
  Zap,
  Target
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  
  // Animation variants for staggered animations
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

  // Study tools categorized for better organization
  const studyTools = [
    {
      category: "Study Sessions",
      description: "Tools to help you focus and manage your study time effectively",
      tools: [
        { name: "Pomodoro Timer", icon: <Clock className="h-5 w-5" />, path: "/tools/pomodoro-timer", description: "Study using timed intervals with breaks" },
        { name: "Focus Mode", icon: <BrainCircuit className="h-5 w-5" />, path: "/tools/focus-mode", description: "Eliminate distractions while studying" },
        { name: "Eye Rest Timer", icon: <Target className="h-5 w-5" />, path: "/tools/eye-rest-timer", description: "Protect your eyes with timed breaks" }
      ]
    },
    {
      category: "Learning Resources",
      description: "Materials to help you master your subjects",
      tools: [
        { name: "Flashcards", icon: <BookCheck className="h-5 w-5" />, path: "/tools/flashcards", description: "Create and review study cards" },
        { name: "Formula Sheet", icon: <Calculator className="h-5 w-5" />, path: "/tools/formula-sheet", description: "Quick reference for important formulas" },
        { name: "Notes & Resources", icon: <BookMarked className="h-5 w-5" />, path: "/resources", description: "All your study materials" }
      ]
    }
  ];

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="mb-12">
        <motion.div 
          className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/70 border border-blue-100 dark:border-blue-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 3D decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 rotate-12">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#6366F1" d="M39.5,-65.3C52.9,-58.7,66.8,-50.6,75.2,-38.5C83.6,-26.4,86.4,-10.2,83.2,4.3C80,18.8,70.8,31.6,60.4,42.6C49.9,53.6,38.2,62.9,24.4,69C10.7,75.2,-5.1,78.2,-19.2,75.1C-33.2,72,-45.6,62.8,-55.8,51.2C-66,39.6,-74,25.7,-77.9,10.2C-81.8,-5.2,-81.6,-22.1,-74.6,-35.6C-67.6,-49,-53.8,-59,-39.3,-65.7C-24.9,-72.3,-9.9,-75.6,2.2,-79.3C14.4,-83,28.8,-87.1,39.5,-83.4C50.3,-79.7,59.4,-68.3,59.5,-56.9C59.7,-45.6,50.8,-34.3,39.5,-65.3Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome to JEE Prepometer
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your complete JEE preparation companion with smart tools and resources to help you achieve your goals.
            </motion.p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.97 }}
              >
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 px-6">
                  <Link to="/subject/Maths">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Learning
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.97 }}
              >
                <Button asChild variant="outline" className="border-indigo-200 dark:border-indigo-800">
                  <Link to="/tools">
                    <Zap className="mr-2 h-4 w-4" />
                    Explore Tools
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <motion.section 
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Study Tools</span>
        </h2>

        <div className="grid gap-8">
          {studyTools.map((category, idx) => (
            <motion.div key={idx} variants={itemVariants} className="space-y-4">
              <div className="mb-2">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{category.category}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {category.tools.map((tool, index) => (
                  <motion.div 
                    key={tool.name}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Link to={tool.path} className="block h-full">
                      <Card className="h-full border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-800/50">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="mb-4 flex items-center">
                            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
                              {tool.icon}
                            </div>
                            <h3 className="font-semibold text-lg">{tool.name}</h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                            {tool.description}
                          </p>
                          <div className="mt-4 flex justify-end">
                            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center">
                              Open <ArrowRight className="ml-1 h-3 w-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Subject Overview Section */}
      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Subject Overview</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Mathematics', 'Physics', 'Chemistry'].map((subject) => (
            <motion.div 
              key={subject}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group"
            >
              <Link to={`/subject/${subject}`}>
                <Card className="overflow-hidden border-0 shadow-md group-hover:shadow-lg transition-all relative">
                  <div className={`h-2 w-full ${
                    subject === 'Mathematics' ? 'bg-blue-500' : 
                    subject === 'Physics' ? 'bg-purple-500' : 
                    'bg-green-500'
                  }`}></div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{subject}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {subject === 'Mathematics' ? 'Algebra, Calculus, Trigonometry, and more' : 
                       subject === 'Physics' ? 'Mechanics, Thermodynamics, Electromagnetism, and more' : 
                       'Organic, Inorganic, Physical Chemistry, and more'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center">
                        Explore chapters <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Getting Started Guide */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 p-8">
          <h2 className="text-2xl font-bold mb-4">New to JEE Prepometer?</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Get started with these helpful resources:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">1</div>
              <div>
                <h3 className="font-semibold">Create your study plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use our planning tools to create a personalized study schedule</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">2</div>
              <div>
                <h3 className="font-semibold">Practice with flashcards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create your own flashcards for efficient revision</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">3</div>
              <div>
                <h3 className="font-semibold">Track your progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your improvement with our dashboard analytics</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button asChild variant="outline" className="border-indigo-200 dark:border-indigo-800">
              <Link to="/dashboard">
                View Your Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
