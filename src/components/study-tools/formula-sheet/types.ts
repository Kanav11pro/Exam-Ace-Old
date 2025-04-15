
export interface Formula {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  subject: 'Maths' | 'Physics' | 'Chemistry';
  chapter: string;
  important: boolean;
  bookmarked?: boolean;
  custom?: boolean;
  latex?: string;
}
