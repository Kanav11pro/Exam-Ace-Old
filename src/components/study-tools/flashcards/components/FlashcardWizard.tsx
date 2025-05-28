
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wand2, Plus, ChevronRight, ChevronLeft, BookOpen, Target, Zap } from 'lucide-react';

interface FlashcardWizardProps {
  onComplete: (cards: Array<{ subject: string; question: string; answer: string; difficulty: string }>) => void;
  onCancel: () => void;
}

export function FlashcardWizard({ onComplete, onCancel }: FlashcardWizardProps) {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [cards, setCards] = useState([{ question: '', answer: '' }]);
  const [currentCard, setCurrentCard] = useState(0);

  const subjects = [
    { value: 'Maths', label: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
    { value: 'Physics', label: 'Physics', icon: '⚛️', color: 'bg-green-500' },
    { value: 'Chemistry', label: 'Chemistry', icon: '🧪', color: 'bg-orange-500' },
    { value: 'Biology', label: 'Biology', icon: '🧬', color: 'bg-purple-500' },
    { value: 'English', label: 'English', icon: '📚', color: 'bg-red-500' },
    { value: 'History', label: 'History', icon: '🏛️', color: 'bg-yellow-500' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', icon: <Target className="h-4 w-4" />, color: 'text-green-600' },
    { value: 'medium', label: 'Medium', icon: <BookOpen className="h-4 w-4" />, color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', icon: <Zap className="h-4 w-4" />, color: 'text-red-600' }
  ];

  const addCard = () => {
    setCards([...cards, { question: '', answer: '' }]);
    setCurrentCard(cards.length);
  };

  const updateCard = (index: number, field: 'question' | 'answer', value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
      setCurrentCard(Math.min(currentCard, newCards.length - 1));
    }
  };

  const handleNext = () => {
    if (step === 1 && subject) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const validCards = cards.filter(card => card.question.trim() && card.answer.trim());
      if (validCards.length > 0) {
        const finalCards = validCards.map(card => ({
          subject,
          question: card.question,
          answer: card.answer,
          difficulty
        }));
        onComplete(finalCards);
      }
    }
  };

  const canProceed = () => {
    if (step === 1) return subject;
    if (step === 2) return true;
    if (step === 3) return cards.some(card => card.question.trim() && card.answer.trim());
    return false;
  };

  const progressValue = (step / 3) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Wand2 className="h-6 w-6" />
              Flashcard Wizard
            </CardTitle>
            <Button variant="ghost" onClick={onCancel} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
          <Progress value={progressValue} className="mt-4 bg-white/20" />
        </CardHeader>

        <CardContent className="p-8">
          {/* Step 1: Subject Selection */}
          {step === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">Choose Your Subject</h3>
                <p className="text-muted-foreground">Select the subject for your flashcards</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((subj) => (
                  <motion.div
                    key={subj.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        subject === subj.value
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSubject(subj.value)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 ${subj.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-3`}>
                          {subj.icon}
                        </div>
                        <h4 className="font-semibold">{subj.label}</h4>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Difficulty & Settings */}
          {step === 2 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">Configure Settings</h3>
                <p className="text-muted-foreground">Set the difficulty level and preferences</p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Selected Subject</label>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {subjects.find(s => s.value === subject)?.icon} {subject}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((diff) => (
                      <motion.div
                        key={diff.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            difficulty === diff.value
                              ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setDifficulty(diff.value)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`${diff.color} mb-2 flex justify-center`}>
                              {diff.icon}
                            </div>
                            <span className="text-sm font-medium">{diff.label}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Create Cards */}
          {step === 3 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-2">Create Your Flashcards</h3>
                <p className="text-muted-foreground">Add questions and answers for {subject}</p>
              </div>

              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  Card {currentCard + 1} of {cards.length}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
                    disabled={currentCard === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentCard(Math.min(cards.length - 1, currentCard + 1))}
                    disabled={currentCard === cards.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCard}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Question</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      placeholder="Enter your question here..."
                      value={cards[currentCard]?.question || ''}
                      onChange={(e) => updateCard(currentCard, 'question', e.target.value)}
                      className="min-h-32"
                    />
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="bg-green-50 dark:bg-green-900/20">
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">Answer</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      placeholder="Enter the answer here..."
                      value={cards[currentCard]?.answer || ''}
                      onChange={(e) => updateCard(currentCard, 'answer', e.target.value)}
                      className="min-h-32"
                    />
                  </CardContent>
                </Card>
              </div>

              {cards.length > 1 && (
                <div className="text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCard(currentCard)}
                  >
                    Remove This Card
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {step > 1 ? 'Previous' : 'Cancel'}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {step === 3 ? 'Create Cards' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
