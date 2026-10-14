const Project = require('../models/Project')

let uploadToCloudinary
try {
  uploadToCloudinary = require('../config/cloudinary').uploadToCloudinary
} catch (e) {
  uploadToCloudinary = null
}

const uploadFileIfPresent = async (file) => {
  if (!file || !uploadToCloudinary) return ''
  try {
    return await uploadToCloudinary(file.buffer, 'portfolio/projects')
  } catch {
    return ''
  }
}

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query
    const filter = {}
    if (category) filter.category = category
    if (featured) filter.featured = featured === 'true'

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, count: projects.length, data: projects })
  } catch (error) {
    next(error)
  }
}

// GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

// POST /api/projects (protected)
const createProject = async (req, res, next) => {
  try {
    const {
      title, description, techStack, features,
      githubLink, liveLink, category, problemStatement, architecture, featured, order
    } = req.body

    const imageFile = req.files?.image?.[0]
    const bannerFile = req.files?.banner?.[0]

    const [imageUrl, bannerUrl] = await Promise.all([
      uploadFileIfPresent(imageFile),
      uploadFileIfPresent(bannerFile),
    ])

    const project = await Project.create({
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : []),
      features: Array.isArray(features) ? features : (features ? features.split(',').map(s => s.trim()) : []),
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      imageUrl: imageUrl || req.body.imageUrl || '',
      bannerUrl: bannerUrl || req.body.bannerUrl || '',
      category: category || 'Full Stack',
      problemStatement: problemStatement || '',
      architecture: architecture || '',
      featured: featured === 'true' || featured === true,
      order: parseInt(order) || 0,
    })

    res.status(201).json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

// PUT /api/projects/:id (protected)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const updates = { ...req.body }

    if (updates.techStack && !Array.isArray(updates.techStack)) {
      updates.techStack = updates.techStack.split(',').map(s => s.trim())
    }
    if (updates.features && !Array.isArray(updates.features)) {
      updates.features = updates.features.split(',').map(s => s.trim())
    }

    const imageFile = req.files?.image?.[0]
    const bannerFile = req.files?.banner?.[0]

    if (imageFile) updates.imageUrl = await uploadFileIfPresent(imageFile)
    if (bannerFile) updates.bannerUrl = await uploadFileIfPresent(bannerFile)

    const updated = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/projects/:id (protected)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }
    res.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject }
