
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FlashcardHeaderProps {
  cardsCount: number;
  autoFlip: boolean;
  setAutoFlip: (value: boolean) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function FlashcardHeader({ cardsCount, autoFlip, setAutoFlip, isEditing, setIsEditing }: FlashcardHeaderProps) {
  return (
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
              {cardsCount} cards
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
    </motion.div>
  );
}
