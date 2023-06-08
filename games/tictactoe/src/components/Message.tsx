import React, { FC } from 'react'
import cn from 'clsx';
import styles from './Message.module.css'

type MessageProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
  type?: 'default' | 'primary' | 'danger' | 'success';
}

export const Message: FC<MessageProps> = ({ type = 'default', children, style }) => (
  <div
    style={style}
    className={cn(styles.message, {
      [styles.primary]: type === 'primary',
      [styles.danger]: type === 'danger',
      [styles.success]: type === 'success',
    })}
  >
    {children}
  </div>
)

export default Message
