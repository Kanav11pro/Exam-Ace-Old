
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format, isSameDay, parseISO, addDays } from 'date-fns';
import { Check, X, Trophy, Clock, ShieldQuestion, ArrowRight, Star, History, RefreshCw, Sparkles } from 'lucide-react';

// Types
interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizAttempt {
  date: string; // ISO string
  subject: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
}

// Questions database
const mathsQuestions: Question[] = [
  {
    id: 'm1',
    subject: 'Maths',
    text: 'What is the derivative of f(x) = x²?',
    options: ['f\'(x) = x', 'f\'(x) = 2x', 'f\'(x) = 2', 'f\'(x) = x²'],
    correctAnswer: 1,
    explanation: 'The derivative of x² is 2x. This follows from the power rule: the derivative of x^n is n·x^(n-1).'
  },
  {
    id: 'm2',
    subject: 'Maths',
    text: 'What is the value of sin²θ + cos²θ for any real number θ?',
    options: ['0', '1', '2', 'It depends on the value of θ'],
    correctAnswer: 1,
    explanation: 'The Pythagorean identity sin²θ + cos²θ = 1 holds for all real values of θ.'
  },
  {
    id: 'm3',
    subject: 'Maths',
    text: 'The integral of 1/x is:',
    options: ['ln|x| + C', 'e^x + C', 'x ln(x) + C', '1/(x+1) + C'],
    correctAnswer: 0,
    explanation: 'The integral of 1/x is ln|x| + C, where C is the constant of integration.'
  },
  {
    id: 'm4',
    subject: 'Maths',
    text: 'What is the formula for the area of a circle?',
    options: ['πr', '2πr', 'πr²', '2πr²'],
    correctAnswer: 2,
    explanation: 'The area of a circle is πr², where r is the radius of the circle.'
  },
  {
    id: 'm5',
    subject: 'Maths',
    text: 'If f(x) = 3x² - 2x + 1, what is f\'(2)?',
    options: ['8', '10', '12', '14'],
    correctAnswer: 1,
    explanation: 'f\'(x) = 6x - 2. So f\'(2) = 6(2) - 2 = 12 - 2 = 10.'
  },
  {
    id: 'm6',
    subject: 'Maths',
    text: 'What is the value of log₁₀(100)?',
    options: ['1', '2', '10', '100'],
    correctAnswer: 1,
    explanation: 'log₁₀(100) = log₁₀(10²) = 2.'
  },
  {
    id: 'm7',
    subject: 'Maths',
    text: 'What is the sum of the interior angles of a triangle?',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswer: 1,
    explanation: 'The sum of the interior angles of a triangle is 180 degrees.'
  },
  {
    id: 'm8',
    subject: 'Maths',
    text: 'What is the value of sin(30°)?',
    options: ['0', '1/4', '1/2', '1'],
    correctAnswer: 2,
    explanation: 'sin(30°) = 1/2.'
  },
  {
    id: 'm9',
    subject: 'Maths',
    text: 'What is the slope of a horizontal line?',
    options: ['0', '1', 'Undefined', 'It depends on the line'],
    correctAnswer: 0,
    explanation: 'The slope of a horizontal line is 0 because there is no change in the y-coordinate as x changes.'
  },
  {
    id: 'm10',
    subject: 'Maths',
    text: 'What is the domain of the function f(x) = √x?',
    options: ['All real numbers', 'All non-negative real numbers', 'All positive real numbers', 'All integers'],
    correctAnswer: 1,
    explanation: 'The domain of f(x) = √x is all non-negative real numbers, i.e., x ≥ 0, since the square root of a negative number is not a real number.'
  },
  {
    id: 'm11',
    subject: 'Maths',
    text: 'If a and b are positive real numbers, then log(ab) = ?',
    options: ['log(a) + log(b)', 'log(a) - log(b)', 'log(a) × log(b)', 'log(a) / log(b)'],
    correctAnswer: 0,
    explanation: 'By the logarithm product rule, log(ab) = log(a) + log(b).'
  },
  {
    id: 'm12',
    subject: 'Maths',
    text: 'The equation of a circle with center (h, k) and radius r is:',
    options: ['(x - h)² + (y - k)² = r', '(x - h)² + (y - k)² = r²', '(x + h)² + (y + k)² = r²', 'x² + y² = r²'],
    correctAnswer: 1,
    explanation: 'The equation of a circle with center (h, k) and radius r is (x - h)² + (y - k)² = r².'
  },
  {
    id: 'm13',
    subject: 'Maths',
    text: 'What is the solution to x² - 5x + 6 = 0?',
    options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 2, x = -3', 'x = -2, x = 3'],
    correctAnswer: 0,
    explanation: 'Using the quadratic formula or factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3.'
  },
];

