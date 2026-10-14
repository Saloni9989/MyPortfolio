const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' })
    }

    // Check env-based admin first (simple setup)
    const envUsername = process.env.ADMIN_USERNAME
    const envPassword = process.env.ADMIN_PASSWORD

    if (envUsername && envPassword) {
      if (username === envUsername && password === envPassword) {
        const token = generateToken('admin', username)
        return res.json({ success: true, token, username })
      }
    }

    // Check DB admin
    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = generateToken(admin._id, admin.username)
    res.json({ success: true, token, username: admin.username })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/register (first-time setup)
const register = async (req, res, next) => {
  try {
    const { username, password, setupKey } = req.body

    // Require a setup key to prevent unauthorized admin creation
    if (setupKey !== process.env.JWT_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid setup key' })
    }

    const existing = await Admin.findOne({ username })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists' })
    }

    const admin = await Admin.create({ username, password })
    const token = generateToken(admin._id, admin.username)

    res.status(201).json({ success: true, token, username: admin.username })
  } catch (error) {
    next(error)
  }
}

module.exports = { login, register }
