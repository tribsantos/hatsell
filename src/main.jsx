import React from 'react';
import ReactDOM from 'react-dom/client';
import { i18nReady } from './i18n';
import App from './App';
import './App.css';

i18nReady
  .catch((error) => {
    console.error('Failed to preload language resources:', error);
  })
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <App />
    );
  });