const physicsQuestions: Question[] = [
  {
    id: 'p1',
    subject: 'Physics',
    text: 'What is Newton\'s Second Law of Motion?',
    options: ['F = ma', 'E = mc²', 'For every action, there is an equal and opposite reaction', 'Objects in motion stay in motion'],
    correctAnswer: 0,
    explanation: 'Newton\'s Second Law states that the force acting on an object is equal to the mass of the object multiplied by its acceleration (F = ma).'
  },
  {
    id: 'p2',
    subject: 'Physics',
    text: 'What is the SI unit of electric current?',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    correctAnswer: 1,
    explanation: 'The SI unit of electric current is the ampere (A).'
  },
  {
    id: 'p3',
    subject: 'Physics',
    text: 'Which of the following is NOT a vector quantity?',
    options: ['Force', 'Velocity', 'Mass', 'Acceleration'],
    correctAnswer: 2,
    explanation: 'Mass is a scalar quantity as it has only magnitude but no direction. Force, velocity, and acceleration are all vector quantities.'
  },
  {
    id: 'p4',
    subject: 'Physics',
    text: 'What is the formula for kinetic energy?',
    options: ['KE = mgh', 'KE = ½mv²', 'KE = Fd', 'KE = mv'],
    correctAnswer: 1,
    explanation: 'The kinetic energy of an object is given by KE = ½mv², where m is the mass and v is the velocity.'
  },
  {
    id: 'p5',
    subject: 'Physics',
    text: 'What is the principle of conservation of energy?',
    options: [
      'Energy cannot be created or destroyed, only transformed',
      'Energy is always conserved in closed systems',
      'The total energy of an isolated system remains constant',
      'All of the above'
    ],
    correctAnswer: 3,
    explanation: 'The principle of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another. The total energy of an isolated system remains constant.'
  },
  {
    id: 'p6',
    subject: 'Physics',
    text: 'Which of the following is a correct statement of Ohm\'s Law?',
    options: ['V = IR', 'I = VR', 'R = VI', 'V = I/R'],
    correctAnswer: 0,
    explanation: 'Ohm\'s Law states that the current through a conductor between two points is directly proportional to the voltage across the two points. The formula is V = IR, where V is voltage, I is current, and R is resistance.'
  },
  {
    id: 'p7',
    subject: 'Physics',
    text: 'What is the period of a simple pendulum that is 1 meter long? (g = 9.8 m/s²)',
    options: ['1 s', '2 s', '3 s', '4 s'],
    correctAnswer: 1,
    explanation: 'The period of a simple pendulum is given by T = 2π√(L/g). For L = 1 m and g = 9.8 m/s², T = 2π√(1/9.8) ≈ 2 seconds.'
  },
  {
    id: 'p8',
    subject: 'Physics',
    text: 'Which of these particles has a positive charge?',
    options: ['Electron', 'Proton', 'Neutron', 'Photon'],
    correctAnswer: 1,
    explanation: 'Protons have a positive charge, electrons have a negative charge, neutrons have no charge, and photons are also electrically neutral.'
  },
  {
    id: 'p9',
    subject: 'Physics',
    text: 'What is the wavelength of light with a frequency of 5 × 10¹⁴ Hz? (Speed of light = 3 × 10⁸ m/s)',
    options: ['6 × 10⁻⁷ m', '6 × 10⁻⁸ m', '6 × 10⁻⁶ m', '6 × 10⁻⁵ m'],
    correctAnswer: 0,
    explanation: 'Using the formula c = λf, where c is the speed of light, λ is wavelength, and f is frequency: λ = c/f = (3 × 10⁸)/(5 × 10¹⁴) = 6 × 10⁻⁷ m = 600 nm.'
  },
  {
    id: 'p10',
    subject: 'Physics',
    text: 'Which law of thermodynamics states that energy cannot be created or destroyed?',
    options: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'],
    correctAnswer: 1,
    explanation: 'The First Law of Thermodynamics, also known as the Law of Conservation of Energy, states that energy cannot be created or destroyed, only transferred or converted from one form to another.'
  },
  {
    id: 'p11',
    subject: 'Physics',
    text: 'Which of these is NOT a fundamental force in nature?',
    options: ['Gravitational force', 'Electromagnetic force', 'Strong nuclear force', 'Centrifugal force'],
    correctAnswer: 3,
    explanation: 'Centrifugal force is a fictitious force, not a fundamental force. The four fundamental forces in nature are gravitational, electromagnetic, strong nuclear, and weak nuclear forces.'
  },
  {
    id: 'p12',
    subject: 'Physics',
    text: 'What is the relationship between frequency (f) and period (T) of a wave?',
    options: ['f = T', 'f = 1/T', 'f = T²', 'f = √T'],
    correctAnswer: 1,
    explanation: 'The frequency and period of a wave are inversely related: f = 1/T.'
  },
  {
    id: 'p13',
    subject: 'Physics',
    text: 'What is the acceleration due to gravity on Earth\'s surface?',
    options: ['5.6 m/s²', '7.8 m/s²', '9.8 m/s²', '11.2 m/s²'],
    correctAnswer: 2,
    explanation: 'The acceleration due to gravity on Earth\'s surface is approximately 9.8 m/s² (or 9.81 m/s²).'
  },
];

