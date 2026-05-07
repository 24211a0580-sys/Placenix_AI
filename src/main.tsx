import React from 'react';
import ReactDOM from 'react-dom/client';
import PlaceNixAssistant from './components/PlaceNixAssistant';

const rawKeys = (import.meta as any).env?.VITE_GEMINI_API_KEYS || '';
(window as any).__GEMINI_KEYS__ = rawKeys;

const rootElement = document.getElementById('placenix-assistant-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <PlaceNixAssistant />
    </React.StrictMode>
  );
} else {
    console.error("PlaceNix Assistant root element not found.");
}
