
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Plus, RotateCw, X } from 'lucide-react';

interface FlashcardFiltersProps {
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
  showBookmarkedOnly: boolean;
  setShowBookmarkedOnly: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  shuffleCards: () => { title: string; description: string };
  filteredCardsLength: number;
  onShuffle: () => void;
}

export function FlashcardFilters({
  activeSubject,
  setActiveSubject,
  showBookmarkedOnly,
  setShowBookmarkedOnly,
  isEditing,
  setIsEditing,
  filteredCardsLength,
  onShuffle
}: FlashcardFiltersProps) {
  return (
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
          onClick={onShuffle}
          disabled={filteredCardsLength < 2}
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
  );
}
