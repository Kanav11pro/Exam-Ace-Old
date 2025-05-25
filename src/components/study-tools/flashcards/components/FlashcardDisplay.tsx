
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Lightbulb, Star, Edit3, Trash2, RotateCcw, Timer } from 'lucide-react';
import { FlashCard } from '../types';

interface FlashcardDisplayProps {
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

export function FlashcardDisplay({
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
}: FlashcardDisplayProps) {
  const [flipCount, setFlipCount] = useState(0);
  const [cardTimer, setCardTimer] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCardTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  React.useEffect(() => {
    setCardTimer(0);
    setFlipCount(0);
  }, [currentIndex]);

  const handleFlip = () => {
    toggleAnswer();
    setFlipCount(prev => prev + 1);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress and Stats Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Card {currentIndex + 1} of {totalCards}
            </span>
            <Badge variant="outline" className={getConfidenceColor(card.confidence)}>
              {card.confidence || 'Not rated'}
            </Badge>
            <Badge variant="outline">
              {card.subject}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {formatTime(cardTimer)}
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="h-4 w-4" />
              {flipCount} flips
            </div>
          </div>
        </div>
        
        <Progress value={getProgressValue()} className="h-2" />
      </div>

      {/* Enhanced Flashcard Component */}
      <div className="relative">
        <div
          className="flashcard-container h-[400px] cursor-pointer group"
          onClick={handleFlip}
        >
          <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
            {/* Front - Question */}
            <div className="flashcard-front">
              <Card className="w-full h-full flex flex-col border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Question</CardTitle>
                    <div className="flex gap-2">
                      {card.bookmarked && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      {studyMode !== 'normal' && (
                        <Badge variant="secondary" className="text-xs">
                          {studyMode} mode
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                      {card.question}
                    </p>
                  </div>
                </CardContent>
                <div className="p-4 text-center bg-blue-50/50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      🔄
                    </motion.div>
                    Click to reveal answer
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Back - Answer */}
            <div className="flashcard-back">
              <Card className="w-full h-full flex flex-col border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Answer</CardTitle>
                    <div className="flex gap-2">
                      {card.bookmarked && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      {studyMode !== 'normal' && (
                        <Badge variant="secondary" className="text-xs">
                          {studyMode} mode
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                      {card.answer}
                    </p>
                  </div>
                </CardContent>
                <div className="p-4 text-center bg-green-50/50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      🔄
                    </motion.div>
                    Click to see question again
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation and Actions */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToPrevCard}
            disabled={currentIndex === 0}
            className="rounded-full h-12 w-12 hover:scale-105 transition-all duration-200 shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={card.bookmarked ? "default" : "outline"}
              onClick={toggleBookmark}
              size="sm"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <Star className={`h-4 w-4 ${card.bookmarked ? 'fill-current' : ''}`} />
              {card.bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            
            <Button
              variant="outline"
              onClick={startEditingCard}
              size="sm"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              onClick={onDeleteCard}
              size="sm"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToNextCard}
            disabled={currentIndex === totalCards - 1}
            className="rounded-full h-12 w-12 hover:scale-105 transition-all duration-200 shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Confidence Rating Section */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How well did you know this answer?
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { level: 'low' as const, label: 'Difficult', color: 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700', emoji: '😵' },
                    { level: 'medium' as const, label: 'Medium', color: 'border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700', emoji: '🤔' },
                    { level: 'high' as const, label: 'Easy', color: 'border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700', emoji: '😊' }
                  ].map((option) => (
                    <motion.div
                      key={option.level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        className={`${option.color} flex items-center gap-2 px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200`}
                        onClick={() => handleConfidenceClick(option.level)}
                      >
                        <span>{option.emoji}</span>
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Study Tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
                  <p className="text-blue-800 dark:text-blue-300">
                    {card.confidence === 'low' ? 
                      "💡 Try explaining this concept out loud or writing it in your own words to improve retention." :
                      card.confidence === 'medium' ?
                      "📚 Review this topic once more before your next study session." :
                      "🎉 Great job! You've mastered this concept. Keep up the excellent work!"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Confetti Effect */}
      <AnimatePresence>
        {confettiActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="confetti-container">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="confetti"
                    initial={{ 
                      x: Math.random() * window.innerWidth,
                      y: -10,
                      rotate: 0,
                      scale: 1
                    }}
                    animate={{ 
                      y: window.innerHeight + 10,
                      rotate: 360,
                      scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 2,
                      ease: "easeOut"
                    }}
                    style={{
                      backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
                      width: '8px',
                      height: '8px',
                      position: 'absolute'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
