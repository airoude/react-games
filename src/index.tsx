import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ForkMe from './components/ForkMe'
import './index.module.css';

ReactDOM.render(
  <React.StrictMode>
    <ForkMe />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