const chemistryQuestions: Question[] = [
  {
    id: 'c1',
    subject: 'Chemistry',
    text: 'What is the chemical formula for water?',
    options: ['H₂O', 'CO₂', 'NaCl', 'CH₄'],
    correctAnswer: 0,
    explanation: 'Water has the chemical formula H₂O, meaning it consists of two hydrogen atoms and one oxygen atom.'
  },
  {
    id: 'c2',
    subject: 'Chemistry',
    text: 'Which of the following is an alkali metal?',
    options: ['Calcium', 'Aluminum', 'Sodium', 'Carbon'],
    correctAnswer: 2,
    explanation: 'Sodium (Na) is an alkali metal, belonging to Group 1 of the periodic table.'
  },
  {
    id: 'c3',
    subject: 'Chemistry',
    text: 'What is the pH of a neutral solution at 25°C?',
    options: ['0', '7', '14', '1'],
    correctAnswer: 1,
    explanation: 'At 25°C, a neutral solution has a pH of 7. Solutions with pH < 7 are acidic, and solutions with pH > 7 are basic/alkaline.'
  },
  {
    id: 'c4',
    subject: 'Chemistry',
    text: 'Which subatomic particle has a positive charge?',
    options: ['Electron', 'Proton', 'Neutron', 'Photon'],
    correctAnswer: 1,
    explanation: 'Protons have a positive charge, electrons have a negative charge, and neutrons have no electrical charge.'
  },
  {
    id: 'c5',
    subject: 'Chemistry',
    text: 'What is the main component of natural gas?',
    options: ['Methane', 'Ethane', 'Propane', 'Butane'],
    correctAnswer: 0,
    explanation: 'The main component of natural gas is methane (CH₄).'
  },
  {
    id: 'c6',
    subject: 'Chemistry',
    text: 'Which type of bond involves the sharing of electrons?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswer: 1,
    explanation: 'A covalent bond involves the sharing of electron pairs between atoms.'
  },
  {
    id: 'c7',
    subject: 'Chemistry',
    text: 'What is the atomic number of carbon?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    explanation: 'Carbon has an atomic number of 6, which means it has 6 protons in its nucleus.'
  },
  {
    id: 'c8',
    subject: 'Chemistry',
    text: 'Which of these is NOT a state of matter?',
    options: ['Solid', 'Liquid', 'Gas', 'Energy'],
    correctAnswer: 3,
    explanation: 'Energy is not a state of matter. The states of matter include solid, liquid, gas, and plasma (and some other less common states).'
  },
  {
    id: 'c9',
    subject: 'Chemistry',
    text: 'What is the chemical formula for table salt?',
    options: ['NaCl', 'H₂O', 'CO₂', 'C₆H₁₂O₆'],
    correctAnswer: 0,
    explanation: 'Table salt (sodium chloride) has the chemical formula NaCl.'
  },
  {
    id: 'c10',
    subject: 'Chemistry',
    text: 'Which of the following is a noble gas?',
    options: ['Oxygen', 'Chlorine', 'Helium', 'Nitrogen'],
    correctAnswer: 2,
    explanation: 'Helium (He) is a noble gas, belonging to Group 18 of the periodic table.'
  },
  {
    id: 'c11',
    subject: 'Chemistry',
    text: 'What is the formula for sulfuric acid?',
    options: ['H₂SO₃', 'H₂SO₄', 'HNO₃', 'HCl'],
    correctAnswer: 1,
    explanation: 'Sulfuric acid has the chemical formula H₂SO₄.'
  },
  {
    id: 'c12',
    subject: 'Chemistry',
    text: 'Which of these elements has the highest electronegativity?',
    options: ['Sodium', 'Carbon', 'Oxygen', 'Fluorine'],
    correctAnswer: 3,
    explanation: 'Fluorine (F) has the highest electronegativity of all elements on the periodic table.'
  },
  {
    id: 'c13',
    subject: 'Chemistry',
    text: 'What type of reaction occurs when two or more substances combine to form a new compound?',
    options: ['Decomposition reaction', 'Single replacement reaction', 'Double replacement reaction', 'Synthesis reaction'],
    correctAnswer: 3,
    explanation: 'A synthesis reaction (also called a combination reaction) occurs when two or more substances combine to form a new compound.'
  },
];

