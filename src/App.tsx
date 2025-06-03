
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { JEEDataProvider } from "@/context/jee";
import { StudyStatsProvider } from "@/context/StudyStatsContext";
import { ThemeProvider } from "@/context/ThemeContext";

import PrepometerPage from "./pages/PrepometerPage";
import SubjectPage from "./pages/SubjectPage";
import ChapterPage from "./pages/ChapterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <JEEDataProvider>
        <StudyStatsProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Navigate to="/prepometer" replace />} />
              <Route path="/prepometer" element={<PrepometerPage />} />
              <Route path="/subject/:subject" element={<SubjectPage />} />
              <Route path="/subject/:subject/:chapter" element={<ChapterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </StudyStatsProvider>
      </JEEDataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
