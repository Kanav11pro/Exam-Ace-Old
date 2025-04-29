
import { useState } from 'react';
import { FlashCard } from '../types';

export function useCardNavigation(filteredCards: FlashCard[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const goToNextCard = () => {
    if (filteredCards.length === 0) return;
    
    setShowAnswer(false);
    setCurrentIndex(prev => {
      const nextIndex = (prev + 1) % filteredCards.length;
      return nextIndex;
    });
  };
  
  const goToPrevCard = () => {
    if (filteredCards.length === 0) return;
    
    setShowAnswer(false);
    setCurrentIndex(prev => {
      const prevIndex = (prev - 1 + filteredCards.length) % filteredCards.length;
      return prevIndex;
    });
  };
  
  const toggleAnswer = () => {
    if (filteredCards.length === 0) return;
    setShowAnswer(prev => !prev);
  };

  return {
    currentIndex,
    setCurrentIndex,
    showAnswer,
    setShowAnswer,
    goToNextCard,
    goToPrevCard,
    toggleAnswer
  };
}
