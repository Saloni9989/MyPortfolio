import { Suspense, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Octahedron } from '@react-three/drei'
import { Github, Linkedin, Code2, Terminal, ExternalLink } from 'lucide-react'
import { CODING_PROFILES } from '../../utils/constants'

const ICON_MAP = { github: Github, linkedin: Linkedin, code: Code2, terminal: Terminal }

function ProfileOrb({ color }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.8
    ref.current.rotation.x = state.clock.elapsedTime * 0.4
  })
  return (
    <Float speed={2} floatIntensity={0.8}>
      <Octahedron ref={ref} args={[1.2, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} transparent opacity={0.85} />
      </Octahedron>
      <Octahedron args={[1.5, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.08} wireframe />
      </Octahedron>
    </Float>
  )
}

export default function CodingProfiles() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="relative py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Find me online</span>
          <h2 className="section-title mt-2">Coding <span className="gradient-text">Profiles</span></h2>
          <p className="section-subtitle">My presence across development and competitive programming platforms</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CODING_PROFILES.map((profile, i) => {
            const Icon = ICON_MAP[profile.icon] || Code2
            return (
              <motion.a
                key={profile.platform}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40, rotateX: -15 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="glass-card overflow-hidden group block transition-all duration-300"
                style={{ borderColor: profile.color + '25' }}
                whileHover={{ y: -10, boxShadow: `0 30px 60px ${profile.color}25`, scale: 1.02 }}
              >
                {/* 3D mini scene */}
                <div className="h-32 relative overflow-hidden" style={{ background: profile.bgColor }}>
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon size={32} color={profile.color} />
                    </div>
                  }>
                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
                      <ambientLight intensity={0.2} />
                      <pointLight position={[3, 3, 3]} intensity={3} color={profile.color} />
                      <Stars radius={15} depth={8} count={100} factor={2} fade />
                      <ProfileOrb color={profile.color} />
                    </Canvas>
                  </Suspense>
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Icon size={28} color={profile.color} style={{ opacity: 0.3 }} />
                  </div>
                  {/* Glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(to right, transparent, ${profile.color}, transparent)` }} />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} color={profile.color} />
                    <h3 className="text-white font-bold">{profile.platform}</h3>
                  </div>
                  <p className="text-gray-500 text-xs font-mono mb-3">@{profile.username}</p>

                  <div className="space-y-1.5 mb-4">
                    {profile.stats.map((stat) => (
                      <div key={stat} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: profile.color }} />
                        {stat}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
                    style={{ color: profile.color }}>
                    Visit Profile <ExternalLink size={11} />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
