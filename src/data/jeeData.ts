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

// Define the chapter icons
export const chapterIcons: Record<string, string> = {
  // Maths icons
  'Sets, Relations, and Functions': '🔢',
  'Complex Numbers': '💫',
  'Quadratic Equations': '📈',
  'Sequences and Series': '📚',
  'Permutations and Combinations': '🔄',
  'Binomial Theorem': '🌿',
  'Trigonometric Ratios and Identities': '📐',
  'Inverse Trigonometric Functions': '🔁',
  'Trigonometric Equations': '📊',
  'Limits and Continuity': '➡️',
  'Differentiation and Applications': '📉',
  'Integration and Applications': '∫',
  'Differential Equations': '🔣',
  'Straight Lines': '📏',
  'Circles': '⭕',
  'Conic Sections': '🔴',
  '3-D Geometry': '🧊',
  'Vectors': '↗️',
  'Probability': '🎲',
  'Statistics': '📊',
  
  // Physics icons
  'Motion in One Dimension': '➡️',
  'Motion in Two Dimensions': '↗️',
  'Newton\'s Laws of Motion': '🍎',
  'Work, Energy, and Power': '⚡',
  'Rotational Motion and Moment of Inertia': '🔄',
  'Gravitation': '🌍',
  'Fluid Mechanics': '💧',
  'Thermal Properties of Matter': '🌡️',
  'Thermodynamics': '🔥',
  'Calorimetry': '☕',
  'Electrostatics': '⚡',
  'Current Electricity': '💡',
  'Magnetic Effects of Current': '🧲',
  'Electromagnetic Induction and Alternating Currents': '⚡',
  'Ray Optics': '🔍',
  'Wave Optics': '🌊',
  'Dual Nature of Matter and Radiation': '🔆',
  'Atomic Structure in Physics': '⚛️', // Changed to avoid duplicate
  'Nuclear Physics': '☢️',
  'Semiconductor Physics': '💻',
  
  // Chemistry icons
  'Some Basic Concepts in Chemistry': '🧪',
  'States of Matter': '💨',
  'Atomic Structure in Chemistry': '⚛️', // Changed to avoid duplicate
  'Chemical Bonding': '🔗',
  'Thermodynamics in Chemistry': '🔥', // Changed to avoid duplicate
  'Chemical Equilibrium': '⚖️',
  'Redox Reactions': '🔄',
  'Chemical Kinetics': '⏱️',
  'Periodic Table and Periodicity': '📋',
  'Chemical Bonding and Molecular Structure': '🔗',
  'Coordination Compounds': '🌐',
  'p-Block, d-Block, and f-Block Elements': '📦',
  'Environmental Chemistry': '🌿',
  'Basic Principles and Techniques': '🧰',
  'Hydrocarbons': '⛽',
  'Haloalkanes and Haloarenes': '🧂',
  'Alcohols, Phenols, and Ethers': '🍷',
  'Aldehydes, Ketones, and Carboxylic Acids': '🍯',
  'Organic Compounds Containing Nitrogen': '🧬',
  'Biomolecules': '🧬',
  'Polymers': '🧵',
  'Chemistry in Everyday Life': '💊'
};

// Define the JEE syllabus data structure
export const jeeSubjectData = {
  Maths: {
    'Sets, Relations, and Functions': { ...emptySubtopic },
    'Complex Numbers': { ...emptySubtopic },
    'Quadratic Equations': { ...emptySubtopic },
    'Sequences and Series': { ...emptySubtopic },
    'Permutations and Combinations': { ...emptySubtopic },
    'Binomial Theorem': { ...emptySubtopic },
    'Trigonometric Ratios and Identities': { ...emptySubtopic },
    'Inverse Trigonometric Functions': { ...emptySubtopic },
    'Trigonometric Equations': { ...emptySubtopic },
    'Limits and Continuity': { ...emptySubtopic },
    'Differentiation and Applications': { ...emptySubtopic },
    'Integration and Applications': { ...emptySubtopic },
    'Differential Equations': { ...emptySubtopic },
    'Straight Lines': { ...emptySubtopic },
    'Circles': { ...emptySubtopic },
    'Conic Sections': { ...emptySubtopic },
    '3-D Geometry': { ...emptySubtopic },
    'Vectors': { ...emptySubtopic },
    'Probability': { ...emptySubtopic },
    'Statistics': { ...emptySubtopic },
  },
  
  Physics: {
    'Motion in One Dimension': { ...emptySubtopic },
    'Motion in Two Dimensions': { ...emptySubtopic },
    'Newton\'s Laws of Motion': { ...emptySubtopic },
    'Work, Energy, and Power': { ...emptySubtopic },
    'Rotational Motion and Moment of Inertia': { ...emptySubtopic },
    'Gravitation': { ...emptySubtopic },
    'Fluid Mechanics': { ...emptySubtopic },
    'Thermal Properties of Matter': { ...emptySubtopic },
    'Thermodynamics': { ...emptySubtopic },
    'Calorimetry': { ...emptySubtopic },
    'Electrostatics': { ...emptySubtopic },
    'Current Electricity': { ...emptySubtopic },
    'Magnetic Effects of Current': { ...emptySubtopic },
    'Electromagnetic Induction and Alternating Currents': { ...emptySubtopic },
    'Ray Optics': { ...emptySubtopic },
    'Wave Optics': { ...emptySubtopic },
    'Dual Nature of Matter and Radiation': { ...emptySubtopic },
    'Atomic Structure in Physics': { ...emptySubtopic }, // Changed to avoid duplicate
    'Nuclear Physics': { ...emptySubtopic },
    'Semiconductor Physics': { ...emptySubtopic },
  },
  
  Chemistry: {
    'Some Basic Concepts in Chemistry': { ...emptySubtopic },
    'States of Matter': { ...emptySubtopic },
    'Atomic Structure in Chemistry': { ...emptySubtopic }, // Changed to avoid duplicate
    'Chemical Bonding': { ...emptySubtopic },
    'Thermodynamics in Chemistry': { ...emptySubtopic }, // Changed to avoid duplicate
    'Chemical Equilibrium': { ...emptySubtopic },
    'Redox Reactions': { ...emptySubtopic },
    'Chemical Kinetics': { ...emptySubtopic },
    'Periodic Table and Periodicity': { ...emptySubtopic },
    'Chemical Bonding and Molecular Structure': { ...emptySubtopic },
    'Coordination Compounds': { ...emptySubtopic },
    'p-Block, d-Block, and f-Block Elements': { ...emptySubtopic },
    'Environmental Chemistry': { ...emptySubtopic },
    'Basic Principles and Techniques': { ...emptySubtopic },
    'Hydrocarbons': { ...emptySubtopic },
    'Haloalkanes and Haloarenes': { ...emptySubtopic },
    'Alcohols, Phenols, and Ethers': { ...emptySubtopic },
    'Aldehydes, Ketones, and Carboxylic Acids': { ...emptySubtopic },
    'Organic Compounds Containing Nitrogen': { ...emptySubtopic },
    'Biomolecules': { ...emptySubtopic },
    'Polymers': { ...emptySubtopic },
    'Chemistry in Everyday Life': { ...emptySubtopic },
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
