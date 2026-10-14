import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react'
import { authApi } from '../../services/api'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) return setError('Please fill all fields')
    setLoading(true); setError('')
    try {
      const res = await authApi.login(form)
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-sm"
      >
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-2xl font-bold mb-3">S</div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Saloni Singh Portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass text-white text-sm placeholder-gray-600 border border-white/10 outline-none focus:border-purple-500/60 transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl glass text-white text-sm placeholder-gray-600 border border-white/10 outline-none focus:border-purple-500/60 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

            <motion.button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-70"
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                : <><LogIn size={16} /> Sign In</>}
            </motion.button>
          </form>
          <p className="text-center text-gray-600 text-xs mt-6">Protected by JWT Authentication</p>
        </div>
      </motion.div>
    </div>
  )
}
