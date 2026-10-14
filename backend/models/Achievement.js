const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['dsa', 'hackathon', 'training', 'academic', 'achievement'],
      default: 'achievement',
    },
    date: { type: String, required: true },
    link: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Achievement', achievementSchema)
