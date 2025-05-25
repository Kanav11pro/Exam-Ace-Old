
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
  Target,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  TrendingUp,
  Star,
  Globe,
  Shield,
  Lightbulb
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  
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

  const studyTools = [
    {
      category: "Study Sessions",
      description: "Revolutionary tools to transform your study experience",
      tools: [
        { name: "Pomodoro Timer", icon: <Clock className="h-5 w-5" />, path: "/tools/pomodoro-timer", description: "AI-powered study intervals with personalized breaks" },
        { name: "Focus Mode", icon: <BrainCircuit className="h-5 w-5" />, path: "/tools/focus-mode", description: "Neural-enhanced concentration environment" },
        { name: "Eye Rest Timer", icon: <Target className="h-5 w-5" />, path: "/tools/eye-rest-timer", description: "Smart eye care with biometric monitoring" }
      ]
    },
    {
      category: "Learning Arsenal", 
      description: "Next-generation learning tools powered by AI",
      tools: [
        { name: "Flashcards", icon: <BookCheck className="h-5 w-5" />, path: "/tools/flashcards", description: "Adaptive spaced repetition with neural networks" },
        { name: "Formula Sheet", icon: <Calculator className="h-5 w-5" />, path: "/tools/formula-sheet", description: "Interactive formulas with real-time problem solving" },
        { name: "Notes & Resources", icon: <BookMarked className="h-5 w-5" />, path: "/resources", description: "Intelligent knowledge management system" }
      ]
    }
  ];

  const revolutionaryFeatures = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "AI-Powered Progress",
      description: "Machine learning algorithms track your learning patterns and optimize your study path",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Competitive Edge", 
      description: "Real-time rankings and performance analytics against top JEE aspirants nationwide",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Connect with 100,000+ JEE aspirants, share doubts, and learn collaboratively",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Adaptive Learning",
      description: "Platform evolves with your performance, identifying weak areas automatically",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="container max-w-7xl py-4 md:py-8 animate-fade-in">
      {/* Revolutionary Hero Section */}
      <section className="mb-16 md:mb-20 relative overflow-hidden">
        <motion.div 
          className="relative rounded-3xl p-8 md:p-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">THE JEE REVOLUTION STARTS HERE</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                JEE Prepometer
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl text-foreground/80 font-medium">
                One Platform. Infinite Possibilities.
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Break free from conventional preparation. Experience the future of JEE learning with AI-powered insights, 
              real-time analytics, and a community of 100,000+ ambitious students. Your journey to IIT starts here.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-2xl px-8 py-4 text-lg font-bold rounded-xl">
                <Link to="/prepometer">
                  <Rocket className="mr-3 h-6 w-6" />
                  Launch Prepometer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
                <Link to="/subject/Maths">
                  <BookOpen className="mr-3 h-5 w-5" />
                  Start Learning
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { number: "100K+", label: "Active Students" },
                { number: "95%", label: "Success Rate" },
                { number: "50K+", label: "Questions Solved" },
                { number: "24/7", label: "AI Support" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Revolutionary Features */}
      <motion.section 
        className="mb-16 md:mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-5xl font-black mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Experience the next generation of JEE preparation with cutting-edge technology
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {revolutionaryFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Study Tools */}
      <motion.section 
        className="mb-16 md:mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-black mb-12 text-center"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Study Arsenal</span>
        </motion.h2>

        <div className="space-y-12">
          {studyTools.map((category, idx) => (
            <motion.div key={idx} variants={itemVariants} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{category.category}</h3>
                <p className="text-muted-foreground text-lg">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, index) => (
                  <motion.div 
                    key={tool.name}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full group"
                  >
                    <Link to={tool.path} className="block h-full">
                      <Card className="h-full border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-background/90 to-muted/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8 flex flex-col h-full">
                          <div className="mb-6 flex items-center">
                            <motion.div 
                              className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {tool.icon}
                            </motion.div>
                            <h3 className="font-bold text-xl">{tool.name}</h3>
                          </div>
                          <p className="text-muted-foreground flex-grow text-lg leading-relaxed">
                            {tool.description}
                          </p>
                          <div className="mt-6 flex justify-end">
                            <span className="text-primary font-bold flex items-center group-hover:translate-x-2 transition-transform duration-300">
                              Launch <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Subject Overview */}
      <motion.section 
        className="mb-16 md:mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Master Every Subject</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Mathematics', 'Physics', 'Chemistry'].map((subject, index) => (
            <motion.div 
              key={subject}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="group"
              transition={{ duration: 0.3 }}
            >
              <Link to={`/subject/${subject}`}>
                <Card className="overflow-hidden border-0 shadow-xl group-hover:shadow-2xl transition-all duration-500 relative">
                  <div className={`h-3 w-full ${
                    subject === 'Mathematics' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                    subject === 'Physics' ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}></div>
                  <CardContent className="p-8 bg-gradient-to-br from-background/95 to-muted/20 backdrop-blur-sm">
                    <div className="flex items-center mb-6">
                      <motion.div
                        className={`p-4 rounded-xl mr-4 bg-gradient-to-br ${
                          subject === 'Mathematics' ? 'from-blue-500 to-cyan-500' : 
                          subject === 'Physics' ? 'from-purple-500 to-violet-500' : 
                          'from-green-500 to-emerald-500'
                        } text-white shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {subject === 'Mathematics' ? <Calculator className="h-6 w-6" /> :
                         subject === 'Physics' ? <Zap className="h-6 w-6" /> :
                         <Lightbulb className="h-6 w-6" />}
                      </motion.div>
                      <h3 className="text-2xl font-bold">{subject}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      {subject === 'Mathematics' ? 'Master calculus, algebra, trigonometry with AI-powered problem solving' : 
                       subject === 'Physics' ? 'Explore mechanics, electromagnetism, thermodynamics with virtual labs' : 
                       'Understand organic, inorganic, physical chemistry with 3D molecular models'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold flex items-center group-hover:translate-x-2 transition-transform duration-300">
                        Explore chapters <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 mr-1" />
                        <span>1000+ concepts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-3xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-sm"
      >
        <div className="p-8 md:p-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-primary">JOIN THE REVOLUTION</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to Transform Your JEE Journey?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who have revolutionized their preparation with our AI-powered platform. 
              The future of JEE preparation is here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-2xl px-8 py-4 text-lg font-bold rounded-xl">
                <Link to="/prepometer">
                  <Rocket className="h-6 w-6 mr-3" />
                  Start Your Revolution
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
                <Link to="/dashboard">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
