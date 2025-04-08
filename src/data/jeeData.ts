
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
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏱️', description: 'Focus with timed intervals' },
  { id: 'flashcards', name: 'Flashcards', icon: '🃏', description: 'Quick revision cards' },
  { id: 'notes', name: 'Smart Notes', icon: '📝', description: 'Organize your notes' },
  { id: 'mindmap', name: 'Mind Mapping', icon: '🧠', description: 'Visualize concepts' },
  { id: 'calendar', name: 'Study Calendar', icon: '📅', description: 'Plan your schedule' },
  { id: 'goals', name: 'Goal Setting', icon: '🎯', description: 'Track your targets' },
  { id: 'formula', name: 'Formula Bank', icon: '∑', description: 'Quick formula reference' },
  { id: 'errorlog', name: 'Error Log', icon: '❌', description: 'Track and learn from mistakes' },
  { id: 'mocktest', name: 'Mock Test', icon: '📝', description: 'Full-length practice exams' },
  { id: 'focus', name: 'Focus Mode', icon: '🧘', description: 'Distraction-free studying' },
  { id: 'analytics', name: 'Study Analytics', icon: '📊', description: 'Analyze your performance' },
  { id: 'bookmark', name: 'Bookmarks', icon: '🔖', description: 'Save important topics' },
  { id: 'dictionary', name: 'Quick Dictionary', icon: '📔', description: 'Look up definitions' },
  { id: 'calculator', name: 'Scientific Calculator', icon: '🔢', description: 'Solve complex equations' },
  { id: 'companion', name: 'AI Study Companion', icon: '🤖', description: 'Get smart assistance' },
  { id: 'voice', name: 'Voice Notes', icon: '🎤', description: 'Record your thoughts' },
  { id: 'whiteboard', name: 'Digital Whiteboard', icon: '🖊️', description: 'Visual explanations' },
  { id: 'resources', name: 'Resource Library', icon: '📚', description: 'Curated study materials' },
  { id: 'habit', name: 'Habit Tracker', icon: '📈', description: 'Build study habits' },
  { id: 'motivation', name: 'Motivation Quotes', icon: '💪', description: 'Stay inspired daily' },
  { id: 'community', name: 'Study Community', icon: '👥', description: 'Connect with peers' },
  { id: 'revision', name: 'Spaced Revision', icon: '🔁', description: 'Optimal revision scheduling' }
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
