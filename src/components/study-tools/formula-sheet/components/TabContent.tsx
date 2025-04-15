
import React from 'react';
import { Search, Bookmark, BookMarked, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormulaCard } from './FormulaCard';
import { SubjectFormulaList } from './SubjectFormulaList';
import { Formula } from '../types';

interface AllFormulasTabProps {
  filteredFormulas: Formula[];
  formulasBySubject: Record<string, Formula[]>;
  formulasByChapter: Record<string, Record<string, Formula[]>>;
  onToggleBookmark: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onCopyFormula: (formula: string) => void;
  onEditFormula: (formula: Formula) => void;
  onDeleteFormula: (id: string) => void;
}

export function AllFormulasTab({
  filteredFormulas,
  formulasBySubject,
  formulasByChapter,
  onToggleBookmark,
  onToggleImportant,
  onCopyFormula,
  onEditFormula,
  onDeleteFormula
}: AllFormulasTabProps) {
  if (filteredFormulas.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No formulas found</h3>
        <p className="text-gray-500">Try changing your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(['Maths', 'Physics', 'Chemistry'] as const).map(subject => {
        if (formulasBySubject[subject].length === 0) return null;
        
        return (
          <SubjectFormulaList
            key={subject}
            subject={subject}
            formulasByChapter={formulasByChapter[subject]}
            onToggleBookmark={onToggleBookmark}
            onToggleImportant={onToggleImportant}
            onCopyFormula={onCopyFormula}
            onEditFormula={onEditFormula}
            onDeleteFormula={onDeleteFormula}
          />
        );
      })}
    </div>
  );
}

interface BookmarkedFormulasTabProps {
  formulas: Formula[];
  onToggleBookmark: (id: string) => void;
  onCopyFormula: (formula: string) => void;
}

export function BookmarkedFormulasTab({
  formulas,
  onToggleBookmark,
  onCopyFormula
}: BookmarkedFormulasTabProps) {
  const bookmarkedFormulas = formulas.filter(f => f.bookmarked);
  
  if (bookmarkedFormulas.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No bookmarked formulas</h3>
        <p className="text-gray-500">Bookmark formulas to access them quickly later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookmarkedFormulas.map(formula => (
        <FormulaCard
          key={formula.id}
          formula={formula}
          onToggleBookmark={onToggleBookmark}
          onToggleImportant={() => {}}
          onCopyFormula={onCopyFormula}
          showSubject={true}
        />
      ))}
    </div>
  );
}

interface ImportantFormulasTabProps {
  filteredFormulas: Formula[];
  onToggleBookmark: (id: string) => void;
  onCopyFormula: (formula: string) => void;
}

export function ImportantFormulasTab({
  filteredFormulas,
  onToggleBookmark,
  onCopyFormula
}: ImportantFormulasTabProps) {
  const importantFormulas = filteredFormulas.filter(f => f.important);
  
  if (importantFormulas.length === 0) {
    return (
      <div className="text-center py-12 col-span-2">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No important formulas found</h3>
        <p className="text-gray-500">Mark formulas as important to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {importantFormulas.map(formula => (
        <FormulaCard
          key={formula.id}
          formula={formula}
          onToggleBookmark={onToggleBookmark}
          onToggleImportant={() => {}}
          onCopyFormula={onCopyFormula}
          showSubject={true}
        />
      ))}
    </div>
  );
}

interface CustomFormulasTabProps {
  formulas: Formula[];
  onEditFormula: (formula: Formula) => void;
  onDeleteFormula: (id: string) => void;
  onAddFormulaClick: () => void;
}

export function CustomFormulasTab({
  formulas,
  onEditFormula,
  onDeleteFormula,
  onAddFormulaClick
}: CustomFormulasTabProps) {
  const customFormulas = formulas.filter(f => f.custom);
  
  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Custom Formulas</h2>
        <Button onClick={onAddFormulaClick}>
          Add Formula
        </Button>
      </div>
      
      {customFormulas.length === 0 ? (
        <div className="text-center py-12">
          <BookMarked className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No custom formulas</h3>
          <p className="text-gray-500">Add your own formulas to see them here</p>
          <Button className="mt-4" onClick={onAddFormulaClick}>
            Add Your First Formula
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customFormulas.map(formula => (
            <FormulaCard
              key={formula.id}
              formula={formula}
              onToggleBookmark={() => {}}
              onToggleImportant={() => {}}
              onCopyFormula={() => {}}
              onEditFormula={onEditFormula}
              onDeleteFormula={onDeleteFormula}
              showSubject={true}
            />
          ))}
        </div>
      )}
    </>
  );
}
