
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, RotateCw, Plus, Trash, Edit, Save, X, BookmarkPlus, Filter, BookmarkCheck } from 'lucide-react';

// FlashCard type
type FlashCard = {
  id: string;
  subject: string;
  question: string;
  answer: string;
  lastReviewed: string | null;
  confidence: 'low' | 'medium' | 'high' | null;
  bookmarked?: boolean;
};

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

export function Flashcards() {
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
  
  const { toast } = useToast();
  
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
      
      toast({
        title: "Confidence updated",
        description: `Card marked as ${confidence} confidence`,
      });
      
      // Move to next card
      goToNextCard();
    }
  };
  
  const addNewCard = () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      toast({
        title: "Cannot add card",
        description: "Question and answer fields cannot be empty",
        variant: "destructive"
      });
      return;
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
    
    toast({
      title: "Card added",
      description: "New flashcard has been added to your deck",
    });
  };
  
  const deleteCurrentCard = () => {
    if (filteredCards.length === 0) return;
    
    const cardId = filteredCards[currentIndex].id;
    setCards(prev => prev.filter(card => card.id !== cardId));
    
    toast({
      title: "Card deleted",
      description: "Flashcard has been removed from your deck",
    });
    
    // Adjust current index if needed
    if (currentIndex >= filteredCards.length - 1) {
      setCurrentIndex(Math.max(0, filteredCards.length - 2));
    }
  };
  
  const startEditingCard = () => {
    if (filteredCards.length === 0) return;
    
    setEditCard({ ...filteredCards[currentIndex] });
    setIsEditing(true);
  };
  
  const saveEditedCard = () => {
    if (!editCard) return;
    
    if (!editCard.question.trim() || !editCard.answer.trim()) {
      toast({
        title: "Cannot save card",
        description: "Question and answer fields cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setCards(prev => 
      prev.map(card => 
        card.id === editCard.id ? editCard : card
      )
    );
    
    setIsEditing(false);
    setEditCard(null);
    
    toast({
      title: "Card updated",
      description: "Your flashcard has been updated",
    });
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
    
    toast({
      title: "Cards shuffled",
      description: "Your flashcards have been randomized",
    });
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
      
      toast({
        title: updatedCards[cardIndex].bookmarked ? "Bookmarked" : "Bookmark removed",
        description: updatedCards[cardIndex].bookmarked ? 
          "Card added to your bookmarks" : 
          "Card removed from your bookmarks",
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <Select
            value={activeSubject}
            onValueChange={setActiveSubject}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Maths">Maths</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={showBookmarkedOnly ? "bg-yellow-50 text-yellow-600 border-yellow-200" : ""}
            title={showBookmarkedOnly ? "Show all cards" : "Show bookmarked only"}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shuffleCards}
            disabled={filteredCards.length < 2}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isEditing ? (
        <Card className="relative animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">
              {editCard ? 'Edit Flashcard' : 'Add New Flashcard'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Select
                  value={editCard ? editCard.subject : newCard.subject}
                  onValueChange={(value) => {
                    if (editCard) {
                      setEditCard({ ...editCard, subject: value });
                    } else {
                      setNewCard({ ...newCard, subject: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maths">Maths</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <Textarea
                  value={editCard ? editCard.question : newCard.question}
                  onChange={(e) => {
                    if (editCard) {
                      setEditCard({ ...editCard, question: e.target.value });
                    } else {
                      setNewCard({ ...newCard, question: e.target.value });
                    }
                  }}
                  placeholder="Enter your question"
                  className="min-h-24"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <Textarea
                  value={editCard ? editCard.answer : newCard.answer}
                  onChange={(e) => {
                    if (editCard) {
                      setEditCard({ ...editCard, answer: e.target.value });
                    } else {
                      setNewCard({ ...newCard, answer: e.target.value });
                    }
                  }}
                  placeholder="Enter the answer"
                  className="min-h-24"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={editCard ? cancelEditing : () => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editCard ? saveEditedCard : addNewCard}
                >
                  {editCard ? 'Save Changes' : 'Add Card'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredCards.length > 0 ? (
            <>
              <div className="relative h-80 mb-4 perspective-1000">
                <Card 
                  className={`absolute inset-0 flex flex-col justify-center p-6 cursor-pointer transition-all duration-500 transform-style-3d ${
                    showAnswer ? 'rotate-y-180' : ''
                  }`}
                  onClick={toggleAnswer}
                >
                  <div className={`absolute inset-0 p-6 backface-hidden ${showAnswer ? 'rotate-y-180 pointer-events-none' : ''}`}>
                    <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {currentIndex + 1} / {filteredCards.length}
                    </div>
                    <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {filteredCards[currentIndex].subject}
                    </div>
                    <div className="mt-8 text-center">
                      <h3 className="text-lg font-medium mb-6">Question:</h3>
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
                        <p className="text-lg">{filteredCards[currentIndex].question}</p>
                      </div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Click to see the answer
                      </p>
                    </div>
                  </div>
                  
                  <div className={`absolute inset-0 p-6 backface-hidden rotate-y-180 ${!showAnswer ? 'pointer-events-none' : ''}`}>
                    <div className="absolute top-3 right-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {currentIndex + 1} / {filteredCards.length}
                    </div>
                    <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {filteredCards[currentIndex].subject}
                    </div>
                    <div className="mt-8 text-center">
                      <h3 className="text-lg font-medium mb-6">Answer:</h3>
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner min-h-[100px] flex items-center justify-center">
                        <p className="text-lg">{filteredCards[currentIndex].answer}</p>
                      </div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Click to see the question
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToPrevCard}
                  className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {showAnswer && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateConfidence('low')}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-105 transition-transform"
                    >
                      Difficult
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateConfidence('medium')}
                      className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:scale-105 transition-transform"
                    >
                      Medium
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateConfidence('high')}
                      className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:scale-105 transition-transform"
                    >
                      Easy
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={toggleBookmark}
                    className={`rounded-full h-8 w-8 ${filteredCards[currentIndex]?.bookmarked ? "text-yellow-500 border-yellow-200 bg-yellow-50" : ""} hover:scale-105 transition-transform`}
                    title={filteredCards[currentIndex]?.bookmarked ? "Remove bookmark" : "Bookmark this card"}
                  >
                    {filteredCards[currentIndex]?.bookmarked ? 
                      <BookmarkCheck className="h-3 w-3" /> : 
                      <BookmarkPlus className="h-3 w-3" />
                    }
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={startEditingCard}
                    className="rounded-full h-8 w-8 hover:scale-105 transition-transform"
                    title="Edit card"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={deleteCurrentCard}
                    className="rounded-full h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 hover:scale-105 transition-transform"
                    title="Delete card"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToNextCard}
                  className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center animate-fade-in">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {showBookmarkedOnly 
                  ? "No bookmarked flashcards found for the selected subject."
                  : "No flashcards found for the selected subject."}
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                className="hover:scale-105 transition-transform"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Card
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
