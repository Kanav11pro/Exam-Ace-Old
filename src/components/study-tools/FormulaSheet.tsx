
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bookmark, Copy, Download, Filter, BookMinus, Calculator, ChevronLeft, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from 'react-router-dom';

interface Formula {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  subject: 'Maths' | 'Physics' | 'Chemistry';
  chapter: string;
  important: boolean;
  latex?: string;
  isUserAdded?: boolean;
}

export function FormulaSheet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [bookmarkedFormulas, setBookmarkedFormulas] = useState<string[]>([]);
  const [isAddFormulaOpen, setIsAddFormulaOpen] = useState(false);
  const [newFormula, setNewFormula] = useState<Partial<Formula>>({
    title: '',
    formula: '',
    explanation: '',
    subject: 'Maths',
    chapter: '',
    important: false
  });
  const { toast } = useToast();
  
  // Load formulas from localStorage on component mount
  useEffect(() => {
    const savedFormulas = localStorage.getItem('jeeFormulas');
    const savedBookmarks = localStorage.getItem('jeeFormulaBookmarks');
    
    if (savedFormulas) {
      try {
        setFormulas(JSON.parse(savedFormulas));
      } catch (e) {
        console.error('Error loading formulas:', e);
        setFormulas(defaultFormulas);
      }
    } else {
      setFormulas(defaultFormulas);
    }
    
    if (savedBookmarks) {
      try {
        setBookmarkedFormulas(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
        setBookmarkedFormulas([]);
      }
    }
  }, []);
  
  // Save formulas and bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('jeeFormulas', JSON.stringify(formulas));
  }, [formulas]);
  
  useEffect(() => {
    localStorage.setItem('jeeFormulaBookmarks', JSON.stringify(bookmarkedFormulas));
  }, [bookmarkedFormulas]);
  
  // Filter formulas based on search and filters
  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = 
      formula.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.chapter.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = selectedSubject === 'all' || formula.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Group formulas by subject
  const formulasBySubject: Record<string, Formula[]> = {
    'Maths': filteredFormulas.filter(f => f.subject === 'Maths'),
    'Physics': filteredFormulas.filter(f => f.subject === 'Physics'),
    'Chemistry': filteredFormulas.filter(f => f.subject === 'Chemistry')
  };

  // Group formulas by chapter within subject
  const formulasByChapter: Record<string, Record<string, Formula[]>> = {
    'Maths': {},
    'Physics': {},
    'Chemistry': {}
  };

  for (const subject of ['Maths', 'Physics', 'Chemistry'] as const) {
    for (const formula of formulasBySubject[subject]) {
      if (!formulasByChapter[subject][formula.chapter]) {
        formulasByChapter[subject][formula.chapter] = [];
      }
      formulasByChapter[subject][formula.chapter].push(formula);
    }
  }

  // Handle copy formula
  const handleCopyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    toast({
      title: "Formula copied",
      description: "Formula copied to clipboard",
    });
  };

  // Handle bookmark formula
  const handleBookmarkFormula = (formulaId: string) => {
    if (bookmarkedFormulas.includes(formulaId)) {
      setBookmarkedFormulas(bookmarkedFormulas.filter(id => id !== formulaId));
      toast({
        title: "Bookmark removed",
        description: "Formula removed from bookmarks",
      });
    } else {
      setBookmarkedFormulas([...bookmarkedFormulas, formulaId]);
      toast({
        title: "Formula bookmarked",
        description: "You can access your bookmarked formulas in the Bookmarks tab",
      });
    }
  };
  
  // Handle adding new formula
  const handleAddFormula = () => {
    if (!newFormula.title || !newFormula.formula || !newFormula.chapter || !newFormula.subject) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newFormulaComplete: Formula = {
      id: `user-${Date.now()}`,
      title: newFormula.title,
      formula: newFormula.formula,
      explanation: newFormula.explanation || '',
      subject: newFormula.subject as 'Maths' | 'Physics' | 'Chemistry',
      chapter: newFormula.chapter,
      important: newFormula.important || false,
      isUserAdded: true
    };
    
    setFormulas([...formulas, newFormulaComplete]);
    setIsAddFormulaOpen(false);
    setNewFormula({
      title: '',
      formula: '',
      explanation: '',
      subject: 'Maths',
      chapter: '',
      important: false
    });
    
    toast({
      title: "Formula added",
      description: "Your formula has been added successfully",
    });
  };

  // Get all chapters for a subject
  const getChaptersForSubject = (subject: string) => {
    const uniqueChapters = new Set<string>();
    formulas
      .filter(formula => formula.subject === subject)
      .forEach(formula => uniqueChapters.add(formula.chapter));
    return Array.from(uniqueChapters);
  };

  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/study-tools" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mr-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Back</span>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calculator className="h-7 w-7 text-blue-600" />
              Formula Sheet
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Quick reference for essential JEE formulas
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Dialog open={isAddFormulaOpen} onOpenChange={setIsAddFormulaOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Formula
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Formula</DialogTitle>
                <DialogDescription>
                  Add your own formula to the collection
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Pythagorean Theorem"
                    value={newFormula.title}
                    onChange={(e) => setNewFormula({...newFormula, title: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formula" className="text-right">Formula</Label>
                  <Input
                    id="formula"
                    placeholder="e.g., a² + b² = c²"
                    value={newFormula.formula}
                    onChange={(e) => setNewFormula({...newFormula, formula: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">Subject</Label>
                  <Select
                    value={newFormula.subject}
                    onValueChange={(value) => setNewFormula({...newFormula, subject: value as 'Maths' | 'Physics' | 'Chemistry'})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chapter" className="text-right">Chapter</Label>
                  <Input
                    id="chapter"
                    placeholder="e.g., Triangles"
                    value={newFormula.chapter}
                    onChange={(e) => setNewFormula({...newFormula, chapter: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="explanation" className="text-right pt-2">Explanation</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Brief explanation of the formula"
                    value={newFormula.explanation}
                    onChange={(e) => setNewFormula({...newFormula, explanation: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="important" className="text-right">Important</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="important"
                      checked={newFormula.important}
                      onCheckedChange={(checked) => setNewFormula({...newFormula, important: checked})}
                    />
                    <Label htmlFor="important">Mark as important formula</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddFormulaOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddFormula}>
                  Add Formula
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search formulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
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
      
      {/* Formula Listings */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Formulas</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarked</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="user">My Formulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No formulas found</h3>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* For each subject */}
              {(['Maths', 'Physics', 'Chemistry'] as const).map(subject => {
                if (formulasBySubject[subject].length === 0) return null;
                
                return (
                  <div key={subject}>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      {subject === 'Maths' ? (
                        <div className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      ) : subject === 'Physics' ? (
                        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                      )}
                      {subject}
                    </h2>
                    
                    {/* Accordion for chapters */}
                    <Accordion type="multiple" defaultValue={Object.keys(formulasByChapter[subject])}>
                      {Object.entries(formulasByChapter[subject]).map(([chapter, chapterFormulas]) => (
                        <AccordionItem key={chapter} value={chapter}>
                          <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg">
                            {chapter} ({chapterFormulas.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 p-2">
                              {chapterFormulas.map(formula => (
                                <Card 
                                  key={formula.id} 
                                  className={`overflow-hidden hover:shadow transition-all ${
                                    formula.important ? 'border-amber-200 dark:border-amber-800' : ''
                                  } ${formula.isUserAdded ? 'border-blue-200 dark:border-blue-800' : ''}`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center">
                                        <h3 className="font-semibold text-lg">{formula.title}</h3>
                                        {formula.isUserAdded && (
                                          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            Your Formula
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8" 
                                          onClick={() => handleBookmarkFormula(formula.id)}
                                        >
                                          <Bookmark className={`h-4 w-4 ${bookmarkedFormulas.includes(formula.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8"
                                          onClick={() => handleCopyFormula(formula.formula)}
                                        >
                                          <Copy className="h-4 w-4 text-gray-400" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center text-lg">
                                      {formula.formula}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                      {formula.explanation}
                                    </p>
                                    
                                    {formula.important && (
                                      <div className="mt-2">
                                        <Badge variant="warning" size="sm">Important</Badge>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookmarks">
          {bookmarkedFormulas.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookmarked formulas</h3>
              <p className="text-gray-500">Bookmark formulas to access them quickly later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulas
                .filter(formula => bookmarkedFormulas.includes(formula.id))
                .map(formula => (
                  <Card 
                    key={formula.id} 
                    className="overflow-hidden hover:shadow transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{formula.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge>{formula.subject}</Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleBookmarkFormula(formula.id)}
                            >
                              <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleCopyFormula(formula.formula)}
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center">
                        {formula.formula}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {formula.explanation}
                      </p>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        Chapter: {formula.chapter}
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="important">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.filter(f => f.important).length > 0 ? (
              filteredFormulas.filter(f => f.important).map(formula => (
                <Card 
                  key={formula.id} 
                  className="overflow-hidden hover:shadow transition-all border-amber-200 dark:border-amber-800"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{formula.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge>{formula.subject}</Badge>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleBookmarkFormula(formula.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${bookmarkedFormulas.includes(formula.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleCopyFormula(formula.formula)}
                          >
                            <Copy className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center">
                      {formula.formula}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {formula.explanation}
                    </p>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Chapter: {formula.chapter}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <BookMinus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No important formulas found</h3>
                <p className="text-gray-500">Try changing your search or filter criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="user">
          {formulas.filter(f => f.isUserAdded).length === 0 ? (
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No formulas added yet</h3>
              <p className="text-gray-500 mb-4">Add your own formulas for quick reference</p>
              <Button onClick={() => setIsAddFormulaOpen(true)}>
                Add Your First Formula
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Formulas</h3>
                <Button size="sm" onClick={() => setIsAddFormulaOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formulas
                  .filter(formula => formula.isUserAdded)
                  .map(formula => (
                    <Card 
                      key={formula.id} 
                      className="overflow-hidden hover:shadow transition-all border-blue-200 dark:border-blue-800"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{formula.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge>{formula.subject}</Badge>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleBookmarkFormula(formula.id)}
                              >
                                <Bookmark className={`h-4 w-4 ${bookmarkedFormulas.includes(formula.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleCopyFormula(formula.formula)}
                              >
                                <Copy className="h-4 w-4 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center">
                          {formula.formula}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {formula.explanation}
                        </p>
                        
                        <div className="mt-2 text-sm text-gray-500">
                          Chapter: {formula.chapter}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Default formulas data - expanded with many more formulas covering all subjects
const defaultFormulas: Formula[] = [
  // Mathematics Formulas
  {
    id: 'math-quad-1',
    title: 'Quadratic Formula',
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    explanation: 'For a quadratic equation ax² + bx + c = 0, this formula gives the values of x that solve the equation.',
    subject: 'Maths',
    chapter: 'Quadratic Equations',
    important: true,
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
  },
  {
    id: 'math-deriv-1',
    title: 'Power Rule',
    formula: 'd/dx [xⁿ] = n·xⁿ⁻¹',
    explanation: 'The derivative of x raised to the power n is n times x raised to the power (n-1).',
    subject: 'Maths',
    chapter: 'Differentiation',
    important: true,
    latex: '\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}'
  },
  {
    id: 'math-integ-1',
    title: 'Power Rule Integration',
    formula: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C for n ≠ -1',
    explanation: 'The integral of x raised to the power n is x raised to the power (n+1) divided by (n+1), plus a constant.',
    subject: 'Maths',
    chapter: 'Integration',
    important: true,
    latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\text{ for } n \\neq -1'
  },
  {
    id: 'math-trig-1',
    title: 'Pythagorean Identity',
    formula: 'sin²θ + cos²θ = 1',
    explanation: 'The fundamental trigonometric identity relating sine and cosine functions.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\sin^2\\theta + \\cos^2\\theta = 1'
  },
  {
    id: 'math-complex-1',
    title: 'Euler\'s Formula',
    formula: 'e^(iθ) = cos θ + i sin θ',
    explanation: 'Relates complex exponentials to trigonometric functions.',
    subject: 'Maths',
    chapter: 'Complex Numbers',
    important: true,
    latex: 'e^{i\\theta} = \\cos \\theta + i \\sin \\theta'
  },
  {
    id: 'math-trig-2',
    title: 'Double Angle Formula - Sine',
    formula: 'sin(2θ) = 2sinθcosθ',
    explanation: 'Expresses the sine of twice an angle in terms of the sine and cosine of the original angle.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta'
  },
  {
    id: 'math-trig-3',
    title: 'Double Angle Formula - Cosine',
    formula: 'cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ',
    explanation: 'Expresses the cosine of twice an angle in terms of the sine and cosine of the original angle.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta'
  },
  {
    id: 'math-trig-4',
    title: 'Half Angle Formula - Sine',
    formula: 'sin(θ/2) = ±√((1-cosθ)/2)',
    explanation: 'Expresses the sine of half an angle in terms of the cosine of the original angle.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: false,
    latex: '\\sin(\\theta/2) = \\pm\\sqrt{\\frac{1-\\cos\\theta}{2}}'
  },
  {
    id: 'math-trig-5',
    title: 'Half Angle Formula - Cosine',
    formula: 'cos(θ/2) = ±√((1+cosθ)/2)',
    explanation: 'Expresses the cosine of half an angle in terms of the cosine of the original angle.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: false,
    latex: '\\cos(\\theta/2) = \\pm\\sqrt{\\frac{1+\\cos\\theta}{2}}'
  },
  {
    id: 'math-trig-6',
    title: 'Sum of Angles - Sine',
    formula: 'sin(α+β) = sinα·cosβ + cosα·sinβ',
    explanation: 'Expresses the sine of a sum of angles in terms of sines and cosines of the individual angles.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\sin(\\alpha+\\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta'
  },
  {
    id: 'math-trig-7',
    title: 'Difference of Angles - Sine',
    formula: 'sin(α-β) = sinα·cosβ - cosα·sinβ',
    explanation: 'Expresses the sine of a difference of angles in terms of sines and cosines of the individual angles.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\sin(\\alpha-\\beta) = \\sin\\alpha\\cos\\beta - \\cos\\alpha\\sin\\beta'
  },
  {
    id: 'math-trig-8',
    title: 'Sum of Angles - Cosine',
    formula: 'cos(α+β) = cosα·cosβ - sinα·sinβ',
    explanation: 'Expresses the cosine of a sum of angles in terms of sines and cosines of the individual angles.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta'
  },
  {
    id: 'math-trig-9',
    title: 'Difference of Angles - Cosine',
    formula: 'cos(α-β) = cosα·cosβ + sinα·sinβ',
    explanation: 'Expresses the cosine of a difference of angles in terms of sines and cosines of the individual angles.',
    subject: 'Maths',
    chapter: 'Trigonometry',
    important: true,
    latex: '\\cos(\\alpha-\\beta) = \\cos\\alpha\\cos\\beta + \\sin\\alpha\\sin\\beta'
  },
  {
    id: 'math-vectors-1',
    title: 'Dot Product',
    formula: 'a·b = |a|·|b|·cosθ',
    explanation: 'The dot product of two vectors equals the product of their magnitudes times the cosine of the angle between them.',
    subject: 'Maths',
    chapter: 'Vectors',
    important: true,
    latex: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}|\\cdot|\\vec{b}|\\cdot\\cos\\theta'
  },
  {
    id: 'math-vectors-2',
    title: 'Cross Product Magnitude',
    formula: '|a×b| = |a|·|b|·sinθ',
    explanation: 'The magnitude of the cross product of two vectors equals the product of their magnitudes times the sine of the angle between them.',
    subject: 'Maths',
    chapter: 'Vectors',
    important: true,
    latex: '|\\vec{a} \\times \\vec{b}| = |\\vec{a}|\\cdot|\\vec{b}|\\cdot\\sin\\theta'
  },
  {
    id: 'math-vectors-3',
    title: 'Vector Triple Product',
    formula: 'a×(b×c) = b(a·c) - c(a·b)',
    explanation: 'The vector triple product can be expanded using this BAC-CAB formula.',
    subject: 'Maths',
    chapter: 'Vectors',
    important: false,
    latex: '\\vec{a}\\times(\\vec{b}\\times\\vec{c}) = \\vec{b}(\\vec{a}\\cdot\\vec{c}) - \\vec{c}(\\vec{a}\\cdot\\vec{b})'
  },
  {
    id: 'math-calculus-1',
    title: 'Chain Rule',
    formula: 'd/dx[f(g(x))] = f\'(g(x))·g\'(x)',
    explanation: 'The derivative of a composite function equals the derivative of the outer function evaluated at the inner function, multiplied by the derivative of the inner function.',
    subject: 'Maths',
    chapter: 'Differentiation',
    important: true,
    latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x))\\cdot g\'(x)'
  },
  {
    id: 'math-calculus-2',
    title: 'Product Rule',
    formula: 'd/dx[f(x)·g(x)] = f\'(x)·g(x) + f(x)·g\'(x)',
    explanation: 'The derivative of a product of two functions equals the derivative of the first times the second, plus the first times the derivative of the second.',
    subject: 'Maths',
    chapter: 'Differentiation',
    important: true,
    latex: '\\frac{d}{dx}[f(x)\\cdot g(x)] = f\'(x)\\cdot g(x) + f(x)\\cdot g\'(x)'
  },
  {
    id: 'math-calculus-3',
    title: 'Quotient Rule',
    formula: 'd/dx[f(x)/g(x)] = [f\'(x)·g(x) - f(x)·g\'(x)]/[g(x)]²',
    explanation: 'The derivative of a quotient of two functions.',
    subject: 'Maths',
    chapter: 'Differentiation',
    important: true,
    latex: '\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f\'(x)\\cdot g(x) - f(x)\\cdot g\'(x)}{[g(x)]^2}'
  },
  {
    id: 'math-calculus-4',
    title: 'Integration by Parts',
    formula: '∫u·dv = u·v - ∫v·du',
    explanation: 'A technique to find the integral of a product of functions.',
    subject: 'Maths',
    chapter: 'Integration',
    important: true,
    latex: '\\int u\\cdot dv = u\\cdot v - \\int v\\cdot du'
  },
  {
    id: 'math-calculus-5',
    title: 'Fundamental Theorem of Calculus',
    formula: '∫ₐᵇ f(x) dx = F(b) - F(a)',
    explanation: 'The definite integral of a function over an interval equals the difference of the antiderivative evaluated at the endpoints.',
    subject: 'Maths',
    chapter: 'Integration',
    important: true,
    latex: '\\int_{a}^{b} f(x) dx = F(b) - F(a)'
  },
  {
    id: 'math-matrix-1',
    title: 'Determinant of 2×2 Matrix',
    formula: 'det(A) = |A| = ad - bc, where A = [[a,b],[c,d]]',
    explanation: 'The determinant of a 2×2 matrix.',
    subject: 'Maths',
    chapter: 'Matrices',
    important: true,
    latex: '\\det(A) = |A| = ad - bc, \\text{ where } A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'
  },
  {
    id: 'math-matrix-2',
    title: 'Inverse of 2×2 Matrix',
    formula: 'A⁻¹ = 1/|A| · [[d,-b],[-c,a]], where A = [[a,b],[c,d]]',
    explanation: 'The inverse of a 2×2 matrix.',
    subject: 'Maths',
    chapter: 'Matrices',
    important: true,
    latex: 'A^{-1} = \\frac{1}{|A|} \\cdot \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}, \\text{ where } A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'
  },
  
  // Physics Formulas
  {
    id: 'physics-mechanics-1',
    title: 'Newton\'s Second Law',
    formula: 'F = ma',
    explanation: 'The force acting on an object is equal to the mass of the object times its acceleration.',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    important: true,
    latex: 'F = ma'
  },
  {
    id: 'physics-mechanics-2',
    title: 'Kinetic Energy',
    formula: 'KE = (1/2)mv²',
    explanation: 'The energy possessed by an object due to its motion.',
    subject: 'Physics',
    chapter: 'Work & Energy',
    important: true,
    latex: 'KE = \\frac{1}{2}mv^2'
  },
  {
    id: 'physics-em-1',
    title: 'Coulomb\'s Law',
    formula: 'F = k·q₁·q₂/r²',
    explanation: 'The electrostatic force between two charged particles.',
    subject: 'Physics',
    chapter: 'Electrostatics',
    important: true,
    latex: 'F = k\\frac{q_1 q_2}{r^2}'
  },
  {
    id: 'physics-optics-1',
    title: 'Snell\'s Law',
    formula: 'n₁sin(θ₁) = n₂sin(θ₂)',
    explanation: 'Relates the angles of incidence and refraction for light passing through different media.',
    subject: 'Physics',
    chapter: 'Ray Optics',
    important: true,
    latex: 'n_1\\sin(\\theta_1) = n_2\\sin(\\theta_2)'
  },
  {
    id: 'physics-modern-1',
    title: 'Energy-Mass Equivalence',
    formula: 'E = mc²',
    explanation: 'The energy equivalent of a mass m is equal to the mass times the square of the speed of light.',
    subject: 'Physics',
    chapter: 'Modern Physics',
    important: true,
    latex: 'E = mc^2'
  },
  {
    id: 'physics-kinematics-1',
    title: 'First Equation of Motion',
    formula: 'v = u + at',
    explanation: 'Final velocity equals initial velocity plus acceleration times time.',
    subject: 'Physics',
    chapter: 'Kinematics',
    important: true,
    latex: 'v = u + at'
  },
  {
    id: 'physics-kinematics-2',
    title: 'Second Equation of Motion',
    formula: 's = ut + (1/2)at²',
    explanation: 'Displacement equals initial velocity times time plus half of acceleration times time squared.',
    subject: 'Physics',
    chapter: 'Kinematics',
    important: true,
    latex: 's = ut + \\frac{1}{2}at^2'
  },
  {
    id: 'physics-kinematics-3',
    title: 'Third Equation of Motion',
    formula: 'v² = u² + 2as',
    explanation: 'Square of final velocity equals square of initial velocity plus twice the acceleration times displacement.',
    subject: 'Physics',
    chapter: 'Kinematics',
    important: true,
    latex: 'v^2 = u^2 + 2as'
  },
  {
    id: 'physics-waves-1',
    title: 'Wave Speed',
    formula: 'v = fλ',
    explanation: 'Wave speed equals frequency times wavelength.',
    subject: 'Physics',
    chapter: 'Waves',
    important: true,
    latex: 'v = f\\lambda'
  },
  {
    id: 'physics-waves-2',
    title: 'Doppler Effect',
    formula: 'f\' = f·(v ± vₒ)/(v ∓ vₛ)',
    explanation: 'The observed frequency changes when there is relative motion between the source and observer.',
    subject: 'Physics',
    chapter: 'Waves',
    important: false,
    latex: 'f\' = f\\cdot\\frac{v \\pm v_o}{v \\mp v_s}'
  },
  {
    id: 'physics-thermo-1',
    title: 'First Law of Thermodynamics',
    formula: 'ΔU = Q - W',
    explanation: 'Change in internal energy equals heat added minus work done by the system.',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    important: true,
    latex: '\\Delta U = Q - W'
  },
  {
    id: 'physics-thermo-2',
    title: 'Ideal Gas Law',
    formula: 'PV = nRT',
    explanation: 'Relates pressure, volume, number of moles, and temperature for an ideal gas.',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    important: true,
    latex: 'PV = nRT'
  },
  {
    id: 'physics-fluid-1',
    title: 'Bernoulli\'s Equation',
    formula: 'P + (1/2)ρv² + ρgh = constant',
    explanation: 'In fluid flow, the sum of pressure, kinetic energy per unit volume, and potential energy per unit volume remains constant.',
    subject: 'Physics',
    chapter: 'Fluid Mechanics',
    important: true,
    latex: 'P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}'
  },
  {
    id: 'physics-fluid-2',
    title: 'Continuity Equation',
    formula: 'A₁v₁ = A₂v₂',
    explanation: 'The product of cross-sectional area and flow velocity is constant in incompressible fluid flow.',
    subject: 'Physics',
    chapter: 'Fluid Mechanics',
    important: true,
    latex: 'A_1v_1 = A_2v_2'
  },
  {
    id: 'physics-gravitation-1',
    title: 'Newton\'s Law of Gravitation',
    formula: 'F = G·m₁·m₂/r²',
    explanation: 'The gravitational force between two masses is proportional to the product of the masses and inversely proportional to the square of the distance between them.',
    subject: 'Physics',
    chapter: 'Gravitation',
    important: true,
    latex: 'F = G\\frac{m_1 m_2}{r^2}'
  },
  {
    id: 'physics-gravitation-2',
    title: 'Gravitational Potential Energy',
    formula: 'U = -G·m₁·m₂/r',
    explanation: 'The gravitational potential energy of two masses separated by a distance r.',
    subject: 'Physics',
    chapter: 'Gravitation',
    important: true,
    latex: 'U = -G\\frac{m_1 m_2}{r}'
  },
  {
    id: 'physics-electromag-1',
    title: 'Gauss\'s Law',
    formula: '∮E·dA = Q/ε₀',
    explanation: 'The electric flux through a closed surface is proportional to the enclosed electric charge.',
    subject: 'Physics',
    chapter: 'Electromagnetism',
    important: true,
    latex: '\\oint \\vec{E}\\cdot d\\vec{A} = \\frac{Q}{\\varepsilon_0}'
  },
  {
    id: 'physics-electromag-2',
    title: 'Ampere\'s Law',
    formula: '∮B·dl = μ₀I',
    explanation: 'The magnetic field around a closed loop is proportional to the electric current passing through the loop.',
    subject: 'Physics',
    chapter: 'Electromagnetism',
    important: true,
    latex: '\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0 I'
  },
  {
    id: 'physics-electromag-3',
    title: 'Faraday\'s Law of Induction',
    formula: 'ℰ = -dΦ/dt',
    explanation: 'The induced electromotive force in a closed circuit is proportional to the rate of change of magnetic flux through the circuit.',
    subject: 'Physics',
    chapter: 'Electromagnetism',
    important: true,
    latex: '\\mathcal{E} = -\\frac{d\\Phi}{dt}'
  },
  
  // Chemistry Formulas
  {
    id: 'chem-thermo-1',
    title: 'Gibbs Free Energy',
    formula: 'ΔG = ΔH - TΔS',
    explanation: 'The change in Gibbs free energy equals the change in enthalpy minus the product of temperature and change in entropy.',
    subject: 'Chemistry',
    chapter: 'Thermodynamics',
    important: true,
    latex: '\\Delta G = \\Delta H - T\\Delta S'
  },
  {
    id: 'chem-kinetics-1',
    title: 'Arrhenius Equation',
    formula: 'k = A·e^(-Ea/RT)',
    explanation: 'Describes the temperature dependence of reaction rates.',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    important: true,
    latex: 'k = A \\cdot e^{-E_a/RT}'
  },
  {
    id: 'chem-equil-1',
    title: 'Equilibrium Constant',
    formula: 'K = [products]/[reactants]',
    explanation: 'The ratio of product concentrations to reactant concentrations at equilibrium, each raised to their stoichiometric coefficients.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    important: true,
    latex: 'K = \\frac{[\\text{products}]}{[\\text{reactants}]}'
  },
  {
    id: 'chem-ph-1',
    title: 'pH Definition',
    formula: 'pH = -log[H⁺]',
    explanation: 'The negative logarithm of the hydrogen ion concentration.',
    subject: 'Chemistry',
    chapter: 'Chemical Equilibrium',
    important: true,
    latex: 'pH = -\\log[H^+]'
  },
  {
    id: 'chem-redox-1',
    title: 'Nernst Equation',
    formula: 'E = E° - (RT/nF)·ln(Q)',
    explanation: 'Relates the reduction potential of a cell to the standard reduction potential and reaction quotient.',
    subject: 'Chemistry',
    chapter: 'Redox Reactions',
    important: true,
    latex: 'E = E^\\circ - \\frac{RT}{nF}\\ln(Q)'
  },
  {
    id: 'chem-gas-1',
    title: 'Van der Waals Equation',
    formula: '(P + a·n²/V²)(V - nb) = nRT',
    explanation: 'A modification of the ideal gas law that accounts for molecular size and intermolecular forces.',
    subject: 'Chemistry',
    chapter: 'States of Matter',
    important: false,
    latex: '\\left(P + \\frac{an^2}{V^2}\\right)(V - nb) = nRT'
  },
  {
    id: 'chem-solution-1',
    title: 'Raoult\'s Law',
    formula: 'Pₐ = Xₐ·P°ₐ',
    explanation: 'The partial vapor pressure of a component in a mixture is equal to the mole fraction of that component times its vapor pressure in the pure state.',
    subject: 'Chemistry',
    chapter: 'Solutions',
    important: true,
    latex: 'P_a = X_a \\cdot P^\\circ_a'
  },
  {
    id: 'chem-atomic-1',
    title: 'de Broglie Wavelength',
    formula: 'λ = h/p',
    explanation: 'The wavelength associated with a particle of momentum p.',
    subject: 'Chemistry',
    chapter: 'Atomic Structure',
    important: true,
    latex: '\\lambda = \\frac{h}{p}'
  },
  {
    id: 'chem-atomic-2',
    title: 'Heisenberg Uncertainty Principle',
    formula: 'Δx·Δp ≥ h/4π',
    explanation: 'The product of the uncertainties in position and momentum cannot be smaller than a constant.',
    subject: 'Chemistry',
    chapter: 'Atomic Structure',
    important: true,
    latex: '\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}'
  },
  {
    id: 'chem-atomic-3',
    title: 'Bohr\'s Formula',
    formula: 'E = -RH·Z²/n²',
    explanation: 'The energy of the electron in the nth energy level of a hydrogen-like atom.',
    subject: 'Chemistry',
    chapter: 'Atomic Structure',
    important: true,
    latex: 'E = -R_H \\cdot \\frac{Z^2}{n^2}'
  },
  {
    id: 'chem-organic-1',
    title: 'Markovnikov\'s Rule',
    formula: 'text rule',
    explanation: 'In addition of HX to an unsymmetrical alkene, the hydrogen adds to the carbon with more hydrogens, and the halogen to the carbon with fewer hydrogens.',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry',
    important: true
  },
  {
    id: 'chem-organic-2',
    title: 'Zaitsev\'s Rule',
    formula: 'text rule',
    explanation: 'In elimination reactions, the major product is the alkene with the more substituted double bond.',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry',
    important: true
  },
  {
    id: 'chem-thermo-2',
    title: 'Born-Haber Cycle',
    formula: 'ΔH(lattice) = ΔH(formation) - ΔH(atomization) - ΔH(ionization) - ΔH(electron affinity) - ΔH(sublimation)',
    explanation: 'A cycle of steps used to calculate the lattice energy of an ionic compound.',
    subject: 'Chemistry',
    chapter: 'Thermodynamics',
    important: false
  },
  {
    id: 'chem-electrochemistry-1',
    title: 'Faraday\'s Law of Electrolysis',
    formula: 'm = (M·Q)/(n·F)',
    explanation: 'The mass of a substance produced at an electrode during electrolysis is proportional to the quantity of electricity passed.',
    subject: 'Chemistry',
    chapter: 'Electrochemistry',
    important: true,
    latex: 'm = \\frac{M \\cdot Q}{n \\cdot F}'
  },
  {
    id: 'chem-coordination-1',
    title: 'Crystal Field Stabilization Energy',
    formula: 'CFSE = (-0.4n₁ + 0.6n₂)Δ',
    explanation: 'The energetic stabilization of a transition metal complex due to d-orbital splitting.',
    subject: 'Chemistry',
    chapter: 'Coordination Compounds',
    important: false,
    latex: 'CFSE = (-0.4n_1 + 0.6n_2)\\Delta'
  },
  {
    id: 'chem-nuclear-1',
    title: 'Half-Life',
    formula: 't₁/₂ = ln(2)/λ',
    explanation: 'The time required for half of the radioactive atoms to decay.',
    subject: 'Chemistry',
    chapter: 'Nuclear Chemistry',
    important: true,
    latex: 't_{1/2} = \\frac{\\ln(2)}{\\lambda}'
  },
  {
    id: 'chem-kinetics-2',
    title: 'First Order Rate Law',
    formula: 'ln[A] = ln[A]₀ - kt',
    explanation: 'The integrated rate law for a first-order reaction.',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    important: true,
    latex: '\\ln[A] = \\ln[A]_0 - kt'
  },
  {
    id: 'chem-kinetics-3',
    title: 'Second Order Rate Law',
    formula: '1/[A] = 1/[A]₀ + kt',
    explanation: 'The integrated rate law for a second-order reaction.',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    important: true,
    latex: '\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt'
  }
];

export default FormulaSheet;
