const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/auth')
const { sendMessage, getMessages, markRead, deleteMessage } = require('../controllers/contactController')

router.post('/', sendMessage)                    // Public - send message
router.get('/', protect, getMessages)            // Admin - view all
router.put('/:id/read', protect, markRead)       // Admin - mark as read
router.delete('/:id', protect, deleteMessage)    // Admin - delete

module.exports = router
