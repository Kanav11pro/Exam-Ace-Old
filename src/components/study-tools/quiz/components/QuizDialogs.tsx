
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PauseCircle, AlertCircle, X } from 'lucide-react';
import { formatTime } from '../utils/helpers';

interface ExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAndExit: () => void;
  onAbandonTest: () => void;
}

export function ExitDialog({ open, onOpenChange, onSaveAndExit, onAbandonTest }: ExitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            Exit Test?
          </DialogTitle>
          <DialogDescription>
            Do you want to exit the test? Your progress will be affected.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={onSaveAndExit}
            >
              <div className="flex justify-center mb-2">
                <PauseCircle className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-center font-medium mb-1">Save & Exit</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Save your progress and continue later
              </p>
            </div>
            
            <div 
              className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={onAbandonTest}
            >
              <div className="flex justify-center mb-2">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-center font-medium mb-1">Abandon Test</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Exit without saving (progress will be lost)
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PauseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pauseTime: number;
  questionsAnswered: number;
  totalQuestions: number;
  isStrictMode: boolean;
  onExitTest: () => void;
  onResumeTest: () => void;
}

export function PauseDialog({
  open,
  onOpenChange,
  pauseTime,
  questionsAnswered,
  totalQuestions,
  isStrictMode,
  onExitTest,
  onResumeTest
}: PauseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PauseCircle className="h-5 w-5 text-amber-500 mr-2" />
            Test Paused
          </DialogTitle>
          <DialogDescription>
            Your test is currently paused and your progress is saved.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {isStrictMode ? 
                "The test was paused because you left the test window. Your attempt has been recorded." :
                "You have paused the test. Your progress is saved and the timer is stopped."
              }
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">
              Time spent: {formatTime(pauseTime)}
            </div>
            <div className="text-sm font-medium">
              Questions answered: {questionsAnswered}/{totalQuestions}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onExitTest}>
            Exit Test
          </Button>
          <Button onClick={onResumeTest}>
            Resume Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
