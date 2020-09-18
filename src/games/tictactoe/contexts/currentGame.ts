import { createContext, useContext } from 'react'
import { initialContext } from 'states/tictactoe'

export const CurrentGameContext = createContext<TicTacToeStateContext>(initialContext)
export const useCurrentGame = () => useContext(CurrentGameContext)
