const Contact = require('../models/Contact')
const sendEmail = require('../utils/sendEmail')

// POST /api/contact - Public
const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' })
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' })
    }

    // Save to DB
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: req.ip || '',
    })

    // Send notification email to owner
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendEmail({
        to: process.env.EMAIL_TO,
        subject: `📬 New Portfolio Message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 12px; border: 1px solid #333;">
            <h2 style="color: #a855f7; margin-bottom: 20px;">New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 100px;">From:</td><td style="color: #fff; font-weight: bold;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Email:</td><td><a href="mailto:${email}" style="color: #22d3ee;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Subject:</td><td style="color: #fff;">${subject}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #1a1a2e; border-radius: 8px; border-left: 3px solid #a855f7;">
              <p style="color: #ccc; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color: #555; font-size: 12px; margin-top: 20px;">Received at ${new Date().toLocaleString()}</p>
          </div>
        `,
      })

      // Auto-reply to sender
      await sendEmail({
        to: email,
        subject: `Thanks for reaching out, ${name}! 👋`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 12px; border: 1px solid #333;">
            <h2 style="color: #a855f7;">Hi ${name}! 👋</h2>
            <p style="color: #ccc; line-height: 1.6;">Thank you for getting in touch. I've received your message and will get back to you within 24 hours.</p>
            <div style="margin: 20px 0; padding: 15px; background: #1a1a2e; border-radius: 8px; border-left: 3px solid #22d3ee;">
              <p style="color: #888; margin: 0; font-size: 14px;">Your message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"</p>
            </div>
            <p style="color: #ccc;">Best regards,<br><strong style="color: #a855f7;">Saloni Singh</strong><br>Software Developer</p>
          </div>
        `,
      })
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: { id: contact._id },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/contact - Protected (admin)
const getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, count: messages.length, data: messages })
  } catch (error) {
    next(error)
  }
}

// PUT /api/contact/:id/read - Protected
const markRead = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, data: message })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/contact/:id - Protected
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id)
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, message: 'Message deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { sendMessage, getMessages, markRead, deleteMessage }
