import React, { FC } from 'react';
import styles from './Center.module.css';

const Center: FC = ({ children }) => <div className={styles.center}>{children}</div>;

export default Center;
