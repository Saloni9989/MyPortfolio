import { Suspense, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Box } from '@react-three/drei'
import { FileText, Download, ExternalLink, Eye, X } from 'lucide-react'

function ResumeOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.4
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <Box ref={ref} args={[1.2, 1.6, 0.1]}>
        <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[1.4, 1.8, 0.05]}>
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.15} wireframe />
      </Box>
    </Float>
  )
}

export default function Resume() {
  const [preview, setPreview] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section className="relative py-16 px-4 sm:px-6 bg-black/30">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="glass-card p-8 md:p-12 gradient-border overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 3D resume visual */}
            <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden glass-card">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><FileText size={40} className="text-purple-400" /></div>}>
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[3, 3, 3]} intensity={2} color="#7c3aed" />
                  <pointLight position={[-3, -3, 3]} intensity={1} color="#22d3ee" />
                  <Stars radius={15} depth={8} count={200} factor={2} fade />
                  <ResumeOrb />
                </Canvas>
              </Suspense>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                My <span className="gradient-text">Resume</span>
              </h2>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                A comprehensive overview of my skills, projects, education and experience. Download or view it directly.
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <motion.button
                  onClick={() => setPreview(true)}
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} /> View Resume
                </motion.button>
                <motion.a
                  href="/resume.pdf"
                  download="Saloni_Singh_Resume.pdf"
                  className="btn-outline flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} /> Download PDF
                </motion.a>
                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center gap-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <ExternalLink size={16} /> New Tab
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview modal */}
      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-full max-w-4xl h-[85vh] glass-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-medium">Resume — Saloni Singh</span>
              <div className="flex gap-2">
                <a href="/resume.pdf" download className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1">
                  <Download size={12} /> Download
                </a>
                <button onClick={() => setPreview(false)} className="p-1.5 rounded-lg glass text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>
            <iframe src="/resume.pdf" className="w-full h-full" title="Resume" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
