const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/auth')
const {
  getAchievements, createAchievement, updateAchievement, deleteAchievement
} = require('../controllers/achievementController')

router.get('/', getAchievements)
router.post('/', protect, createAchievement)
router.put('/:id', protect, updateAchievement)
router.delete('/:id', protect, deleteAchievement)

module.exports = router
