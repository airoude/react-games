import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GamesPage.module.css';

const GamesPage = () => (
  <div className={styles.selectScreen}>
    <h1>SELECT YOUR GAME</h1>
    <Link className={styles.link} to="/pacman">
      PACMAN
    </Link>
    <Link className={styles.link} to="/tictactoe">
      TIC-TAC-TOE
    </Link>

    <p>
      These games are made with{' '}
      <a href="https://reactjs.org/" rel="noreferrer noopener">
        React
      </a>{' '}
      and{' '}
      <a href="http://xstate.js.org/" rel="noreferrer noopener">
        XState
      </a>
    </p>
  </div>
);

export default GamesPage;
