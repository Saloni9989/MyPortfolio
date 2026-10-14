import { Suspense, useRef, useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Icosahedron } from '@react-three/drei'
import { Trophy, Code2, BookOpen, Star, TrendingUp } from 'lucide-react'
import { achievementsApi } from '../../services/api'

const DEMO = [
  { _id: '1', title: '300+ DSA Problems Solved', description: 'Solved 300+ problems across LeetCode and GeeksforGeeks covering arrays, trees, graphs, DP and more.', category: 'dsa', date: '2024' },
  { _id: '2', title: 'Built 4 Full Stack Projects', description: 'Independently built Farmer Market, RentEase, Hostel Desk and SkillSwap — all solving real-world problems.', category: 'achievement', date: '2023-2025' },
  { _id: '3', title: 'Hackathon Finalist', description: 'Reached the finals of a national-level hackathon, building a full-stack solution within 24 hours.', category: 'hackathon', date: '2023' },
  { _id: '4', title: 'MERN Stack Certified', description: 'Completed an intensive full-stack development bootcamp covering React, Node.js, Express and MongoDB.', category: 'training', date: '2023' },
  { _id: '5', title: 'Academic Excellence', description: 'Recognized for outstanding academic performance and consistent top rankings in Computer Science.', category: 'academic', date: '2023' },
  { _id: '6', title: 'LeetCode Active Solver', description: 'Consistently solving weekly contest problems and improving algorithmic problem solving skills.', category: 'dsa', date: '2024' },
]

const CAT = {
  dsa: { icon: Code2, color: '#22d3ee', label: 'DSA' },
  hackathon: { icon: Trophy, color: '#f59e0b', label: 'Hackathon' },
  training: { icon: BookOpen, color: '#a855f7', label: 'Training' },
  academic: { icon: Star, color: '#34d399', label: 'Academic' },
  achievement: { icon: TrendingUp, color: '#60a5fa', label: 'Achievement' },
}

function TrophyOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.5
    ref.current.rotation.x = state.clock.elapsedTime * 0.3
  })
  return (
    <Float speed={2} floatIntensity={1}>
      <Icosahedron ref={ref} args={[1.5, 1]}>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} wireframe />
      </Icosahedron>
      <Icosahedron args={[1.2, 1]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </Icosahedron>
    </Float>
  )
}

function DSAProgress({ inView }) {
  const platforms = [
    { name: 'LeetCode', solved: 300, total: 400, color: '#FFA116' },
    { name: 'GeeksforGeeks', solved: 200, total: 300, color: '#2F8D46' },
    { name: 'Codeforces', solved: 50, total: 100, color: '#1D8ACA' },
  ]

  return (
    <div className="glass-card p-6 h-full">
      {/* 3D visual */}
      <div className="h-36 rounded-xl overflow-hidden mb-5">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#f59e0b" />
            <Stars radius={20} depth={10} count={200} factor={2} fade />
            <TrophyOrb />
          </Canvas>
        </Suspense>
      </div>

      <h3 className="text-white font-bold mb-1 flex items-center gap-2">
        <Code2 size={18} className="text-cyan-400" /> DSA Progress
      </h3>
      <p className="text-gray-500 text-xs mb-5">Problems solved across competitive platforms</p>

      <div className="space-y-4">
        {platforms.map((p) => (
          <div key={p.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 font-medium">{p.name}</span>
              <span className="text-gray-500 font-mono text-xs">{p.solved} / {p.total}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: p.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${(p.solved / p.total) * 100}%` } : {}}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Total', value: '550+', color: '#a855f7' },
          { label: 'Streak', value: '30d', color: '#22d3ee' },
          { label: 'Projects', value: '4', color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-600 text-xs">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    achievementsApi.getAll()
      .then(res => setAchievements(res.data.data || res.data))
      .catch(() => setAchievements(DEMO))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="achievements" className="relative py-24 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-radial from-yellow-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Milestones</span>
          <h2 className="section-title mt-2">Achievements & <span className="gradient-text">Progress</span></h2>
          <p className="section-subtitle">Highlights from competitive programming, hackathons and academic journey</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="lg:col-span-1">
            <DSAProgress inView={inView} />
          </motion.div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {(loading ? DEMO : achievements).map((a, i) => {
              const config = CAT[a.category] || CAT.achievement
              const Icon = config.icon
              return (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="glass-card p-5"
                  style={{ borderColor: config.color + '20' }}
                  whileHover={{ y: -5, boxShadow: `0 20px 40px ${config.color}20` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: config.color + '20', boxShadow: `0 0 15px ${config.color}30` }}>
                      <Icon size={18} style={{ color: config.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: config.color + '20', color: config.color, border: `1px solid ${config.color}40` }}>
                          {config.label}
                        </span>
                        <span className="text-gray-600 text-xs">{a.date}</span>
                      </div>
                      <h3 className="text-white font-bold text-sm mb-1">{a.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{a.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
