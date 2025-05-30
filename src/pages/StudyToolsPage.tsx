
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudyToolsGuide } from '@/components/study-tools/StudyToolsGuide';
import { AdvancedStudyTimer } from '@/components/study-tools/AdvancedStudyTimer';
import { Flashcards } from '@/components/study-tools/flashcards/Flashcards';
import { FormulaSheet } from '@/components/study-tools/FormulaSheet';
import { DailyQuiz } from '@/components/study-tools/DailyQuiz';
import { MockTests } from '@/components/study-tools/MockTests';

const StudyToolsPage = () => {
  return (
    <div className="container max-w-6xl py-8">
      <Routes>
        <Route index element={<StudyToolsGuide />} />
        <Route path="advanced-study-timer" element={<AdvancedStudyTimer />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="formula-sheet" element={<FormulaSheet />} />
        <Route path="daily-quiz" element={<DailyQuiz />} />
        <Route path="mock-tests" element={<MockTests />} />
        
        {/* Redirect old timer routes to new advanced timer */}
        <Route path="pomodoro-timer" element={<Navigate to="/tools/advanced-study-timer" replace />} />
        <Route path="study-timer" element={<Navigate to="/tools/advanced-study-timer" replace />} />
        <Route path="focus-mode" element={<Navigate to="/tools/advanced-study-timer" replace />} />
      </Routes>
    </div>
  );
};

export default StudyToolsPage;
