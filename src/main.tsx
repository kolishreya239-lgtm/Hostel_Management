import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HostelProvider } from './context/HostelContext';
import { ToastProvider } from './components/common/Toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HostelProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </HostelProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