const allQuestions = [...mathsQuestions, ...physicsQuestions, ...chemistryQuestions];

export function DailyQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizSubject, setQuizSubject] = useState<string>('all');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [quizEndTime, setQuizEndTime] = useState<Date | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canTakeDailyQuiz, setCanTakeDailyQuiz] = useState(true);
  const [todayAttempt, setTodayAttempt] = useState<QuizAttempt | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  
  const { toast } = useToast();
  
  // Load previous attempts from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('jeeDailyQuizAttempts');
    if (savedAttempts) {
      try {
        const attempts: QuizAttempt[] = JSON.parse(savedAttempts);
        setPreviousAttempts(attempts);
        
        // Check if there's an attempt for today
        const today = new Date().toISOString().split('T')[0];
        const todaysAttempt = attempts.find(attempt => {
          const attemptDate = parseISO(attempt.date).toISOString().split('T')[0];
          return attemptDate === today;
        });
        
        if (todaysAttempt) {
          setTodayAttempt(todaysAttempt);
          setCanTakeDailyQuiz(false);
        }
      } catch (e) {
        console.error('Error loading quiz attempts:', e);
      }
    }
  }, []);
  
  // Generate daily quiz questions
  const generateQuiz = () => {
    let availableQuestions = [...allQuestions];
    
    if (quizSubject !== 'all') {
      availableQuestions = availableQuestions.filter(q => q.subject === quizSubject);
    }
    
    // Shuffle questions
    availableQuestions = shuffleArray(availableQuestions);
    
    // Take 10 questions for the quiz
    const selectedQuestions = availableQuestions.slice(0, 10);
    setQuizQuestions(selectedQuestions);
    setUserAnswers(Array(selectedQuestions.length).fill(null));
  };
  
  // Start the quiz
  const startQuiz = () => {
    generateQuiz();
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setQuizStartTime(new Date());
    setQuizEndTime(null);
  };
  
  // Submit answer for the current question
  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Update user answers
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);
  };
  
  // Move to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const endTime = new Date();
      setQuizEndTime(endTime);
      setQuizComplete(true);
      
      // Save attempt
      if (quizStartTime) {
        const timeSpent = Math.floor((endTime.getTime() - quizStartTime.getTime()) / 1000);
        const newAttempt: QuizAttempt = {
          date: new Date().toISOString(),
          subject: quizSubject,
          score,
          totalQuestions: quizQuestions.length,
          timeSpent
        };
        
        const updatedAttempts = [...previousAttempts, newAttempt];
        setPreviousAttempts(updatedAttempts);
        localStorage.setItem('jeeDailyQuizAttempts', JSON.stringify(updatedAttempts));
        
        // If this was the daily quiz, set today's attempt
        if (canTakeDailyQuiz) {
          setTodayAttempt(newAttempt);
          setCanTakeDailyQuiz(false);
        }
      }
      
      setShowResultDialog(true);
    }
  };
  
  // Calculate time spent on quiz
  const getTimeSpent = () => {
    if (!quizStartTime || !quizEndTime) return 0;
    return Math.floor((quizEndTime.getTime() - quizStartTime.getTime()) / 1000);
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Return to home screen
  const returnToHome = () => {
    setQuizStarted(false);
    setShowResultDialog(false);
  };
  
  // Helper function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Get a streak message based on score
  const getStreakMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Excellent! You're mastering the material!";
    if (percentage >= 70) return "Good job! Keep practicing!";
    if (percentage >= 50) return "Nice effort! Review the topics you missed.";
    return "Keep studying, you'll improve with practice!";
  };
  
  // Get progress color based on score
  const getProgressColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };
  
  // Get subject badge color
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
    <div className="container max-w-4xl py-6">
      {!quizStarted ? (
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Daily Quiz</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Test your knowledge with 10 new questions every day
            </p>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldQuestion className="h-5 w-5 mr-2" />
                Take Today's Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canTakeDailyQuiz ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Ready to test your JEE preparation? Take the daily quiz to keep your knowledge sharp.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quiz-subject">Select Subject</Label>
                    <Select
                      value={quizSubject}
                      onValueChange={setQuizSubject}
                    >
                      <SelectTrigger id="quiz-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="Maths">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-lg font-medium">Today's Quiz Completed!</h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Score:</span>
                      <span className="font-medium">{todayAttempt?.score}/{todayAttempt?.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Subject:</span>
                      <span className="font-medium">{todayAttempt?.subject === 'all' ? 'All Subjects' : todayAttempt?.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{formatTime(todayAttempt?.timeSpent || 0)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You've already taken today's quiz. Come back tomorrow for a new set of questions!
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {canTakeDailyQuiz && (
                <Button className="w-full" onClick={startQuiz}>
                  Start Daily Quiz
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Practice Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Want more practice? Take an additional quiz anytime.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="practice-subject">Select Subject</Label>
                <Select
                  value={quizSubject}
                  onValueChange={setQuizSubject}
                >
                  <SelectTrigger id="practice-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Maths">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={startQuiz}>
                Start Practice Quiz
              </Button>
            </CardFooter>
          </Card>
          
          {previousAttempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Previous Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousAttempts.slice(-5).reverse().map((attempt, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(parseISO(attempt.date), 'MMM d, yyyy')}
                          </span>
                          <Badge className={getSubjectColor(attempt.subject)}>
                            {attempt.subject === 'all' ? 'All' : attempt.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{attempt.score}/{attempt.totalQuestions}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTime(attempt.timeSpent)}</span>
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <div className="text-lg font-bold">
                          {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Quiz in progress
        <div>
          {!quizComplete ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Badge className={getSubjectColor(quizQuestions[currentQuestionIndex]?.subject || 'all')}>
                    {quizQuestions[currentQuestionIndex]?.subject || 'Quiz'}
                  </Badge>
                </div>
                <div className="text-sm">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </div>
              </div>
              
              <Progress
                value={((currentQuestionIndex) / quizQuestions.length) * 100}
                className="h-2 mb-6"
              />
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-6">
                    {quizQuestions[currentQuestionIndex]?.text}
                  </h2>
                  
                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                    className="space-y-3"
                    disabled={isAnswered}
                  >
                    {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center space-x-2 border p-3 rounded-lg ${
                          isAnswered && index === quizQuestions[currentQuestionIndex].correctAnswer
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                            : isAnswered && index === selectedAnswer && index !== quizQuestions[currentQuestionIndex].correctAnswer
                              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                              : ''
                        }`}
                      >
                        <RadioGroupItem 
                          value={index.toString()} 
                          id={`option-${index}`} 
                          className="mr-2"
                        />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                        {isAnswered && index === quizQuestions[currentQuestionIndex].correctAnswer && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        {isAnswered && index === selectedAnswer && index !== quizQuestions[currentQuestionIndex].correctAnswer && (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {isAnswered && showExplanation && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-medium mb-1">Explanation:</h4>
                      <p className="text-sm">
                        {quizQuestions[currentQuestionIndex]?.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  {!isAnswered ? (
                    <Button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <div className="w-full flex justify-between gap-2">
                      {!showExplanation && (
                        <Button
                          variant="outline"
                          onClick={() => setShowExplanation(true)}
                        >
                          Show Explanation
                        </Button>
                      )}
                      <Button
                        onClick={nextQuestion}
                        className={!showExplanation ? "ml-auto" : "w-full"}
                      >
                        {currentQuestionIndex < quizQuestions.length - 1 ? (
                          <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                        ) : (
                          'Finish Quiz'
                        )}
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                    Quiz Results
                  </DialogTitle>
                  <DialogDescription>
                    Here's how you did on the quiz!
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-gray-800 flex items-center justify-center relative">
                      <div className="text-3xl font-bold">
                        {score}/{quizQuestions.length}
                      </div>
                      <svg className="absolute inset-0" viewBox="0 0 100 100">
                        <circle 
                          className="text-gray-200 dark:text-gray-700" 
                          strokeWidth="8" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="42" 
                          cx="50" 
                          cy="50" 
                        />
                        <circle 
                          className="text-primary" 
                          strokeWidth="8" 
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * score) / quizQuestions.length} 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="42" 
                          cx="50" 
                          cy="50" 
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-center font-medium">
                    {getStreakMessage(score, quizQuestions.length)}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time taken:</span>
                      <span className="font-medium">{formatTime(getTimeSpent())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Subject:</span>
                      <span className="font-medium">{quizSubject === 'all' ? 'All Subjects' : quizSubject}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-medium">{Math.round((score / quizQuestions.length) * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={returnToHome}>
                    Return to Home
                  </Button>
                  <Button onClick={() => {
                    setShowResultDialog(false);
                    startQuiz();
                  }}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
