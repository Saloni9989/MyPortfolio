import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-xs font-bold">S</div>
              <span className="font-bold gradient-text">Saloni Singh</span>
            </div>
            <p className="text-gray-600 text-xs">Software Developer · India</p>
          </div>

          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: 'https://github.com/Saloni9989', label: 'GitHub' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/saloni-singh-063282290/', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:salonisinghmti07@gmail.com', label: 'Email' },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/40 transition-all"
                aria-label={link.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <link.icon size={16} />
              </motion.a>
            ))}
          </div>

          <p className="text-gray-600 text-xs flex items-center gap-1">
            Built with <Heart size={10} className="text-red-400" fill="currentColor" /> by Saloni Singh · {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs transition-colors group"
            whileHover={{ y: -2 }}
          >
            <ArrowUp size={14} /> Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
