import { Suspense, useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Stars } from '@react-three/drei'

function LoadingOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 1
    ref.current.rotation.x = state.clock.elapsedTime * 0.5
  })
  return (
    <Sphere ref={ref} args={[1.2, 64, 64]}>
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#a855f7"
        emissiveIntensity={0.6}
        distort={0.6}
        speed={3}
        metalness={1}
        roughness={0}
      />
    </Sphere>
  )
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); setTimeout(onComplete, 500); return 100 }
        return prev + 1.5
      })
    }, 25)
    const pt = setTimeout(() => setPhase(1), 600)
    return () => { clearInterval(timer); clearTimeout(pt) }
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
      >
        {/* 3D orb */}
        <div className="w-32 h-32 mb-6">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[3, 3, 3]} intensity={3} color="#7c3aed" />
            <pointLight position={[-3, -3, 3]} intensity={1} color="#22d3ee" />
            <Stars radius={20} depth={10} count={200} factor={2} fade />
            <LoadingOrb />
          </Canvas>
        </div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
          className="text-3xl font-black gradient-text mb-1"
        >
          Saloni Singh
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-sm mb-8"
        >
          Software Developer
        </motion.p>

        {/* Progress */}
        <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, #7c3aed, #3b82f6, #22d3ee)',
            }}
          />
        </div>

        <motion.p
          className="text-gray-600 text-xs font-mono"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {progress < 100 ? `Loading... ${Math.round(progress)}%` : 'Ready ✨'}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
