import React, { FC } from 'react';
import styles from './Score.module.css'

const Score: FC<{ score: number }> = ({ score }) => (
  <span className={styles.score}>Score: {score}</span>
)

export default Score
