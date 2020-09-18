import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ForkMe from 'components/ForkMe';
import TicTacToe from 'games/tictactoe/Screen';
import Pacman from 'games/pacman/Screen';
import SelectGamePage from './GamesPage';
import styles from './App.module.css';

const App: FC = () => (
  <>
    <ForkMe />
    <Router>
      <nav className={styles.nav}>
        <Link to="/">React Games 🎮</Link>
      </nav>

      <section className={styles.container}>
        <Switch>
          <Route path="/tictactoe">
            <TicTacToe />
          </Route>
          <Route path="/pacman">
            <Pacman />
          </Route>
          <Route path="/">
            <SelectGamePage />
          </Route>
        </Switch>
      </section>

      <footer className={styles.footer}>
        Made by{' '}
        <a href="https://airou.de" rel="noreferrer noopener">
          Youssef Airoude
        </a>
      </footer>
    </Router>
  </>
);

export default App;
