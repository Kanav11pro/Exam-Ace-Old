
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { setupSecurityMeasures } from './utils/securityUtils';
import { Toaster } from '@/components/ui/toaster';

// Setup security measures to prevent inspection
setupSecurityMeasures();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>
);
