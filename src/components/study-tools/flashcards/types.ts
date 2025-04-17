
export type FlashCardConfidence = 'low' | 'medium' | 'high' | null;

export interface FlashCard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  lastReviewed: string | null;
  confidence: FlashCardConfidence;
  bookmarked?: boolean;
}
