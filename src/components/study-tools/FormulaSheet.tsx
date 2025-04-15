
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bookmark, Copy, Download, Filter, BookMinus, Calculator, Plus, ArrowLeft, Edit, Trash2, BookOpen, BookMarked, Star, StarOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Formula {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  subject: 'Maths' | 'Physics' | 'Chemistry';
  chapter: string;
  important: boolean;
  bookmarked?: boolean;
  custom?: boolean;
  latex?: string;
}

export function FormulaSheet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [isAddFormulaOpen, setIsAddFormulaOpen] = useState(false);
  const [newFormula, setNewFormula] = useState<Partial<Formula>>({
    subject: 'Maths',
    chapter: '',
    title: '',
    formula: '',
    explanation: '',
    important: false
  });
  const [editingFormula, setEditingFormula] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load formulas from localStorage on initial load
  const [formulas, setFormulas] = useState<Formula[]>(() => {
    const savedFormulas = localStorage.getItem('jeeFormulas');
    const baseFormulas = getInitialFormulas();
    
    if (savedFormulas) {
      try {
        // Merge saved custom formulas with base formulas
        const customFormulas = JSON.parse(savedFormulas) as Formula[];
        return [...baseFormulas, ...customFormulas.filter(f => f.custom)];
      } catch (e) {
        console.error('Error parsing saved formulas', e);
        return baseFormulas;
      }
    }
    return baseFormulas;
  });

  // Save custom formulas to localStorage whenever they change
  useEffect(() => {
    const customFormulas = formulas.filter(f => f.custom);
    if (customFormulas.length > 0) {
      localStorage.setItem('jeeFormulas', JSON.stringify(customFormulas));
    }
  }, [formulas]);

  // Save bookmarks to localStorage
  useEffect(() => {
    const bookmarkedIds = formulas.filter(f => f.bookmarked).map(f => f.id);
    localStorage.setItem('bookmarkedFormulas', JSON.stringify(bookmarkedIds));
  }, [formulas]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedFormulas');
    if (savedBookmarks) {
      try {
        const bookmarkedIds = JSON.parse(savedBookmarks) as string[];
        setFormulas(prevFormulas => 
          prevFormulas.map(formula => ({
            ...formula,
            bookmarked: bookmarkedIds.includes(formula.id)
          }))
        );
      } catch (e) {
        console.error('Error parsing bookmarks', e);
      }
    }
  }, []);

  // Get unique chapters for the selected subject
  const getChaptersForSubject = (subject: string) => {
    if (subject === 'all') {
      return [...new Set(formulas.map(f => f.chapter))].sort();
    }
    return [...new Set(formulas.filter(f => f.subject === subject).map(f => f.chapter))].sort();
  };

  const chapters = getChaptersForSubject(selectedSubject);

  // Filter formulas based on search and filters
  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = 
      formula.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.chapter.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = selectedSubject === 'all' || formula.subject === selectedSubject;
    const matchesChapter = selectedChapter === 'all' || formula.chapter === selectedChapter;
    
    return matchesSearch && matchesSubject && matchesChapter;
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
  const handleToggleBookmark = (formulaId: string) => {
    setFormulas(prevFormulas => 
      prevFormulas.map(formula => {
        if (formula.id === formulaId) {
          const newBookmarked = !formula.bookmarked;
          toast({
            title: newBookmarked ? "Formula bookmarked" : "Bookmark removed",
            description: newBookmarked 
              ? "You can access your bookmarked formulas in the Bookmarks tab" 
              : "Formula removed from bookmarks",
          });
          return { ...formula, bookmarked: newBookmarked };
        }
        return formula;
      })
    );
  };

  // Handle toggle important
  const handleToggleImportant = (formulaId: string) => {
    setFormulas(prevFormulas => 
      prevFormulas.map(formula => {
        if (formula.id === formulaId) {
          return { ...formula, important: !formula.important };
        }
        return formula;
      })
    );
  };

  // Add new formula
  const handleAddFormula = () => {
    if (!newFormula.title || !newFormula.formula || !newFormula.chapter) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const formulaToAdd: Formula = {
      id: `custom-${Date.now()}`,
      title: newFormula.title || '',
      formula: newFormula.formula || '',
      explanation: newFormula.explanation || '',
      subject: newFormula.subject as 'Maths' | 'Physics' | 'Chemistry',
      chapter: newFormula.chapter || '',
      important: newFormula.important || false,
      custom: true
    };

    if (editingFormula) {
      // Update existing formula
      setFormulas(prevFormulas => 
        prevFormulas.map(formula => 
          formula.id === editingFormula ? formulaToAdd : formula
        )
      );
      toast({
        title: "Formula updated",
        description: "Your formula has been updated successfully",
      });
    } else {
      // Add new formula
      setFormulas(prevFormulas => [...prevFormulas, formulaToAdd]);
      toast({
        title: "Formula added",
        description: "Your custom formula has been added successfully",
      });
    }

    // Reset form
    setNewFormula({
      subject: 'Maths',
      chapter: '',
      title: '',
      formula: '',
      explanation: '',
      important: false
    });
    setIsAddFormulaOpen(false);
    setEditingFormula(null);
  };

  const handleEditFormula = (formula: Formula) => {
    setNewFormula({
      subject: formula.subject,
      chapter: formula.chapter,
      title: formula.title,
      formula: formula.formula,
      explanation: formula.explanation,
      important: formula.important
    });
    setEditingFormula(formula.id);
    setIsAddFormulaOpen(true);
  };

  const handleDeleteFormula = (formulaId: string) => {
    setFormulas(prevFormulas => prevFormulas.filter(formula => formula.id !== formulaId));
    toast({
      title: "Formula deleted",
      description: "The formula has been deleted",
    });
  };

  // Download all formulas as PDF
  const handleDownloadPDF = () => {
    toast({
      title: "Download started",
      description: "Your formula sheet PDF is being generated",
    });
    // In a real app, this would generate and download a PDF
  };

  // Reset the form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setNewFormula({
        subject: 'Maths',
        chapter: '',
        title: '',
        formula: '',
        explanation: '',
        important: false
      });
      setEditingFormula(null);
    }
    setIsAddFormulaOpen(open);
  };

  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Calculator className="h-7 w-7 text-blue-600" />
            Formula Sheet
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Quick reference for essential JEE formulas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsAddFormulaOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Formula
          </Button>
        </div>
      </div>
      
      {/* Back Button */}
      <div className="mb-4">
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
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
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select 
                  value={selectedSubject} 
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Maths">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedSubject !== 'all' && (
                <div className="flex items-center gap-1 w-full sm:w-auto">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <Select 
                    value={selectedChapter} 
                    onValueChange={setSelectedChapter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chapters</SelectItem>
                      {chapters.map(chapter => (
                        <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
          <TabsTrigger value="custom">My Formulas</TabsTrigger>
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
                                  } ${formula.custom ? 'border-blue-200 dark:border-blue-800' : ''}`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-semibold text-lg">{formula.title}</h3>
                                      <div className="flex gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8" 
                                          onClick={() => handleToggleBookmark(formula.id)}
                                        >
                                          <Bookmark className={`h-4 w-4 ${formula.bookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8"
                                          onClick={() => handleToggleImportant(formula.id)}
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
                                          onClick={() => handleCopyFormula(formula.formula)}
                                        >
                                          <Copy className="h-4 w-4 text-gray-400" />
                                        </Button>
                                        {formula.custom && (
                                          <>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8"
                                              onClick={() => handleEditFormula(formula)}
                                            >
                                              <Edit className="h-4 w-4 text-gray-400" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8"
                                              onClick={() => handleDeleteFormula(formula.id)}
                                            >
                                              <Trash2 className="h-4 w-4 text-red-400" />
                                            </Button>
                                          </>
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
          {formulas.filter(f => f.bookmarked).length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookmarked formulas</h3>
              <p className="text-gray-500">Bookmark formulas to access them quickly later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulas
                .filter(f => f.bookmarked)
                .map(formula => (
                  <Card 
                    key={formula.id} 
                    className={`overflow-hidden hover:shadow transition-all ${
                      formula.important ? 'border-amber-200 dark:border-amber-800' : ''
                    } ${formula.custom ? 'border-blue-200 dark:border-blue-800' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{formula.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>{formula.subject}</Badge>
                            <span className="text-xs text-gray-500">• {formula.chapter}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleToggleBookmark(formula.id)}
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
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center">
                        {formula.formula}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {formula.explanation}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="important">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.filter(f => f.important).length === 0 ? (
              <div className="text-center py-12 col-span-2">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No important formulas found</h3>
                <p className="text-gray-500">Mark formulas as important to see them here</p>
              </div>
            ) : (
              filteredFormulas.filter(f => f.important).map(formula => (
                <Card 
                  key={formula.id} 
                  className="overflow-hidden hover:shadow transition-all border-amber-200 dark:border-amber-800"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{formula.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge>{formula.subject}</Badge>
                          <span className="text-xs text-gray-500">• {formula.chapter}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleToggleBookmark(formula.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${formula.bookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
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
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center">
                      {formula.formula}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {formula.explanation}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Custom Formulas</h2>
            <Button onClick={() => setIsAddFormulaOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Formula
            </Button>
          </div>
          
          {formulas.filter(f => f.custom).length === 0 ? (
            <div className="text-center py-12">
              <BookMarked className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No custom formulas</h3>
              <p className="text-gray-500">Add your own formulas to see them here</p>
              <Button className="mt-4" onClick={() => setIsAddFormulaOpen(true)}>
                Add Your First Formula
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulas
                .filter(f => f.custom)
                .map(formula => (
                  <Card 
                    key={formula.id} 
                    className="overflow-hidden hover:shadow transition-all border-blue-200 dark:border-blue-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{formula.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>{formula.subject}</Badge>
                            <span className="text-xs text-gray-500">• {formula.chapter}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditFormula(formula)}
                          >
                            <Edit className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteFormula(formula.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 my-2 font-mono text-center">
                        {formula.formula}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {formula.explanation}
                      </p>
                      
                      {formula.important && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Important
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Formula Dialog */}
      <Dialog open={isAddFormulaOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingFormula ? 'Edit Formula' : 'Add New Formula'}</DialogTitle>
            <DialogDescription>
              {editingFormula ? 'Update your custom formula.' : 'Create your own custom formula for quick reference.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Select 
                  value={newFormula.subject} 
                  onValueChange={(value) => setNewFormula({...newFormula, subject: value as 'Maths' | 'Physics' | 'Chemistry'})}
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
                  value={newFormula.chapter} 
                  onChange={(e) => setNewFormula({...newFormula, chapter: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Formula Name</label>
              <Input 
                id="title"
                placeholder="e.g., Pythagorean Theorem" 
                value={newFormula.title} 
                onChange={(e) => setNewFormula({...newFormula, title: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="formula" className="text-sm font-medium">Formula</label>
              <Textarea 
                id="formula"
                placeholder="e.g., a² + b² = c²" 
                value={newFormula.formula} 
                onChange={(e) => setNewFormula({...newFormula, formula: e.target.value})}
                className="font-mono"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="explanation" className="text-sm font-medium">Explanation (Optional)</label>
              <Textarea 
                id="explanation"
                placeholder="Explain what the formula is used for and any conditions" 
                value={newFormula.explanation} 
                onChange={(e) => setNewFormula({...newFormula, explanation: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="important"
                checked={newFormula.important}
                onChange={(e) => setNewFormula({...newFormula, important: e.target.checked})}
                className="rounded border-gray-300"
              />
              <label htmlFor="important" className="text-sm font-medium">Mark as important</label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFormulaOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFormula}>{editingFormula ? 'Save Changes' : 'Add Formula'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Initial formula data
function getInitialFormulas(): Formula[] {
  return [
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
      id: 'math-vectors-1',
      title: 'Dot Product',
      formula: 'A·B = |A||B|cosθ',
      explanation: 'The dot product of two vectors A and B is the product of their magnitudes and the cosine of the angle between them.',
      subject: 'Maths',
      chapter: 'Vectors',
      important: true,
    },
    {
      id: 'math-vectors-2',
      title: 'Cross Product Magnitude',
      formula: '|A×B| = |A||B|sinθ',
      explanation: 'The magnitude of the cross product of two vectors A and B is the product of their magnitudes and the sine of the angle between them.',
      subject: 'Maths',
      chapter: 'Vectors',
      important: false,
    },
    {
      id: 'math-probability-1',
      title: 'Binomial Probability',
      formula: 'P(X=k) = ₙCₖ p^k (1-p)^(n-k)',
      explanation: 'The probability of exactly k successes in n independent Bernoulli trials with probability of success p.',
      subject: 'Maths',
      chapter: 'Probability',
      important: true,
    },
    {
      id: 'math-coordinate-1',
      title: 'Distance Formula',
      formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
      explanation: 'The distance between two points (x₁,y₁) and (x₂,y₂) in a Cartesian coordinate system.',
      subject: 'Maths',
      chapter: 'Coordinate Geometry',
      important: true,
    },
    {
      id: 'math-trigonometry-1',
      title: 'Law of Sines',
      formula: 'a/sin(A) = b/sin(B) = c/sin(C)',
      explanation: 'In any triangle, the ratio of the length of a side to the sine of the opposite angle is constant.',
      subject: 'Maths',
      chapter: 'Trigonometry',
      important: true,
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
      id: 'physics-mechanics-3',
      title: 'Momentum',
      formula: 'p = mv',
      explanation: 'Linear momentum is the product of an object\'s mass and velocity.',
      subject: 'Physics',
      chapter: 'Laws of Motion',
      important: true,
    },
    {
      id: 'physics-rotational-1',
      title: 'Rotational Kinetic Energy',
      formula: 'KE = (1/2)Iω²',
      explanation: 'The kinetic energy of a rotating object with moment of inertia I and angular velocity ω.',
      subject: 'Physics',
      chapter: 'Rotational Motion',
      important: false,
    },
    {
      id: 'physics-thermo-1',
      title: 'First Law of Thermodynamics',
      formula: 'ΔU = Q - W',
      explanation: 'The change in internal energy of a system equals the heat added to the system minus the work done by the system.',
      subject: 'Physics',
      chapter: 'Thermodynamics',
      important: true,
    },
    {
      id: 'physics-waves-1',
      title: 'Wave Speed',
      formula: 'v = fλ',
      explanation: 'The speed of a wave equals its frequency times its wavelength.',
      subject: 'Physics',
      chapter: 'Waves',
      important: true,
    },
    {
      id: 'physics-electricity-1',
      title: 'Ohm\'s Law',
      formula: 'V = IR',
      explanation: 'The voltage across a conductor is directly proportional to the current flowing through it.',
      subject: 'Physics',
      chapter: 'Current Electricity',
      important: true,
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
      title: 'Ideal Gas Law',
      formula: 'PV = nRT',
      explanation: 'Relates pressure, volume, amount of substance, and temperature for an ideal gas.',
      subject: 'Chemistry',
      chapter: 'Gaseous State',
      important: true,
    },
    {
      id: 'chem-atomic-1',
      title: 'de Broglie Wavelength',
      formula: 'λ = h/mv',
      explanation: 'The wavelength associated with a particle of mass m and velocity v.',
      subject: 'Chemistry',
      chapter: 'Atomic Structure',
      important: false,
    },
    {
      id: 'chem-solution-1',
      title: 'Raoult\'s Law',
      formula: 'P = X·P°',
      explanation: 'The partial pressure of a component in a solution equals its mole fraction times its vapor pressure in pure form.',
      subject: 'Chemistry',
      chapter: 'Solutions',
      important: false,
    },
    {
      id: 'chem-organic-1',
      title: 'Rate Law',
      formula: 'Rate = k[A]ᵐ[B]ⁿ',
      explanation: 'The rate of a reaction equals the rate constant k times the concentrations of reactants raised to their orders.',
      subject: 'Chemistry',
      chapter: 'Chemical Kinetics',
      important: true,
    },
    {
      id: 'chem-colligative-1',
      title: 'Molality',
      formula: 'm = moles of solute / kg of solvent',
      explanation: 'The concentration of a solution expressed as moles of solute per kilogram of solvent.',
      subject: 'Chemistry',
      chapter: 'Solutions',
      important: true,
    },
  ];
}

export default FormulaSheet;
