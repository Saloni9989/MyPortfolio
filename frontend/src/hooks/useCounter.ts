import { useState, useEffect, useRef } from 'react'

export function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!start || started.current) return
    started.current = true

    const steps = 60
    const increment = target / steps
    const stepDuration = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [target, duration, start])

  return count
}
