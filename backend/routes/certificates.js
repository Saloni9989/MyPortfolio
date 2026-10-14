const express = require('express')
const router = express.Router()
const multer = require('multer')
const { protect } = require('../middlewares/auth')
const {
  getCertificates, createCertificate, updateCertificate, deleteCertificate
} = require('../controllers/certificateController')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

router.get('/', getCertificates)
router.post('/', protect, upload.single('image'), createCertificate)
router.put('/:id', protect, upload.single('image'), updateCertificate)
router.delete('/:id', protect, deleteCertificate)

module.exports = router
