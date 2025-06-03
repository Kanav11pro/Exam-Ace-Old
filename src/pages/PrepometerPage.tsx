
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useJEEData } from '@/context/jee';
import { 
  Calculator, 
  Atom, 
  Beaker, 
  Target, 
  TrendingUp, 
  BookOpen,
  Star,
  Trophy,
  Rocket
} from 'lucide-react';

const PrepometerPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const { getProgressBySubject, getTotalProgress } = useJEEData();

  const subjects = [
    {
      name: 'Mathematics',
      key: 'Maths',
      icon: <Calculator className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50'
    },
    {
      name: 'Physics',
      key: 'Physics', 
      icon: <Atom className="h-8 w-8" />,
      color: 'from-purple-500 to-violet-500',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50'
    },
    {
      name: 'Chemistry',
      key: 'Chemistry',
      icon: <Beaker className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50'
    }
  ];

  const totalProgress = getTotalProgress();

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
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">JEE PREPOMETER</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Track Your JEE Journey
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Monitor your preparation progress across all subjects with detailed chapter-wise tracking.
          </p>

          {/* Overall Progress Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-12"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Overall Progress</span>
                </div>
                <div className="space-y-3">
                  <Progress value={totalProgress} className="h-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{totalProgress.toFixed(1)}%</span>
                    <Badge variant="secondary" className="px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {totalProgress > 75 ? 'Excellent' : totalProgress > 50 ? 'Good' : 'Keep Going!'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Subject Selection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {subjects.map((subject, index) => {
            const progress = getProgressBySubject(subject.key);
            const isSelected = selectedSubject === subject.key;

            return (
              <motion.div
                key={subject.key}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 ${
                    isSelected 
                      ? 'border-primary shadow-xl ring-4 ring-primary/20' 
                      : 'border-transparent hover:border-primary/30'
                  } ${subject.bgPattern}`}
                  onClick={() => setSelectedSubject(isSelected ? null : subject.key)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {subject.icon}
                      </motion.div>
                      <Badge 
                        variant={progress > 75 ? 'default' : progress > 50 ? 'secondary' : 'outline'}
                        className="px-3 py-1 font-semibold"
                      >
                        {progress.toFixed(1)}%
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold">{subject.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <Progress value={progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Target: 100%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">
                            {progress > 50 ? 'On Track' : 'Needs Focus'}
                          </span>
                        </div>
                      </div>

                      <Button 
                        className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90 text-white font-medium shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/subject/${subject.key}`;
                        }}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Study Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Animation Elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default PrepometerPage;
