import React, { FC } from 'react'
import cn from 'clsx';
import { Ghosts } from 'games/pacman/consts';
import styles from './Ghost.module.css'

type GhostProps = {
  name: string;
  isScared: boolean;
}

const Ghost: FC<GhostProps> = ({ name, isScared }) => (
  <div className={cn({
    [styles.scared]: isScared,
    [styles.pinky]: name === Ghosts.PINKY,
    [styles.blinky]: name === Ghosts.BLINKY,
    [styles.inky]: name === Ghosts.INKY,
    [styles.clyde]: name === Ghosts.CLYDE,
  })} />
)

export default Ghost
