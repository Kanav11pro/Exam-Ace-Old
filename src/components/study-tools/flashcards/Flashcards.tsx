
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFlashcards } from './useFlashcards';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardForm } from './FlashcardForm';
import { EmptyState } from './EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlashcardWizard } from './components/FlashcardWizard';
import { AdvancedFlashcardDisplay } from './components/AdvancedFlashcardDisplay';
import { FlashcardStats } from './components/FlashcardStats';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  BarChart3, 
  Settings, 
  Sparkles, 
  BookOpen,
  Brain,
  Target,
  Zap 
} from 'lucide-react';

export function Flashcards() {
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState<'study' | 'stats' | 'create'>('study');

  const {
    filteredCards,
    currentIndex,
    showAnswer,
    activeSubject,
    setActiveSubject,
    isEditing,
    setIsEditing,
    showBookmarkedOnly,
    setShowBookmarkedOnly,
    newCard,
    setNewCard,
    editCard,
    setEditCard,
    goToNextCard,
    goToPrevCard,
    toggleAnswer,
    updateConfidence,
    addNewCard,
    deleteCurrentCard,
    startEditingCard,
    saveEditedCard,
    cancelEditing,
    shuffleCards,
    toggleBookmark
  } = useFlashcards();

  const [autoFlip, setAutoFlip] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [studyMode, setStudyMode] = useState<'normal' | 'speed' | 'focused'>('normal');
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [streak, setStreak] = useState(0);

  // Auto flip functionality
  useEffect(() => {
    if (autoFlip && !showAnswer && filteredCards.length > 0) {
      const timer = setTimeout(() => {
        toggleAnswer();
      }, studyMode === 'speed' ? 3000 : studyMode === 'focused' ? 8000 : 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoFlip, showAnswer, filteredCards.length, studyMode]);

  // Study time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalStudyTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToast = (toastData: { title: string; description: string; variant?: string } | undefined) => {
    if (toastData) {
      toast({
        title: toastData.title,
        description: toastData.description,
        variant: toastData.variant === 'destructive' ? 'destructive' : 'default'
      });
    }
  };

  const handleWizardComplete = (cards: Array<{ subject: string; question: string; answer: string; difficulty: string }>) => {
    let successCount = 0;
    
    cards.forEach(card => {
      setNewCard({
        subject: card.subject,
        question: card.question,
        answer: card.answer
      });
      
      const result = addNewCard();
      if (result && !result.title.includes('Error')) {
        successCount++;
      }
    });
    
    setShowWizard(false);
    
    if (successCount > 0) {
      toast({
        title: "🎉 Cards Created Successfully!",
        description: `Added ${successCount} new flashcard${successCount > 1 ? 's' : ''} to your collection`,
      });
    }
  };

  const handleConfidenceClick = (level: 'low' | 'medium' | 'high') => {
    const result = updateConfidence(level);
    
    if (level === 'high') {
      setConfettiActive(true);
      setStreak(prev => prev + 1);
      setTimeout(() => setConfettiActive(false), 3000);
    }
    
    if (result) handleToast(result);
    
    // Auto advance to next card after rating
    setTimeout(() => {
      goToNextCard();
    }, 1000);
  };

  const handleDeleteCard = () => {
    const result = deleteCurrentCard();
    if (result) handleToast(result);
  };

  const handleToggleBookmark = () => {
    const result = toggleBookmark();
    if (result) handleToast(result);
  };

  const handleShuffle = () => {
    const result = shuffleCards();
    if (result) handleToast(result);
  };

  // Calculate stats
  const masteredCards = filteredCards.filter(card => card.confidence === 'high').length;
  const needPracticeCards = filteredCards.filter(card => card.confidence === 'low').length;
  const bookmarkedCards = filteredCards.filter(card => card.bookmarked).length;

  const studyModeConfig = {
    normal: { icon: <BookOpen className="h-4 w-4" />, label: "Normal", color: "bg-blue-500" },
    speed: { icon: <Zap className="h-4 w-4" />, label: "Speed", color: "bg-yellow-500" },
    focused: { icon: <Target className="h-4 w-4" />, label: "Focused", color: "bg-purple-500" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Enhanced Header */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg"
                  >
                    <Brain className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      Advanced Flashcards
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Master your subjects with intelligent spaced repetition
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {filteredCards.length > 0 && (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                          📚 {filteredCards.length} cards
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                          🎯 {masteredCards} mastered
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <div className={`${studyModeConfig[studyMode].color} text-white px-4 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2`}>
                          {studyModeConfig[studyMode].icon}
                          {studyModeConfig[studyMode].label}
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowWizard(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
                    size="lg"
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    Create with Wizard
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode(viewMode === 'stats' ? 'study' : 'stats')}
                    size="lg"
                    className="shadow-lg"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    {viewMode === 'stats' ? 'Study Mode' : 'View Stats'}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    size="lg"
                    className="shadow-lg"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    {isEditing ? 'Cancel' : 'Quick Add'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <FlashcardFilters 
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
            showBookmarkedOnly={showBookmarkedOnly}
            setShowBookmarkedOnly={setShowBookmarkedOnly}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            shuffleCards={shuffleCards}
            filteredCardsLength={filteredCards.length}
            onShuffle={handleShuffle}
          />

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {showWizard && (
              <FlashcardWizard
                onComplete={handleWizardComplete}
                onCancel={() => setShowWizard(false)}
              />
            )}

            {viewMode === 'stats' ? (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FlashcardStats
                  totalCards={filteredCards.length}
                  masteredCards={masteredCards}
                  needPracticeCards={needPracticeCards}
                  totalStudyTime={totalStudyTime}
                  streak={streak}
                  bookmarkedCards={bookmarkedCards}
                />
              </motion.div>
            ) : isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      {editCard ? "✏️ Edit Flashcard" : "✨ Quick Add Flashcard"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <FlashcardForm
                      editCard={editCard}
                      newCard={newCard}
                      setNewCard={setNewCard}
                      setEditCard={setEditCard}
                      cancelEditing={cancelEditing}
                      saveEditedCard={saveEditedCard}
                      addNewCard={addNewCard}
                      onSave={(result) => {
                        handleToast(result);
                        if (result && !result.title.includes('Error')) {
                          setIsEditing(false);
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ) : filteredCards.length > 0 ? (
              <motion.div
                key="study"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdvancedFlashcardDisplay
                  card={filteredCards[currentIndex]}
                  currentIndex={currentIndex}
                  totalCards={filteredCards.length}
                  showAnswer={showAnswer}
                  toggleAnswer={toggleAnswer}
                  goToNextCard={goToNextCard}
                  goToPrevCard={goToPrevCard}
                  startEditingCard={startEditingCard}
                  toggleBookmark={handleToggleBookmark}
                  handleConfidenceClick={handleConfidenceClick}
                  confettiActive={confettiActive}
                  onDeleteCard={handleDeleteCard}
                  studyMode={studyMode}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <EmptyState 
                  showBookmarkedOnly={showBookmarkedOnly} 
                  onAddCard={() => setShowWizard(true)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
