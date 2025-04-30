
import { SubtopicData } from "@/context/JEEDataContext";

// Define the empty subtopic template
const emptySubtopic: SubtopicData = {
  notes: false,
  shortNotes: false,
  modules: false,
  ncert: false,
  pyqMains: false,
  pyqAdv: false,
  testMains: false,
  testAdv: false,
  tag: '',
  revisedMains: false,
  revisedAdv: false,
  remarks: ''
};

// Define the subject icons
export const subjectIcons = {
  Maths: '📐',
  Physics: '⚛️',
  Chemistry: '🧪',
  Dashboard: '📊'
};

// Define the chapter icons with enhanced visuals
export const chapterIcons: Record<string, string> = {
  // Mathematics icons
  'Basic of Mathematics': '🔢',
  'Quadratic Equation': '📉',
  'Complex Number': '💫',
  'Permutation Combination': '🔀',
  'Sequences and Series': '📚',
  'Binomial Theorem': '🌿',
  'Trigonometric Ratios & Identities': '📐',
  'Straight Lines': '📏',
  'Circle': '⭕',
  'Parabola': '🛝',
  'Ellipse': '🥚',
  'Hyperbola': '⚡',
  'Limits': '➡️',
  'Statistics': '📊',
  'Sets and Relations': '⊆',
  'Matrices': '🔲',
  'Determinants': '🎯',
  'Inverse Trigonometric Functions': '🔄',
  'Functions': '🧩',
  'Continuity and Differentiability': '🔍',
  'Differentiation': '📉',
  'Application of Derivatives': '🚀',
  'Indefinite Integration': '∫',
  'Definite Integration': '∬',
  'Area Under Curves': '📈',
  'Differential Equations': '🔣',
  'Vector Algebra': '↗️',
  'Three Dimensional Geometry': '🧊',
  'Probability': '🎲',
  
  // Physics icons
  'Mathematics in Physics': '🧮',
  'Units and Dimensions': '📏',
  'Motion In One Dimension': '➡️',
  'Motion In Two Dimensions': '↗️',
  'Laws of Motion': '🍎',
  'Work Power Energy': '⚡',
  'Center of Mass Momentum and Collision': '💥',
  'Rotational Motion': '🔄',
  'Gravitation': '🌍',
  'Mechanical Properties of Solids': '🧱',
  'Mechanical Properties of Fluids': '💧',
  'Thermal Properties of Matter': '🌡️',
  'Thermodynamics': '🔥',
  'Kinetic Theory of Gases': '💨',
  'Oscillations': '🏓',
  'Waves and Sound': '🎵',
  'Electrostatics': '⚡',
  'Capacitance': '🔋',
  'Current Electricity': '💡',
  'Magnetic Properties of Matter': '🧲',
  'Magnetic Effects of Current': '🔌',
  'Electromagnetic Induction': '🔄',
  'Alternating Current': '〰️',
  'Electromagnetic Waves': '📡',
  'Ray Optics': '🔍',
  'Wave Optics': '🌊',
  'Dual Nature of Matter': '🔆',
  'Atomic Physics': '⚛️',
  'Nuclear Physics': '☢️',
  'Semiconductors': '💻',
  'Experimental Physics': '🧪',
  
  // Chemistry icons
  'Some Basic Concepts of Chemistry': '🧪',
  'Structure of Atom': '⚛️',
  'Classification of Elements and Periodicity in Properties': '📋',
  'Chemical Bonding and Molecular Structure': '🔗',
  'Thermodynamics (C)': '♨️',
  'Chemical Equilibrium': '⚖️',
  'Ionic Equilibrium': '🧂',
  'Redox Reactions': '🔄',
  'p Block Elements (Group 13 & 14)': '📦',
  'General Organic Chemistry': '🧬',
  'Hydrocarbons': '⛽',
  'Solutions': '💉',
  'Electrochemistry': '⚡',
  'Chemical Kinetics': '⏱️',
  'p Block Elements (Group 15, 16, 17 & 18)': '📊',
  'd and f Block Elements': '🔶',
  'Coordination Compounds': '🌐',
  'Haloalkanes and Haloarenes': '🧪',
  'Alcohols Phenols and Ethers': '🍷',
  'Aldehydes and Ketones': '🍯',
  'Carboxylic Acid Derivatives': '🧴',
  'Amines': '🔬',
  'Biomolecules': '🧬',
  'Practical Chemistry': '⚗️'
};

