import * as React from 'react'

type Listerners = Array<{
  keys: string[];
  fn: (e: KeyboardEvent) => void;
}>

const useKeyPress = (listeners: Listerners): void => {
  const onKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
    },
    []
  )

  React.useEffect(
    () => {
      window.addEventListener('keydown', onKeyPress)

      return () => {
        window.removeEventListener('keydown', onKeyPress)
      }
    },
    []
  )
}

export default useKeyPress
