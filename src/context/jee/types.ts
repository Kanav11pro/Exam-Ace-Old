
// Define types for JEE data structure
export interface SubtopicData {
  notes: boolean;
  shortNotes: boolean;
  modules: boolean;
  ncert: boolean;
  pyqMains: boolean;
  pyqAdv: boolean;
  testMains: boolean;
  testAdv: boolean;
  tag: string;
  revisedMains: boolean;
  revisedAdv: boolean;
  remarks: string;
}

export interface JEESubjects {
  [subject: string]: {
    [chapter: string]: SubtopicData;
  };
}

export interface JEEDataState {
  subjects: JEESubjects;
  weakChapters: Array<{subject: string; chapter: string}>;
}

export interface JEEDataContextType {
  jeeData: JEEDataState;
  updateChapterData: (subject: string, chapter: string, key: string, value: boolean | string) => void;
  getProgressBySubject: (subject: string) => number;
  getProgressByChapter: (subject: string, chapter: string) => number;
  getProgressByCategory: (subject: string, chapter: string, category: string) => number;
  getWeakChapters: () => Array<{subject: string; chapter: string}>;
  updateWeakChapters: (chapters: Array<{subject: string; chapter: string}>) => void;
  getTotalProgress: () => number;
  resetData: () => void;
}
