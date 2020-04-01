import { createContext, useContext } from 'react'

export const CurrentPlayerContext = createContext<string>('')
export const useCurrentPlayer = () => useContext(CurrentPlayerContext)
