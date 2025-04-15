
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormulaCard } from './FormulaCard';
import { Formula } from '../types';

interface SubjectFormulaListProps {
  subject: 'Maths' | 'Physics' | 'Chemistry';
  formulasByChapter: Record<string, Formula[]>;
  onToggleBookmark: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onCopyFormula: (formula: string) => void;
  onEditFormula: (formula: Formula) => void;
  onDeleteFormula: (id: string) => void;
}

export function SubjectFormulaList({
  subject,
  formulasByChapter,
  onToggleBookmark,
  onToggleImportant,
  onCopyFormula,
  onEditFormula,
  onDeleteFormula
}: SubjectFormulaListProps) {
  if (Object.keys(formulasByChapter).length === 0) {
    return null;
  }

  const getSubjectIcon = () => {
    if (subject === 'Maths') {
      return (
        <div className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 p-1 rounded mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else if (subject === 'Physics') {
      return (
        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 p-1 rounded mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 p-1 rounded mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        {getSubjectIcon()}
        {subject}
      </h2>
      
      <Accordion type="multiple" defaultValue={Object.keys(formulasByChapter)}>
        {Object.entries(formulasByChapter).map(([chapter, chapterFormulas]) => (
          <AccordionItem key={chapter} value={chapter}>
            <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg">
              {chapter} ({chapterFormulas.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 p-2">
                {chapterFormulas.map(formula => (
                  <FormulaCard
                    key={formula.id}
                    formula={formula}
                    onToggleBookmark={onToggleBookmark}
                    onToggleImportant={onToggleImportant}
                    onCopyFormula={onCopyFormula}
                    onEditFormula={onEditFormula}
                    onDeleteFormula={onDeleteFormula}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
