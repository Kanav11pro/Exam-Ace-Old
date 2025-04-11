
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { JEEDataProvider } from "@/context/JEEDataContext";
import { StudyStatsProvider } from "@/context/StudyStatsContext";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";
import ChapterPage from "./pages/ChapterPage";
import DashboardPage from "./pages/DashboardPage";
import StudyToolsPage from "./pages/StudyToolsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Study Tools
import { PomodoroTimer } from "./components/study-tools/PomodoroTimer";
import { Flashcards } from "./components/study-tools/Flashcards";
import { StudyTimer } from "./components/study-tools/StudyTimer";
import { NoteTaker } from "./components/study-tools/NoteTaker";
import { FocusMode } from "./components/study-tools/FocusMode";
import { GoalTracker } from "./components/study-tools/GoalTracker";
import { FormulaSheet } from "./components/study-tools/FormulaSheet";
import { BacklogManagement } from "./components/study-tools/BacklogManagement";
import { WeeklyPlanner } from "./components/study-tools/WeeklyPlanner";
import { ErrorLog } from "./components/study-tools/ErrorLog";
import { RevisionReminder } from "./components/study-tools/RevisionReminder";
import { DailyQuiz } from "./components/study-tools/DailyQuiz";
import { BookmarkManager } from "./components/study-tools/BookmarkManager";
import { EyeRestTimer } from "./components/study-tools/EyeRestTimer";
import { StudyMusic } from "./components/study-tools/StudyMusic";
import { MockTests } from "./components/study-tools/MockTests";
import { Mindfulness } from "./components/study-tools/Mindfulness";
import { LearningResourcesPage } from "./pages/LearningResourcesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <JEEDataProvider>
        <StudyStatsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<Index />}>
                <Route index element={<HomePage />} />
                <Route path="subject/:subject" element={<SubjectPage />} />
                <Route path="subject/:subject/:chapter" element={<ChapterPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="prepometer" element={<Navigate to="/subject/Maths" replace />} />
                
                {/* Study Tools Routes */}
                <Route path="tools" element={<StudyToolsPage />} />
                <Route path="tools/pomodoro-timer" element={<PomodoroTimer />} />
                <Route path="tools/flashcards" element={<Flashcards />} />
                <Route path="tools/study-timer" element={<StudyTimer />} />
                <Route path="tools/note-taker" element={<NoteTaker />} />
                <Route path="tools/focus-mode" element={<FocusMode />} />
                <Route path="tools/goal-tracker" element={<GoalTracker />} />
                <Route path="tools/formula-sheet" element={<FormulaSheet />} />
                <Route path="tools/backlog-management" element={<BacklogManagement />} />
                <Route path="tools/weekly-planner" element={<WeeklyPlanner />} />
                <Route path="tools/error-log" element={<ErrorLog />} />
                <Route path="tools/revision-reminder" element={<RevisionReminder />} />
                <Route path="tools/daily-quiz" element={<DailyQuiz />} />
                <Route path="tools/bookmark-manager" element={<BookmarkManager />} />
                <Route path="tools/eye-rest-timer" element={<EyeRestTimer />} />
                <Route path="tools/study-music" element={<StudyMusic />} />
                <Route path="tools/mock-tests" element={<MockTests />} />
                <Route path="tools/mindfulness" element={<Mindfulness />} />
                
                {/* Resources */}
                <Route path="resources" element={<LearningResourcesPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </StudyStatsProvider>
      </JEEDataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
