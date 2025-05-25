
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Zap, Brain, Target } from 'lucide-react';

interface FlashcardHeaderProps {
  cardsCount: number;
  autoFlip: boolean;
  setAutoFlip: (value: boolean) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  studyMode: 'normal' | 'speed' | 'focused';
  setStudyMode: (mode: 'normal' | 'speed' | 'focused') => void;
}

export function FlashcardHeader({
  cardsCount,
  autoFlip,
  setAutoFlip,
  isEditing,
  setIsEditing,
  studyMode,
  setStudyMode
}: FlashcardHeaderProps) {
  const studyModeIcons = {
    normal: <BookOpen className="h-4 w-4" />,
    speed: <Zap className="h-4 w-4" />,
    focused: <Target className="h-4 w-4" />
  };

  const studyModeDescriptions = {
    normal: "Regular pace learning",
    speed: "Quick review mode",
    focused: "Deep learning mode"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <BookOpen className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Flashcards
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              <Brain className="h-3 w-3 mr-1" />
              {cardsCount} cards available
            </Badge>
            <Badge variant="outline" className="text-sm">
              {studyModeIcons[studyMode]}
              <span className="ml-1">{studyMode} mode</span>
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Study Mode Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Study Mode</Label>
            <Select value={studyMode} onValueChange={(value: 'normal' | 'speed' | 'focused') => setStudyMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Normal
                  </div>
                </SelectItem>
                <SelectItem value="speed">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Speed
                  </div>
                </SelectItem>
                <SelectItem value="focused">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Focused
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">{studyModeDescriptions[studyMode]}</p>
          </div>

          {/* Auto Flip Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Auto Flip</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-flip"
                checked={autoFlip}
                onCheckedChange={setAutoFlip}
              />
              <Label htmlFor="auto-flip" className="text-sm text-gray-600 dark:text-gray-400">
                {autoFlip ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              {studyMode === 'speed' ? '3s delay' : '5s delay'}
            </p>
          </div>

          {/* Add Card Button */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Add Card'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
