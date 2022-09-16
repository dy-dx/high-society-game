// dunno why these react-script types (for img imports) aren't included automatically
/// <reference types="react-scripts" />

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
// React 18's StrictMode is incompatible with boardgame.io
// https://github.com/boardgameio/boardgame.io/issues/1068
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
