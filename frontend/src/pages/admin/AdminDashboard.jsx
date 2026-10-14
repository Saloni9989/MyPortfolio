import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, FolderOpen, Award, MessageSquare, LogOut, Plus, Trash2, Edit, CheckCircle, Mail } from 'lucide-react'
import { projectsApi, certificatesApi, contactApi } from '../../services/api'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  )
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [certs, setCerts] = useState([])
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin/login'); return }
    Promise.allSettled([projectsApi.getAll(), certificatesApi.getAll(), contactApi.getAll()])
      .then(([p, c, m]) => {
        if (p.status === 'fulfilled') setProjects(p.value.data.data || p.value.data)
        if (c.status === 'fulfilled') setCerts(c.value.data.data || c.value.data)
        if (m.status === 'fulfilled') setMessages(m.value.data.data || m.value.data)
      })
  }, [navigate])

  const logout = () => { localStorage.removeItem('admin_token'); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-56 bg-white/3 border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-sm">S</div>
            <div>
              <p className="text-white font-semibold text-sm">Admin</p>
              <p className="text-gray-600 text-xs">Saloni Singh</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id ? 'bg-purple-600/20 text-white border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={16} />{label}
              {id === 'messages' && messages.filter(m => !m.read).length > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto p-6">
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Projects" value={projects.length} icon={FolderOpen} color="#a855f7" />
              <StatCard label="Certificates" value={certs.length} icon={Award} color="#22d3ee" />
              <StatCard label="Messages" value={messages.length} icon={MessageSquare} color="#60a5fa" />
              <StatCard label="Unread" value={messages.filter(m => !m.read).length} icon={Mail} color="#f59e0b" />
            </div>
            <div className="glass-card p-6">
              <h2 className="text-white font-semibold mb-4">Recent Messages</h2>
              {messages.slice(0, 3).map(msg => (
                <div key={msg._id} className={`p-3 rounded-xl mb-2 ${msg.read ? 'bg-white/3' : 'bg-purple-600/10 border border-purple-500/20'}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm font-medium">{msg.name}</span>
                    <span className="text-gray-500 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-400 text-xs truncate">{msg.subject}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Projects ({projects.length})</h1>
              <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2"><Plus size={16} /> Add Project</button>
            </div>
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p._id} className="glass-card p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{p.category} · {(p.techStack || []).slice(0, 3).join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg glass text-gray-400 hover:text-white"><Edit size={14} /></button>
                    <button onClick={async () => { await projectsApi.delete(p._id); setProjects(prev => prev.filter(x => x._id !== p._id)) }} className="p-2 rounded-lg glass text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'certificates' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Certificates ({certs.length})</h1>
              <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2"><Plus size={16} /> Add</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certs.map(c => (
                <div key={c._id} className="glass-card p-4">
                  <h3 className="text-white font-medium text-sm mb-1">{c.title}</h3>
                  <p className="text-gray-500 text-xs mb-3">{c.organization} · {c.issueDate}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg glass text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1"><Edit size={12} /> Edit</button>
                    <button onClick={async () => { await certificatesApi.delete(c._id); setCerts(prev => prev.filter(x => x._id !== c._id)) }} className="p-1.5 rounded-lg glass text-gray-400 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-bold text-white mb-6">Messages ({messages.length})</h1>
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg._id} className={`glass-card p-5 ${!msg.read ? 'border-purple-500/30' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-medium">{msg.name}</span>
                        {!msg.read && <span className="px-2 py-0.5 rounded-full text-xs bg-purple-600/30 text-purple-300">New</span>}
                        <span className="text-gray-500 text-xs">{msg.email}</span>
                      </div>
                      <p className="text-purple-400 text-sm font-medium mb-1">{msg.subject}</p>
                      <p className="text-gray-400 text-sm">{msg.message}</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {!msg.read && (
                        <button onClick={async () => { await contactApi.markRead(msg._id); setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m)) }}
                          className="p-2 rounded-lg glass text-gray-400 hover:text-green-400" title="Mark read">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button onClick={async () => { await contactApi.delete(msg._id); setMessages(prev => prev.filter(m => m._id !== msg._id)) }}
                        className="p-2 rounded-lg glass text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
