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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Clock, Check, X, FileCheck, BarChart, ArrowRight,
  FileQuestion, ListChecks, LayoutDashboard, BookOpen, Trophy,
  PieChart, Award, Target, Calendar, Lightbulb, FileText, HelpCircle
} from 'lucide-react';
import { StudyTip } from './flashcards/components/StudyTip';

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
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
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
    questionDetails?: Question[];
    difficultyBreakdown?: {
      easy: { total: number; correct: number };
      medium: { total: number; correct: number };
      hard: { total: number; correct: number };
    };
    speedMetrics?: {
      averageTimePerQuestion: number;
      fastestQuestion: number;
      slowestQuestion: number;
    };
    improvementAreas?: string[];
  } | null>(null);
  
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  const [questionTimings, setQuestionTimings] = useState<Record<number, number>>({});
  const [lastQuestionTime, setLastQuestionTime] = useState<Date | null>(null);
  
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
  
  // Track time spent on each question
  useEffect(() => {
    if (activeTest && lastQuestionTime) {
      const now = new Date();
      const timeSpent = Math.round((now.getTime() - lastQuestionTime.getTime()) / 1000);
      
      // Only update if the time spent is reasonable (less than 5 minutes)
      if (timeSpent > 0 && timeSpent < 300) {
        setQuestionTimings(prev => ({
          ...prev,
          [activeTest.currentQuestionIndex]: (prev[activeTest.currentQuestionIndex] || 0) + timeSpent
        }));
      }
    }
    
    if (activeTest) {
      setLastQuestionTime(new Date());
    }
  }, [activeTest?.currentQuestionIndex]);
  
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
  
  // Get difficulty badge color
  const getDifficultyBadgeColor = (difficulty: string) => {
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

  // Toggle bookmark for a question
  const toggleBookmark = (questionIndex: number) => {
    const questionId = activeTest?.questions[questionIndex].id;
    if (!questionId) return;

    setBookmarkedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });

    // Fixed toast calls to use proper string values instead of functions
    toast({
      title: bookmarkedQuestions.includes(questionId || '') ? "Bookmark removed" : "Question bookmarked",
      description: bookmarkedQuestions.includes(questionId || '') 
        ? "Question removed from bookmarks" 
        : "Question added to bookmarks for later review",
    });
  };

  // Check if a question is bookmarked
  const isBookmarked = (questionId: string) => {
    return bookmarkedQuestions.includes(questionId);
  };
  
  // Generate detailed test report
  const generateDetailedReport = (
    test: Test, 
    questions: Question[], 
    answers: (number | null)[], 
    totalTime: number
  ) => {
    // Calculate subject-wise scores
    let mathsScore = 0;
    let physicsScore = 0;
    let chemistryScore = 0;
    
    // Calculate difficulty breakdown
    const difficultyBreakdown = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    };
    
    // Calculate question timing metrics
    const questionTimes = Object.values(questionTimings);
    const averageTimePerQuestion = questionTimes.length > 0 
      ? Math.round(questionTimes.reduce((sum, time) => sum + time, 0) / questionTimes.length) 
      : 0;
    
    const fastestQuestion = questionTimes.length > 0 ? Math.min(...questionTimes) : 0;
    const slowestQuestion = questionTimes.length > 0 ? Math.max(...questionTimes) : 0;
    
    // Analyze each question
    questions.forEach((question, index) => {
      // Count by difficulty
      if (question.difficulty === 'easy') difficultyBreakdown.easy.total++;
      if (question.difficulty === 'medium') difficultyBreakdown.medium.total++;
      if (question.difficulty === 'hard') difficultyBreakdown.hard.total++;
      
      // Count correct answers by subject and difficulty
      if (answers[index] === question.correctAnswer) {
        if (question.subject === 'maths') mathsScore++;
        if (question.subject === 'physics') physicsScore++;
        if (question.subject === 'chemistry') chemistryScore++;
        
        if (question.difficulty === 'easy') difficultyBreakdown.easy.correct++;
        if (question.difficulty === 'medium') difficultyBreakdown.medium.correct++;
        if (question.difficulty === 'hard') difficultyBreakdown.hard.correct++;
      }
    });
    
    // Identify improvement areas
    const improvementAreas: string[] = [];
    
    // Subject-based improvement areas
    const mathsPerformance = mathsScore / questions.filter(q => q.subject === 'maths').length;
    const physicsPerformance = physicsScore / questions.filter(q => q.subject === 'physics').length;
    const chemistryPerformance = chemistryScore / questions.filter(q => q.subject === 'chemistry').length;
    
    const subjectsToImprove: string[] = [];
    if (mathsPerformance < 0.6 && questions.filter(q => q.subject === 'maths').length > 0) {
      subjectsToImprove.push('Mathematics');
    }
    if (physicsPerformance < 0.6 && questions.filter(q => q.subject === 'physics').length > 0) {
      subjectsToImprove.push('Physics');
    }
    if (chemistryPerformance < 0.6 && questions.filter(q => q.subject === 'chemistry').length > 0) {
      subjectsToImprove.push('Chemistry');
    }
    
    if (subjectsToImprove.length > 0) {
      improvementAreas.push(`Focus on strengthening core concepts in ${subjectsToImprove.join(', ')}`);
    }
    
    // Difficulty-based improvement areas
    const hardPerformance = difficultyBreakdown.hard.correct / (difficultyBreakdown.hard.total || 1);
    if (hardPerformance < 0.5 && difficultyBreakdown.hard.total > 0) {
      improvementAreas.push('Practice more complex problems to improve advanced problem-solving skills');
    }
    
    // Time management improvement
    if (averageTimePerQuestion > 60 && questions.length > 0) {
      improvementAreas.push('Work on time management - try to solve questions more quickly');
    }
    
    // Consistency improvement
    if (questions.filter((_, i) => answers[i] === null).length > questions.length * 0.1) {
      improvementAreas.push('Try to attempt all questions - even educated guesses can improve your score');
    }
    
    return {
      testTitle: test.title,
      score: {
        maths: mathsScore,
        physics: physicsScore,
        chemistry: chemistryScore,
        total: mathsScore + physicsScore + chemistryScore
      },
      totalTime,
      answers: questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: answers[index]
      })),
      questionDetails: questions,
      difficultyBreakdown,
      speedMetrics: {
        averageTimePerQuestion,
        fastestQuestion,
        slowestQuestion
      },
      improvementAreas: improvementAreas.length > 0 ? improvementAreas : ['Keep up the good work and continue practicing regularly']
    };
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
    
    // Generate detailed report
    const testReport = generateDetailedReport(
      activeTest.test,
      activeTest.questions,
      activeTest.answers,
      totalMinutes
    );
    
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
      score: testReport.score
    };
    
    setPreviousAttempts(prev => [...prev, newAttempt]);
    
    // Set the test result
    setTestResult(testReport);
    
    // Close submit dialog and show results
    setIsSubmitDialogOpen(false);
    setIsResultsDialogOpen(true);
    setIsTestActive(false);
    setActiveTest(null);
    
    // Reset question timings for next test
    setQuestionTimings({});
  };
  
  // Return to test selection
  const returnToTests = () => {
    setIsResultsDialogOpen(false);
    setTestResult(null);
    setActiveTab('available');
    setDetailedReport(false);
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
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Mock Tests</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Practice with simulated JEE exam conditions to improve your test-taking skills
            </p>
          </motion.div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="available" className="text-center">Available Tests</TabsTrigger>
              <TabsTrigger value="previous" className="text-center">Previous Attempts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTests.map(test => (
                  <Card key={test.id} className={`${!test.isActive ? 'opacity-60' : ''} transition-all hover:shadow-md`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{test.title}</CardTitle>
                        <Badge className={getLevelBadgeColor(test.level)}>
                          {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {test.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {test.questions.maths > 0 && (
                          <Badge variant="outline" className={getSubjectBadgeColor('maths')}>
                            {test.questions.maths} Maths Questions
                          </Badge>
                        )}
                        {test.questions.physics > 0 && (
                          <Badge variant="outline" className={getSubjectBadgeColor('physics')}>
                            {test.questions.physics} Physics Questions
                          </Badge>
                        )}
                        {test.questions.chemistry > 0 && (
                          <Badge variant="outline" className={getSubjectBadgeColor('chemistry')}>
                            {test.questions.chemistry} Chemistry Questions
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{test.duration} minutes</span>
                        </div>
                        <div>
                          <span>{test.totalQuestions} questions</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-1">
                      <Button 
                        onClick={() => {
                          setSelectedTest(test);
                          setIsTestStartDialogOpen(true);
                        }}
                        disabled={!test.isActive}
                        className="w-full"
                      >
                        {test.isActive ? 'Start Test' : 'Coming Soon'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <StudyTip 
                title="Test Preparation Tip"
                tip="Before starting a mock test, ensure you are in a quiet environment, have all necessary tools (calculator if allowed), and are well-rested. Time yourself strictly to simulate real exam conditions."
              />
            </TabsContent>
            
            <TabsContent value="previous" className="mt-6">
              {previousAttempts.length > 0 ? (
                <div className="space-y-4">
                  {previousAttempts.map(attempt => {
                    const test = availableTests.find(t => t.id === attempt.testId);
                    return (
                      <Card key={attempt.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{test?.title || "Unknown Test"}</CardTitle>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {((attempt.score.total / 
                                (test?.totalQuestions || 1)) * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <CardDescription className="mt-2">
                            Attempted on {format(parseISO(attempt.dateStarted), 'PPp')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Maths</p>
                              <p className="font-semibold">
                                {attempt.score.maths}/{test?.questions.maths || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Physics</p>
                              <p className="font-semibold">
                                {attempt.score.physics}/{test?.questions.physics || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Chemistry</p>
                              <p className="font-semibold">
                                {attempt.score.chemistry}/{test?.questions.chemistry || 0}
                              </p>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Completed in {attempt.totalTime} minutes</span>
                            </div>
                            <div>
                              <span>Total: {attempt.score.total}/{test?.totalQuestions || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-1">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              // View detailed report
                              const questions = generateTestQuestions(test || mockTests[0]);
                              
                              const testReport = {
                                testTitle: test?.title || "Unknown Test",
                                score: attempt.score,
                                totalTime: attempt.totalTime,
                                answers: attempt.answers,
                                questionDetails: questions,
                                // We don't have this info from past attempts
                                difficultyBreakdown: undefined, 
                                speedMetrics: undefined,
                                improvementAreas: ['Continue practicing regularly']
                              };
                              
                              setTestResult(testReport);
                              setIsResultsDialogOpen(true);
                            }}
                            className="w-full"
                          >
                            <FileText className="mr-1 h-4 w-4" />
                            View Report
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <FileQuestion className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">No previous attempts</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                    You haven't taken any mock tests yet. Start one to track your progress!
                  </p>
                  <Button onClick={() => setActiveTab('available')}>
                    View Available Tests
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div>
          {/* Active Test UI */}
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Question Area - Left Side */}
            <div className="lg:w-3/4 mb-4 lg:mb-0">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-blue-50 dark:bg-blue-900/20">
                    Question {activeTest?.currentQuestionIndex! + 1} of {activeTest?.questions.length}
                  </Badge>
                  <Badge className={getSubjectBadgeColor(activeTest?.questions[activeTest?.currentQuestionIndex!]?.subject || '')}>
                    {activeTest?.questions[activeTest?.currentQuestionIndex!]?.subject.charAt(0).toUpperCase() + 
                      activeTest?.questions[activeTest?.currentQuestionIndex!]?.subject.slice(1)}
                  </Badge>
                  <Badge className={`ml-2 ${getDifficultyBadgeColor(activeTest?.questions[activeTest?.currentQuestionIndex!]?.difficulty || '')}`}>
                    {activeTest?.questions[activeTest?.currentQuestionIndex!]?.difficulty.charAt(0).toUpperCase() + 
                      activeTest?.questions[activeTest?.currentQuestionIndex!]?.difficulty.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleBookmark(activeTest?.currentQuestionIndex!)}
                    className="flex items-center gap-1"
                  >
                    {isBookmarked(activeTest?.questions[activeTest?.currentQuestionIndex!]?.id || '') ? (
                      <>
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Bookmark</span>
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-md">
                    <Clock className="h-4 w-4 text-yellow-700 dark:text-yellow-400" />
                    <span className="ml-1 font-mono text-yellow-800 dark:text-yellow-300">
                      {formatTime(activeTest?.timeLeft || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <p className="text-lg font-medium mb-8">
                    {activeTest?.questions[activeTest?.currentQuestionIndex!]?.text}
                  </p>
                  
                  <RadioGroup
                    value={activeTest?.answers[activeTest?.currentQuestionIndex!]?.toString()}
                    onValueChange={updateAnswer}
                    className="space-y-4"
                  >
                    {activeTest?.questions[activeTest?.currentQuestionIndex!]?.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <RadioGroupItem 
                          value={index.toString()} 
                          id={`option-${index}`} 
                          className="mr-2" 
                        />
                        <Label htmlFor={`option-${index}`} className="w-full cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between pt-0 pb-4">
                  <Button
                    variant="outline"
                    onClick={goToPreviousQuestion}
                    disabled={activeTest?.currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  {activeTest?.currentQuestionIndex === activeTest.questions.length - 1 ? (
                    <Button
                      onClick={() => setIsSubmitDialogOpen(true)}
                      className="ml-2"
                    >
                      Submit Test
                    </Button>
                  ) : (
                    <Button
                      onClick={goToNextQuestion}
                    >
                      Next
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Test Progress</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {activeTest?.answers.filter(a => a !== null).length} of {activeTest?.questions.length} answered
                </span>
              </div>
              <Progress value={calculateProgress()} className="mb-6 h-2" />
            </div>
            
            {/* Question Navigator - Right Side */}
            <div className="lg:w-1/4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Questions Navigator</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-5 gap-2">
                    {activeTest?.questions.map((q, index) => (
                      <Button
                        key={index}
                        variant={activeTest.currentQuestionIndex === index ? "default" : 
                          activeTest.answers[index] !== null ? "secondary" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => jumpToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">Current</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">Unanswered</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-gray-500 rounded-full mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">Answered</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-2 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsSubmitDialogOpen(true)}
                  >
                    Finish & Submit
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {/* Test Start Dialog */}
      <Dialog open={isTestStartDialogOpen} onOpenChange={setIsTestStartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start {selectedTest?.title}</DialogTitle>
            <DialogDescription>
              You're about to start a timed mock test. Make sure you're ready before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Duration:</span>
              <span className="font-mono">{selectedTest?.duration} minutes</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Total Questions:</span>
              <span>{selectedTest?.totalQuestions}</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Question Distribution:</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedTest?.questions.maths ? (
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="text-purple-700 dark:text-purple-300 font-medium">Maths</p>
                    <p className="text-lg">{selectedTest?.questions.maths}</p>
                  </div>
                ) : null}
                {selectedTest?.questions.physics ? (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-blue-700 dark:text-blue-300 font-medium">Physics</p>
                    <p className="text-lg">{selectedTest?.questions.physics}</p>
                  </div>
                ) : null}
                {selectedTest?.questions.chemistry ? (
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-green-700 dark:text-green-300 font-medium">Chemistry</p>
                    <p className="text-lg">{selectedTest?.questions.chemistry}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          
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
      
      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? You won't be able to change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Completed:</span>
              <span>
                {activeTest?.answers.filter(a => a !== null).length} of {activeTest?.questions.length} questions
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Time Remaining:</span>
              <span className="font-mono">{formatTime(activeTest?.timeLeft || 0)}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Continue Test
            </Button>
            <Button onClick={submitTest}>
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Results: {testResult?.testTitle}</DialogTitle>
            <DialogDescription>
              Review your performance and identify areas for improvement
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {testResult?.score.total || 0}
                        <span className="text-gray-500 text-lg">/{testResult?.answers.length || 0}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {Math.round(((testResult?.score.total || 0) / 
                          (testResult?.answers.length || 1)) * 100)}% Correct
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Time Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {testResult?.totalTime || 0}
                        <span className="text-gray-500 text-lg"> mins</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {testResult?.speedMetrics ? 
                          `${testResult.speedMetrics.averageTimePerQuestion} seconds per question` : 
                          "Time spent on test"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Subject Performance */}
            <h3 className="font-semibold text-lg mb-3">Subject Performance</h3>
            <div className="space-y-4 mb-6">
              {testResult?.score.maths !== undefined && testResult.score.maths >= 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className={getSubjectBadgeColor('maths')}>Maths</Badge>
                      <span className="ml-2 font-medium">
                        {testResult.score.maths} / 
                        {testResult.questionDetails?.filter(q => q.subject === 'maths').length || 0}
                      </span>
                    </div>
                    <span className="text-sm">
                      {testResult.questionDetails?.filter(q => q.subject === 'maths').length ?
                        `${Math.round((testResult.score.maths / 
                          testResult.questionDetails.filter(q => q.subject === 'maths').length) * 100)}%` : '0%'}
                    </span>
                  </div>
                  <Progress 
                    value={testResult.questionDetails?.filter(q => q.subject === 'maths').length ?
                      (testResult.score.maths / 
                        testResult.questionDetails.filter(q => q.subject === 'maths').length) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              )}
              
              {testResult?.score.physics !== undefined && testResult.score.physics >= 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className={getSubjectBadgeColor('physics')}>Physics</Badge>
                      <span className="ml-2 font-medium">
                        {testResult.score.physics} / 
                        {testResult.questionDetails?.filter(q => q.subject === 'physics').length || 0}
                      </span>
                    </div>
                    <span className="text-sm">
                      {testResult.questionDetails?.filter(q => q.subject === 'physics').length ?
                        `${Math.round((testResult.score.physics / 
                          testResult.questionDetails.filter(q => q.subject === 'physics').length) * 100)}%` : '0%'}
                    </span>
                  </div>
                  <Progress 
                    value={testResult.questionDetails?.filter(q => q.subject === 'physics').length ?
                      (testResult.score.physics / 
                        testResult.questionDetails.filter(q => q.subject === 'physics').length) * 100 : 0}
                    className="h-2" 
                  />
                </div>
              )}
              
              {testResult?.score.chemistry !== undefined && testResult.score.chemistry >= 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className={getSubjectBadgeColor('chemistry')}>Chemistry</Badge>
                      <span className="ml-2 font-medium">
                        {testResult.score.chemistry} / 
                        {testResult.questionDetails?.filter(q => q.subject === 'chemistry').length || 0}
                      </span>
                    </div>
                    <span className="text-sm">
                      {testResult.questionDetails?.filter(q => q.subject === 'chemistry').length ?
                        `${Math.round((testResult.score.chemistry / 
                          testResult.questionDetails.filter(q => q.subject === 'chemistry').length) * 100)}%` : '0%'}
                    </span>
                  </div>
                  <Progress 
                    value={testResult.questionDetails?.filter(q => q.subject === 'chemistry').length ?
                      (testResult.score.chemistry / 
                        testResult.questionDetails.filter(q => q.subject === 'chemistry').length) * 100 : 0}
                    className="h-2" 
                  />
                </div>
              )}
            </div>
            
            {/* Toggle for detailed report */}
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="detailed-report" className="font-medium">
                Show Detailed Analysis
              </Label>
              <div className="flex items-center">
                <Switch
                  id="detailed-report"
                  checked={detailedReport}
                  onCheckedChange={setDetailedReport}
                />
              </div>
            </div>
            
            {/* Detailed Report */}
            {detailedReport && testResult?.difficultyBreakdown && (
              <>
                <Separator className="my-4" />
                <div className="space-y-6">
                  {/* Difficulty breakdown */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      Difficulty Breakdown
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <Badge className={getDifficultyBadgeColor('easy')}>Easy</Badge>
                            <div className="text-2xl font-semibold mt-2">
                              {testResult.difficultyBreakdown.easy.correct} / {testResult.difficultyBreakdown.easy.total}
                            </div>
                            <p className="text-sm text-gray-500">
                              {testResult.difficultyBreakdown.easy.total > 0 
                                ? `${Math.round((testResult.difficultyBreakdown.easy.correct / 
                                    testResult.difficultyBreakdown.easy.total) * 100)}%`
                                : '0%'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <Badge className={getDifficultyBadgeColor('medium')}>Medium</Badge>
                            <div className="text-2xl font-semibold mt-2">
                              {testResult.difficultyBreakdown.medium.correct} / {testResult.difficultyBreakdown.medium.total}
                            </div>
                            <p className="text-sm text-gray-500">
                              {testResult.difficultyBreakdown.medium.total > 0 
                                ? `${Math.round((testResult.difficultyBreakdown.medium.correct / 
                                    testResult.difficultyBreakdown.medium.total) * 100)}%`
                                : '0%'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <Badge className={getDifficultyBadgeColor('hard')}>Hard</Badge>
                            <div className="text-2xl font-semibold mt-2">
                              {testResult.difficultyBreakdown.hard.correct} / {testResult.difficultyBreakdown.hard.total}
                            </div>
                            <p className="text-sm text-gray-500">
                              {testResult.difficultyBreakdown.hard.total > 0 
                                ? `${Math.round((testResult.difficultyBreakdown.hard.correct / 
                                    testResult.difficultyBreakdown.hard.total) * 100)}%`
                                : '0%'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Time metrics */}
                  {testResult.speedMetrics && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Time Metrics
                      </h3>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-sm text-gray-500">Average Time</p>
                              <p className="text-xl font-mono">
                                {testResult.speedMetrics.averageTimePerQuestion}s
                              </p>
                              <p className="text-xs text-gray-500">per question</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fastest</p>
                              <p className="text-xl font-mono">
                                {testResult.speedMetrics.fastestQuestion}s
                              </p>
                              <p className="text-xs text-gray-500">per question</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Slowest</p>
                              <p className="text-xl font-mono">
                                {testResult.speedMetrics.slowestQuestion}s
                              </p>
                              <p className="text-xs text-gray-500">per question</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Improvement Areas */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Areas for Improvement
                    </h3>
                    <Card>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {testResult.improvementAreas?.map((area, index) => (
                            <li key={index} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={returnToTests}>
              Return to Tests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
