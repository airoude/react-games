import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.module.css';
import ForkMe from './components/ForkMe'

ReactDOM.render(
  <React.StrictMode>
    <ForkMe />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
