import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

  const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        pool: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
  });
  
  export const sendEmail = async (toEmail,token) => {
  
    const mailOptions = {
      from: "info@kashibnb.com <Kashi-BnB>",
      to: toEmail,
      bcc: "info@kashibnb.com",
      subject: "KASHI-BnB: verify your mail",
      html: `<p>Click the link below to verify your email:</p>
            <a href="${process.env.BACK_URL}/api/v1/user/signup/verify/?token=${token}&email=${toEmail}">Verify Email</a>
            <div style="margin-top:16px;color:#666;font-size:14px">For support, contact us at <strong>info@kashibnb.com</strong></div>` ,
    };
    if (!transporter) {
      throw new Error("Transporter is not defined.");
    }
  
    await transporter.sendMail(mailOptions).catch((error) => {
      throw new Error(error);
    });

    return;
  };

  // Send OTP email for verification
  export const sendOTPEmail = async (toEmail, otp, purpose = 'verification') => {
    const mailOptions = {
      from: "info@kashibnb.com <Kashi-BnB>",
      to: toEmail,
      bcc: "info@kashibnb.com",
      subject: `KASHI-BnB: ${purpose === 'signup' ? 'Email Verification for Signup' : purpose === 'verification' ? 'Email Verification' : 'OTP Code'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">KASHI-BnB</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Your trusted homestay platform</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">
                ${purpose === 'signup' ? 'Welcome to KASHI-BnB!' : purpose === 'verification' ? 'Email Verification Code' : 'Your OTP Code'}
              </h2>
              <p style="color: #666; margin: 0 0 20px 0; line-height: 1.5;">
                ${purpose === 'signup' 
                  ? 'Welcome! Please use the following verification code to complete your account creation:' 
                  : purpose === 'verification' 
                  ? 'Please use the following verification code to complete your email verification process:' 
                  : 'Please use the following OTP code to complete your verification process:'}
              </p>
              
              <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
              </div>
              
              <p style="color: #666; margin: 20px 0 0 0; font-size: 14px; text-align: center;">
                This code will expire in <strong>10 minutes</strong>
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              ${purpose === 'signup' 
                ? '<p style="margin: 0;">We\'re excited to have you join our community!</p>' 
                : '<p style="margin: 0;">If you didn\'t request this code, please ignore this email.</p>'}
              <p style="margin: 10px 0 0 0;">For support, contact us at <strong>info@kashibnb.com</strong></p>
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

    if (!transporter) {
      throw new Error("Transporter is not defined.");
    }

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error: error.message };
    }
  };

  // Send notification email for listing access requests
  export const sendNotificationEmail = async (toEmail, subject, message) => {
    const mailOptions = {
      from: "info@kashibnb.com <Kashi-BnB>",
      to: toEmail,
      bcc: "info@kashibnb.com",
      subject: `KASHI-BnB: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">KASHI-BnB</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Your trusted homestay platform</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">${subject}</h2>
              <div style="color: #666; margin: 0; line-height: 1.6; white-space: pre-line;">
                ${message}
              </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 10px 0 0 0;">For support, contact us at <strong>info@kashibnb.com</strong></p>
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

    if (!transporter) {
      throw new Error("Transporter is not defined.");
    }

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending notification email:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Send promotion notification email
  export const sendPromotionEmail = async (toEmail, promotionType, userName = '') => {
    const mailOptions = {
      from: "info@kashibnb.com <Kashi-BnB>",
      to: toEmail,
      bcc: "info@kashibnb.com",
      subject: `KASHI-BnB: Congratulations! You've been promoted to ${promotionType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">KASHI-BnB</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Your trusted homestay platform</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #28a745;">
              <h2 style="color: #155724; margin: 0 0 15px 0; font-size: 20px;">
                🎉 Congratulations on Your Promotion!
              </h2>
              <p style="color: #155724; margin: 0 0 20px 0; line-height: 1.5;">
                Dear ${userName || 'Valued User'},
              </p>
              <p style="color: #155724; margin: 0 0 20px 0; line-height: 1.5;">
                We're excited to inform you that your account has been <strong>promoted to ${promotionType}</strong> on KASHI-BnB!
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">
                What This Means for You:
              </h3>
              ${promotionType === 'hotel owner' ? `
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>✅ You can now list your properties on our platform</li>
                  <li>✅ Access to hotel management dashboard</li>
                  <li>✅ View and manage hotel bookings</li>
                  <li>✅ Set your own pricing and availability</li>
                  <li>✅ Upload property photos and descriptions</li>
                </ul>
                <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
                  <strong>Next Steps:</strong> Visit your profile page and go to the "My Hotels" tab to start listing your properties!
                </p>
              ` : promotionType === 'admin' ? `
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>✅ Full administrative access to the platform</li>
                  <li>✅ Manage user accounts and permissions</li>
                  <li>✅ Oversee hotel listings and bookings</li>
                  <li>✅ Access to system analytics and reports</li>
                  <li>✅ Handle support requests and disputes</li>
                </ul>
                <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
                  <strong>Next Steps:</strong> Visit your profile page to access admin features in the "Access Requests" and "All Users" tabs!
                </p>
              ` : promotionType === 'team member' ? `
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>✅ Help manage the platform and assist users</li>
                  <li>✅ Promote users to hotel and restaurant owners</li>
                  <li>✅ Access team member dashboard</li>
                  <li>✅ View and manage user listings</li>
                  <li>✅ Assist with platform operations</li>
                </ul>
                <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
                  <strong>Next Steps:</strong> Visit your profile page to access the team member dashboard and start helping manage the platform!
                </p>
              ` : ''}
            </div>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 16px;">
                Need Help?
              </h3>
              <p style="color: #856404; margin: 0 0 15px 0; line-height: 1.5;">
                If you have any questions about your new role or need assistance getting started, please don't hesitate to contact us:
              </p>
              <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>📧 Email: info@kashibnb.com</li>
                <li>📱 Phone: +91-XXXXXXXXXX</li>
                <li>💬 Live Chat: Available on our website</li>
              </ul>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0;">Welcome to your new role in the KASHI-BnB community!</p>
              <p style="margin: 10px 0 0 0;">We're excited to see what you'll accomplish.</p>
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

    if (!transporter) {
      throw new Error("Transporter is not defined.");
    }

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending promotion email:', error);
      return { success: false, error: error.message };
    }
  };
