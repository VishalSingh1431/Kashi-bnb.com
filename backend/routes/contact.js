import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create a Nodemailer transporter using the same config as OTP emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  pool: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact request endpoint - saves contact info and sends email
router.post('/contact-request', async (req, res) => {
  const { name, phone } = req.body;

  try {
    // Send email notification to vishalsingh05072003@gmail.com
    const mailOptions = {
      from: "info@kashibnb.com <Kashi-BnB>",
      to: 'vishalsingh05072003@gmail.com',
      subject: 'New Contact Request - Call Back Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">KASHI-BnB</h1>
              <p style="color: #666; margin: 10px 0 0 0;">New Contact Request</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Call Back Request</h2>
              <p style="color: #666; margin: 0 0 20px 0; line-height: 1.5;">
                A new customer has requested a call back. Please contact them as soon as possible.
              </p>
              
              <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <div style="margin-bottom: 10px;">
                  <strong>Customer Name:</strong> ${name}
                </div>
                <div>
                  <strong>Phone Number:</strong> ${phone}
                </div>
              </div>
              
              <p style="color: #666; margin: 20px 0 0 0; font-size: 14px; text-align: center;">
                <strong>Action Required:</strong> Please call this customer back
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0;">This is an automated notification from your website.</p>
              <p style="margin: 10px 0 0 0;">For support, contact us at support@kashibnb.com</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 KASHI-BnB. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Contact request submitted successfully. We will call you back soon!' 
    });
    
  } catch (error) {
    console.error('Error processing contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit contact request. Please try again later.' 
    });
  }
});

// Legacy endpoint for backward compatibility
router.post('/send-contact-email', async (req, res) => {
  const { name, phone } = req.body;

  try {
    const mailOptions = {
      from: "info@kashibnb.com <Kashi-BnB>",
      to: 'vishalsingh05072003@gmail.com',
      subject: 'New Contact Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">KASHI-BnB</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Contact Request</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">New Contact Request</h2>
              <p style="color: #666; margin: 0 0 20px 0; line-height: 1.5;">
                A new customer has submitted a contact request.
              </p>
              
              <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <div style="margin-bottom: 10px;">
                  <strong>Name:</strong> ${name}
                </div>
                <div>
                  <strong>Phone:</strong> ${phone}
                </div>
              </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0;">This is an automated notification from your website.</p>
              <p style="margin: 10px 0 0 0;">For support, contact us at support@kashibnb.com</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 KASHI-BnB. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

export default router;