import { Suspense, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Stars, Float } from '@react-three/drei'
import { Send, Mail, MapPin, CheckCircle, Github, Linkedin } from 'lucide-react'
import { contactApi } from '../../services/api'

function ContactOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.4
    ref.current.rotation.x = state.clock.elapsedTime * 0.2
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <Sphere ref={ref} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#22d3ee"
          emissive="#06b6d4"
          emissiveIntensity={0.4}
          distort={0.5}
          speed={2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  )
}

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (form.message.length < 10) e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      await contactApi.send(form)
      setSuccess(true)
      setForm(INITIAL_FORM)
    } catch {
      setError('Failed to send. Please email me directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl glass text-white text-sm placeholder-gray-600 outline-none transition-all duration-200 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 border ${errors[field] ? 'border-red-500/50' : 'border-white/10'}`

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 bg-black/30">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Get in touch</span>
          <h2 className="section-title mt-2">Let's <span className="gradient-text">Connect</span></h2>
          <p className="section-subtitle">Have an opportunity or project? I'd love to hear from you.</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            {/* 3D orb */}
            <div className="h-48 rounded-2xl overflow-hidden glass-card">
              <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
                  <ambientLight intensity={0.2} />
                  <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
                  <pointLight position={[-5, -5, 5]} intensity={1} color="#7c3aed" />
                  <Stars radius={20} depth={10} count={300} factor={2} fade />
                  <ContactOrb />
                </Canvas>
              </Suspense>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-bold text-xl mb-3">Let's work together</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                I'm actively seeking software developer roles. If you're looking for a dedicated developer who brings both technical skills and creative problem-solving, let's talk.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: 'salonisinghmti07@gmail.com', href: 'mailto:salonisinghmti07@gmail.com' },
                  { icon: MapPin, label: 'Location', value: 'India 🇮🇳', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="text-white text-sm hover:text-purple-400 transition-colors">{item.value}</a>
                        : <p className="text-white text-sm">{item.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <p className="text-gray-400 text-sm font-medium mb-3">Connect on social</p>
              <div className="flex gap-3">
                {[
                  { icon: Github, href: 'https://github.com/Saloni9989', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/saloni-singh-063282290/', label: 'LinkedIn' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl glass hover:border-purple-500/40 transition-all text-gray-400 hover:text-white text-sm">
                    <s.icon size={16} /> {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-gray-400 text-sm">Typically responds within <span className="text-white font-medium">24 hours</span></p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                    <CheckCircle size={64} className="text-green-400 mb-4" />
                  </motion.div>
                  <h3 className="text-white font-bold text-2xl mb-2">Message Sent! 🎉</h3>
                  <p className="text-gray-400 mb-6">Thank you! I'll get back to you soon.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary text-sm">Send Another</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="glass-card p-6 sm:p-8 space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className={inputClass('name')} />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputClass('email')} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="Job opportunity / Project collaboration" className={inputClass('subject')} />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about the opportunity..." rows={5} className={`${inputClass('message')} resize-none`} />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                    <p className="text-gray-600 text-xs mt-1 text-right">{form.message.length} chars</p>
                  </div>

                  {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-70"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
