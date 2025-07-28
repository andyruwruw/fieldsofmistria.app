// Packages
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// Local Imports
import App from './App.tsx'

// Styles
import '@radix-ui/themes/styles.css';
import './index.css';

/**
 * Main entry point for the React application.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
