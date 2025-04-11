
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StudyStatsProvider } from '@/context/StudyStatsContext';
import { JEEDataProvider } from '@/context/JEEDataContext';

// Disable security measures for now
// setupSecurityMeasures();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <StudyStatsProvider>
          <JEEDataProvider>
            <App />
            <Toaster />
          </JEEDataProvider>
        </StudyStatsProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
