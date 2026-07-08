import React from 'react';
import ReactDOM from 'react-dom/client';
import { NetraApp } from './pages/NetraApp';

const rootElement = document.getElementById('netra-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NetraApp />
    </React.StrictMode>
  );
} else {
  console.error("Netra OS root element not found.");
}
