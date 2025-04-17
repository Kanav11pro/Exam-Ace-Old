
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Download, Copy, Check, Sparkles, FileQuestion, Bookmark, Printer, Share2 } from 'lucide-react';

// Define the question types
type QuestionType = 'mcq' | 'numerical' | 'theory' | 'match' | 'truefalse';
type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'advanced';

// Define the question interface
interface Question {
  id: string;
  subject: string;
  chapter: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  text: string;
  answer?: string;
  options?: string[];
  explanation?: string;
}

// Subject chapters
const chapters = {
  Maths: [
    'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Algebra', 
    'Vectors', 'Probability', 'Statistics', 'Complex Numbers'
  ],
  Physics: [
    'Mechanics', 'Electrostatics', 'Current Electricity', 'Magnetism', 
    'Electromagnetic Induction', 'Optics', 'Modern Physics', 'Thermodynamics'
  ],
  Chemistry: [
    'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 
    'Chemical Bonding', 'Equilibrium', 'Thermodynamics', 'Electrochemistry', 'Solutions'
  ]
};

// Sample question templates by subject, chapter, and type
const questionTemplates: Record<string, Record<string, Record<QuestionType, Question[]>>> = {
  Maths: {
    Calculus: {
      mcq: [
        {
          id: 'm1',
          subject: 'Maths',
          chapter: 'Calculus',
          type: 'mcq',
          difficulty: 'medium',
          text: 'What is the derivative of f(x) = ln(sin(x))?',
          options: ['cot(x)', 'tan(x)', '-cot(x)', '-tan(x)'],
          answer: 'cot(x)',
          explanation: 'Using the chain rule, d/dx[ln(sin(x))] = (1/sin(x)) × cos(x) = cos(x)/sin(x) = cot(x)'
        }
      ],
      numerical: [
        {
          id: 'm2',
          subject: 'Maths',
          chapter: 'Calculus',
          type: 'numerical',
          difficulty: 'hard',
          text: 'Find the value of ∫(0 to π/2) sin²(x) dx.',
          answer: 'π/4',
          explanation: 'Using the identity sin²(x) = (1-cos(2x))/2, and integrating gives π/4.'
        }
      ],
      theory: [
        {
          id: 'm3',
          subject: 'Maths',
          chapter: 'Calculus',
          type: 'theory',
          difficulty: 'easy',
          text: 'State and explain the Mean Value Theorem for derivatives.',
          answer: 'If a function f is continuous on the closed interval [a,b] and differentiable on the open interval (a,b), then there exists at least one number c in (a,b) such that f\'(c) = [f(b) - f(a)]/(b-a).'
        }
      ],
      match: [
        {
          id: 'm4',
          subject: 'Maths',
          chapter: 'Calculus',
          type: 'match',
          difficulty: 'medium',
          text: 'Match the following functions with their derivatives:\nA. sin(x)\nB. e^x\nC. ln(x)\nD. x^n\n\n1. cos(x)\n2. e^x\n3. 1/x\n4. n×x^(n-1)',
          answer: 'A-1, B-2, C-3, D-4'
        }
      ],
      truefalse: [
        {
          id: 'm5',
          subject: 'Maths',
          chapter: 'Calculus',
          type: 'truefalse',
          difficulty: 'easy',
          text: 'The derivative of a constant function is always zero.',
          answer: 'True',
          explanation: 'If f(x) = c where c is a constant, then f\'(x) = 0.'
        }
      ]
    }
  },
  Physics: {
    Mechanics: {
      mcq: [
        {
          id: 'p1',
          subject: 'Physics',
          chapter: 'Mechanics',
          type: 'mcq',
          difficulty: 'medium',
          text: 'A ball is thrown vertically upward. Which of the following statements is correct?',
          options: [
            'Velocity and acceleration both decrease during upward motion',
            'Velocity decreases but acceleration remains constant during upward motion',
            'Velocity increases but acceleration decreases during upward motion',
            'Both velocity and acceleration increase during upward motion'
          ],
          answer: 'Velocity decreases but acceleration remains constant during upward motion',
          explanation: 'During upward motion, gravity acts downward, so velocity decreases at a constant rate, while acceleration due to gravity remains constant at g (≈ 9.8 m/s²).'
        }
      ],
      numerical: [
        {
          id: 'p2',
          subject: 'Physics',
          chapter: 'Mechanics',
          type: 'numerical',
          difficulty: 'hard',
          text: 'A block of mass 2 kg is placed on a frictionless inclined plane at an angle of 30° to the horizontal. Calculate the acceleration of the block down the incline. Take g = 9.8 m/s².',
          answer: '4.9 m/s²',
          explanation: 'The acceleration down the incline is g sin(θ) = 9.8 × sin(30°) = 9.8 × 0.5 = 4.9 m/s².'
        }
      ],
      theory: [],
      match: [],
      truefalse: []
    }
  },
  Chemistry: {
    'Organic Chemistry': {
      mcq: [
        {
          id: 'c1',
          subject: 'Chemistry',
          chapter: 'Organic Chemistry',
          type: 'mcq',
          difficulty: 'medium',
          text: 'Which of the following compounds would undergo SN1 reaction most readily?',
          options: ['CH3CH2Cl', '(CH3)3CCl', 'CH3CH2CH2Cl', 'CH3CHClCH3'],
          answer: '(CH3)3CCl',
          explanation: 'Tertiary halides like (CH3)3CCl form the most stable carbocations, making them most suitable for SN1 reactions.'
        }
      ],
      numerical: [],
      theory: [],
      match: [],
      truefalse: []
    }
  }
};

