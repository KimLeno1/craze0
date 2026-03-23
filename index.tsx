
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Suppress benign Vite WebSocket errors in sandboxed environments
const isBenignViteError = (error: any) => {
  const message = error?.message || (typeof error === 'string' ? error : '');
  return (
    message.includes('WebSocket') || 
    message.includes('vite') ||
    message === 'WebSocket closed without opened.'
  );
};

window.addEventListener('unhandledrejection', (event) => {
  if (isBenignViteError(event.reason)) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (isBenignViteError(event.error)) {
    event.preventDefault();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
