
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupSecurityMeasures } from './utils/securityUtils';

// Setup security measures to prevent inspection
setupSecurityMeasures();

createRoot(document.getElementById("root")!).render(<App />);
