import React, { FC } from 'react'
import cn from 'classnames'
import styles from './Message.module.css'

interface MessageProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
  type?: 'default' | 'primary' | 'danger' | 'success';
}

const Message: FC<MessageProps> = ({ type = 'default', children, style }) => (
  <div
    style={style}
    className={cn(styles.message, {
      [styles.primary]: type === 'primary',
      [styles.danger]: type === 'danger',
      [styles.success]: type === 'success',
    })}>
    <span>{children}</span>
  </div>
)

export default Message
