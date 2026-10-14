import { Suspense, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei'
import { Github, ExternalLink, ArrowRight, X, Sparkles } from 'lucide-react'
import { PROJECTS } from '../../utils/constants'

function ProjectOrb({ color }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.5
  })
  return (
    <Float speed={2} floatIntensity={1}>
      <Sphere ref={ref} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          distort={0.4}
          speed={2}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  )
}

function ProjectCard({ project, index, onClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 25
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 25
    setTilt({ x, y })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.6s ease',
      }}
      className="cursor-pointer group"
    >
      <div
        className="glass-card overflow-hidden h-full transition-all duration-500"
        style={{
          borderColor: hovered ? project.color + '60' : 'rgba(255,255,255,0.08)',
          boxShadow: hovered ? `0 30px 80px ${project.color}25` : 'none',
        }}
      >
        {/* 3D Preview */}
        <div className="h-48 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${project.color}15, transparent)` }}>
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-5xl">{project.icon}</div>}>
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[3, 3, 3]} intensity={2} color={project.color} />
              <Stars radius={20} depth={10} count={200} factor={2} fade />
              <ProjectOrb color={project.color} />
            </Canvas>
          </Suspense>

          {/* Emoji overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-6xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 select-none">
              {project.icon}
            </span>
          </div>

          {/* Category badge */}
          <span
            className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium"
            style={{ background: project.color + '30', color: project.color, border: `1px solid ${project.color}40` }}
          >
            {project.category}
          </span>

          {/* Glow line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
            style={{ background: hovered ? `linear-gradient(to right, transparent, ${project.color}, transparent)` : 'transparent' }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            className="text-white font-bold text-lg mb-2 group-hover:transition-colors duration-300"
            style={{ color: hovered ? project.color : 'white' }}
          >
            {project.icon} {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 text-xs rounded font-mono text-gray-400 border border-white/10">
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded font-mono text-gray-600">+{project.techStack.length - 4}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(project) }}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${project.color}90, ${project.color}50)` }}
            >
              View Details <ArrowRight size={12} />
            </button>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg glass hover:border-white/30 transition-all"
            >
              <Github size={16} className="text-gray-400" />
            </a>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg glass hover:border-white/30 transition-all"
                title="Live Demo"
              >
                <ExternalLink size={16} className="text-gray-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: project.color + '40' }}
      >
        {/* Banner with 3D */}
        <div className="h-48 relative" style={{ background: `linear-gradient(135deg, ${project.color}20, black)` }}>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[3, 3, 3]} intensity={3} color={project.color} />
              <Stars radius={20} depth={10} count={300} factor={3} fade />
              <ProjectOrb color={project.color} />
            </Canvas>
          </Suspense>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-8xl opacity-20 select-none">{project.icon}</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
          >
            <X size={16} />
          </button>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(to right, transparent, ${project.color}, transparent)` }}
          />
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-white">{project.icon} {project.title}</h2>
            <p style={{ color: project.color }} className="text-sm font-medium">{project.category}</p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
              <Sparkles size={14} style={{ color: project.color }} /> Problem Statement
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">{project.problemStatement}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-2">Key Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {project.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-lg text-xs font-mono border"
                  style={{ color: project.color, borderColor: project.color + '40', background: project.color + '15' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Architecture</h4>
            <p className="text-gray-400 text-sm">{project.architecture}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass text-sm text-white hover:border-white/30 transition-all"
            >
              <Github size={16} /> View on GitHub
            </a>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: `linear-gradient(135deg, ${project.color}90, ${project.color}50)` }}
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">What I've built</span>
          <h2 className="section-title mt-2">Featured <span className="gradient-text">Projects</span></h2>
          <p className="section-subtitle">Real-world applications solving real problems — from idea to deployment</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onClick={setSelected} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/Saloni9989"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2 group"
          >
            <Github size={18} />
            View All on GitHub
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
