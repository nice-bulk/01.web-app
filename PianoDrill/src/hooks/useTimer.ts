import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setRemaining(initialSeconds)
    setFinished(false)
    setRunning(true)
  }, [initialSeconds])

  const stop = useCallback(() => {
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    setFinished(false)
    setRemaining(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          setFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [running])

  return { remaining, running, finished, start, stop, reset }
}
