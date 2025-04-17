
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlashCard } from './types';

interface FlashcardFormProps {
  editCard: FlashCard | null;
  newCard: { subject: string; question: string; answer: string };
  setNewCard: (card: { subject: string; question: string; answer: string }) => void;
  setEditCard: (card: FlashCard | null) => void;
  cancelEditing: () => void;
  saveEditedCard: () => { title: string; description: string; variant?: string } | undefined;
  addNewCard: () => { title: string; description: string; variant?: string } | undefined;
  onSave: (toast: { title: string; description: string; variant?: string } | undefined) => void;
}

export function FlashcardForm({
  editCard,
  newCard,
  setNewCard,
  setEditCard,
  cancelEditing,
  saveEditedCard,
  addNewCard,
  onSave
}: FlashcardFormProps) {
  const handleSave = () => {
    const result = editCard ? saveEditedCard() : addNewCard();
    onSave(result);
  };

  return (
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
              onClick={editCard ? cancelEditing : () => onSave(undefined)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editCard ? 'Save Changes' : 'Add Card'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
