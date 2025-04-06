
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jeeSubjectData } from '@/data/jeeData';

// Define the structure of our study data
export type SubtopicData = {
  notes: boolean;
  shortNotes: boolean;
  modules: boolean;
  ncert: boolean;
  pyqMains: boolean;
  pyqAdv: boolean;
  testMains: boolean;
  testAdv: boolean;
  tag: '' | 'Weak' | 'Medium' | 'Strong';
  revisedMains: boolean;
  revisedAdv: boolean;
  remarks: string;
};

export type JEEStudyData = {
  [subject: string]: {
    [chapter: string]: SubtopicData;
  };
};

export type JEEDataContextType = {
  studyData: JEEStudyData;
  updateChapterData: (subject: string, chapter: string, newData: Partial<SubtopicData>) => void;
  getChapterProgress: (subject: string, chapter: string) => number;
  getSubjectProgress: (subject: string) => number;
  getCategoryProgress: (subject: string, chapter: string, category: 'learn' | 'practice' | 'tests' | 'revise') => number;
  getTotalProgress: () => number;
  resetChapter: (subject: string, chapter: string) => void;
  markChapterComplete: (subject: string, chapter: string) => void;
  getWeakChapters: () => Array<{ subject: string; chapter: string }>;
};

const STUDY_DATA_KEY = 'jeeStudyData';
const STUDY_DATA_VERSION = 'v1.0.0';

const JEEDataContext = createContext<JEEDataContextType | undefined>(undefined);

export const JEEDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studyData, setStudyData] = useState<JEEStudyData>(() => {
    // Try to get data from localStorage
    const storedData = localStorage.getItem(STUDY_DATA_KEY);
    const storedVersion = localStorage.getItem('studyTrackerVersion');
    
    // If version mismatch or no data, initialize with default data
    if (!storedData || storedVersion !== STUDY_DATA_VERSION) {
      // Initialize with default structure based on our syllabus
      return jeeSubjectData;
    }
    
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Error parsing stored data:', e);
      return jeeSubjectData;
    }
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STUDY_DATA_KEY, JSON.stringify(studyData));
    localStorage.setItem('studyTrackerVersion', STUDY_DATA_VERSION);
  }, [studyData]);

  // Update chapter data
  const updateChapterData = (subject: string, chapter: string, newData: Partial<SubtopicData>) => {
    setStudyData(prevData => ({
      ...prevData,
      [subject]: {
        ...prevData[subject],
        [chapter]: {
          ...prevData[subject][chapter],
          ...newData
        }
      }
    }));
  };

  // Calculate progress for a specific chapter
  const getChapterProgress = (subject: string, chapter: string): number => {
    const chapterData = studyData[subject]?.[chapter];
    if (!chapterData) return 0;
    
    // Count boolean properties that are true
    const totalFields = 10; // all boolean fields except tag and remarks
    const completedFields = [
      chapterData.notes,
      chapterData.shortNotes,
      chapterData.modules,
      chapterData.ncert,
      chapterData.pyqMains,
      chapterData.pyqAdv,
      chapterData.testMains,
      chapterData.testAdv,
      chapterData.revisedMains,
      chapterData.revisedAdv,
    ].filter(Boolean).length;
    
    return (completedFields / totalFields) * 100;
  };

  // Calculate progress for a subject
  const getSubjectProgress = (subject: string): number => {
    const chapters = Object.keys(studyData[subject] || {});
    if (chapters.length === 0) return 0;
    
    const totalProgress = chapters.reduce(
      (sum, chapter) => sum + getChapterProgress(subject, chapter),
      0
    );
    
    return totalProgress / chapters.length;
  };

  // Calculate progress for a specific category in a chapter
  const getCategoryProgress = (
    subject: string, 
    chapter: string, 
    category: 'learn' | 'practice' | 'tests' | 'revise'
  ): number => {
    const chapterData = studyData[subject]?.[chapter];
    if (!chapterData) return 0;
    
    let fields: boolean[] = [];
    let totalFields = 0;
    
    if (category === 'learn') {
      fields = [chapterData.notes, chapterData.shortNotes];
      totalFields = 2;
    } else if (category === 'practice') {
      fields = [chapterData.modules, chapterData.ncert];
      totalFields = 2;
    } else if (category === 'tests') {
      fields = [chapterData.pyqMains, chapterData.pyqAdv, chapterData.testMains, chapterData.testAdv];
      totalFields = 4;
    } else if (category === 'revise') {
      fields = [chapterData.revisedMains, chapterData.revisedAdv];
      totalFields = 2;
    }
    
    const completedFields = fields.filter(Boolean).length;
    return (completedFields / totalFields) * 100;
  };

  // Calculate overall progress across all subjects
  const getTotalProgress = (): number => {
    const subjects = Object.keys(studyData);
    if (subjects.length === 0) return 0;
    
    const totalProgress = subjects.reduce(
      (sum, subject) => sum + getSubjectProgress(subject),
      0
    );
    
    return totalProgress / subjects.length;
  };

  // Reset a chapter's progress
  const resetChapter = (subject: string, chapter: string) => {
    setStudyData(prevData => ({
      ...prevData,
      [subject]: {
        ...prevData[subject],
        [chapter]: {
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
        }
      }
    }));
  };

  // Mark a chapter as complete
  const markChapterComplete = (subject: string, chapter: string) => {
    setStudyData(prevData => ({
      ...prevData,
      [subject]: {
        ...prevData[subject],
        [chapter]: {
          ...prevData[subject][chapter],
          notes: true,
          shortNotes: true,
          modules: true,
          ncert: true,
          pyqMains: true,
          pyqAdv: true,
          testMains: true,
          testAdv: true,
          revisedMains: true,
          revisedAdv: true,
        }
      }
    }));
  };

  // Get a list of chapters tagged as "Weak"
  const getWeakChapters = () => {
    const weakChapters: Array<{ subject: string; chapter: string }> = [];
    
    Object.entries(studyData).forEach(([subject, chapters]) => {
      Object.entries(chapters).forEach(([chapter, data]) => {
        if (data.tag === 'Weak') {
          weakChapters.push({ subject, chapter });
        }
      });
    });
    
    return weakChapters;
  };

  return (
    <JEEDataContext.Provider
      value={{
        studyData,
        updateChapterData,
        getChapterProgress,
        getSubjectProgress,
        getCategoryProgress,
        getTotalProgress,
        resetChapter,
        markChapterComplete,
        getWeakChapters,
      }}
    >
      {children}
    </JEEDataContext.Provider>
  );
};

export const useJEEData = (): JEEDataContextType => {
  const context = useContext(JEEDataContext);
  if (context === undefined) {
    throw new Error('useJEEData must be used within a JEEDataProvider');
  }
  return context;
};
