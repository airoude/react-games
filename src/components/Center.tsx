import React, { FC } from 'react'
import styles from './Center.module.css'

interface CenterProps {
  children: React.ReactNode;
}

const Center: FC<CenterProps> = ({ children }) => (
  <div className={styles.center}>
    <span>{children}</span>
  </div>
)

export default Center
