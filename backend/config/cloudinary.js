const cloudinary = require('cloudinary').v2
const multer = require('multer')
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Upload buffer to Cloudinary and return URL
const uploadToCloudinary = (buffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

module.exports = { cloudinary, upload, uploadToCloudinary }
