
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import SubjectPage from './pages/SubjectPage';
import ChapterPage from './pages/ChapterPage';
import LearningResourcesPage from './pages/LearningResourcesPage';
import StudyToolsPage from './pages/StudyToolsPage';

// Import study tools
import { PomodoroTimer } from '@/components/study-tools/PomodoroTimer';
import { Flashcards } from '@/components/study-tools/Flashcards';
import { FormulaSheet } from '@/components/study-tools/FormulaSheet';
import { StudyTimer } from '@/components/study-tools/StudyTimer';
import { WeeklyPlanner } from '@/components/study-tools/WeeklyPlanner';
import { NoteTaker } from '@/components/study-tools/NoteTaker';
import { StudyMusic } from '@/components/study-tools/StudyMusic';
import { BookmarkManager } from '@/components/study-tools/BookmarkManager';
import { FocusMode } from '@/components/study-tools/FocusMode';
import { EyeRestTimer } from '@/components/study-tools/EyeRestTimer';
import { Mindfulness } from '@/components/study-tools/Mindfulness';
import { BacklogManagement } from '@/components/study-tools/BacklogManagement';
import { DailyQuiz } from '@/components/study-tools/DailyQuiz';
import { RevisionReminder } from '@/components/study-tools/RevisionReminder';
import { ErrorLog } from '@/components/study-tools/ErrorLog';
import { MockTests } from '@/components/study-tools/MockTests';
import QuestionGenerator from '@/components/study-tools/QuestionGenerator';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="subject/:subjectId" element={<SubjectPage />} />
          <Route path="chapter/:chapterId" element={<ChapterPage />} />
          <Route path="resources" element={<LearningResourcesPage />} />
          
          {/* Study Tools Routes */}
          <Route path="study-tools" element={<StudyToolsPage />}>
            <Route path="pomodoro-timer" element={<PomodoroTimer />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="formula-sheet" element={<FormulaSheet />} />
            <Route path="study-timer" element={<StudyTimer />} />
            <Route path="weekly-planner" element={<WeeklyPlanner />} />
            <Route path="note-taker" element={<NoteTaker />} />
            <Route path="study-music" element={<StudyMusic />} />
            <Route path="bookmark-manager" element={<BookmarkManager />} />
            <Route path="focus-mode" element={<FocusMode />} />
            <Route path="eye-rest-timer" element={<EyeRestTimer />} />
            <Route path="mindfulness" element={<Mindfulness />} />
            <Route path="backlog-management" element={<BacklogManagement />} />
            <Route path="daily-quiz" element={<DailyQuiz />} />
            <Route path="revision-reminder" element={<RevisionReminder />} />
            <Route path="error-log" element={<ErrorLog />} />
            <Route path="mock-tests" element={<MockTests />} />
            <Route path="question-generator" element={<QuestionGenerator />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
