import { Suspense, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Float, Stars } from '@react-three/drei'
import { Code2, GraduationCap, Target, Lightbulb } from 'lucide-react'
import { STATS } from '../../utils/constants'

function useCounter(target, duration, start) {
  const count = useRef(0)
  const [display, setDisplay] = [count, (v) => { count.current = v }]
  if (start && count.current < target) {
    const steps = 60
    const increment = target / steps
    const stepDur = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { clearInterval(timer); count.current = target }
      else count.current = Math.floor(current)
    }, stepDur)
  }
  return count.current
}

function StatCard({ label, value, suffix = '+', inView }) {
  const [ref, isVisible] = [useRef(null), inView]
  const [count, setCount] = [useRef(0), null]
  const [displayed, setDisplayed] = [0, null]

  // Simple animated counter using motion
  return (
    <motion.div
      className="glass-card p-5 text-center hover:border-purple-500/30 transition-all duration-300"
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <motion.div
        className="text-3xl sm:text-4xl font-black mb-1"
        style={{
          background: 'linear-gradient(135deg, #a855f7, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          {inView ? value : 0}{suffix}
        </motion.span>
      </motion.div>
      <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

function AboutOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
    ref.current.rotation.z = state.clock.elapsedTime * 0.2
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={ref} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#a855f7"
          emissiveIntensity={0.4}
          distort={0.5}
          speed={2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[1.8, 32, 32]}>
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.05} wireframe />
      </Sphere>
    </Float>
  )
}

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const cards = [
    { icon: <GraduationCap className="text-purple-400" size={20} />, title: 'Education', content: 'Pursuing B.Tech in Computer Science, building a strong foundation in software development, data structures, and system design.' },
    { icon: <Code2 className="text-blue-400" size={20} />, title: 'Current Focus', content: 'Mastering MERN stack development, exploring DSA deeply, and building real-world full stack projects.' },
    { icon: <Target className="text-cyan-400" size={20} />, title: 'Career Goals', content: 'Targeting software engineering roles at product-based companies, focused on scalable backend systems and clean frontend design.' },
    { icon: <Lightbulb className="text-yellow-400" size={20} />, title: 'Philosophy', content: 'I learn by building. Every project is a new challenge. I turn real-world problems into working software.' },
  ]

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Get to know me</span>
          <h2 className="section-title mt-2">About <span className="gradient-text">Me</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D orb + bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* 3D Canvas */}
            <div className="h-64 w-full mb-8 rounded-2xl overflow-hidden glass-card">
              <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[5, 5, 5]} intensity={2} color="#7c3aed" />
                  <pointLight position={[-5, -5, 5]} intensity={1} color="#22d3ee" />
                  <Stars radius={30} depth={20} count={500} factor={2} fade speed={0.5} />
                  <AboutOrb />
                </Canvas>
              </Suspense>
            </div>

            {/* Bio card */}
            <div className="glass-card p-6 gradient-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-xl font-black flex-shrink-0">
                  SS
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Saloni Singh</h3>
                  <p className="text-purple-400 text-sm">Full Stack Developer · Problem Solver</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Open to Work</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">MERN Stack</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                I'm a passionate software developer who loves turning real-world problems into elegant digital solutions. I've built 4 full-stack projects — a farmers marketplace, a rental platform, a hostel complaint system, and a peer learning app.
              </p>
            </div>
          </motion.div>

          {/* Right: stats + info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Projects Built" value={STATS.projects} inView={inView} />
              <StatCard label="Technologies" value={STATS.technologies} inView={inView} />
              <StatCard label="Certifications" value={STATS.certifications} inView={inView} />
              <StatCard label="DSA Problems" value={STATS.dsaProblems} inView={inView} />
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <motion.div
                  key={card.title}
                  className="glass-card p-4 hover:border-purple-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {card.icon}
                    <span className="text-white text-xs font-semibold">{card.title}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{card.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick info */}
            <div className="glass-card p-5 grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Location', value: 'India 🇮🇳' },
                { label: 'Available', value: 'Immediately', valueClass: 'text-green-400' },
                { label: 'Experience', value: 'Fresher / Junior' },
                { label: 'Preferred', value: 'Remote / Hybrid' },
              ].map((i) => (
                <div key={i.label}>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">{i.label}</span>
                  <p className={`font-medium mt-0.5 ${i.valueClass || 'text-white'}`}>{i.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
