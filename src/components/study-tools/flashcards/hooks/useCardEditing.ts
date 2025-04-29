
import { useState } from 'react';
import { FlashCard } from '../types';
import { DEFAULT_CARD_FORM } from '../constants';
import { ToastNotification } from '../flashcardUtils';

export interface CardFormData {
  subject: string;
  question: string;
  answer: string;
}

export function useCardEditing(
  cards: FlashCard[], 
  setCards: React.Dispatch<React.SetStateAction<FlashCard[]>>,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [newCard, setNewCard] = useState<CardFormData>(DEFAULT_CARD_FORM);
  const [editCard, setEditCard] = useState<FlashCard | null>(null);
  
  const addNewCard = (): ToastNotification => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      return { 
        title: "Cannot add card", 
        description: "Question and answer fields cannot be empty", 
        variant: "destructive" 
      };
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
  
  const deleteCard = (cardId: string): ToastNotification => {
    setCards(prev => prev.filter(card => card.id !== cardId));
    return { title: "Card deleted", description: "Flashcard has been removed from your deck" };
  };
  
  const startEditingCard = (card: FlashCard) => {
    setEditCard({ ...card });
    setIsEditing(true);
  };
  
  const saveEditedCard = (): ToastNotification => {
    if (!editCard) return { 
      title: "Error", 
      description: "No card to save", 
      variant: "destructive" 
    };
    
    if (!editCard.question.trim() || !editCard.answer.trim()) {
      return { 
        title: "Cannot save card", 
        description: "Question and answer fields cannot be empty", 
        variant: "destructive" 
      };
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

  return {
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
  };
}
