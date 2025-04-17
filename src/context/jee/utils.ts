
import { JEESubjects, SubtopicData } from './types';
import { jeeSubjectData, categoryGroups } from '@/data/jeeData';

// Load data from localStorage or use default
export const loadJEEData = () => {
  const savedData = localStorage.getItem('jeeData');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Error parsing JEE data from localStorage:', error);
      return jeeSubjectData;
    }
  }
  return jeeSubjectData;
};

// Save data to localStorage
export const saveJEEData = (data: JEESubjects) => {
  localStorage.setItem('jeeData', JSON.stringify(data));
};

// Load weak chapters from localStorage
export const loadWeakChapters = () => {
  const savedWeakChapters = localStorage.getItem('weakChapters');
  if (savedWeakChapters) {
    try {
      const parsed = JSON.parse(savedWeakChapters);
      
      // Handle legacy format: convert string[] to proper object array if needed
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === 'string') {
          // Convert old format to new format
          return parsed.map((chapter: string) => ({
            subject: 'Unknown',  // Default subject for legacy data
            chapter
          }));
        }
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error parsing weak chapters from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Save weak chapters to localStorage
export const saveWeakChapters = (weakChapters: Array<{subject: string; chapter: string}>) => {
  localStorage.setItem('weakChapters', JSON.stringify(weakChapters));
};

// Calculate progress percentage for a subject
export const calculateSubjectProgress = (subject: string, data: JEESubjects) => {
  const chapters = Object.keys(data[subject] || {});
  if (chapters.length === 0) return 0;
  
  const chapterProgress = chapters.map(chapter => calculateChapterProgress(subject, chapter, data));
  return chapterProgress.reduce((sum, progress) => sum + progress, 0) / chapters.length;
};

// Calculate progress percentage for a chapter
export const calculateChapterProgress = (subject: string, chapter: string, data: JEESubjects) => {
  const subtopic = data[subject]?.[chapter];
  if (!subtopic) return 0;
  
  const booleanFields = Object.entries(subtopic).filter(
    ([key, value]) => typeof value === 'boolean' && key !== 'revisedMains' && key !== 'revisedAdv'
  );
  
  if (booleanFields.length === 0) return 0;
  
  const completedFields = booleanFields.filter(([, value]) => value).length;
  return (completedFields / booleanFields.length) * 100;
};

// Calculate progress percentage for a category within a chapter
export const calculateCategoryProgress = (subject: string, chapter: string, category: string, data: JEESubjects) => {
  if (!categoryGroups[category]) return 0;
  
  const subtopic = data[subject]?.[chapter];
  if (!subtopic) return 0;
  
  const categoryFields = categoryGroups[category];
  const completedFields = categoryFields.filter(field => subtopic[field as keyof SubtopicData] === true).length;
  
  return categoryFields.length > 0 ? (completedFields / categoryFields.length) * 100 : 0;
};

// Calculate total progress across all subjects
export const calculateTotalProgress = (data: JEESubjects) => {
  const subjects = Object.keys(data);
  if (subjects.length === 0) return 0;
  
  const subjectProgress = subjects.map(subject => calculateSubjectProgress(subject, data));
  return subjectProgress.reduce((sum, progress) => sum + progress, 0) / subjects.length;
};
