
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, Sparkles, Book, Rocket, Lightbulb, Download, Copy, Brain, PenTool, 
  CheckCircle, XCircle, HelpCircle, Bookmark, Save
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isBookmarked: boolean;
}

interface GenerationConfig {
  subject: string;
  topic: string;
  difficulty: string;
  questionType: string;
  count: number;
  includeAnswers: boolean;
  includeExplanations: boolean;
}

export function QuestionGenerator() {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [loading, setLoading] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<GenerationConfig>({
    subject: 'mathematics',
    topic: '',
    difficulty: 'medium',
    questionType: 'conceptual',
    count: 3,
    includeAnswers: true,
    includeExplanations: true
  });
  
  const { toast } = useToast();
  
  // Pre-defined sample questions for each subject
  const sampleQuestions: Record<string, Question[]> = {
    mathematics: [
      {
        id: 'math-sample-1',
        question: "Evaluate the integral ∫(ln(x)/x)dx from x=1 to x=e.",
        answer: "1/2",
        explanation: "Let u = ln(x), then du = dx/x. So the integral becomes ∫u du, which is u²/2. Evaluating from x=1 to x=e: [ln²(x)/2]₁ᵉ = ln²(e)/2 - ln²(1)/2 = 1²/2 - 0²/2 = 1/2.",
        subject: 'mathematics',
        topic: 'calculus',
        difficulty: 'medium',
        isBookmarked: false
      },
      {
        id: 'math-sample-2',
        question: "Find all values of x that satisfy the equation sin(2x) = sin(x) in the interval [0, 2π].",
        answer: "x = 0, π/3, π, 5π/3",
        explanation: "We have sin(2x) = sin(x), which gives sin(2x) - sin(x) = 0. Using the identity sin(A) - sin(B) = 2sin((A-B)/2)cos((A+B)/2), we get 2sin(x/2)cos(3x/2) = 0. This gives sin(x/2) = 0 or cos(3x/2) = 0. Solving for x in [0, 2π], we get x = 0, π, π/3, 5π/3.",
        subject: 'mathematics',
        topic: 'trigonometry',
        difficulty: 'hard',
        isBookmarked: false
      },
      {
        id: 'math-sample-3',
        question: "If the sum of the first n terms of an AP is n², find the nth term of the AP.",
        answer: "2n - 1",
        explanation: "Let S_n be the sum of the first n terms and a_n be the nth term. We know S_n = n², and S_n = n(a_1 + a_n)/2. Also, S_{n-1} = (n-1)². Subtracting, we get a_n = S_n - S_{n-1} = n² - (n-1)² = n² - (n² - 2n + 1) = 2n - 1.",
        subject: 'mathematics',
        topic: 'sequences and series',
        difficulty: 'medium',
        isBookmarked: false
      }
    ],
    physics: [
      {
        id: 'physics-sample-1',
        question: "A particle moves in a circle with constant speed. Which of the following statements is correct about its acceleration?",
        answer: "It is directed towards the center of the circle",
        explanation: "When a particle moves in a circle with constant speed, it has centripetal acceleration directed toward the center of the circle. The velocity vector changes direction but not magnitude, resulting in acceleration that is perpendicular to the velocity.",
        subject: 'physics',
        topic: 'circular motion',
        difficulty: 'easy',
        isBookmarked: false
      },
      {
        id: 'physics-sample-2',
        question: "A capacitor of capacitance 2 μF is charged to a potential difference of 100 V and then connected across an uncharged capacitor of capacitance 8 μF. What is the final potential difference across the capacitors?",
        answer: "20 V",
        explanation: "Initially, charge on the first capacitor is Q = C₁V₁ = 2 μF × 100 V = 200 μC. When connected to the second capacitor, this charge redistributes across both capacitors: Q = (C₁ + C₂)V_final. So V_final = Q/(C₁ + C₂) = 200 μC/(2 μF + 8 μF) = 200 μC/10 μF = 20 V.",
        subject: 'physics',
        topic: 'electrostatics',
        difficulty: 'medium',
        isBookmarked: false
      },
      {
        id: 'physics-sample-3',
        question: "A ball is thrown vertically upward with an initial velocity of 20 m/s. How high will it rise? (Take g = 10 m/s²)",
        answer: "20 m",
        explanation: "Using the equation v² = u² - 2gh, where final velocity v = 0 at the highest point. So 0 = 20² - 2(10)h, which gives h = 400/20 = 20 m.",
        subject: 'physics',
        topic: 'kinematics',
        difficulty: 'easy',
        isBookmarked: false
      }
    ],
    chemistry: [
      {
        id: 'chemistry-sample-1',
        question: "What is the IUPAC name for CH₃-CH(CH₃)-CH₂-CH₃?",
        answer: "2-methylbutane",
        explanation: "The longest carbon chain has 4 carbon atoms (butane), with a methyl group at the 2nd carbon. Thus, the IUPAC name is 2-methylbutane.",
        subject: 'chemistry',
        topic: 'organic chemistry',
        difficulty: 'medium',
        isBookmarked: false
      },
      {
        id: 'chemistry-sample-2',
        question: "Calculate the pH of a 0.01 M HCl solution.",
        answer: "2",
        explanation: "HCl is a strong acid that completely dissociates in water. So [H⁺] = 0.01 M. pH = -log[H⁺] = -log(0.01) = 2.",
        subject: 'chemistry',
        topic: 'acid-base equilibria',
        difficulty: 'easy',
        isBookmarked: false
      },
      {
        id: 'chemistry-sample-3',
        question: "Arrange the following in increasing order of acidic strength: phenol, ethanol, and p-nitrophenol.",
        answer: "Ethanol < phenol < p-nitrophenol",
        explanation: "The acidic strength depends on the stability of the conjugate base. The nitro group in p-nitrophenol is electron-withdrawing, which stabilizes the negative charge in the conjugate base, making it more acidic than phenol. Phenol is more acidic than ethanol due to resonance stabilization of the phenoxide ion.",
        subject: 'chemistry',
        topic: 'organic chemistry',
        difficulty: 'hard',
        isBookmarked: false
      }
    ]
  };
  
  // Load saved questions from localStorage
  React.useEffect(() => {
    const savedQuestionsFromStorage = localStorage.getItem('jeeSavedQuestions');
    if (savedQuestionsFromStorage) {
      try {
        setSavedQuestions(JSON.parse(savedQuestionsFromStorage));
      } catch (e) {
        console.error('Error loading saved questions:', e);
      }
    }
  }, []);
  
  // Save questions to localStorage when they change
  React.useEffect(() => {
    if (savedQuestions.length > 0) {
      localStorage.setItem('jeeSavedQuestions', JSON.stringify(savedQuestions));
    }
  }, [savedQuestions]);
  
  // Generate questions based on configuration
  const generateQuestions = () => {
    setLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      let questions: Question[];
      
      // Select sample questions based on subject
      if (config.subject in sampleQuestions) {
        questions = [...sampleQuestions[config.subject]];
        
        // Filter by topic if specified
        if (config.topic) {
          questions = questions.filter(q => 
            q.topic.toLowerCase().includes(config.topic.toLowerCase())
          );
        }
        
        // Filter by difficulty if specified
        if (config.difficulty !== 'any') {
          questions = questions.filter(q => q.difficulty === config.difficulty);
        }
        
        // If not enough questions, add more with slight variations
        while (questions.length < config.count) {
          const baseQuestion = sampleQuestions[config.subject][
            Math.floor(Math.random() * sampleQuestions[config.subject].length)
          ];
          
          questions.push({
            ...baseQuestion,
            id: `${baseQuestion.id}-variant-${Date.now()}-${questions.length}`,
            question: `${baseQuestion.question} (Variant)`,
          });
        }
        
        // Limit to requested count
        questions = questions.slice(0, config.count);
        
        // Modify questions based on configuration
        if (!config.includeAnswers) {
          questions = questions.map(q => ({ ...q, answer: '' }));
        }
        
        if (!config.includeExplanations) {
          questions = questions.map(q => ({ ...q, explanation: '' }));
        }
      } else {
        // Fallback to empty array if subject not found
        questions = [];
      }
      
      setGeneratedQuestions(questions);
      setLoading(false);
      
      toast({
        title: "Questions Generated",
        description: `Generated ${questions.length} ${config.difficulty} questions for ${config.subject}.`
      });
    }, 1500); // Simulate processing time
  };
  
  // Generate questions from custom prompt
  const generateFromPrompt = () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate questions.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      let subject = 'mathematics';
      if (customPrompt.toLowerCase().includes('physics')) {
        subject = 'physics';
      } else if (customPrompt.toLowerCase().includes('chemistry')) {
        subject = 'chemistry';
      }
      
      // Generate 2 sample questions based on the prompt
      const questions: Question[] = [
        {
          id: `custom-${Date.now()}-1`,
          question: `Question related to: ${customPrompt}`,
          answer: "Sample answer based on your prompt",
          explanation: "Detailed explanation would be provided here",
          subject,
          topic: customPrompt.split(' ')[0].toLowerCase(),
          difficulty: 'medium',
          isBookmarked: false
        },
        {
          id: `custom-${Date.now()}-2`,
          question: `Alternative question about: ${customPrompt}`,
          answer: "Another sample answer",
          explanation: "Another detailed explanation",
          subject,
          topic: customPrompt.split(' ')[0].toLowerCase(),
          difficulty: 'medium',
          isBookmarked: false
        }
      ];
      
      setGeneratedQuestions(questions);
      setLoading(false);
      
      toast({
        title: "Questions Generated",
        description: `Generated ${questions.length} questions based on your prompt.`
      });
    }, 1500); // Simulate processing time
  };
  
  // Bookmark a question
  const toggleBookmark = (questionId: string) => {
    setGeneratedQuestions(questions =>
      questions.map(q =>
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
      )
    );
  };
  
  // Save a question
  const saveQuestion = (question: Question) => {
    // Check if question already exists in saved questions
    if (!savedQuestions.some(q => q.id === question.id)) {
      setSavedQuestions([...savedQuestions, question]);
      
      toast({
        title: "Question Saved",
        description: "The question has been added to your saved questions."
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This question is already in your saved questions."
      });
    }
  };
  
  // Copy question to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to clipboard."
    });
  };
  
  // Delete a saved question
  const deleteSavedQuestion = (questionId: string) => {
    setSavedQuestions(savedQuestions.filter(q => q.id !== questionId));
    
    toast({
      title: "Question Deleted",
      description: "The question has been removed from your saved questions."
    });
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/study-tools" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mr-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Back</span>
            </Link>
            <h1 className="text-3xl font-bold">Question Generator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Generate practice questions for JEE preparation
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Questions
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Saved Questions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Configuration */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-primary" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Set parameters for question generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={config.subject}
                    onValueChange={(value) => setConfig({...config, subject: value})}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic (Optional)</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., calculus, mechanics"
                    value={config.topic}
                    onChange={(e) => setConfig({...config, topic: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={config.difficulty}
                    onValueChange={(value) => setConfig({...config, difficulty: value})}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    value={config.questionType}
                    onValueChange={(value) => setConfig({...config, questionType: value})}
                  >
                    <SelectTrigger id="questionType">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conceptual">Conceptual</SelectItem>
                      <SelectItem value="numerical">Numerical</SelectItem>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Questions</Label>
                  <Select
                    value={config.count.toString()}
                    onValueChange={(value) => setConfig({...config, count: parseInt(value)})}
                  >
                    <SelectTrigger id="count">
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeAnswers" className="cursor-pointer">
                    Include Answers
                  </Label>
                  <Switch
                    id="includeAnswers"
                    checked={config.includeAnswers}
                    onCheckedChange={(checked) => setConfig({...config, includeAnswers: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeExplanations" className="cursor-pointer">
                    Include Explanations
                  </Label>
                  <Switch
                    id="includeExplanations"
                    checked={config.includeExplanations}
                    onCheckedChange={(checked) => setConfig({...config, includeExplanations: checked})}
                  />
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={generateQuestions}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Questions'}
                </Button>
              </CardContent>
            </Card>
            
            {/* Right side: Results */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Custom Prompt
                  </CardTitle>
                  <CardDescription>
                    Or describe what kind of questions you need
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="e.g., Generate 3 questions about integration by parts in calculus with step-by-step solutions"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={generateFromPrompt}
                    disabled={loading || !customPrompt.trim()}
                  >
                    {loading ? 'Generating...' : 'Generate from Prompt'}
                  </Button>
                </CardContent>
              </Card>
              
              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Generated Questions</h2>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download All
                    </Button>
                  </div>
                  
                  {generatedQuestions.map((question, index) => (
                    <Card key={question.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="capitalize">
                              {question.subject}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {question.difficulty}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyToClipboard(question.question)}
                            >
                              <Copy className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleBookmark(question.id)}
                            >
                              <Bookmark className={`h-4 w-4 ${question.isBookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-base mt-2 text-gray-600 dark:text-gray-300 capitalize">
                          Question {index + 1} - {question.topic}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="mb-4">
                          <p className="font-medium">{question.question}</p>
                        </div>
                        
                        {config.includeAnswers && question.answer && (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-sm font-semibold">Answer</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => copyToClipboard(question.answer)}
                              >
                                Copy
                              </Button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md mb-3">
                              <p>{question.answer}</p>
                            </div>
                          </>
                        )}
                        
                        {config.includeExplanations && question.explanation && (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-sm font-semibold">Explanation</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => copyToClipboard(question.explanation)}
                              >
                                Copy
                              </Button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-sm">
                              <p>{question.explanation}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => saveQuestion(question)}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save Question
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              {generatedQuestions.length === 0 && !loading && (
                <Card className="border-dashed border-2 bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Lightbulb className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2 text-center">No Questions Generated Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                      Configure your parameters or use a custom prompt to generate questions
                    </p>
                    <Button onClick={generateQuestions}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Sample Questions
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {loading && (
                <Card className="border-dashed border-2 bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Your Saved Questions
              </CardTitle>
              <CardDescription>
                Questions you've saved for later reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedQuestions.length > 0 ? (
                <div className="space-y-4">
                  {savedQuestions.map((question, index) => (
                    <Card key={question.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="capitalize">
                              {question.subject}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {question.difficulty}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyToClipboard(question.question)}
                            >
                              <Copy className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteSavedQuestion(question.id)}
                            >
                              <Trash className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-base mt-2 text-gray-600 dark:text-gray-300 capitalize">
                          Question {index + 1} - {question.topic}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="mb-4">
                          <p className="font-medium">{question.question}</p>
                        </div>
                        
                        {question.answer && (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-sm font-semibold">Answer</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => copyToClipboard(question.answer)}
                              >
                                Copy
                              </Button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md mb-3">
                              <p>{question.answer}</p>
                            </div>
                          </>
                        )}
                        
                        {question.explanation && (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="text-sm font-semibold">Explanation</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => copyToClipboard(question.explanation)}
                              >
                                Copy
                              </Button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-sm">
                              <p>{question.explanation}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Saved Questions</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Questions you save will appear here for easy access
                  </p>
                  <Button onClick={() => setActiveTab('generator')}>
                    Generate Questions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Tips for Effective Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Focus on understanding concepts, not just memorizing solutions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Practice a variety of question types for each topic</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Regularly revisit challenging questions to reinforce learning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Time yourself to build speed and exam readiness</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <XCircle className="h-5 w-5 text-primary" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                    <span>Rushing through problems without understanding</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                    <span>Avoiding difficult topics or question types</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                    <span>Not reviewing incorrect solutions to learn from mistakes</span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                    <span>Focusing only on one subject while neglecting others</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Rocket className="h-5 w-5 text-primary" />
                  Strategies for Hard Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <span>Break complex problems into smaller, manageable steps</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <span>Look for patterns or similarities to problems you've solved</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <span>Work backwards from the answer if you're stuck</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <span>Draw diagrams or use visual aids for complex concepts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default QuestionGenerator;
