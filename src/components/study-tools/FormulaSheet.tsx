
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bookmark, Copy, Download, Filter, BookMinus, Calculator } from 'lucide-react';
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
  latex?: string;
}

export function FormulaSheet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const { toast } = useToast();
  
  // Formula data
  const formulas: Formula[] = [
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
  ];

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
    toast({
      title: "Formula bookmarked",
      description: "You can access your bookmarked formulas in the Bookmarks tab",
    });
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
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
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
                                  }`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-semibold text-lg">{formula.title}</h3>
                                      <div className="flex gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8" 
                                          onClick={() => handleBookmarkFormula(formula.id)}
                                        >
                                          <Bookmark className="h-4 w-4 text-gray-400" />
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
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookmarked formulas</h3>
            <p className="text-gray-500">Bookmark formulas to access them quickly later</p>
          </div>
        </TabsContent>
        
        <TabsContent value="important">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.filter(f => f.important).map(formula => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FormulaSheet;
