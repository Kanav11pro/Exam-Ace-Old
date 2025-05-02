
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards } from './useFlashcards';
import { FlashcardFilters } from './FlashcardFilters';
import { FlashcardForm } from './FlashcardForm';
import { FlashcardControls } from './FlashcardControls';
import { EmptyState } from './EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Info, 
  Book, 
  BookMarked,
  Feather
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 max-w-md rounded-xl p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring" }}
            >
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <BookMarked className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Welcome to Flashcards!</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                Create and review flashcards to improve your memory retention for JEE concepts.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <Feather className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm">Tap a card to flip it and reveal the answer</p>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                    <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm">Rate your confidence to track your progress</p>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
                    <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm">Add your own flashcards on any subject</p>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setShowWelcome(false);
                  localStorage.setItem('flashcards-visited', 'true');
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative blobs */}
      <div className="study-blob study-blob-1"></div>
      <div className="study-blob study-blob-2"></div>
      <div className="study-blob study-blob-3"></div>
      
      {/* Header and Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              JEE Flashcards
              <Badge variant="outline" className="ml-2">
                {filteredCards.length} cards
              </Badge>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Memorize key concepts through active recall
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <Switch
                id="auto-flip"
                checked={autoFlip}
                onCheckedChange={setAutoFlip}
              />
              <Label htmlFor="auto-flip" className="text-sm">Auto-flip</Label>
            </div>
            
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto sm:ml-0"
            >
              {isEditing ? "Cancel" : "Add Card"}
            </Button>
          </div>
        </div>
        
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
          className="rounded-xl"
        >
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
        </motion.div>
      ) : (
        <>
          {filteredCards.length > 0 ? (
            <div>
              {/* Flashcard */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="mb-2 flex justify-between items-center text-sm text-gray-500">
                  <p>Card {currentIndex + 1} of {filteredCards.length}</p>
                  <Badge variant="outline">
                    {filteredCards[currentIndex].subject}
                  </Badge>
                </div>
                
                {/* Flashcard Component with proper 3D flip */}
                <div
                  className="flashcard-container h-[300px] sm:h-[260px] mb-6 cursor-pointer"
                  onClick={() => toggleAnswer()}
                >
                  <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
                    {/* Front - Question */}
                    <div className="flashcard-front">
                      <Card className="w-full h-full flex flex-col border-2 border-indigo-100 dark:border-indigo-900 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-indigo-600 dark:text-indigo-400">Question</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center">
                          <p className="text-lg text-center">
                            {filteredCards[currentIndex].question}
                          </p>
                        </CardContent>
                        <div className="p-4 pt-0 text-center text-sm text-gray-500">
                          Tap to see answer
                        </div>
                      </Card>
                    </div>
                    
                    {/* Back - Answer */}
                    <div className="flashcard-back">
                      <Card className="w-full h-full flex flex-col border-2 border-green-100 dark:border-green-900 shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-green-600 dark:text-green-400">Answer</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center">
                          <p className="text-lg text-center">
                            {filteredCards[currentIndex].answer}
                          </p>
                        </CardContent>
                        <div className="p-4 pt-0 text-center text-sm text-gray-500">
                          Tap to see question
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mb-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={goToPrevCard}
                    disabled={currentIndex === 0}
                    className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => startEditingCard()}
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      variant={filteredCards[currentIndex].bookmarked ? "secondary" : "outline"}
                      onClick={() => toggleBookmark()}
                      size="sm"
                      className={filteredCards[currentIndex].bookmarked ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400" : ""}
                    >
                      {filteredCards[currentIndex].bookmarked ? "Bookmarked" : "Bookmark"}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={goToNextCard}
                    disabled={currentIndex === filteredCards.length - 1}
                    className="rounded-full h-10 w-10 hover:scale-105 transition-transform"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Confidence Rating Section */}
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <p className="text-center mb-3 text-sm text-gray-600 dark:text-gray-400">
                        How well did you know this?
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleConfidenceClick('low')}
                        >
                          Difficult
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                          onClick={() => handleConfidenceClick('medium')}
                        >
                          Medium
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleConfidenceClick('high')}
                        >
                          Easy
                        </Button>
                      </div>
                      
                      {/* Study Tip */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-4 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500" />
                        <p>
                          {filteredCards[currentIndex].confidenceLevel === 'low' ? 
                            "Try rewriting this concept in your own words to improve retention." :
                            "Rating cards helps the app show you difficult cards more frequently."}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Confetti Effect */}
              {confettiActive && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* This would be replaced with actual confetti animation */}
                    <div className="confetti-container">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
      
      {/* Study tip footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">Study Tip</h3>
            <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-1">
              Flashcards are most effective when you actively recall information before flipping. 
              Try to answer each question in your mind before checking the answer.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
