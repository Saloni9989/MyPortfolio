import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 300 })
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 300 })
  const dotXSpring = useSpring(dotX, { damping: 10, stiffness: 500 })
  const dotYSpring = useSpring(dotY, { damping: 10, stiffness: 500 })

  useEffect(() => {
    if ('ontouchstart' in window) return
    const move = (e) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      dotX.set(e.clientX - 4)
      dotY.set(e.clientY - 4)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY, dotX, dotY])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] border border-purple-400/60 mix-blend-difference hidden md:block"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] bg-cyan-400 hidden md:block"
        style={{ x: dotXSpring, y: dotYSpring }}
      />
    </>
  )
}
