import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { TextContextProvider } from './context/TextContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <TextContextProvider>
        <App />
      </TextContextProvider>
    </HashRouter>
  </React.StrictMode>
); 