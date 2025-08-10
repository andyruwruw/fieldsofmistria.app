// Packages
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// Local Imports
import { MultiSelectProvider } from './contexts/multi-select/provider.tsx';
import { PlayersProvider } from './contexts/player/provider.tsx';
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
      <MultiSelectProvider>
        <PlayersProvider>
          <App />
        </PlayersProvider>
      </MultiSelectProvider>
    </BrowserRouter>
  </StrictMode>,
);
