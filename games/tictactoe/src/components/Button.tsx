import * as React from 'react'
import cn from 'clsx';
import styles from './Button.module.css'

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ onClick, size= 'md', children }: ButtonProps) => (
  <button
    onClick={onClick}
    className={cn(styles.button, {
      [styles.sm]: size === 'sm',
      [styles.lg]: size === 'lg',
    })}
  >
    {children}
  </button>
);
