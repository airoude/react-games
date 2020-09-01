import { createContext, useContext } from 'react'
import { initialContext } from 'state/game'

export const CurrentGameContext = createContext<GameContext>(initialContext)
export const useCurrentGame = () => useContext(CurrentGameContext)
