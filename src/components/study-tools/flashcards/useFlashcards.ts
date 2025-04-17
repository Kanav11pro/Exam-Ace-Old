
import { useState, useEffect } from 'react';
import { FlashCard } from './types';

// Default cards for demo
const defaultCards: FlashCard[] = [
  {
    id: '1',
    subject: 'Maths',
    question: 'What is the derivative of sin(x)?',
    answer: 'cos(x)',
    lastReviewed: null,
    confidence: null
  },
  {
    id: '2',
    subject: 'Physics',
    question: 'What is Newton\'s First Law?',
    answer: 'An object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.',
    lastReviewed: null,
    confidence: null
  },
  {
    id: '3',
    subject: 'Chemistry',
    question: 'What is the molecular formula for water?',
    answer: 'H₂O',
    lastReviewed: null,
    confidence: null
  }
];

export function useFlashcards() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [filteredCards, setFilteredCards] = useState<FlashCard[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  // New card form
  const [newCard, setNewCard] = useState<Omit<FlashCard, 'id' | 'lastReviewed' | 'confidence'>>({
    subject: 'Maths',
    question: '',
    answer: ''
  });
  
  // Edit mode
  const [editCard, setEditCard] = useState<FlashCard | null>(null);
  
  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('jeeFlashcards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error('Error loading flashcards:', e);
        setCards(defaultCards);
      }
    } else {
      setCards(defaultCards);
    }
  }, []);
  
  // Save cards to localStorage when they change
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('jeeFlashcards', JSON.stringify(cards));
    }
  }, [cards]);
  
  // Filter cards by subject and bookmarks
  useEffect(() => {
    let filtered = [...cards];
    
    if (activeSubject !== 'all') {
      filtered = filtered.filter(card => card.subject === activeSubject);
    }
    
    if (showBookmarkedOnly) {
      filtered = filtered.filter(card => card.bookmarked);
    }
    
    setFilteredCards(filtered);
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [activeSubject, cards, showBookmarkedOnly]);
  
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
    
    // Mark as reviewed when showing answer
    if (!showAnswer) {
      const updatedCards = [...cards];
      const cardIndex = cards.findIndex(card => card.id === filteredCards[currentIndex].id);
      
      if (cardIndex !== -1) {
        updatedCards[cardIndex] = {
          ...updatedCards[cardIndex],
          lastReviewed: new Date().toISOString()
        };
        setCards(updatedCards);
      }
    }
  };
  
  const updateConfidence = (confidence: 'low' | 'medium' | 'high') => {
    if (filteredCards.length === 0) return;
    
    const updatedCards = [...cards];
    const cardIndex = cards.findIndex(card => card.id === filteredCards[currentIndex].id);
    
    if (cardIndex !== -1) {
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        confidence
      };
      setCards(updatedCards);
      
      // Move to next card
      goToNextCard();
    }
    
    return { title: "Confidence updated", description: `Card marked as ${confidence} confidence` };
  };
  
  const addNewCard = () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      return { title: "Cannot add card", description: "Question and answer fields cannot be empty", variant: "destructive" };
    }
    
    const id = Date.now().toString();
    
    const newCardComplete: FlashCard = {
      id,
      ...newCard,
      lastReviewed: null,
      confidence: null
    };
    
    setCards(prev => [...prev, newCardComplete]);
    
    // Reset form
    setNewCard({
      subject: newCard.subject,
      question: '',
      answer: ''
    });
    
    return { title: "Card added", description: "New flashcard has been added to your deck" };
  };
  
  const deleteCurrentCard = () => {
    if (filteredCards.length === 0) return;
    
    const cardId = filteredCards[currentIndex].id;
    setCards(prev => prev.filter(card => card.id !== cardId));
    
    // Adjust current index if needed
    if (currentIndex >= filteredCards.length - 1) {
      setCurrentIndex(Math.max(0, filteredCards.length - 2));
    }
    
    return { title: "Card deleted", description: "Flashcard has been removed from your deck" };
  };
  
  const startEditingCard = () => {
    if (filteredCards.length === 0) return;
    
    setEditCard({ ...filteredCards[currentIndex] });
    setIsEditing(true);
  };
  
  const saveEditedCard = () => {
    if (!editCard) return;
    
    if (!editCard.question.trim() || !editCard.answer.trim()) {
      return { title: "Cannot save card", description: "Question and answer fields cannot be empty", variant: "destructive" };
    }
    
    setCards(prev => 
      prev.map(card => 
        card.id === editCard.id ? editCard : card
      )
    );
    
    setIsEditing(false);
    setEditCard(null);
    
    return { title: "Card updated", description: "Your flashcard has been updated" };
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditCard(null);
  };
  
  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    
    return { title: "Cards shuffled", description: "Your flashcards have been randomized" };
  };
  
  const toggleBookmark = () => {
    if (filteredCards.length === 0) return;
    
    const updatedCards = [...cards];
    const cardIndex = cards.findIndex(card => card.id === filteredCards[currentIndex].id);
    
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
    toggleAnswer,
    updateConfidence,
    addNewCard,
    deleteCurrentCard,
    startEditingCard,
    saveEditedCard,
    cancelEditing,
    shuffleCards,
    toggleBookmark
  };
}
