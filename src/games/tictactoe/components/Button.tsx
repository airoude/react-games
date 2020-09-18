import React, { FC } from 'react'
import cn from 'classnames'
import styles from './Button.module.css'

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Button: FC<ButtonProps> = ({ onClick, size= 'md', children }) => (
  <button onClick={onClick} className={cn(styles.button, {
    [styles.sm]: size === 'sm',
    [styles.lg]: size === 'lg',
  })}>
    {children}
  </button>
)

export default Button
