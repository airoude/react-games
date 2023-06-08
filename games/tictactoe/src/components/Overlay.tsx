import * as React from 'react';
import styles from './Overlay.module.css';

type OverlayProps = {
  children: React.ReactNode;
}

export const Overlay = ({ children }: OverlayProps) => {
  return (
    <div className={styles.overlay}>
      {children}
    </div>
  )
}
