
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards } from './useFlashcards';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardForm } from './FlashcardForm';
import { FlashcardContent } from './FlashcardContent';
import { FlashcardControls } from './FlashcardControls';
import { EmptyState } from './EmptyState';
import { motion } from 'framer-motion';

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
  
  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Decorative blobs */}
      <div className="study-blob study-blob-1"></div>
      <div className="study-blob study-blob-2"></div>
      <div className="study-blob study-blob-3"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
      
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glow-effect rounded-xl"
        >
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
        </motion.div>
      ) : (
        <>
          {filteredCards.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FlashcardContent
                  card={filteredCards[currentIndex]}
                  showAnswer={showAnswer}
                  currentIndex={currentIndex}
                  totalCards={filteredCards.length}
                  toggleAnswer={toggleAnswer}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
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
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <EmptyState 
                showBookmarkedOnly={showBookmarkedOnly} 
                onAddCard={() => setIsEditing(true)} 
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
