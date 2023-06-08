import React from 'react'
import ReactDOM from 'react-dom/client'
import { Game } from './Game.tsx';
import './main.module.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
);
