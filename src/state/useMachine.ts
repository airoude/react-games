import { useEffect, useMemo, useState } from 'react'
import { interpret, Interpreter, State } from 'xstate'
import { GameContext, GameEvents } from './game'
import { StateMachine } from 'xstate/lib/types'

type MachineTuple = [
  State<GameContext, GameEvents>,
  Interpreter<GameContext, any, GameEvents>
]

export const useMachine = (machine: StateMachine<GameContext, any, GameEvents>): MachineTuple => {
  const [machineState, setMachineState] = useState(machine.initialState)

  const service = useMemo(() => interpret(machine)
  .onTransition(state => {
    if (state.changed) {
      setMachineState(state)
    }
  })
  .start(), [machine])

  useEffect(() => {
    return () => {
      service.stop()
    }
  }, [service])

  return [machineState, service]
}
