import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Application starting...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Root element found, mounting React app...');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('React app mounted');
