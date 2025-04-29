
import { FlashCard } from './types';

// Default cards for demo
export const defaultCards: FlashCard[] = [
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

export const DEFAULT_SUBJECT = 'all';
export const DEFAULT_CARD_FORM = {
  subject: 'Maths',
  question: '',
  answer: ''
};
