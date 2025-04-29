
import { FlashCard } from './types';

// Default cards for demo
export const defaultCards: FlashCard[] = [
  {
    id: '1',
    subject: 'Mathematics',
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
  },
  {
    id: '4',
    subject: 'Mathematics',
    question: 'What is the integral of 1/x?',
    answer: 'ln|x| + C',
    lastReviewed: null,
    confidence: null
  },
  {
    id: '5',
    subject: 'Physics',
    question: 'What is the formula for kinetic energy?',
    answer: 'KE = (1/2)mv²',
    lastReviewed: null,
    confidence: null
  },
  {
    id: '6',
    subject: 'Chemistry',
    question: 'What is the pH of a neutral solution?',
    answer: '7',
    lastReviewed: null,
    confidence: null
  },
  {
    id: '7',
    subject: 'Mathematics',
    question: 'What is the Pythagorean theorem?',
    answer: 'In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the other two sides (a² + b² = c²)',
    lastReviewed: null,
    confidence: null
  },
  {
    id: '8',
    subject: 'Physics',
    question: 'What is Ohm\'s Law?',
    answer: 'V = IR (Voltage equals current times resistance)',
    lastReviewed: null,
    confidence: null
  }
];

export const DEFAULT_SUBJECT = 'all';
export const DEFAULT_CARD_FORM = {
  subject: 'Mathematics',
  question: '',
  answer: ''
};
