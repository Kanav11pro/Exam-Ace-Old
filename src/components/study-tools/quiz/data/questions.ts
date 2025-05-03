
import { Question } from '../types';

// Mathematics questions
export const mathsQuestions: Question[] = [
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

export const physicsQuestions: Question[] = [
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

export const chemistryQuestions: Question[] = [
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

export const allQuestions = [...mathsQuestions, ...physicsQuestions, ...chemistryQuestions];
