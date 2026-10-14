import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('admin_token')
    return Promise.reject(err)
  }
)

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/projects/${id}`),
}

export const certificatesApi = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/certificates/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/certificates/${id}`),
}

export const achievementsApi = {
  getAll: () => api.get('/achievements'),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
}

export const contactApi = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
}

export default api
