import { Suspense, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import SkillsGalaxy from '../three/SkillsGalaxy'
import { SKILLS } from '../../utils/constants'

const CATEGORIES = ['all', 'frontend', 'backend', 'programming']

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [view, setView] = useState('3d') // '3d' or 'grid'
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const filtered = activeCategory === 'all' ? SKILLS : SKILLS.filter(s => s.category === activeCategory)

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 bg-black/50">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8"
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">What I work with</span>
          <h2 className="section-title mt-2">Technical <span className="gradient-text">Skills</span></h2>
          <p className="section-subtitle">Hover over the orbiting planets to explore my skills</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        {/* View toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="flex justify-center gap-3 mb-8"
        >
          {['3d', 'grid'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                view === v
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {v === '3d' ? '🌌 3D Galaxy' : '⚡ Grid View'}
            </button>
          ))}
        </motion.div>

        {/* 3D Galaxy */}
        <AnimatePresence mode="wait">
          {view === '3d' && (
            <motion.div
              key="3d"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden glass-card"
            >
              <div className="p-4 border-b border-white/10 text-center">
                <p className="text-gray-400 text-sm">🖱️ Drag to rotate · Hover planets to see skill details</p>
              </div>
              <Suspense fallback={
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-purple-400 text-sm animate-pulse">Loading 3D Galaxy...</div>
                </div>
              }>
                <SkillsGalaxy />
              </Suspense>
            </motion.div>
          )}

          {view === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Category filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                      activeCategory === cat
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'glass text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {filtered.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 text-center group cursor-default"
                    style={{ borderColor: skill.color + '30' }}
                    whileHover={{ scale: 1.08, y: -6, boxShadow: `0 20px 40px ${skill.color}30` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mx-auto mb-3"
                      style={{ background: skill.color + '20', color: skill.color }}
                    >
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-white text-xs font-semibold mb-2">{skill.name}</p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{skill.proficiency}%</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