// Define the JEE syllabus data structure
export const jeeSubjectData = {
  Maths: {
    'Basic of Mathematics': { ...emptySubtopic },
    'Quadratic Equation': { ...emptySubtopic },
    'Complex Number': { ...emptySubtopic },
    'Permutation Combination': { ...emptySubtopic },
    'Sequences and Series': { ...emptySubtopic },
    'Binomial Theorem': { ...emptySubtopic },
    'Trigonometric Ratios & Identities': { ...emptySubtopic },
    'Straight Lines': { ...emptySubtopic },
    'Circle': { ...emptySubtopic },
    'Parabola': { ...emptySubtopic },
    'Ellipse': { ...emptySubtopic },
    'Hyperbola': { ...emptySubtopic },
    'Limits': { ...emptySubtopic },
    'Statistics': { ...emptySubtopic },
    'Sets and Relations': { ...emptySubtopic },
    'Matrices': { ...emptySubtopic },
    'Determinants': { ...emptySubtopic },
    'Inverse Trigonometric Functions': { ...emptySubtopic },
    'Functions': { ...emptySubtopic },
    'Continuity and Differentiability': { ...emptySubtopic },
    'Differentiation': { ...emptySubtopic },
    'Application of Derivatives': { ...emptySubtopic },
    'Indefinite Integration': { ...emptySubtopic },
    'Definite Integration': { ...emptySubtopic },
    'Area Under Curves': { ...emptySubtopic },
    'Differential Equations': { ...emptySubtopic },
    'Vector Algebra': { ...emptySubtopic },
    'Three Dimensional Geometry': { ...emptySubtopic },
    'Probability': { ...emptySubtopic },
  },
  
  Physics: {
    'Mathematics in Physics': { ...emptySubtopic },
    'Units and Dimensions': { ...emptySubtopic },
    'Motion In One Dimension': { ...emptySubtopic },
    'Motion In Two Dimensions': { ...emptySubtopic },
    'Laws of Motion': { ...emptySubtopic },
    'Work Power Energy': { ...emptySubtopic },
    'Center of Mass Momentum and Collision': { ...emptySubtopic },
    'Rotational Motion': { ...emptySubtopic },
    'Gravitation': { ...emptySubtopic },
    'Mechanical Properties of Solids': { ...emptySubtopic },
    'Mechanical Properties of Fluids': { ...emptySubtopic },
    'Thermal Properties of Matter': { ...emptySubtopic },
    'Thermodynamics': { ...emptySubtopic },
    'Kinetic Theory of Gases': { ...emptySubtopic },
    'Oscillations': { ...emptySubtopic },
    'Waves and Sound': { ...emptySubtopic },
    'Electrostatics': { ...emptySubtopic },
    'Capacitance': { ...emptySubtopic },
    'Current Electricity': { ...emptySubtopic },
    'Magnetic Properties of Matter': { ...emptySubtopic },
    'Magnetic Effects of Current': { ...emptySubtopic },
    'Electromagnetic Induction': { ...emptySubtopic },
    'Alternating Current': { ...emptySubtopic },
    'Electromagnetic Waves': { ...emptySubtopic },
    'Ray Optics': { ...emptySubtopic },
    'Wave Optics': { ...emptySubtopic },
    'Dual Nature of Matter': { ...emptySubtopic },
    'Atomic Physics': { ...emptySubtopic },
    'Nuclear Physics': { ...emptySubtopic },
    'Semiconductors': { ...emptySubtopic },
    'Experimental Physics': { ...emptySubtopic },
  },
  
  Chemistry: {
    'Some Basic Concepts of Chemistry': { ...emptySubtopic },
    'Structure of Atom': { ...emptySubtopic },
    'Classification of Elements and Periodicity in Properties': { ...emptySubtopic },
    'Chemical Bonding and Molecular Structure': { ...emptySubtopic },
    'Thermodynamics (C)': { ...emptySubtopic },
    'Chemical Equilibrium': { ...emptySubtopic },
    'Ionic Equilibrium': { ...emptySubtopic },
    'Redox Reactions': { ...emptySubtopic },
    'p Block Elements (Group 13 & 14)': { ...emptySubtopic },
    'General Organic Chemistry': { ...emptySubtopic },
    'Hydrocarbons': { ...emptySubtopic },
    'Solutions': { ...emptySubtopic },
    'Electrochemistry': { ...emptySubtopic },
    'Chemical Kinetics': { ...emptySubtopic },
    'p Block Elements (Group 15, 16, 17 & 18)': { ...emptySubtopic },
    'd and f Block Elements': { ...emptySubtopic },
    'Coordination Compounds': { ...emptySubtopic },
    'Haloalkanes and Haloarenes': { ...emptySubtopic },
    'Alcohols Phenols and Ethers': { ...emptySubtopic },
    'Aldehydes and Ketones': { ...emptySubtopic },
    'Carboxylic Acid Derivatives': { ...emptySubtopic },
    'Amines': { ...emptySubtopic },
    'Biomolecules': { ...emptySubtopic },
    'Practical Chemistry': { ...emptySubtopic },
  }
};

