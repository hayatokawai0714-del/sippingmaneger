import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { AppDataProvider } from './contexts/AppDataContext';
import { ViewSettingsProvider } from './contexts/ViewSettingsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppDataProvider>
        <ViewSettingsProvider>
          <App />
        </ViewSettingsProvider>
      </AppDataProvider>
    </HashRouter>
  </StrictMode>,
);
