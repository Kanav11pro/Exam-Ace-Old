
import React, { createContext, useContext, useState, useEffect } from 'react';
import { JEEDataContextType, JEEDataState, JEESubjects } from './types';
import { 
  loadJEEData, 
  saveJEEData, 
  loadWeakChapters, 
  saveWeakChapters,
  calculateSubjectProgress,
  calculateChapterProgress,
  calculateCategoryProgress,
  calculateTotalProgress
} from './utils';
import { categoryGroups } from '@/data/jeeData';

// Create the context
const JEEDataContext = createContext<JEEDataContextType | undefined>(undefined);

// Provider component
export const JEEDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jeeData, setJeeData] = useState<JEEDataState>({
    subjects: loadJEEData(),
    weakChapters: loadWeakChapters(),
  });

  useEffect(() => {
    // Load data on mount
    setJeeData({
      subjects: loadJEEData(),
      weakChapters: loadWeakChapters(),
    });
  }, []);

  // Update chapter data
  const updateChapterData = (subject: string, chapter: string, key: string, value: boolean | string) => {
    setJeeData(prevData => {
      const newSubjects = { ...prevData.subjects };
      
      if (newSubjects[subject] && newSubjects[subject][chapter]) {
        newSubjects[subject][chapter] = {
          ...newSubjects[subject][chapter],
          [key]: value,
        };
        
        // Save to localStorage
        saveJEEData(newSubjects);
        return { ...prevData, subjects: newSubjects };
      }
      
      return prevData;
    });
  };

  // Get progress by subject
  const getProgressBySubject = (subject: string) => {
    return calculateSubjectProgress(subject, jeeData.subjects);
  };

  // Get progress by chapter
  const getProgressByChapter = (subject: string, chapter: string) => {
    return calculateChapterProgress(subject, chapter, jeeData.subjects);
  };

  // Get progress by category
  const getProgressByCategory = (subject: string, chapter: string, category: string) => {
    return calculateCategoryProgress(subject, chapter, category, jeeData.subjects);
  };

  // Get weak chapters
  const getWeakChapters = () => {
    return jeeData.weakChapters;
  };

  // Update weak chapters
  const updateWeakChapters = (chapters: string[]) => {
    setJeeData(prevData => {
      saveWeakChapters(chapters);
      return { ...prevData, weakChapters: chapters };
    });
  };

  // Get total progress
  const getTotalProgress = () => {
    return calculateTotalProgress(jeeData.subjects);
  };

  // Reset data
  const resetData = () => {
    setJeeData({
      subjects: loadJEEData(),
      weakChapters: [],
    });
    saveWeakChapters([]);
  };

  const contextValue: JEEDataContextType = {
    jeeData,
    updateChapterData,
    getProgressBySubject,
    getProgressByChapter,
    getProgressByCategory,
    getWeakChapters,
    updateWeakChapters,
    getTotalProgress,
    resetData,
  };

  return (
    <JEEDataContext.Provider value={contextValue}>
      {children}
    </JEEDataContext.Provider>
  );
};

// Custom hook to use the context
export const useJEEData = () => {
  const context = useContext(JEEDataContext);
  if (context === undefined) {
    throw new Error('useJEEData must be used within a JEEDataProvider');
  }
  return context;
};

export default JEEDataContext;
