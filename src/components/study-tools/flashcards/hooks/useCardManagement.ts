
import { useState } from 'react';
import { FlashCard, FlashCardConfidence } from '../types';
import { getCardIndex, ToastNotification } from '../flashcardUtils';

export function useCardManagement(
  cards: FlashCard[], 
  setCards: React.Dispatch<React.SetStateAction<FlashCard[]>>,
  filteredCards: FlashCard[],
  currentIndex: number
) {
  // Mark card as reviewed
  const markCardAsReviewed = () => {
    if (filteredCards.length === 0) return;
    
    const updatedCards = [...cards];
    const cardIndex = getCardIndex(cards, filteredCards[currentIndex].id);
    
    if (cardIndex !== -1) {
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        lastReviewed: new Date().toISOString()
      };
      setCards(updatedCards);
    }
  };

  // Update confidence level
  const updateConfidence = (confidence: FlashCardConfidence): ToastNotification => {
    if (filteredCards.length === 0) return { title: "Error", description: "No cards available" };
    
    const updatedCards = [...cards];
    const cardIndex = getCardIndex(cards, filteredCards[currentIndex].id);
    
    if (cardIndex !== -1) {
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        confidence
      };
      setCards(updatedCards);
      
      return { title: "Confidence updated", description: `Card marked as ${confidence} confidence` };
    }
    
    return { title: "Error", description: "Card not found" };
  };
  
  // Toggle bookmark
  const toggleBookmark = (): ToastNotification | undefined => {
    if (filteredCards.length === 0) return;
    
    const updatedCards = [...cards];
    const cardIndex = getCardIndex(cards, filteredCards[currentIndex].id);
    
    if (cardIndex !== -1) {
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        bookmarked: !updatedCards[cardIndex].bookmarked
      };
      setCards(updatedCards);
      
      return { 
        title: updatedCards[cardIndex].bookmarked ? "Bookmarked" : "Bookmark removed",
        description: updatedCards[cardIndex].bookmarked ? 
          "Card added to your bookmarks" : 
          "Card removed from your bookmarks"
      };
    }
  };
  
  // Shuffle cards
  const shuffleCards = (filteredCards: FlashCard[], setFilteredCards: React.Dispatch<React.SetStateAction<FlashCard[]>>, 
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>, setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>): ToastNotification => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    
    return { title: "Cards shuffled", description: "Your flashcards have been randomized" };
  };

  return {
    markCardAsReviewed,
    updateConfidence,
    toggleBookmark,
    shuffleCards
  };
}
