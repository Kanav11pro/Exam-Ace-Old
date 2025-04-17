
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookmarkCheck, BookmarkPlus, Edit, Trash } from 'lucide-react';
import { FlashCard } from './types';

interface FlashcardControlsProps {
  card: FlashCard;
  showAnswer: boolean;
  goToPrevCard: () => void;
  goToNextCard: () => void;
  updateConfidence: (confidence: 'low' | 'medium' | 'high') => void | { title: string; description: string };
  toggleBookmark: () => void | { title: string; description: string };
  startEditingCard: () => void;
  deleteCurrentCard: () => void | { title: string; description: string };
  onAction: (result: { title: string; description: string } | undefined) => void;
}

export function FlashcardControls({
  card,
  showAnswer,
  goToPrevCard,
  goToNextCard,
  updateConfidence,
  toggleBookmark,
  startEditingCard,
  deleteCurrentCard,
  onAction
}: FlashcardControlsProps) {
  const handleConfidence = (level: 'low' | 'medium' | 'high') => {
    const result = updateConfidence(level);
    if (result) onAction(result);
  };

  const handleBookmark = () => {
    const result = toggleBookmark();
    if (result) onAction(result);
  };

  const handleDelete = () => {
    const result = deleteCurrentCard();
    if (result) onAction(result);
  };

  return (
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
            onClick={() => handleConfidence('low')}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-105 transition-transform"
          >
            Difficult
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleConfidence('medium')}
            className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:scale-105 transition-transform"
          >
            Medium
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleConfidence('high')}
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
          onClick={handleBookmark}
          className={`rounded-full h-8 w-8 ${card?.bookmarked ? "text-yellow-500 border-yellow-200 bg-yellow-50" : ""} hover:scale-105 transition-transform`}
          title={card?.bookmarked ? "Remove bookmark" : "Bookmark this card"}
        >
          {card?.bookmarked ? 
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
          onClick={handleDelete}
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
  );
}
