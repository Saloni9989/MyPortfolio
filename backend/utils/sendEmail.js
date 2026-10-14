const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: to || process.env.EMAIL_TO,
      subject,
      html,
    })

    console.log('📧 Email sent successfully')
  } catch (error) {
    console.error('Email send failed:', error.message)
    // Don't throw — email failure shouldn't break the API
  }
}

module.exports = sendEmail
