const Achievement = require('../models/Achievement')

const getAchievements = async (req, res, next) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const achievements = await Achievement.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, count: achievements.length, data: achievements })
  } catch (error) {
    next(error)
  }
}

const createAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body)
    res.status(201).json({ success: true, data: achievement })
  } catch (error) {
    next(error)
  }
}

const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' })
    res.json({ success: true, data: achievement })
  } catch (error) {
    next(error)
  }
}

const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id)
    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' })
    res.json({ success: true, message: 'Achievement deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAchievements, createAchievement, updateAchievement, deleteAchievement }
