import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { 
  Clock, Check, X, FileCheck, BarChart, ArrowRight, ChevronLeft,
  FileQuestion, ListChecks, LayoutDashboard, BookOpen, Trophy, Plus, PenTool
} from 'lucide-react';

// Types
interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: {
    maths: number;
    physics: number;
    chemistry: number;
  };
  totalQuestions: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  isCustom?: boolean;
}

interface TestAttempt {
  id: string;
  testId: string;
  dateStarted: string;
  dateCompleted?: string;
  totalTime: number; // in minutes
  answers: {
    questionId: string;
    selectedAnswer: number | null;
  }[];
  score: {
    maths: number;
    physics: number;
    chemistry: number;
    total: number;
  };
}

export function MockTests() {
  const [activeTab, setActiveTab] = useState<string>('available');
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [previousAttempts, setPreviousAttempts] = useState<TestAttempt[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isTestStartDialogOpen, setIsTestStartDialogOpen] = useState(false);
  const [isCreateCustomTestOpen, setIsCreateCustomTestOpen] = useState(false);
  const [activeTest, setActiveTest] = useState<{
    test: Test;
    questions: Question[];
    currentQuestionIndex: number;
    answers: (number | null)[];
    startTime: Date;
    timeLeft: number;
  } | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [testResult, setTestResult] = useState<{
    testTitle: string;
    score: {
      maths: number;
      physics: number;
      chemistry: number;
      total: number;
    };
    totalTime: number;
    answers: {
      questionId: string;
      selectedAnswer: number | null;
    }[];
  } | null>(null);
  const [isNtaInterface, setIsNtaInterface] = useState(false);
  const [customTest, setCustomTest] = useState<{
    title: string;
    description: string;
    duration: number;
    mathsQuestions: number;
    physicsQuestions: number;
    chemistryQuestions: number;
    level: 'beginner' | 'intermediate' | 'advanced';
  }>({
    title: 'My Custom Test',
    description: 'A personalized test with my preferred settings',
    duration: 60,
    mathsQuestions: 10,
    physicsQuestions: 10,
    chemistryQuestions: 10,
    level: 'intermediate'
  });
  
  const timerIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Sample mock tests
  const mockTests: Test[] = [
    {
      id: 'test1',
      title: 'JEE Mini Mock Test 1',
      description: 'A short test covering basic concepts across all subjects',
      duration: 60, // 60 minutes
      questions: {
        maths: 10,
        physics: 10,
        chemistry: 10
      },
      totalQuestions: 30,
      level: 'beginner',
      isActive: true
    },
    {
      id: 'test2',
      title: 'JEE Advanced Physics Focus',
      description: 'An in-depth test focusing on advanced physics concepts',
      duration: 45, // 45 minutes
      questions: {
        maths: 0,
        physics: 25,
        chemistry: 0
      },
      totalQuestions: 25,
      level: 'advanced',
      isActive: true
    },
    {
      id: 'test3',
      title: 'JEE Main Full Mock 1',
      description: 'Complete mock test with time constraints matching JEE Main',
      duration: 180, // 3 hours
      questions: {
        maths: 25,
        physics: 25,
        chemistry: 25
      },
      totalQuestions: 75,
      level: 'intermediate',
      isActive: true
    },
    {
      id: 'test4',
      title: 'Chemistry Mastery Test',
      description: 'Comprehensive test covering organic, inorganic and physical chemistry',
      duration: 60, // 60 minutes
      questions: {
        maths: 0,
        physics: 0,
        chemistry: 30
      },
      totalQuestions: 30,
      level: 'intermediate',
      isActive: true
    },
    {
      id: 'test5',
      title: 'Mathematics Challenge',
      description: 'Test your problem-solving skills with challenging math problems',
      duration: 90, // 90 minutes
      questions: {
        maths: 30,
        physics: 0,
        chemistry: 0
      },
      totalQuestions: 30,
      level: 'advanced',
      isActive: true
    },
    {
      id: 'upcoming1',
      title: 'JEE Advanced Full Mock',
      description: 'Complete simulation of JEE Advanced exam (Coming Soon)',
      duration: 180, // 3 hours
      questions: {
        maths: 25,
        physics: 25,
        chemistry: 25
      },
      totalQuestions: 75,
      level: 'advanced',
      isActive: false
    }
  ];
  
  // Sample questions pool
  const questionsPool: Question[] = [
    // Mathematics questions
    {
      id: 'math1',
      subject: 'maths',
      text: 'If f(x) = x² - 3x + 2, what is f\'(2)?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 0,
      explanation: 'f\'(x) = 2x - 3, so f\'(2) = 2×2 - 3 = 4 - 3 = 1',
      difficulty: 'easy'
    },
    {
      id: 'math2',
      subject: 'maths',
      text: 'Evaluate the integral ∫(2x + 3) dx from x = 0 to x = 2',
      options: ['5', '7', '9', '11'],
      correctAnswer: 2,
      explanation: '∫(2x + 3) dx = x² + 3x + C. From x = 0 to x = 2: (2² + 3×2) - (0² + 3×0) = 4 + 6 = 10',
      difficulty: 'medium'
    },
    {
      id: 'math3',
      subject: 'maths',
      text: 'If A and B are two events such that P(A) = 0.6, P(B) = 0.5, and P(A∩B) = 0.3, what is P(A|B)?',
      options: ['0.2', '0.3', '0.5', '0.6'],
      correctAnswer: 3,
      explanation: 'P(A|B) = P(A∩B)/P(B) = 0.3/0.5 = 0.6',
      difficulty: 'medium'
    },
    {
      id: 'math4',
      subject: 'maths',
      text: 'The solution of the differential equation dy/dx = y² is:',
      options: ['y = 1/(C - x)', 'y = 1/(C + x)', 'y = 1/(x - C)', 'y = 1/(x + C)'],
      correctAnswer: 0,
      explanation: 'Separating variables: dy/y² = dx. Integrating both sides: -1/y = x + C. Solving for y: y = -1/(x + C) = 1/(C - x)',
      difficulty: 'hard'
    },
    {
      id: 'math5',
      subject: 'maths',
      text: 'The sum of the infinite geometric series 1 + 1/3 + 1/9 + 1/27 + ... is:',
      options: ['3/2', '3', '3/4', '2'],
      correctAnswer: 0,
      explanation: 'For an infinite geometric series with first term a and common ratio r, the sum is a/(1-r) if |r| < 1. Here a = 1, r = 1/3, so sum = 1/(1-1/3) = 1/(2/3) = 3/2',
      difficulty: 'medium'
    },
    // Physics questions
    {
      id: 'physics1',
      subject: 'physics',
      text: 'A particle moves in a circle with constant speed. Which of the following statements is correct?',
      options: [
        'The velocity is constant',
        'The acceleration is zero',
        'The acceleration is directed toward the center',
        'The velocity and acceleration are parallel'
      ],
      correctAnswer: 2,
      explanation: 'When a particle moves in a circle with constant speed, it has centripetal acceleration directed toward the center of the circle. The velocity changes direction but not magnitude.',
      difficulty: 'medium'
    },
    {
      id: 'physics2',
      subject: 'physics',
      text: 'What is the equivalent resistance between points A and B in the circuit if R₁ = R₂ = R₃ = 6Ω?',
      options: ['2Ω', '3Ω', '4Ω', '9Ω'],
      correctAnswer: 1,
      explanation: 'R₂ and R₃ are in parallel, so their combined resistance is (R₂×R₃)/(R₂+R₃) = (6×6)/(6+6) = 36/12 = 3Ω. This is then in series with R₁, so the total resistance is 6 + 3 = 9Ω.',
      difficulty: 'hard'
    },
    {
      id: 'physics3',
      subject: 'physics',
      text: 'A ball is thrown vertically upward with an initial velocity of 20 m/s. How high will it rise? (Take g = 10 m/s²)',
      options: ['10 m', '20 m', '30 m', '40 m'],
      correctAnswer: 1,
      explanation: 'Using the equation v² = u² - 2gh, where final velocity v = 0 at the highest point. 0 = 20² - 2×10×h. Solving for h: h = 20²/(2×10) = 400/20 = 20 m',
      difficulty: 'easy'
    },
    {
      id: 'physics4',
      subject: 'physics',
      text: 'Which of the following is a unit of power?',
      options: ['Newton', 'Joule', 'Watt', 'Pascal'],
      correctAnswer: 2,
      explanation: 'Watt is the SI unit of power, which is the rate of doing work or transferring energy. 1 Watt = 1 Joule/second.',
      difficulty: 'easy'
    },
    {
      id: 'physics5',
      subject: 'physics',
      text: 'What is the wavelength of a photon with energy 3.3 eV? (Take h = 6.6 × 10^-34 J·s, c = 3 × 10^8 m/s, 1 eV = 1.6 × 10^-19 J)',
      options: ['2.0 × 10^-7 m', '3.8 × 10^-7 m', '5.0 × 10^-7 m', '7.5 × 10^-7 m'],
      correctAnswer: 1,
      explanation: 'E = hc/λ, so λ = hc/E = (6.6 × 10^-34 × 3 × 10^8)/(3.3 × 1.6 × 10^-19) ≈ 3.8 × 10^-7 m',
      difficulty: 'hard'
    },
    // Chemistry questions
    {
      id: 'chem1',
      subject: 'chemistry',
      text: 'Which of the following is the correct IUPAC name for CH₃-CH(CH₃)-CH₂-CH₃?',
      options: ['2-methylbutane', '3-methylbutane', 'pentane', 'isopentane'],
      correctAnswer: 0,
      explanation: 'The longest carbon chain has 4 carbon atoms (butane), with a methyl group at the 2nd carbon. Thus, the IUPAC name is 2-methylbutane.',
      difficulty: 'medium'
    },
    {
      id: 'chem2',
      subject: 'chemistry',
      text: 'What is the pH of a 0.01 M HCl solution?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
      explanation: 'HCl is a strong acid that completely dissociates in water. The pH = -log[H⁺] = -log(0.01) = -log(10^-2) = 2',
      difficulty: 'easy'
    },
    {
      id: 'chem3',
      subject: 'chemistry',
      text: 'Which of the following is NOT a colligative property?',
      options: [
        'Elevation in boiling point',
        'Depression in freezing point',
        'Osmotic pressure',
        'Surface tension'
      ],
      correctAnswer: 3,
      explanation: 'Surface tension is a physical property of a liquid that depends on the nature of the liquid, not on the concentration of solute particles. Elevation in boiling point, depression in freezing point, and osmotic pressure are all colligative properties.',
      difficulty: 'medium'
    },
    {
      id: 'chem4',
      subject: 'chemistry',
      text: 'Which quantum number determines the orientation of an orbital in space?',
      options: ['Principal quantum number (n)', 'Azimuthal quantum number (l)', 'Magnetic quantum number (m)', 'Spin quantum number (s)'],
      correctAnswer: 2,
      explanation: 'The magnetic quantum number (m) determines the orientation of an orbital in space. It can have values from -l to +l, where l is the azimuthal quantum number.',
      difficulty: 'medium'
    },
    {
      id: 'chem5',
      subject: 'chemistry',
      text: 'Which of the following is the correct order of increasing first ionization energy?',
      options: ['Na < Al < Mg < Si', 'Na < Mg < Al < Si', 'Si < Al < Mg < Na', 'Si < Al < Na < Mg'],
      correctAnswer: 1,
      explanation: 'First ionization energy generally increases across a period and decreases down a group. Among these elements, Na (Group 1) has the lowest, followed by Mg (Group 2), Al (Group 13), and Si (Group 14).',
      difficulty: 'hard'
    }
  ];
  
  // Load tests and attempts from localStorage
  useEffect(() => {
    // Load tests
    const savedTests = localStorage.getItem('jeeMockTests');
    if (savedTests) {
      try {
        setAvailableTests(JSON.parse(savedTests));
      } catch (e) {
        console.error('Error loading mock tests:', e);
        setAvailableTests(mockTests);
      }
    } else {
      setAvailableTests(mockTests);
    }
    
    // Load previous attempts
    const savedAttempts = localStorage.getItem('jeeMockTestAttempts');
    if (savedAttempts) {
      try {
        setPreviousAttempts(JSON.parse(savedAttempts));
      } catch (e) {
        console.error('Error loading mock test attempts:', e);
        setPreviousAttempts([]);
      }
    }
  }, []);
  
  // Save attempts to localStorage
  useEffect(() => {
    if (previousAttempts.length > 0) {
      localStorage.setItem('jeeMockTestAttempts', JSON.stringify(previousAttempts));
    }
  }, [previousAttempts]);

  // Save tests to localStorage
  useEffect(() => {
    if (availableTests.length > 0) {
      localStorage.setItem('jeeMockTests', JSON.stringify(availableTests));
    }
  }, [availableTests]);
  
  // Timer logic for active test
  useEffect(() => {
    if (isTestActive && activeTest) {
      // Start timer
      timerIntervalRef.current = window.setInterval(() => {
        setActiveTest(prev => {
          if (!prev) return null;
          
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            // Time's up - auto submit the test
            clearInterval(timerIntervalRef.current!);
            submitTest();
            return {
              ...prev,
              timeLeft: 0
            };
          }
          
          return {
            ...prev,
            timeLeft: newTimeLeft
          };
        });
      }, 1000);
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTestActive]);
  
  // Format time for display (minutes:seconds)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get subject badge color
  const getSubjectBadgeColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'maths':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'physics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'chemistry':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Generate questions for a test
  const generateTestQuestions = (test: Test): Question[] => {
    // Filter questions by subject
    const mathsQuestions = questionsPool.filter(q => q.subject === 'maths');
    const physicsQuestions = questionsPool.filter(q => q.subject === 'physics');
    const chemistryQuestions = questionsPool.filter(q => q.subject === 'chemistry');
    
    // Select questions based on test requirements
    // In a real app, we'd have a much larger question pool and better selection logic
    
    const selectedMaths = test.questions.maths > 0 
      ? [...mathsQuestions].sort(() => 0.5 - Math.random()).slice(0, Math.min(test.questions.maths, mathsQuestions.length))
      : [];
      
    const selectedPhysics = test.questions.physics > 0 
      ? [...physicsQuestions].sort(() => 0.5 - Math.random()).slice(0, Math.min(test.questions.physics, physicsQuestions.length))
      : [];
      
    const selectedChemistry = test.questions.chemistry > 0 
      ? [...chemistryQuestions].sort(() => 0.5 - Math.random()).slice(0, Math.min(test.questions.chemistry, chemistryQuestions.length))
      : [];
    
    // Combine and shuffle questions
    return [...selectedMaths, ...selectedPhysics, ...selectedChemistry].sort(() => 0.5 - Math.random());
  };
  
  // Start a mock test
  const startTest = () => {
    if (!selectedTest) return;
    
    const questions = generateTestQuestions(selectedTest);
    
    setActiveTest({
      test: selectedTest,
      questions,
      currentQuestionIndex: 0,
      answers: Array(questions.length).fill(null),
      startTime: new Date(),
      timeLeft: selectedTest.duration * 60
    });
    
    setIsTestActive(true);
    setIsTestStartDialogOpen(false);
    
    toast({
      title: "Test Started",
      description: `You have ${selectedTest.duration} minutes to complete the test.`,
    });
  };

  // Create custom test
  const createCustomTest = () => {
    const totalQuestions = customTest.mathsQuestions + customTest.physicsQuestions + customTest.chemistryQuestions;
    
    if (totalQuestions <= 0) {
      toast({
        title: "Invalid Configuration",
        description: "Please select at least one question.",
        variant: "destructive"
      });
      return;
    }
    
    if (customTest.duration <= 0) {
      toast({
        title: "Invalid Configuration",
        description: "Test duration must be greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    const newTest: Test = {
      id: `custom-${Date.now()}`,
      title: customTest.title || 'Custom Test',
      description: customTest.description || 'A personalized test',
      duration: customTest.duration,
      questions: {
        maths: customTest.mathsQuestions,
        physics: customTest.physicsQuestions,
        chemistry: customTest.chemistryQuestions
      },
      totalQuestions: totalQuestions,
      level: customTest.level,
      isActive: true,
      isCustom: true
    };
    
    setAvailableTests([...availableTests, newTest]);
    setIsCreateCustomTestOpen(false);
    
    toast({
      title: "Custom Test Created",
      description: "Your custom test has been created and is ready to take.",
    });
  };
  
  // Update answer for current question
  const updateAnswer = (value: string) => {
    if (!activeTest) return;
    
    const answerIndex = parseInt(value);
    
    setActiveTest({
      ...activeTest,
      answers: activeTest.answers.map((ans, idx) => 
        idx === activeTest.currentQuestionIndex ? answerIndex : ans
      )
    });
  };
  
  // Move to next question
  const goToNextQuestion = () => {
    if (!activeTest) return;
    
    if (activeTest.currentQuestionIndex < activeTest.questions.length - 1) {
      setActiveTest({
        ...activeTest,
        currentQuestionIndex: activeTest.currentQuestionIndex + 1
      });
    }
  };
  
  // Move to previous question
  const goToPreviousQuestion = () => {
    if (!activeTest) return;
    
    if (activeTest.currentQuestionIndex > 0) {
      setActiveTest({
        ...activeTest,
        currentQuestionIndex: activeTest.currentQuestionIndex - 1
      });
    }
  };
  
  // Jump to a specific question
  const jumpToQuestion = (index: number) => {
    if (!activeTest) return;
    
    setActiveTest({
      ...activeTest,
      currentQuestionIndex: index
    });
  };
  
  // Submit the test
  const submitTest = () => {
    if (!activeTest) return;
    
    // Clear the timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Calculate spent time
    const endTime = new Date();
    const totalSeconds = Math.floor((endTime.getTime() - activeTest.startTime.getTime()) / 1000);
    const totalMinutes = Math.ceil(totalSeconds / 60);
    
    // Calculate score
    const mathsQuestions = activeTest.questions.filter(q => q.subject === 'maths');
    const physicsQuestions = activeTest.questions.filter(q => q.subject === 'physics');
    const chemistryQuestions = activeTest.questions.filter(q => q.subject === 'chemistry');
    
    let mathsScore = 0;
    let physicsScore = 0;
    let chemistryScore = 0;
    
    activeTest.questions.forEach((question, index) => {
      if (activeTest.answers[index] === question.correctAnswer) {
        if (question.subject === 'maths') mathsScore++;
        if (question.subject === 'physics') physicsScore++;
        if (question.subject === 'chemistry') chemistryScore++;
      }
    });
    
    const totalScore = mathsScore + physicsScore + chemistryScore;
    
    // Save the attempt
    const newAttempt: TestAttempt = {
      id: Date.now().toString(),
      testId: activeTest.test.id,
      dateStarted: activeTest.startTime.toISOString(),
      dateCompleted: endTime.toISOString(),
      totalTime: totalMinutes,
      answers: activeTest.questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: activeTest.answers[index]
      })),
      score: {
        maths: mathsScore,
        physics: physicsScore,
        chemistry: chemistryScore,
        total: totalScore
      }
    };
    
    setPreviousAttempts(prev => [...prev, newAttempt]);
    
    // Prepare results for display
    setTestResult({
      testTitle: activeTest.test.title,
      score: {
        maths: mathsScore,
        physics: physicsScore,
        chemistry: chemistryScore,
        total: totalScore
      },
      totalTime: totalMinutes,
      answers: activeTest.questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: activeTest.answers[index]
      }))
    });
    
    // Close submit dialog and show results
    setIsSubmitDialogOpen(false);
    setIsResultsDialogOpen(true);
    setIsTestActive(false);
    setActiveTest(null);
  };
  
  // Return to test selection
  const returnToTests = () => {
    setIsResultsDialogOpen(false);
    setTestResult(null);
    setActiveTab('available');
  };
  
  // Calculate the percentage of answered questions
  const calculateProgress = () => {
    if (!activeTest) return 0;
    
    const answeredCount = activeTest.answers.filter(a => a !== null).length;
    return (answeredCount / activeTest.questions.length) * 100;
  };
  
  return (
    <div className="container max-w-6xl py-6">
      {!isTestActive ? (
        <div>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Link to="/study-tools" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mr-2">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only sm:not-sr-only sm:ml-1">Back</span>
              </Link>
              <h1 className="text-3xl font-bold">Mock Tests</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Prepare for JEE with full-length practice exams
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Available Tests
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Test History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Available Mock Tests</h2>
                
                <Dialog open={isCreateCustomTestOpen} onOpenChange={setIsCreateCustomTestOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      Create Custom Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Create Custom Test</DialogTitle>
                      <DialogDescription>
                        Design your own test by customizing the parameters below.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="test-title" className="text-right">Title</Label>
                        <Input
                          id="test-title"
                          value={customTest.title}
                          onChange={(e) => setCustomTest({...customTest, title: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="test-description" className="text-right">Description</Label>
                        <Input
                          id="test-description"
                          value={customTest.description}
                          onChange={(e) => setCustomTest({...customTest, description: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Duration</Label>
                        <div className="col-span-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-500">{customTest.duration} minutes</span>
                          </div>
                          <Slider 
                            value={[customTest.duration]} 
                            min={10} 
                            max={180} 
                            step={5}
                            onValueChange={(value) => setCustomTest({...customTest, duration: value[0]})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Level</Label>
                        <Select
                          value={customTest.level}
                          onValueChange={(value) => setCustomTest({...customTest, level: value as 'beginner' | 'intermediate' | 'advanced'})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select difficulty level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Mathematics</Label>
                        <div className="col-span-3">
                          <div className="flex items-center justify-between
