
import { FlashCard } from './types';

// Load cards from localStorage
export const loadCardsFromStorage = (): FlashCard[] | null => {
  const savedCards = localStorage.getItem('jeeFlashcards');
  if (savedCards) {
    try {
      return JSON.parse(savedCards);
    } catch (e) {
      console.error('Error loading flashcards:', e);
      return null;
    }
  }
  return null;
};

// Save cards to localStorage
export const saveCardsToStorage = (cards: FlashCard[]): void => {
  if (cards.length > 0) {
    localStorage.setItem('jeeFlashcards', JSON.stringify(cards));
  }
};

// Filter cards by subject and bookmarks
export const filterCards = (
  cards: FlashCard[], 
  activeSubject: string, 
  showBookmarkedOnly: boolean
): FlashCard[] => {
  let filtered = [...cards];
  
  if (activeSubject !== 'all') {
    filtered = filtered.filter(card => card.subject === activeSubject);
  }
  
  if (showBookmarkedOnly) {
    filtered = filtered.filter(card => card.bookmarked);
  }
  
  return filtered;
};

// Get index of a card in the original cards array
export const getCardIndex = (cards: FlashCard[], cardId: string): number => {
  return cards.findIndex(card => card.id === cardId);
};

// Create a toast notification object
export type ToastNotification = { 
  title: string; 
  description: string; 
  variant?: string;
};

// Generate success toast
export const createSuccessToast = (title: string, description: string): ToastNotification => {
  return { title, description };
};

// Generate error toast
export const createErrorToast = (title: string, description: string): ToastNotification => {
  return { title, description, variant: 'destructive' };
};
