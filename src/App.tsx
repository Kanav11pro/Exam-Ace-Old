
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { JEEDataProvider } from "@/context/JEEDataContext";
import { StudyStatsProvider } from "@/context/StudyStatsContext";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";
import ChapterPage from "./pages/ChapterPage";
import DashboardPage from "./pages/DashboardPage";
import StudyToolsPage from "./pages/StudyToolsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <JEEDataProvider>
          <StudyStatsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />}>
                    <Route index element={<HomePage />} />
                    <Route path="subject/:subject" element={<SubjectPage />} />
                    <Route path="subject/:subject/:chapter" element={<ChapterPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="tools" element={<StudyToolsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </StudyStatsProvider>
        </JEEDataProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
