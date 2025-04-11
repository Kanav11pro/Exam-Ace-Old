
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, RotateCcw, BookOpen, Check, X, Star, 
  StarHalf, Plus, Edit, Trash, Sparkles, ChevronDown, Search, Filter, Save
} from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  timesReviewed: number;
  confidence: 'low' | 'medium' | 'high';
  userCreated?: boolean;
}

export function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'learn' | 'review'>('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [newCard, setNewCard] = useState<Partial<Flashcard>>({
    question: '',
    answer: '',
    subject: 'Maths',
    topic: '',
    difficulty: 'medium',
    timesReviewed: 0,
    confidence: 'medium'
  });
  
  const { toast } = useToast();
  
  const subjects = ['Maths', 'Physics', 'Chemistry'];
  
  // Load flashcards from localStorage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('jeeFlashcards');
    if (savedFlashcards) {
      try {
        const parsedCards = JSON.parse(savedFlashcards);
        setFlashcards(parsedCards);
      } catch (e) {
        console.error('Error loading flashcards:', e);
        setFlashcards(defaultFlashcards);
      }
    } else {
      setFlashcards(defaultFlashcards);
    }
  }, []);
  
  // Save flashcards to localStorage when they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('jeeFlashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);
  
  // Filter flashcards based on search and subject
  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = 
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || card.subject === subjectFilter;
    
    const matchesTab = 
      selectedTab === 'all' || 
      (selectedTab === 'user' && card.userCreated) ||
      (selectedTab === 'needsReview' && card.confidence === 'low');
    
    return matchesSearch && matchesSubject && matchesTab;
  });
  
  // Group flashcards by subject
  const flashcardsBySubject: Record<string, Flashcard[]> = {};
  subjects.forEach(subject => {
    flashcardsBySubject[subject] = filteredFlashcards.filter(card => card.subject === subject);
  });
  
  // Group flashcards by difficulty
  const flashcardsByDifficulty: Record<string, Flashcard[]> = {
    'easy': filteredFlashcards.filter(card => card.difficulty === 'easy'),
    'medium': filteredFlashcards.filter(card => card.difficulty === 'medium'),
    'hard': filteredFlashcards.filter(card => card.difficulty === 'hard')
  };
  
  // Create study decks
  const studyDecks = [
    { name: 'All Flashcards', cards: filteredFlashcards },
    { name: 'Mathematics', cards: flashcardsBySubject['Maths'] || [] },
    { name: 'Physics', cards: flashcardsBySubject['Physics'] || [] },
    { name: 'Chemistry', cards: flashcardsBySubject['Chemistry'] || [] },
    { name: 'Needs Review', cards: filteredFlashcards.filter(card => card.confidence === 'low') },
    { name: 'Your Cards', cards: filteredFlashcards.filter(card => card.userCreated) }
  ].filter(deck => deck.cards.length > 0);
  
  // Get current deck and card
  const currentDeck = studyDecks[currentDeckIndex] || { name: 'No Cards', cards: [] };
  const currentCard = currentDeck.cards[currentCardIndex] || null;
  const totalCards = currentDeck.cards.length;
  
  // Handle card navigation
  const goToNextCard = () => {
    setShowAnswer(false);
    setIsCardFlipped(false);
    
    if (currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of deck reached
      toast({
        title: 'Deck Completed',
        description: `You've reviewed all ${currentDeck.cards.length} cards in this deck!`,
      });
      // Reset to first card
      setCurrentCardIndex(0);
    }
  };
  
  const goToPrevCard = () => {
    setShowAnswer(false);
    setIsCardFlipped(false);
    
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      // Wrap to end of deck
      setCurrentCardIndex(currentDeck.cards.length - 1);
    }
  };
  
  const resetDeck = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setIsCardFlipped(false);
  };
  
  // Handle confidence rating
  const rateConfidence = (level: 'low' | 'medium' | 'high') => {
    if (!currentCard) return;
    
    const updatedFlashcards = flashcards.map(card => {
      if (card.id === currentCard.id) {
        return {
          ...card,
          confidence: level,
          timesReviewed: card.timesReviewed + 1,
          lastReviewed: new Date().toISOString()
        };
      }
      return card;
    });
    
    setFlashcards(updatedFlashcards);
    goToNextCard();
  };
  
  // Change study deck
  const changeDeck = (direction: 'next' | 'prev') => {
    let newIndex = currentDeckIndex;
    
    if (direction === 'next') {
      newIndex = (currentDeckIndex + 1) % studyDecks.length;
    } else {
      newIndex = (currentDeckIndex - 1 + studyDecks.length) % studyDecks.length;
    }
    
    setCurrentDeckIndex(newIndex);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setIsCardFlipped(false);
  };
  
  // Handle card flip
  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
    setShowAnswer(!showAnswer);
  };
  
  // Handle edit card
  const openEditDialog = (card: Flashcard) => {
    setCardToEdit(card);
    setIsEditDialogOpen(true);
  };
  
  const saveEditedCard = () => {
    if (!cardToEdit) return;
    
    const updatedFlashcards = flashcards.map(card => 
      card.id === cardToEdit.id ? cardToEdit : card
    );
    
    setFlashcards(updatedFlashcards);
    setIsEditDialogOpen(false);
    
    toast({
      title: 'Card Updated',
      description: 'Your flashcard has been updated successfully.',
    });
  };
  
  // Handle delete card
  const deleteCard = (cardId: string) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== cardId);
    setFlashcards(updatedFlashcards);
    
    toast({
      title: 'Card Deleted',
      description: 'Your flashcard has been deleted.',
    });
    
    // If we're in study mode and deleting the current card
    if (currentCard && currentCard.id === cardId) {
      if (currentDeck.cards.length > 1) {
        // Go to next card or reset to start if at the end
        if (currentCardIndex === currentDeck.cards.length - 1) {
          setCurrentCardIndex(0);
        }
        // Current index is fine as the array will shift
      } else {
        // If it was the last card in the deck, go to the first deck
        setCurrentDeckIndex(0);
        setCurrentCardIndex(0);
      }
    }
  };
  
  // Handle create card
  const createNewCard = () => {
    if (!newCard.question || !newCard.answer) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both a question and an answer.',
        variant: 'destructive'
      });
      return;
    }
    
    const newFlashcard: Flashcard = {
      id: `user-${Date.now()}`,
      question: newCard.question || '',
      answer: newCard.answer || '',
      subject: newCard.subject as string || 'Maths',
      topic: newCard.topic || 'General',
      difficulty: newCard.difficulty as 'easy' | 'medium' | 'hard' || 'medium',
      timesReviewed: 0,
      confidence: 'medium',
      userCreated: true
    };
    
    setFlashcards([...flashcards, newFlashcard]);
    setIsCreateDialogOpen(false);
    
    // Reset the form
    setNewCard({
      question: '',
      answer: '',
      subject: 'Maths',
      topic: '',
      difficulty: 'medium',
      timesReviewed: 0,
      confidence: 'medium'
    });
    
    toast({
      title: 'Card Created',
      description: 'Your new flashcard has been created successfully.',
    });
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get subject color
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Maths':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Physics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Chemistry':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container max-w-6xl py-6">
      {studyMode === 'learn' ? (
        // Browse and manage mode
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Link to="/study-tools" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mr-2">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Back</span>
                </Link>
                <h1 className="text-3xl font-bold">Flashcards</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Create and study flashcards to master JEE concepts
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setStudyMode('review')} className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Study Mode
              </Button>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Flashcard</DialogTitle>
                    <DialogDescription>
                      Add your own flashcard to study later
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="question" className="text-right">Question</Label>
                      <Textarea
                        id="question"
                        value={newCard.question}
                        onChange={(e) => setNewCard({...newCard, question: e.target.value})}
                        placeholder="Enter your question here"
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="answer" className="text-right">Answer</Label>
                      <Textarea
                        id="answer"
                        value={newCard.answer}
                        onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
                        placeholder="Enter the answer here"
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subject" className="text-right">Subject</Label>
                      <Select
                        value={newCard.subject}
                        onValueChange={(value) => setNewCard({...newCard, subject: value})}
                      >
                        <SelectTrigger id="subject" className="col-span-3">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maths">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="topic" className="text-right">Topic</Label>
                      <Input
                        id="topic"
                        value={newCard.topic}
                        onChange={(e) => setNewCard({...newCard, topic: e.target.value})}
                        placeholder="e.g., Calculus, Mechanics"
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
                      <Select
                        value={newCard.difficulty}
                        onValueChange={(value) => setNewCard({...newCard, difficulty: value as 'easy' | 'medium' | 'hard'})}
                      >
                        <SelectTrigger id="difficulty" className="col-span-3">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createNewCard}>
                      Create Flashcard
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Search and filters */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search flashcards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Subjects</option>
                    <option value="Maths">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for different views */}
          <Tabs defaultValue="all" className="mb-6" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Cards</TabsTrigger>
              <TabsTrigger value="user">Your Cards</TabsTrigger>
              <TabsTrigger value="needsReview">Needs Review</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Flashcard grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlashcards.length > 0 ? (
              filteredFlashcards.map(card => (
                <Card key={card.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getSubjectColor(card.subject)}>
                          {card.subject}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(card.difficulty)}>
                          {card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1)}
                        </Badge>
                        {card.userCreated && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            Your Card
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(card)}>
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCard(card.id)}>
                          <Trash className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardTitle className="text-base mt-3 text-gray-600 dark:text-gray-300">
                      {card.topic}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">Q: {card.question}</h3>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Answer</div>
                        <Button variant="ghost" size="sm" onClick={() => flipCard()} className="h-6 text-xs">
                          Show/Hide
                        </Button>
                      </div>
                      <p className={`bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm ${!showAnswer ? 'blur-sm hover:blur-none' : ''}`}>
                        {card.answer}
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex justify-between w-full">
                      <div>Reviewed: {card.timesReviewed} times</div>
                      <div className="flex items-center">
                        Confidence:
                        {card.confidence === 'low' && <X className="h-4 w-4 ml-1 text-red-500" />}
                        {card.confidence === 'medium' && <StarHalf className="h-4 w-4 ml-1 text-yellow-500" />}
                        {card.confidence === 'high' && <Star className="h-4 w-4 ml-1 text-green-500" />}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No flashcards found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || subjectFilter !== 'all' 
                    ? 'Try changing your search or filter criteria'
                    : 'Create your first flashcard to start studying'}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Create Flashcard
                </Button>
              </div>
            )}
          </div>
          
          {/* Edit dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Flashcard</DialogTitle>
                <DialogDescription>
                  Make changes to your flashcard
                </DialogDescription>
              </DialogHeader>
              
              {cardToEdit && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-question" className="text-right">Question</Label>
                    <Textarea
                      id="edit-question"
                      value={cardToEdit.question}
                      onChange={(e) => setCardToEdit({...cardToEdit, question: e.target.value})}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-answer" className="text-right">Answer</Label>
                    <Textarea
                      id="edit-answer"
                      value={cardToEdit.answer}
                      onChange={(e) => setCardToEdit({...cardToEdit, answer: e.target.value})}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-subject" className="text-right">Subject</Label>
                    <Select
                      value={cardToEdit.subject}
                      onValueChange={(value) => setCardToEdit({...cardToEdit, subject: value})}
                    >
                      <SelectTrigger id="edit-subject" className="col-span-3">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maths">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-topic" className="text-right">Topic</Label>
                    <Input
                      id="edit-topic"
                      value={cardToEdit.topic}
                      onChange={(e) => setCardToEdit({...cardToEdit, topic: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-difficulty" className="text-right">Difficulty</Label>
                    <Select
                      value={cardToEdit.difficulty}
                      onValueChange={(value) => setCardToEdit({...cardToEdit, difficulty: value as 'easy' | 'medium' | 'hard'})}
                    >
                      <SelectTrigger id="edit-difficulty" className="col-span-3">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedCard}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        // Study mode
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Link to="/study-tools" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mr-2">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Back</span>
                </Link>
                <h1 className="text-3xl font-bold">Study Mode</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Reviewing: {currentDeck.name} ({currentCardIndex + 1} of {totalCards})
              </p>
            </div>
            
            <Button variant="outline" onClick={() => setStudyMode('learn')} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Exit Study Mode
            </Button>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {currentCard ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => changeDeck('prev')}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev Deck
                  </Button>
                  
                  <div className="text-center">
                    <h2 className="font-semibold">{currentDeck.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{totalCards} cards</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => changeDeck('next')}
                    className="flex items-center"
                  >
                    Next Deck
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <div className="mb-4">
                  <Progress value={(currentCardIndex / totalCards) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Card {currentCardIndex + 1} of {totalCards}</span>
                    <span>{Math.round((currentCardIndex / totalCards) * 100)}% complete</span>
                  </div>
                </div>
                
                <div 
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6 mb-6 h-80 flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
                    isCardFlipped ? 'bg-gray-50 dark:bg-gray-750' : ''
                  }`}
                  onClick={flipCard}
                  style={{
                    perspective: '1000px'
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center relative"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s',
                      transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    <div
                      className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between"
                      style={{
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className={getSubjectColor(currentCard.subject)}>
                          {currentCard.subject}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(currentCard.difficulty)}>
                          {currentCard.difficulty}
                        </Badge>
                      </div>
                      <div className="text-center my-6">
                        <h3 className="text-2xl font-semibold">{currentCard.question}</h3>
                      </div>
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Click to reveal answer</p>
                        <p>{currentCard.topic}</p>
                      </div>
                    </div>
                    
                    <div
                      className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className={getSubjectColor(currentCard.subject)}>
                          {currentCard.subject}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          Answer
                        </Badge>
                      </div>
                      <div className="text-center my-6">
                        <p className="text-xl">{currentCard.answer}</p>
                      </div>
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Click to return to question</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-8">
                  <Button 
                    variant="outline" 
                    className="flex items-center mr-3" 
                    onClick={goToPrevCard}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center mr-3"
                    onClick={resetDeck}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  
                  <Button 
                    className="flex items-center" 
                    onClick={goToNextCard}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <div className="border-t pt-6 pb-4">
                  <h3 className="text-center text-lg font-semibold mb-4">How well did you know this?</h3>
                  <div className="flex justify-center gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 max-w-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30" 
                      onClick={() => rateConfidence('low')}
                    >
                      <X className="h-5 w-5 mr-2" />
                      Didn't Know
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 max-w-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-900/30" 
                      onClick={() => rateConfidence('medium')}
                    >
                      <StarHalf className="h-5 w-5 mr-2" />
                      Partially Knew
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 max-w-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30" 
                      onClick={() => rateConfidence('high')}
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Knew It
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-medium mb-2">No flashcards available</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try selecting a different deck or create some flashcards
                </p>
                <Button onClick={() => setStudyMode('learn')}>
                  Go to Flashcards
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Default flashcards
const defaultFlashcards: Flashcard[] = [
  // Math flashcards
  {
    id: 'math-1',
    question: 'What is the derivative of e^x?',
    answer: 'e^x',
    subject: 'Maths',
    topic: 'Calculus',
    difficulty: 'easy',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'math-2',
    question: 'What is the formula for the area of a circle?',
    answer: 'A = πr²',
    subject: 'Maths',
    topic: 'Geometry',
    difficulty: 'easy',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'math-3',
    question: 'What is the quadratic formula?',
    answer: 'x = (-b ± √(b² - 4ac)) / 2a',
    subject: 'Maths',
    topic: 'Algebra',
    difficulty: 'medium',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'math-4',
    question: 'What is the definition of a limit?',
    answer: 'The limit of f(x) as x approaches a is L if for every ε > 0, there exists a δ > 0 such that |f(x) - L| < ε whenever 0 < |x - a| < δ.',
    subject: 'Maths',
    topic: 'Calculus',
    difficulty: 'hard',
    timesReviewed: 0,
    confidence: 'low'
  },
  {
    id: 'math-5',
    question: 'What is the formula for the sum of an arithmetic series?',
    answer: 'S = n/2 · (a₁ + aₙ), where a₁ is the first term, aₙ is the last term, and n is the number of terms.',
    subject: 'Maths',
    topic: 'Series and Sequences',
    difficulty: 'medium',
    timesReviewed: 0,
    confidence: 'medium'
  },
  
  // Physics flashcards
  {
    id: 'physics-1',
    question: 'What is Newton\'s second law of motion?',
    answer: 'F = ma, where F is the net force, m is the mass, and a is the acceleration.',
    subject: 'Physics',
    topic: 'Mechanics',
    difficulty: 'easy',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'physics-2',
    question: 'What is the formula for kinetic energy?',
    answer: 'KE = (1/2)mv², where m is mass and v is velocity.',
    subject: 'Physics',
    topic: 'Energy',
    difficulty: 'easy',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'physics-3',
    question: 'What is Bohr\'s model of the hydrogen atom?',
    answer: 'Electrons move in stable, circular orbits around the nucleus. The orbits have discrete energies, and transitions between orbits result in the emission or absorption of photons with specific frequencies.',
    subject: 'Physics',
    topic: 'Atomic Physics',
    difficulty: 'hard',
    timesReviewed: 0,
    confidence: 'low'
  },
  {
    id: 'physics-4',
    question: 'What is Faraday\'s law of electromagnetic induction?',
    answer: 'The induced electromotive force (EMF) in a closed circuit is equal to the negative of the rate of change of magnetic flux through the circuit.',
    subject: 'Physics',
    topic: 'Electromagnetism',
    difficulty: 'medium',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'physics-5',
    question: 'What is the relationship between wavelength (λ), frequency (f), and wave speed (v)?',
    answer: 'v = λf',
    subject: 'Physics',
    topic: 'Waves',
    difficulty: 'easy',
    timesReviewed: 0,
    confidence: 'high'
  },
  
  // Chemistry flashcards
  {
    id: 'chem-1',
    question: 'What is the Aufbau principle?',
    answer: 'Electrons fill orbitals starting at the lowest available energy level before filling higher energy levels.',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    difficulty: 'medium',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'chem-2',
    question: 'What is Hess\'s Law?',
    answer: 'The total enthalpy change of a reaction is independent of the route taken to get from the initial to the final state.',
    subject: 'Chemistry',
    topic: 'Thermochemistry',
    difficulty: 'medium',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'chem-3',
    question: 'What is the definition of pH?',
    answer: 'pH = -log[H⁺], where [H⁺] is the concentration of hydrogen ions in moles per liter.',
    subject: 'Chemistry',
    topic: 'Acids and Bases',
    difficulty: 'easy',
    timesReviewed: 0,
    confidence: 'high'
  },
  {
    id: 'chem-4',
    question: 'What is the VSEPR theory used for?',
    answer: 'Valence Shell Electron Pair Repulsion theory is used to predict the geometry of molecules based on the arrangement of electron pairs around the central atom.',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    difficulty: 'hard',
    timesReviewed: 0,
    confidence: 'medium'
  },
  {
    id: 'chem-5',
    question: 'What is Markovnikov\'s rule?',
    answer: 'When an unsymmetrical reagent (like HBr) adds to an unsymmetrical alkene, the H atom adds to the carbon that already has more H atoms, and the Br adds to the carbon with fewer H atoms.',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    timesReviewed: 0,
    confidence: 'low'
  }
];

export default Flashcards;
