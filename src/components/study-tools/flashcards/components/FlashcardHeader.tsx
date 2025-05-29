
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FlashcardHeaderProps {
  cardsCount: number;
  autoFlip: boolean;
  setAutoFlip: (value: boolean) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function FlashcardHeader({ cardsCount, autoFlip, setAutoFlip, isEditing, setIsEditing }: FlashcardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="space-y-3">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="h-6 w-6 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  JEE Flashcards
                </h1>
                <motion.div 
                  className="flex items-center gap-2 mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge 
                    variant="outline" 
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 font-semibold"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {cardsCount} cards
                  </Badge>
                  {cardsCount > 0 && (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-muted-foreground max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Master key concepts through active recall and spaced repetition
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border border-border/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Switch
                id="auto-flip"
                checked={autoFlip}
                onCheckedChange={setAutoFlip}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary"
              />
              <Label 
                htmlFor="auto-flip" 
                className="text-sm font-medium cursor-pointer select-none"
              >
                Auto-flip
              </Label>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isEditing ? "outline" : "default"}
                size="lg"
                onClick={() => setIsEditing(!isEditing)}
                className={`font-semibold shadow-lg transition-all duration-300 ${
                  isEditing 
                    ? 'border-primary/30 hover:bg-primary/5' 
                    : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <motion.span
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      ✕
                    </motion.span>
                    <span className="ml-2">Cancel</span>
                  </>
                ) : (
                  <>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      ✨
                    </motion.span>
                    <span className="ml-2">Add Card</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating decoration elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-50"
          animate={{
            y: [0, 6, 0],
            x: [0, 4, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </motion.div>
  );
}
