
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Copy, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { Formula } from '../types';

interface FormulaCardProps {
  formula: Formula;
  onToggleBookmark: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onCopyFormula: (formula: string) => void;
  onEditFormula?: (formula: Formula) => void;
  onDeleteFormula?: (id: string) => void;
  showSubject?: boolean;
}

export function FormulaCard({
  formula,
  onToggleBookmark,
  onToggleImportant,
  onCopyFormula,
  onEditFormula,
  onDeleteFormula,
  showSubject = false
}: FormulaCardProps) {
  return (
    <Card 
      className={`overflow-hidden hover:shadow transition-all ${
        formula.important ? 'border-amber-200 dark:border-amber-800' : ''
      } ${formula.custom ? 'border-blue-200 dark:border-blue-800' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{formula.title}</h3>
            {showSubject && (
              <div className="flex items-center gap-2 mt-1">
                <Badge>{formula.subject}</Badge>
                <span className="text-xs text-gray-500">• {formula.chapter}</span>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onToggleBookmark(formula.id)}
            >
              <Bookmark className={`h-4 w-4 ${formula.bookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onToggleImportant(formula.id)}
            >
              {formula.important ? 
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : 
                <StarOff className="h-4 w-4 text-gray-400" />
              }
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onCopyFormula(formula.formula)}
            >
              <Copy className="h-4 w-4 text-gray-400" />
            </Button>
            {formula.custom && onEditFormula && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onEditFormula(formula)}
              >
                <Edit className="h-4 w-4 text-gray-400" />
              </Button>
            )}
            {formula.custom && onDeleteFormula && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onDeleteFormula(formula.id)}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center text-lg">
          {formula.formula}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {formula.explanation}
        </p>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {formula.important && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
              Important
            </Badge>
          )}
          {formula.custom && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              Custom
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