// Organize chapters by categories for display in chapter detail view
export const categoryGroups = {
  learn: ['notes', 'shortNotes'],
  practice: ['modules', 'ncert', 'pyqMains', 'pyqAdv'],
  tests: ['testMains', 'testAdv'],
  revise: ['revisedMains', 'revisedAdv']
};

// User-friendly labels for each field
export const fieldLabels: Record<string, string> = {
  notes: 'Complete Notes',
  shortNotes: 'Short Notes/Formula Sheet',
  modules: 'Coaching Modules',
  ncert: 'NCERT Problems',
  pyqMains: 'Previous Year Questions - JEE Mains',
  pyqAdv: 'Previous Year Questions - JEE Advanced',
  testMains: 'Topic-wise Test - JEE Mains',
  testAdv: 'Topic-wise Test - JEE Advanced',
  revisedMains: 'Revised for JEE Mains',
  revisedAdv: 'Revised for JEE Advanced'
};

// Category labels with emojis
export const categoryLabels = {
  learn: '📚 LEARN',
  practice: '📝 PRACTICE',
  tests: '🧪 TESTS',
  revise: '🔄 REVISE'
};

// Category descriptions for tooltips
export const categoryDescriptions = {
  learn: 'How much theory/notes have you covered?',
  practice: 'Percentage of practice problems solved',
  tests: 'How many tests are complete?',
  revise: 'Revision sessions done'
};

