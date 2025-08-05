// In your backend route file (e.g., routes/contact.js)
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-contact-email', async (req, res) => {
  const { name, phone } = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your email password or app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'vishalsingh05072003@gmail.com',
    subject: 'New Contact Request',
    text: `Name: ${name}\nPhone: ${phone}`,
    html: `
      <h3>New Contact Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;