// Generate more questions for each subject to fill in the blanks
for (const subject in questionTemplates) {
  for (const chapter in questionTemplates[subject]) {
    // Add missing question types with at least one question
    for (const type of ['mcq', 'numerical', 'theory', 'match', 'truefalse'] as QuestionType[]) {
      if (!questionTemplates[subject][chapter][type] || questionTemplates[subject][chapter][type].length === 0) {
        questionTemplates[subject][chapter][type] = [{
          id: `${subject[0].toLowerCase()}${Math.random().toString(36).substring(2, 8)}`,
          subject: subject,
          chapter: chapter,
          type: type,
          difficulty: 'medium',
          text: `Sample ${type} question for ${subject} - ${chapter}`,
          answer: type === 'mcq' ? 'Option A' : 'Sample answer'
        }];
      }
    }
  }
}

// Function to generate questions based on parameters
const generateQuestions = (
  subject: string,
  chapter: string,
  types: QuestionType[],
  difficulty: DifficultyLevel,
  count: number
): Question[] => {
  const generatedQuestions: Question[] = [];
  
  // If we have templates for this subject and chapter
  if (questionTemplates[subject]?.[chapter]) {
    // For each selected question type
    for (const type of types) {
      // Get questions of this type for the subject and chapter
      const availableQuestions = questionTemplates[subject][chapter][type] || [];
      
      // Filter by difficulty if specified
      const filteredQuestions = availableQuestions.filter(q => 
        difficulty === 'easy' ? ['easy', 'medium'].includes(q.difficulty) :
        difficulty === 'medium' ? ['medium', 'hard'].includes(q.difficulty) :
        difficulty === 'hard' ? ['hard', 'advanced'].includes(q.difficulty) :
        true // for 'advanced', include all
      );
      
      // Add questions until we have enough or run out
      let i = 0;
      while (generatedQuestions.length < count && i < filteredQuestions.length) {
        const question = {...filteredQuestions[i]};
        // Ensure unique ID
        question.id = `${question.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        generatedQuestions.push(question);
        i++;
        
        // If we ran out of questions, but need more, restart from beginning
        if (i >= filteredQuestions.length && generatedQuestions.length < count) {
          i = 0;
        }
      }
    }
  }
  
  // If we still don't have enough questions, generate placeholder questions
  while (generatedQuestions.length < count) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    generatedQuestions.push({
      id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      subject,
      chapter,
      type: randomType,
      difficulty,
      text: `Question for ${subject} - ${chapter} (${randomType}, ${difficulty} difficulty)`,
      answer: 'This is a placeholder answer.'
    });
  }
  
  return generatedQuestions.slice(0, count);
};

export function QuestionGenerator() {
  const [subject, setSubject] = useState<string>('Maths');
  const [chapter, setChapter] = useState<string>(chapters.Maths[0]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['mcq']);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [count, setCount] = useState<number>(5);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [customQuestion, setCustomQuestion] = useState<{
    text: string;
    answer: string;
    subject: string;
    chapter: string;
    type: QuestionType;
    difficulty: DifficultyLevel;
  }>({
    text: '',
    answer: '',
    subject: 'Maths',
    chapter: chapters.Maths[0],
    type: 'mcq',
    difficulty: 'medium'
  });
  
  const { toast } = useToast();
  
  // Update chapter options when subject changes
  React.useEffect(() => {
    setChapter(chapters[subject as keyof typeof chapters][0]);
  }, [subject]);
  
  const handleTypeToggle = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      // Don't allow deselecting the last type
      if (selectedTypes.length > 1) {
        setSelectedTypes(prev => prev.filter(t => t !== type));
      }
    } else {
      setSelectedTypes(prev => [...prev, type]);
    }
  };
  
  const handleGenerate = () => {
    const questions = generateQuestions(
      subject,
      chapter,
      selectedTypes,
      difficulty,
      count
    );
    
    setGeneratedQuestions(questions);
    
    toast({
      title: "Questions Generated",
      description: `${questions.length} questions have been generated.`,
    });
  };
  
  const handleCreateCustom = () => {
    if (!customQuestion.text || !customQuestion.answer) {
      toast({
        title: "Missing Information",
        description: "Please provide both question and answer.",
        variant: "destructive"
      });
      return;
    }
    
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      ...customQuestion
    };
    
    setGeneratedQuestions(prev => [...prev, newQuestion]);
    
    // Reset form
    setCustomQuestion({
      text: '',
      answer: '',
      subject: customQuestion.subject,
      chapter: customQuestion.chapter,
      type: customQuestion.type,
      difficulty: customQuestion.difficulty
    });
    
    toast({
      title: "Question Added",
      description: "Your custom question has been added to the list.",
    });
    
    // Switch to questions tab
    setActiveTab('questions');
  };
  
  const handleDownload = () => {
    if (generatedQuestions.length === 0) {
      toast({
        title: "No questions to download",
        description: "Generate some questions first.",
        variant: "destructive"
      });
      return;
    }
    
    let content = "# JEE Practice Questions\n\n";
    
    generatedQuestions.forEach((q, index) => {
      content += `## Question ${index + 1}\n`;
      content += `${q.text}\n\n`;
      
      if (q.options) {
        q.options.forEach((option, i) => {
          content += `${String.fromCharCode(65 + i)}. ${option}\n`;
        });
        content += '\n';
      }
      
      content += `**Subject:** ${q.subject} - ${q.chapter}\n`;
      content += `**Type:** ${q.type}\n`;
      content += `**Difficulty:** ${q.difficulty}\n\n`;
      
      if (showAnswers) {
        content += `**Answer:** ${q.answer}\n`;
        if (q.explanation) {
          content += `**Explanation:** ${q.explanation}\n`;
        }
        content += '\n';
      }
      
      content += '---\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jee_questions_${subject}_${chapter}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your questions are being downloaded.",
    });
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to Clipboard",
      description: "The question has been copied to your clipboard.",
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <FileQuestion className="h-8 w-8 text-indigo-500" />
        Question Generator
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="generate">Generate Questions</TabsTrigger>
          <TabsTrigger value="create">Create Custom Question</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={subject}
                    onValueChange={setSubject}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="chapter">Chapter</Label>
                  <Select
                    value={chapter}
                    onValueChange={setChapter}
                  >
                    <SelectTrigger id="chapter">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters[subject as keyof typeof chapters].map(chap => (
                        <SelectItem key={chap} value={chap}>{chap}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Question Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-mcq"
                      checked={selectedTypes.includes('mcq')}
                      onCheckedChange={() => handleTypeToggle('mcq')}
                    />
                    <Label htmlFor="type-mcq">Multiple Choice</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-numerical"
                      checked={selectedTypes.includes('numerical')}
                      onCheckedChange={() => handleTypeToggle('numerical')}
                    />
                    <Label htmlFor="type-numerical">Numerical</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-theory"
                      checked={selectedTypes.includes('theory')}
                      onCheckedChange={() => handleTypeToggle('theory')}
                    />
                    <Label htmlFor="type-theory">Theory</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-match"
                      checked={selectedTypes.includes('match')}
                      onCheckedChange={() => handleTypeToggle('match')}
                    />
                    <Label htmlFor="type-match">Matching</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-truefalse"
                      checked={selectedTypes.includes('truefalse')}
                      onCheckedChange={() => handleTypeToggle('truefalse')}
                    />
                    <Label htmlFor="type-truefalse">True/False</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="count">Number of Questions</Label>
                  <Input
                    id="count"
                    type="number"
                    min={1}
                    max={20}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleGenerate}
                  className="px-8 py-2 hover:scale-105 transition-transform"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Questions
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {generatedQuestions.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Generated Questions</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswers(!showAnswers)}
                  >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {generatedQuestions.map((question, index) => (
                  <Card key={question.id} className="overflow-hidden hover:shadow-md transition-all">
                    <CardContent className="p-0">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-semibold">Question {index + 1}</span>
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                            {question.type.toUpperCase()}
                          </span>
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                            {question.difficulty}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(question.text)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="p-4">
                        <p className="whitespace-pre-line">{question.text}</p>
                        
                        {question.type === 'mcq' && question.options && (
                          <div className="mt-4 space-y-2">
                            {question.options.map((option, i) => (
                              <div key={i} className="flex items-start">
                                <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {showAnswers && (
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md">
                            <div className="font-semibold text-green-700 dark:text-green-400">Answer:</div>
                            <div>{question.answer}</div>
                            
                            {question.explanation && (
                              <div className="mt-2">
                                <div className="font-semibold text-green-700 dark:text-green-400">Explanation:</div>
                                <div>{question.explanation}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/40 text-sm text-gray-500 dark:text-gray-400">
                        {question.subject} - {question.chapter}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="custom-subject">Subject</Label>
                  <Select
                    value={customQuestion.subject}
                    onValueChange={(value) => setCustomQuestion({...customQuestion, subject: value})}
                  >
                    <SelectTrigger id="custom-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maths">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="custom-chapter">Chapter</Label>
                  <Select
                    value={customQuestion.chapter}
                    onValueChange={(value) => setCustomQuestion({...customQuestion, chapter: value})}
                  >
                    <SelectTrigger id="custom-chapter">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters[customQuestion.subject as keyof typeof chapters].map(chap => (
                        <SelectItem key={chap} value={chap}>{chap}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="custom-type">Question Type</Label>
                  <Select
                    value={customQuestion.type}
                    onValueChange={(value) => setCustomQuestion({...customQuestion, type: value as QuestionType})}
                  >
                    <SelectTrigger id="custom-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="numerical">Numerical</SelectItem>
                      <SelectItem value="theory">Theory</SelectItem>
                      <SelectItem value="match">Matching</SelectItem>
                      <SelectItem value="truefalse">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="custom-difficulty">Difficulty Level</Label>
                  <Select
                    value={customQuestion.difficulty}
                    onValueChange={(value) => setCustomQuestion({...customQuestion, difficulty: value as DifficultyLevel})}
                  >
                    <SelectTrigger id="custom-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-question">Question</Label>
                <Textarea
                  id="custom-question"
                  placeholder="Enter your question here..."
                  value={customQuestion.text}
                  onChange={(e) => setCustomQuestion({...customQuestion, text: e.target.value})}
                  className="min-h-32"
                />
              </div>
              
              <div>
                <Label htmlFor="custom-answer">Answer</Label>
                <Textarea
                  id="custom-answer"
                  placeholder="Enter the answer here..."
                  value={customQuestion.answer}
                  onChange={(e) => setCustomQuestion({...customQuestion, answer: e.target.value})}
                  className="min-h-24"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleCreateCustom}>
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
