import { Suspense, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Torus } from '@react-three/drei'
import { GraduationCap, Briefcase, Award, Code2, BookOpen } from 'lucide-react'
import { TIMELINE_ITEMS } from '../../utils/constants'

const ICONS = {
  education: GraduationCap,
  internship: Briefcase,
  training: BookOpen,
  certification: Award,
  achievement: Code2,
}

const COLORS = {
  education: '#a855f7',
  internship: '#22d3ee',
  training: '#60a5fa',
  certification: '#34d399',
  achievement: '#fb923c',
}

function TimelineOrb() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={group}>
      {[1.5, 2.5, 3.5].map((r, i) => (
        <Float key={r} speed={1 + i * 0.3} rotationIntensity={0.5} floatIntensity={0.5}>
          <Torus args={[r, 0.015, 8, 100]} rotation={[Math.PI / 4 * i, 0, Math.PI / 6 * i]}>
            <meshStandardMaterial
              color={['#7c3aed', '#22d3ee', '#3b82f6'][i]}
              emissive={['#7c3aed', '#22d3ee', '#3b82f6'][i]}
              emissiveIntensity={0.5}
              transparent
              opacity={0.5}
            />
          </Torus>
        </Float>
      ))}
    </group>
  )
}

function TimelineItem({ item, index, isLeft }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })
  const Icon = ICONS[item.category]
  const color = COLORS[item.category]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className={`relative flex items-center gap-4 mb-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
        <motion.div
          className="glass-card p-5 transition-all duration-300"
          style={{ borderColor: color + '30' }}
          whileHover={{ scale: 1.02, boxShadow: `0 20px 60px ${color}20` }}
        >
          <div className={`flex items-center gap-2 mb-2 flex-wrap ${isLeft ? 'md:justify-end' : ''}`}>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
              style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
              {item.category}
            </span>
            <span className="text-gray-500 text-xs font-mono">{item.date}</span>
          </div>
          <h3 className="text-white font-bold mb-1">{item.title}</h3>
          <p className="font-medium text-sm mb-2" style={{ color }}>{item.subtitle}</p>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </motion.div>
      </div>

      {/* Center node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.3, type: 'spring' }}
        className="relative z-10 flex-shrink-0"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center border-2"
          style={{ background: color + '20', borderColor: color, boxShadow: `0 0 20px ${color}40` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </motion.div>

      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export default function Experience() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 bg-black/30">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8"
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">My journey</span>
          <h2 className="section-title mt-2">Experience & <span className="gradient-text">Education</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        {/* 3D rings decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="h-40 mb-8 rounded-2xl overflow-hidden glass-card"
        >
          <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
            <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ alpha: true }}>
              <ambientLight intensity={0.2} />
              <pointLight position={[5, 5, 5]} intensity={2} color="#7c3aed" />
              <pointLight position={[-5, -5, 5]} intensity={1} color="#22d3ee" />
              <Stars radius={30} depth={20} count={300} factor={2} fade speed={0.3} />
              <TimelineOrb />
            </Canvas>
          </Suspense>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-500 opacity-30 hidden sm:block transform md:-translate-x-1/2" />

          {TIMELINE_ITEMS.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} isLeft={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
