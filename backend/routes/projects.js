const express = require('express')
const router = express.Router()
const multer = require('multer')
const { protect } = require('../middlewares/auth')
const {
  getProjects, getProject, createProject, updateProject, deleteProject
} = require('../controllers/projectController')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

router.get('/', getProjects)
router.get('/:id', getProject)
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), createProject)
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateProject)
router.delete('/:id', protect, deleteProject)

module.exports = router
