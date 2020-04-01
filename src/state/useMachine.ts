import { useEffect, useMemo, useState } from 'react'
import { interpret } from 'xstate'

export const useMachine = (machine: any) => {
  const [machineState, setMachineState] = useState(machine.initialState)

  const service = useMemo(() => interpret(machine)
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
