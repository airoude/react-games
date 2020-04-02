import { useEffect, useMemo, useState } from 'react'
import { interpret, Interpreter, State } from 'xstate'
import { GameContext, GameEvents } from './game'

type MachineTuple = [
  State<GameContext, GameEvents>,
  Interpreter<GameContext, any, GameEvents>
]

export const useMachine = (machine: any): MachineTuple => {
  const [machineState, setMachineState] = useState(machine.initialState)

  const service = useMemo(() => interpret<GameContext, any, GameEvents>(machine)
  .onTransition(state => {
    if (state.changed) {
      setMachineState(state)
    }
  })
  .start(), [])

  useEffect(() => {
    return () => {
      service.stop()
    }
  }, [])

  return [machineState, service]
}
