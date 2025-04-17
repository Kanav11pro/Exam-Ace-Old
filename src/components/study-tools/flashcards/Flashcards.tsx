
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards } from './useFlashcards';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardForm } from './FlashcardForm';
import { FlashcardContent } from './FlashcardContent';
import { FlashcardControls } from './FlashcardControls';
import { EmptyState } from './EmptyState';

export function Flashcards() {
  const { toast } = useToast();
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

  const handleToast = (toastData: { title: string; description: string; variant?: string } | undefined) => {
    if (toastData) {
      toast(toastData);
    }
  };

  const handleShuffle = () => {
    const result = shuffleCards();
    if (result) handleToast(result);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
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
      ) : (
        <>
          {filteredCards.length > 0 ? (
            <>
              <FlashcardContent
                card={filteredCards[currentIndex]}
                showAnswer={showAnswer}
                currentIndex={currentIndex}
                totalCards={filteredCards.length}
                toggleAnswer={toggleAnswer}
              />
              
              <FlashcardControls
                card={filteredCards[currentIndex]}
                showAnswer={showAnswer}
                goToPrevCard={goToPrevCard}
                goToNextCard={goToNextCard}
                updateConfidence={updateConfidence}
                toggleBookmark={toggleBookmark}
                startEditingCard={startEditingCard}
                deleteCurrentCard={deleteCurrentCard}
                onAction={handleToast}
              />
            </>
          ) : (
            <EmptyState 
              showBookmarkedOnly={showBookmarkedOnly} 
              onAddCard={() => setIsEditing(true)} 
            />
          )}
        </>
      )}
    </div>
  );
}
