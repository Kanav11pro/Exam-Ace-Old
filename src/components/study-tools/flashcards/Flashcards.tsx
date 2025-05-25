
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFlashcards } from './useFlashcards';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardForm } from './FlashcardForm';
import { EmptyState } from './EmptyState';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlashcardWelcome } from './components/FlashcardWelcome';
import { FlashcardHeader } from './components/FlashcardHeader';
import { FlashcardDisplay } from './components/FlashcardDisplay';
import { StudyTip } from './components/StudyTip';
import { motion } from 'framer-motion';

export function Flashcards() {
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(() => {
    const visited = localStorage.getItem('flashcards-visited');
    return !visited;
  });

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem('flashcards-visited', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

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

  useEffect(() => {
    if (autoFlip && !showAnswer && filteredCards.length > 0) {
      const timer = setTimeout(() => {
        toggleAnswer();
      }, studyMode === 'speed' ? 3000 : 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoFlip, showAnswer, filteredCards.length, studyMode]);

  const handleToast = (toastData: { title: string; description: string; variant?: string } | undefined) => {
    if (toastData) {
      toast({
        title: toastData.title,
        description: toastData.description,
        variant: toastData.variant === 'destructive' ? 'destructive' : 'default'
      });
    }
  };

  const handleShuffle = () => {
    const result = shuffleCards();
    if (result) handleToast(result);
  };

  const handleConfidenceClick = (level: 'low' | 'medium' | 'high') => {
    const result = updateConfidence(level);
    if (level === 'high') {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2000);
    }
    if (result) handleToast(result);
    
    // Auto advance to next card after rating
    setTimeout(() => {
      goToNextCard();
    }, 500);
  };

  const handleDeleteCard = () => {
    const result = deleteCurrentCard();
    if (result) handleToast(result);
  };

  const handleToggleBookmark = () => {
    const result = toggleBookmark();
    if (result) handleToast(result);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Welcome Overlay */}
          <FlashcardWelcome showWelcome={showWelcome} setShowWelcome={setShowWelcome} />

          {/* Header and Controls */}
          <FlashcardHeader 
            cardsCount={filteredCards.length}
            autoFlip={autoFlip}
            setAutoFlip={setAutoFlip}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            studyMode={studyMode}
            setStudyMode={setStudyMode}
          />
          
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
          
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {editCard ? "✏️ Edit Flashcard" : "✨ Create New Flashcard"}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {editCard ? "Update your existing flashcard" : "Add a new flashcard to your collection"}
                  </CardDescription>
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
                      if (result) {
                        setIsEditing(false);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {filteredCards.length > 0 ? (
                <FlashcardDisplay
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
              ) : (
                <EmptyState 
                  showBookmarkedOnly={showBookmarkedOnly} 
                  onAddCard={() => setIsEditing(true)} 
                />
              )}
            </>
          )}
          
          {/* Study tip footer */}
          <StudyTip />
        </motion.div>
      </div>
    </div>
  );
}
