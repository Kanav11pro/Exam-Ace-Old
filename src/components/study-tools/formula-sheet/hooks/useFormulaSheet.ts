
import { useState, useEffect } from 'react';
import { Formula } from '../types';
import { getInitialFormulas } from '../utils';
import { useToast } from '@/components/ui/use-toast';

export function useFormulaSheet() {
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

  // Add/update formula
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
      id: editingFormula || `custom-${Date.now()}`,
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

  return {
    searchTerm,
    setSearchTerm,
    selectedSubject,
    setSelectedSubject,
    selectedChapter,
    setSelectedChapter,
    isAddFormulaOpen,
    setIsAddFormulaOpen,
    newFormula,
    setNewFormula,
    editingFormula,
    formulas,
    filteredFormulas,
    chapters,
    formulasBySubject,
    formulasByChapter,
    handleCopyFormula,
    handleToggleBookmark,
    handleToggleImportant,
    handleAddFormula,
    handleEditFormula,
    handleDeleteFormula,
    handleDownloadPDF,
    handleDialogChange
  };
}
