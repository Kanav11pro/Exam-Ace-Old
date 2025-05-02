
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards } from './useFlashcards';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardForm } from './FlashcardForm';
import { EmptyState } from './EmptyState';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlashcardWelcome } from './components/FlashcardWelcome';
import { FlashcardHeader } from './components/FlashcardHeader';
import { FlashcardDisplay } from './components/FlashcardDisplay';
import { StudyTip } from './components/StudyTip';

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
      }, 5000);
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

  useEffect(() => {
    if (autoFlip && !showAnswer && filteredCards.length > 0) {
      const timer = setTimeout(() => {
        toggleAnswer();
      }, 5000); // Auto flip after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoFlip, showAnswer, filteredCards.length]);

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
  
  return (
    <div className="space-y-6 animate-fade-in relative p-4 sm:p-6">
      {/* Welcome Overlay */}
      <FlashcardWelcome showWelcome={showWelcome} setShowWelcome={setShowWelcome} />

      {/* Decorative blobs */}
      <div className="study-blob study-blob-1"></div>
      <div className="study-blob study-blob-2"></div>
      <div className="study-blob study-blob-3"></div>
      
      {/* Header and Controls */}
      <FlashcardHeader 
        cardsCount={filteredCards.length}
        autoFlip={autoFlip}
        setAutoFlip={setAutoFlip}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {editCard ? "Edit Flashcard" : "Create New Flashcard"}
            </CardTitle>
            <CardDescription>
              {editCard ? "Update your existing flashcard" : "Add a new flashcard to your collection"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              toggleBookmark={toggleBookmark}
              handleConfidenceClick={handleConfidenceClick}
              confettiActive={confettiActive}
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
    </div>
  );
}
