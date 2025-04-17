
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  showBookmarkedOnly: boolean;
  onAddCard: () => void;
}

export function EmptyState({ showBookmarkedOnly, onAddCard }: EmptyStateProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center animate-fade-in">
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {showBookmarkedOnly 
          ? "No bookmarked flashcards found for the selected subject."
          : "No flashcards found for the selected subject."}
      </p>
      <Button
        onClick={onAddCard}
        className="hover:scale-105 transition-transform"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Card
      </Button>
    </div>
  );
}
