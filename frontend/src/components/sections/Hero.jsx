import { Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Sparkles } from 'lucide-react'
import HeroScene from '../three/HeroScene'

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  }
  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Mouse light effect */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          transition: 'left 0.1s ease, top 0.1s ease',
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20 z-10 pointer-events-none" />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-purple-300 border border-purple-500/30">
              <Sparkles size={14} className="text-cyan-400" />
              Available for opportunities
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={item} className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4">
            <span className="block text-white drop-shadow-2xl">SALONI</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.5))',
              }}
            >
              SINGH
            </span>
          </motion.h1>

          {/* Role */}
          <motion.div variants={item} className="mb-6">
            <div className="inline-flex items-center gap-3 text-xl sm:text-2xl text-gray-300 font-light">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-purple-500" />
              Software Developer
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p variants={item} className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Building modern web experiences through{' '}
            <span className="text-purple-400 font-semibold">problem solving</span>,{' '}
            <span className="text-blue-400 font-semibold">scalable applications</span> and{' '}
            <span className="text-cyan-400 font-semibold">clean user-focused design</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => scrollTo('projects')}
              className="btn-primary flex items-center gap-2 group text-base px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Portfolio</span>
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </motion.button>
            <motion.a
              href="/resume.pdf"
              download="Saloni_Singh_Resume.pdf"
              className="btn-outline flex items-center gap-2 text-base px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} />
              <span>Download Resume</span>
            </motion.a>
          </motion.div>

          {/* Project pills */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-2 mt-12">
            {['Farmer Market', 'RentEase', 'Hostel Desk', 'SkillSwap'].map((p) => (
              <motion.span
                key={p}
                className="px-4 py-1.5 text-xs font-mono text-gray-400 border border-white/10 rounded-full hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-default"
                whileHover={{ scale: 1.1 }}
              >
                {p}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 z-20"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>
    </section>
  )
}
