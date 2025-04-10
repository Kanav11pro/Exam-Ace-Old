
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { 
  Clock, Check, X, FileCheck, BarChart, ArrowRight, 
  FileQuestion, ListChecks, LayoutDashboard, BookOpen, Trophy
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
            <h1 className="text-3xl font-bold mb-2">Mock Tests</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTests.map(test => (
                  <Card 
                    key={test.id} 
                    className={`border ${test.isActive ? '' : 'opacity-60'}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <Badge className={getLevelBadgeColor(test.level)}>
                          {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {test.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FileQuestion className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{test.totalQuestions} questions</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {test.questions.maths > 0 && (
                          <Badge variant="outline" className={getSubjectBadgeColor('maths')}>
                            Maths: {test.questions.maths}
                          </Badge>
                        )}
                        {test.questions.physics > 0 && (
                          <Badge variant="outline" className={getSubjectBadgeColor('physics')}>
                            Physics: {test.questions.physics}
                          </Badge>
                        )}
                        {test.questions.chemistry > 0 && (
                          <Badge variant="outline" className={getSubjectBadgeColor('chemistry')}>
                            Chemistry: {test.questions.chemistry}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        disabled={!test.isActive}
                        onClick={() => {
                          setSelectedTest(test);
                          setIsTestStartDialogOpen(true);
                        }}
                      >
                        {test.isActive ? 'Start Test' : 'Coming Soon'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              {previousAttempts.length > 0 ? (
                <div className="space-y-4">
                  {previousAttempts.sort((a, b) => 
                    new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime()
                  ).map(attempt => {
                    const test = availableTests.find(t => t.id === attempt.testId);
                    
                    return (
                      <Card key={attempt.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{test?.title || 'Unknown Test'}</h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{format(parseISO(attempt.dateCompleted || attempt.dateStarted), 'MMM d, yyyy')}</span>
                                <span className="mx-2">•</span>
                                <span>{attempt.totalTime} minutes</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {attempt.score.total}
                                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    /{test?.totalQuestions || 0}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {test?.totalQuestions ? Math.round((attempt.score.total / test.totalQuestions) * 100) : 0}%
                                </div>
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={() => {
                                  // Show detailed results
                                  setTestResult({
                                    testTitle: test?.title || 'Unknown Test',
                                    score: attempt.score,
                                    totalTime: attempt.totalTime,
                                    answers: attempt.answers
                                  });
                                  setIsResultsDialogOpen(true);
                                }}
                              >
                                View Results
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="bg-purple-50 dark:bg-purple-900/10 p-2 rounded text-center">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Maths</div>
                              <div className="font-medium">
                                {attempt.score.maths}
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  /{test?.questions.maths || 0}
                                </span>
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded text-center">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Physics</div>
                              <div className="font-medium">
                                {attempt.score.physics}
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  /{test?.questions.physics || 0}
                                </span>
                              </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded text-center">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Chemistry</div>
                              <div className="font-medium">
                                {attempt.score.chemistry}
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  /{test?.questions.chemistry || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Test History</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven't taken any mock tests yet
                  </p>
                  <Button onClick={() => setActiveTab('available')}>
                    Browse Available Tests
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="h-5 w-5 mr-2 text-primary" /> 
                  Test Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Practice with real JEE-pattern questions and time constraints</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Identify your strengths and weaknesses across subjects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Build exam stamina and improve time management skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Assess your preparation level with detailed analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="h-5 w-5 mr-2 text-primary" /> 
                  Test Taking Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Attempt questions strategically - easy ones first</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Don't spend too much time on any single question</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Mark questions for review if you're unsure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Keep track of time throughout the test</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" /> 
                  After the Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Review all incorrect answers carefully</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Look for patterns in your mistakes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Create a focused study plan based on weak areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Retake tests to measure your improvement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Test Start Dialog */}
          <Dialog open={isTestStartDialogOpen} onOpenChange={setIsTestStartDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedTest?.title}</DialogTitle>
                <DialogDescription>
                  Prepare to start your mock test
                </DialogDescription>
              </DialogHeader>
              
              {selectedTest && (
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Duration:</span>
                      <span className="font-medium">{selectedTest.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total Questions:</span>
                      <span className="font-medium">{selectedTest.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Difficulty:</span>
                      <Badge className={getLevelBadgeColor(selectedTest.level)}>
                        {selectedTest.level.charAt(0).toUpperCase() + selectedTest.level.slice(1)}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Math Questions:</span>
                      <span className="font-medium">{selectedTest.questions.maths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Physics Questions:</span>
                      <span className="font-medium">{selectedTest.questions.physics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Chemistry Questions:</span>
                      <span className="font-medium">{selectedTest.questions.chemistry}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>Once started, the timer cannot be paused</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>You can navigate between questions freely</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>Submit your test before the timer ends</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>Results will be available immediately after submission</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTestStartDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={startTest}>
                  Start Test
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Test Results Dialog */}
          <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  Test Results: {testResult?.testTitle}
                </DialogTitle>
                <DialogDescription>
                  Your performance analysis
                </DialogDescription>
              </DialogHeader>
              
              {testResult && (
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-accent/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Score</div>
                        <div className="text-3xl font-bold mt-1">{testResult.score.total}</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-accent/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Time Taken</div>
                        <div className="text-3xl font-bold mt-1">{testResult.totalTime} min</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-accent/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Questions Attempted</div>
                        <div className="text-3xl font-bold mt-1">
                          {testResult.answers.filter(a => a.selectedAnswer !== null).length}/
                          {testResult.answers.length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Subject-wise Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Mathematics</div>
                          <Badge variant="outline" className={getSubjectBadgeColor('maths')}>
                            {testResult.score.maths} pts
                          </Badge>
                        </div>
                        <Progress 
                          value={50} // This would be calculated based on the actual questions
                          className="h-2 bg-purple-100 dark:bg-purple-900/30"
                        />
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Physics</div>
                          <Badge variant="outline" className={getSubjectBadgeColor('physics')}>
                            {testResult.score.physics} pts
                          </Badge>
                        </div>
                        <Progress 
                          value={60} // This would be calculated based on the actual questions
                          className="h-2 bg-blue-100 dark:bg-blue-900/30"
                        />
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Chemistry</div>
                          <Badge variant="outline" className={getSubjectBadgeColor('chemistry')}>
                            {testResult.score.chemistry} pts
                          </Badge>
                        </div>
                        <Progress 
                          value={70} // This would be calculated based on the actual questions
                          className="h-2 bg-green-100 dark:bg-green-900/30"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Improvement Areas</h3>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg space-y-2">
                      <p className="text-sm">
                        Based on your performance, focus on improving these areas:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>Review concepts in {testResult.score.maths < testResult.score.physics && testResult.score.maths < testResult.score.chemistry ? 'Mathematics' : testResult.score.physics < testResult.score.maths && testResult.score.physics < testResult.score.chemistry ? 'Physics' : 'Chemistry'}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>Practice more {testResult.totalTime > 90 ? 'to improve speed' : 'for accuracy'}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>Focus on {testResult.answers.filter(a => a.selectedAnswer !== null).length < testResult.answers.length / 2 ? 'attempting more questions' : 'reviewing mistakes'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button onClick={returnToTests}>
                  Return to Tests
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        // Active test view
        <div className="animate-fade-in">
          {activeTest && (
            <>
              <div className="fixed top-14 left-0 right-0 z-10 bg-background border-b p-2">
                <div className="container max-w-6xl flex justify-between items-center">
                  <div className="flex items-center">
                    <h2 className="font-semibold mr-4">{activeTest.test.title}</h2>
                    <Badge className={getLevelBadgeColor(activeTest.test.level)}>
                      {activeTest.test.level.charAt(0).toUpperCase() + activeTest.test.level.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center">
                      <Progress 
                        value={calculateProgress()} 
                        className="w-32 h-2 mr-2" 
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activeTest.answers.filter(a => a !== null).length}/{activeTest.questions.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="font-medium">
                        {formatTime(activeTest.timeLeft)}
                      </span>
                    </div>
                    
                    <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                          Submit Test
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Test</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to submit your test?
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                          <div className="flex items-center justify-between mb-4">
                            <span>Questions Answered:</span>
                            <span className="font-medium">
                              {activeTest.answers.filter(a => a !== null).length}/{activeTest.questions.length}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span>Time Remaining:</span>
                            <span className="font-medium">
                              {formatTime(activeTest.timeLeft)}
                            </span>
                          </div>
                          
                          {activeTest.answers.filter(a => a !== null).length < activeTest.questions.length && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-300 text-sm border border-yellow-200 dark:border-yellow-800 rounded-md">
                              Warning: You have {activeTest.questions.length - activeTest.answers.filter(a => a !== null).length} unanswered questions.
                            </div>
                          )}
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                            Return to Test
                          </Button>
                          <Button onClick={submitTest}>
                            Submit Test
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Question navigator - mobile view */}
                <div className="md:hidden">
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Question Navigator</div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activeTest.currentQuestionIndex + 1}/{activeTest.questions.length}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {activeTest.answers.map((answer, index) => (
                          <Button
                            key={index}
                            variant={index === activeTest.currentQuestionIndex ? "default" : "outline"}
                            size="sm"
                            className={`w-8 h-8 p-0 ${
                              answer !== null 
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900"
                                : ""
                            }`}
                            onClick={() => jumpToQuestion(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Current question */}
                <div className="md:col-span-3">
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={getSubjectBadgeColor(activeTest.questions[activeTest.currentQuestionIndex].subject)}>
                          {activeTest.questions[activeTest.currentQuestionIndex].subject.charAt(0).toUpperCase() + 
                           activeTest.questions[activeTest.currentQuestionIndex].subject.slice(1)}
                        </Badge>
                        <div className="text-sm font-medium">
                          Question {activeTest.currentQuestionIndex + 1} of {activeTest.questions.length}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-6">
                        {activeTest.questions[activeTest.currentQuestionIndex].text}
                      </h3>
                      
                      <RadioGroup
                        value={activeTest.answers[activeTest.currentQuestionIndex]?.toString() || ""}
                        onValueChange={updateAnswer}
                        className="space-y-3"
                      >
                        {activeTest.questions[activeTest.currentQuestionIndex].options.map((option, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent/50 cursor-pointer"
                          >
                            <RadioGroupItem
                              value={idx.toString()}
                              id={`option-${idx}`}
                            />
                            <Label
                              htmlFor={`option-${idx}`}
                              className="flex-1 cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button 
                        variant="outline" 
                        onClick={goToPreviousQuestion}
                        disabled={activeTest.currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      
                      <Button 
                        onClick={goToNextQuestion}
                        disabled={activeTest.currentQuestionIndex === activeTest.questions.length - 1}
                      >
                        Next <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Question navigator and stats - desktop view */}
                <div className="hidden md:block">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Question Navigator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-y-auto pb-4">
                      <div className="grid grid-cols-5 gap-2">
                        {activeTest.answers.map((answer, index) => (
                          <Button
                            key={index}
                            variant={index === activeTest.currentQuestionIndex ? "default" : "outline"}
                            size="sm"
                            className={`w-8 h-8 p-0 ${
                              answer !== null && index !== activeTest.currentQuestionIndex
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                                : ""
                            }`}
                            onClick={() => jumpToQuestion(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Test Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Answered:</span>
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                {activeTest.answers.filter(a => a !== null).length}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Remaining:</span>
                              <Badge variant="outline">
                                {activeTest.questions.length - activeTest.answers.filter(a => a !== null).length}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Time Left:</span>
                              <span className="font-medium">
                                {formatTime(activeTest.timeLeft)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Subject Distribution</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Maths:</span>
                              <span>
                                {activeTest.questions.filter(q => q.subject === 'maths').length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Physics:</span>
                              <span>
                                {activeTest.questions.filter(q => q.subject === 'physics').length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Chemistry:</span>
                              <span>
                                {activeTest.questions.filter(q => q.subject === 'chemistry').length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setIsSubmitDialogOpen(true)}>
                        Submit Test
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
