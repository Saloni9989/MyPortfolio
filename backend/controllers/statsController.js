const Project = require('../models/Project')
const Certificate = require('../models/Certificate')
const Achievement = require('../models/Achievement')
const Contact = require('../models/Contact')

const getStats = async (req, res, next) => {
  try {
    const [projects, certs, achievements, messages, unread] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Achievement.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
    ])

    res.json({
      success: true,
      data: {
        projects,
        certificates: certs,
        achievements,
        messages,
        unreadMessages: unread,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getStats }
