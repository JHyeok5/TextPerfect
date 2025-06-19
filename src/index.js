import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import './index.css';
import App from './App';
import packageJson from '../package.json';

const container = document.getElementById('root');
const root = createRoot(container);

const basename = new URL(packageJson.homepage).pathname;

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 