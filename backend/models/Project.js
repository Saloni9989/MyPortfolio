const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    githubLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'Other'],
      default: 'Full Stack',
    },
    problemStatement: { type: String, default: '' },
    architecture: { type: String, default: '' },
    screenshots: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)
