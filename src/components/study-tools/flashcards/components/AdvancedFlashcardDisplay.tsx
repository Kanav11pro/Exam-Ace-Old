
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  StarOff, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Timer, 
  Brain,
  Target,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { FlashCard } from '../types';

interface AdvancedFlashcardDisplayProps {
  card: FlashCard;
  currentIndex: number;
  totalCards: number;
  showAnswer: boolean;
  toggleAnswer: () => void;
  goToNextCard: () => void;
  goToPrevCard: () => void;
  startEditingCard: () => void;
  toggleBookmark: () => void;
  handleConfidenceClick: (level: 'low' | 'medium' | 'high') => void;
  confettiActive: boolean;
  onDeleteCard: () => void;
  studyMode: 'normal' | 'speed' | 'focused';
}

export function AdvancedFlashcardDisplay({
  card,
  currentIndex,
  totalCards,
  showAnswer,
  toggleAnswer,
  goToNextCard,
  goToPrevCard,
  startEditingCard,
  toggleBookmark,
  handleConfidenceClick,
  confettiActive,
  onDeleteCard,
  studyMode
}: AdvancedFlashcardDisplayProps) {
  const [flipCount, setFlipCount] = useState(0);
  const [cardTimer, setCardTimer] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCardTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    setCardTimer(0);
    setFlipCount(0);
  }, [currentIndex]);

  const handleFlip = async () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setFlipCount(prev => prev + 1);
    
    // Animate the flip
    await controls.start({
      rotateY: showAnswer ? 0 : 180,
      transition: { duration: 0.6, ease: "easeInOut" }
    });
    
    toggleAnswer();
    setTimeout(() => setIsFlipping(false), 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressValue = () => {
    return ((currentIndex + 1) / totalCards) * 100;
  };

  const getConfidenceColor = (confidence: string | null) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      'Maths': '📐',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'English': '📚',
      'History': '🏛️'
    };
    return icons[subject] || '📝';
  };

  const getStudyModeIcon = () => {
    switch (studyMode) {
      case 'speed': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'focused': return <Target className="h-4 w-4 text-blue-500" />;
      default: return <Brain className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Enhanced Stats Bar */}
      <motion.div
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <span className="mr-2">{getSubjectIcon(card.subject)}</span>
              {card.subject}
            </Badge>
            <Badge variant="outline" className={getConfidenceColor(card.confidence)}>
              {card.confidence || 'Not rated'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getStudyModeIcon()}
              {studyMode} mode
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Timer className="h-4 w-4" />
              {formatTime(cardTimer)}
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <RotateCcw className="h-4 w-4" />
              {flipCount} flips
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <TrendingUp className="h-4 w-4" />
              Card {currentIndex + 1}/{totalCards}
            </motion.div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgressValue())}%</span>
          </div>
          <Progress value={getProgressValue()} className="h-3" />
        </div>
      </motion.div>

      {/* Enhanced 3D Flashcard */}
      <div className="perspective-1000 h-[500px]">
        <motion.div
          className="relative w-full h-full cursor-pointer preserve-3d"
          animate={controls}
          onClick={handleFlip}
          whileHover={{ scale: 1.02 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Question Side */}
          <motion.div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Card className="w-full h-full border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Question</h3>
                      <p className="text-blue-100 text-sm">Think carefully...</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {card.bookmarked && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    )}
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {currentIndex + 1}/{totalCards}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-inner border border-blue-100 dark:border-blue-800"
                  >
                    <p className="text-2xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                      {card.question}
                    </p>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center"
                  >
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      🔄 Click to reveal answer
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer Side */}
          <motion.div
            className="absolute inset-0 backface-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <Card className="w-full h-full border-0 shadow-2xl bg-gradient-to-br from-green-50 via-white to-emerald-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Answer</h3>
                      <p className="text-green-100 text-sm">How did you do?</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {card.bookmarked && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    )}
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {currentIndex + 1}/{totalCards}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-inner border border-green-100 dark:border-green-800"
                  >
                    <p className="text-2xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                      {card.answer}
                    </p>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center"
                  >
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      🔄 Click to see question again
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Control Panel */}
      <motion.div
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="lg"
              onClick={goToPrevCard}
              disabled={currentIndex === 0}
              className="rounded-full h-14 w-14 shadow-lg border-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </motion.div>
          
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={card.bookmarked ? "default" : "outline"}
                onClick={toggleBookmark}
                className="flex items-center gap-2 shadow-lg"
              >
                {card.bookmarked ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                {card.bookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={startEditingCard}
                className="flex items-center gap-2 shadow-lg"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={onDeleteCard}
                className="flex items-center gap-2 shadow-lg text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </motion.div>
          </div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="lg"
              onClick={goToNextCard}
              disabled={currentIndex === totalCards - 1}
              className="rounded-full h-14 w-14 shadow-lg border-2"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
        
        {/* Confidence Rating */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  How confident are you with this answer?
                </h4>
                <div className="flex justify-center gap-4">
                  {[
                    { level: 'low' as const, label: 'Need Practice', emoji: '😅', color: 'from-red-400 to-red-600' },
                    { level: 'medium' as const, label: 'Getting There', emoji: '🤔', color: 'from-yellow-400 to-yellow-600' },
                    { level: 'high' as const, label: 'Mastered!', emoji: '🎉', color: 'from-green-400 to-green-600' }
                  ].map((option, index) => (
                    <motion.div
                      key={option.level}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        className={`bg-gradient-to-r ${option.color} text-white border-0 shadow-lg hover:shadow-xl px-6 py-3 text-lg font-medium`}
                        onClick={() => handleConfidenceClick(option.level)}
                      >
                        <span className="mr-2 text-xl">{option.emoji}</span>
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confetti Effect */}
      <AnimatePresence>
        {confettiActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="absolute w-3 h-3 rounded"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                  scale: 1
                }}
                animate={{ 
                  y: window.innerHeight + 10,
                  rotate: 360,
                  scale: [1, 1.5, 0.5, 1]
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
