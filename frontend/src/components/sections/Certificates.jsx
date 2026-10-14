import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Award, ExternalLink, Calendar } from 'lucide-react'
import { certificatesApi } from '../../services/api'

const DEMO = [
  { _id: '1', title: 'Full Stack Web Development', organization: 'Udemy', issueDate: 'Dec 2023', credentialLink: '#', imageUrl: '' },
  { _id: '2', title: 'Data Structures & Algorithms', organization: 'GeeksforGeeks', issueDate: 'Oct 2023', credentialLink: '#', imageUrl: '' },
  { _id: '3', title: 'React - The Complete Guide', organization: 'Udemy', issueDate: 'Aug 2023', credentialLink: '#', imageUrl: '' },
  { _id: '4', title: 'Node.js & Express Bootcamp', organization: 'Udemy', issueDate: 'Nov 2023', credentialLink: '#', imageUrl: '' },
  { _id: '5', title: 'MongoDB Developer Certificate', organization: 'MongoDB University', issueDate: 'Jan 2024', credentialLink: '#', imageUrl: '' },
  { _id: '6', title: 'C++ Programming', organization: 'NPTEL', issueDate: 'May 2023', credentialLink: '#', imageUrl: '' },
  { _id: '7', title: 'Cloud Computing Fundamentals', organization: 'AWS', issueDate: 'Mar 2024', credentialLink: '#', imageUrl: '' },
  { _id: '8', title: 'Git & GitHub Mastery', organization: 'GitHub Learning Lab', issueDate: 'Jul 2023', credentialLink: '#', imageUrl: '' },
]

const GRADIENTS = [
  ['#7c3aed', '#a855f7'], ['#2563eb', '#60a5fa'], ['#0891b2', '#22d3ee'],
  ['#059669', '#34d399'], ['#d97706', '#fbbf24'], ['#dc2626', '#f87171'],
  ['#7c3aed', '#3b82f6'], ['#8b5cf6', '#22d3ee'],
]

function CertCard({ cert, index }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const [c1, c2] = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateY: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className="group"
      whileHover={{ y: -10, scale: 1.03, rotateY: 5 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="glass-card overflow-hidden h-full transition-all duration-300"
        style={{ borderColor: c1 + '30' }}>
        {/* Visual top */}
        <div className="relative h-28 flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${c1}20, ${c2}15)` }}>
          {cert.imageUrl ? (
            <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
          ) : (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
            >
              <Award size={44} style={{ color: c1, opacity: 0.6 }} />
            </motion.div>
          )}
          {/* Shine */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, transparent 20%, ${c2}30 50%, transparent 80%)` }} />
          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to right, transparent, ${c1}, transparent)` }} />
        </div>

        <div className="p-4">
          <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:transition-colors duration-300"
            style={{ color: undefined }}>
            {cert.title}
          </h3>
          <p className="text-gray-400 text-xs font-medium mb-3">{cert.organization}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Calendar size={11} /><span>{cert.issueDate}</span>
            </div>
            {cert.credentialLink && cert.credentialLink !== '#' && (
              <a href={cert.credentialLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium hover:text-white transition-colors"
                style={{ color: c1 }}>
                View <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    certificatesApi.getAll()
      .then(res => setCerts(res.data.data || res.data))
      .catch(() => setCerts(DEMO))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="certificates" className="relative py-24 px-4 sm:px-6 bg-black/30">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Credentials</span>
          <h2 className="section-title mt-2">Certifications & <span className="gradient-text">Training</span></h2>
          <p className="section-subtitle">Verified credentials from industry-recognized platforms</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" style={{ perspective: '1000px' }}>
          {(loading ? DEMO : certs).map((cert, i) => (
            <CertCard key={cert._id} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
