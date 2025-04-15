
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Formula } from '../types';

interface AddFormulaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formula: Partial<Formula>;
  setFormula: (formula: Partial<Formula>) => void;
  onAddFormula: () => void;
  isEditing: boolean;
}

export function AddFormulaDialog({
  open,
  onOpenChange,
  formula,
  setFormula,
  onAddFormula,
  isEditing
}: AddFormulaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Formula' : 'Add New Formula'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your custom formula.' : 'Create your own custom formula for quick reference.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Select 
                value={formula.subject} 
                onValueChange={(value) => setFormula({...formula, subject: value as 'Maths' | 'Physics' | 'Chemistry'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maths">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="chapter" className="text-sm font-medium">Chapter</label>
              <Input 
                id="chapter"
                placeholder="Enter chapter name" 
                value={formula.chapter} 
                onChange={(e) => setFormula({...formula, chapter: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Formula Name</label>
            <Input 
              id="title"
              placeholder="e.g., Pythagorean Theorem" 
              value={formula.title} 
              onChange={(e) => setFormula({...formula, title: e.target.value})}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="formula" className="text-sm font-medium">Formula</label>
            <Textarea 
              id="formula"
              placeholder="e.g., a² + b² = c²" 
              value={formula.formula} 
              onChange={(e) => setFormula({...formula, formula: e.target.value})}
              className="font-mono"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="explanation" className="text-sm font-medium">Explanation (Optional)</label>
            <Textarea 
              id="explanation"
              placeholder="Explain what the formula is used for and any conditions" 
              value={formula.explanation} 
              onChange={(e) => setFormula({...formula, explanation: e.target.value})}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="important"
              checked={formula.important}
              onChange={(e) => setFormula({...formula, important: e.target.checked})}
              className="rounded border-gray-300"
            />
            <label htmlFor="important" className="text-sm font-medium">Mark as important</label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddFormula}>{isEditing ? 'Save Changes' : 'Add Formula'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
