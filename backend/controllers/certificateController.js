const Certificate = require('../models/Certificate')

let uploadToCloudinary
try {
  uploadToCloudinary = require('../config/cloudinary').uploadToCloudinary
} catch (e) {
  uploadToCloudinary = null
}

const uploadFileIfPresent = async (file) => {
  if (!file || !uploadToCloudinary) return ''
  try {
    return await uploadToCloudinary(file.buffer, 'portfolio/certificates')
  } catch {
    return ''
  }
}

const getCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, count: certs.length, data: certs })
  } catch (error) {
    next(error)
  }
}

const createCertificate = async (req, res, next) => {
  try {
    const { title, organization, issueDate, credentialLink, order } = req.body
    const imageUrl = req.file ? await uploadFileIfPresent(req.file) : (req.body.imageUrl || '')

    const cert = await Certificate.create({
      title, organization, issueDate,
      credentialLink: credentialLink || '',
      imageUrl,
      order: parseInt(order) || 0,
    })

    res.status(201).json({ success: true, data: cert })
  } catch (error) {
    next(error)
  }
}

const updateCertificate = async (req, res, next) => {
  try {
    const updates = { ...req.body }
    if (req.file) updates.imageUrl = await uploadFileIfPresent(req.file)

    const cert = await Certificate.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    })
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' })

    res.json({ success: true, data: cert })
  } catch (error) {
    next(error)
  }
}

const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id)
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' })

    res.json({ success: true, message: 'Certificate deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCertificates, createCertificate, updateCertificate, deleteCertificate }