// Study tools icons and names
export const studyTools = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Focus with timed study sessions',
    icon: '⏱️',
    category: 'productivity'
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Create and test yourself with flashcards',
    icon: '🗂️',
    category: 'revision'
  },
  {
    id: 'studyTimer',
    name: 'Study Timer',
    description: 'Track how long you study each subject',
    icon: '⏲️',
    category: 'productivity'
  },
  {
    id: 'noteTaker',
    name: 'Note Taker',
    description: 'Create and organize your notes',
    icon: '📝',
    category: 'organization'
  },
  {
    id: 'focusMode',
    name: 'Focus Mode',
    description: 'Eliminate distractions for deep work',
    icon: '🧠',
    category: 'productivity'
  },
  {
    id: 'goalTracker',
    name: 'Goal Tracker',
    description: 'Set academic goals and track progress',
    icon: '🎯',
    category: 'productivity'
  },
  {
    id: 'calculator',
    name: 'Scientific Calculator',
    description: 'Perform complex mathematical operations',
    icon: '🧮',
    category: 'tools'
  },
  {
    id: 'formulaSheet',
    name: 'Formula Sheet',
    description: 'Quick access to important formulas',
    icon: '📊',
    category: 'revision'
  },
  {
    id: 'pyqBank',
    name: 'PYQ Bank',
    description: 'Practice with previous year questions',
    icon: '📚',
    category: 'practice'
  },
  {
    id: 'conceptMap',
    name: 'Concept Map',
    description: 'Visualize connections between concepts',
    icon: '🔄',
    category: 'organization'
  },
  {
    id: 'weeklyPlanner',
    name: 'Weekly Planner',
    description: 'Create and manage study schedules',
    icon: '📅',
    category: 'organization'
  },
  {
    id: 'errorLog',
    name: 'Error Log',
    description: 'Track and learn from your mistakes',
    icon: '❌',
    category: 'practice'
  },
  {
    id: 'mockTest',
    name: 'Mock Tests',
    description: 'Practice with timed mock exams',
    icon: '📋',
    category: 'practice'
  },
  {
    id: 'revisionReminder',
    name: 'Revision Reminder',
    description: 'Schedule and get reminded to revise',
    icon: '🔔',
    category: 'revision'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Short guided breaks to refresh your mind',
    icon: '🧘',
    category: 'wellbeing'
  },
  {
    id: 'dailyQuiz',
    name: 'Daily Quiz',
    description: 'Start your day with a quick knowledge check',
    icon: '❓',
    category: 'practice'
  },
  {
    id: 'studyMusic',
    name: 'Study Music',
    description: 'Background music to enhance concentration',
    icon: '🎵',
    category: 'wellbeing'
  },
  {
    id: 'progressInsights',
    name: 'Progress Insights',
    description: 'Advanced analytics of your study habits',
    icon: '📈',
    category: 'productivity'
  },
  {
    id: 'bookmarkManager',
    name: 'Bookmark Manager',
    description: 'Save and organize useful resources',
    icon: '🔖',
    category: 'organization'
  },
  {
    id: 'eyeRestTimer',
    name: 'Eye Rest Timer',
    description: 'Remind yourself to take eye breaks',
    icon: '👁️',
    category: 'wellbeing'
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary Builder',
    description: 'Learn scientific terminology efficiently',
    icon: '🔤',
    category: 'tools'
  },
  {
    id: 'achievementBadges',
    name: 'Achievement Badges',
    description: 'Earn badges for study milestones',
    icon: '🏆',
    category: 'motivation'
  },
  {
    id: 'studyGroups',
    name: 'Study Groups',
    description: 'Find or create virtual study groups',
    icon: '👥',
    category: 'social'
  },
  {
    id: 'questionGenerator',
    name: 'Question Generator',
    description: 'Generate practice questions by topic',
    icon: '❔',
    category: 'practice'
  }
];

// Study metrics to track
export const studyMetrics = [
  { id: 'studyTime', name: 'Study Hours', icon: '⏰', category: 'time' },
  { id: 'topicsCovered', name: 'Topics Covered', icon: '📋', category: 'progress' },
  { id: 'questionsAttempted', name: 'Questions Attempted', icon: '❓', category: 'practice' },
  { id: 'accuracyRate', name: 'Accuracy Rate', icon: '🎯', category: 'performance' },
  { id: 'revisionCycles', name: 'Revision Cycles', icon: '🔄', category: 'revision' },
  { id: 'testScores', name: 'Test Scores', icon: '📊', category: 'performance' },
  { id: 'streakDays', name: 'Study Streak', icon: '🔥', category: 'consistency' },
  { id: 'focusRating', name: 'Focus Rating', icon: '🧠', category: 'quality' },
  { id: 'errorRate', name: 'Error Rate', icon: '❌', category: 'performance' },
  { id: 'solveSpeed', name: 'Solving Speed', icon: '⚡', category: 'efficiency' }
];
