
import { useState, useEffect } from 'react';
import { FlashCard } from './types';
import { defaultCards } from './constants';
import { loadCardsFromStorage, saveCardsToStorage, filterCards } from './flashcardUtils';
import { useCardNavigation } from './hooks/useCardNavigation';
import { useCardManagement } from './hooks/useCardManagement';
import { useCardEditing } from './hooks/useCardEditing';

export function useFlashcards() {
  // Main state
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [filteredCards, setFilteredCards] = useState<FlashCard[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  // Import functionality from separate hooks
  const {
    currentIndex,
    setCurrentIndex,
    showAnswer,
    setShowAnswer,
    goToNextCard,
    goToPrevCard,
    toggleAnswer
  } = useCardNavigation(filteredCards);
  
  const {
    isEditing,
    setIsEditing,
    newCard,
    setNewCard,
    editCard,
    setEditCard,
    addNewCard,
    deleteCard,
    startEditingCard,
    saveEditedCard,
    cancelEditing
  } = useCardEditing(cards, setCards);
  
  const {
    markCardAsReviewed,
    updateConfidence,
    toggleBookmark,
    shuffleCards
  } = useCardManagement(cards, setCards, filteredCards, currentIndex);
  
  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = loadCardsFromStorage();
    if (savedCards) {
      setCards(savedCards);
    } else {
      setCards(defaultCards);
    }
  }, []);
  
  // Save cards to localStorage when they change
  useEffect(() => {
    saveCardsToStorage(cards);
  }, [cards]);
  
  // Filter cards by subject and bookmarks
  useEffect(() => {
    const filtered = filterCards(cards, activeSubject, showBookmarkedOnly);
    setFilteredCards(filtered);
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [activeSubject, cards, showBookmarkedOnly]);
  
  // Enhanced toggle answer that also marks card as reviewed
  const handleToggleAnswer = () => {
    toggleAnswer();
    
    // Mark as reviewed when showing answer
    if (!showAnswer) {
      markCardAsReviewed();
    }
  };

  // Delete current card with index adjustment
  const deleteCurrentCard = () => {
    if (filteredCards.length === 0) return;
    
    const cardId = filteredCards[currentIndex].id;
    const result = deleteCard(cardId);
    
    // Adjust current index if needed
    if (currentIndex >= filteredCards.length - 1) {
      setCurrentIndex(Math.max(0, filteredCards.length - 2));
    }
    
    return result;
  };

  // Wrapper for shuffle to access the required state setters
  const handleShuffleCards = () => {
    return shuffleCards(filteredCards, setFilteredCards, setCurrentIndex, setShowAnswer);
  };

  // Wrapper for starting edit on current card
  const handleStartEditingCard = () => {
    if (filteredCards.length === 0) return;
    startEditingCard(filteredCards[currentIndex]);
  };

  return {
    cards,
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
    toggleAnswer: handleToggleAnswer,
    updateConfidence,
    addNewCard,
    deleteCurrentCard,
    startEditingCard: handleStartEditingCard,
    saveEditedCard,
    cancelEditing,
    shuffleCards: handleShuffleCards,
    toggleBookmark
  };
}
