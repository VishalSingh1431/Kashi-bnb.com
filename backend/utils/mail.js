import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { google } from 'googleapis';

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(process.env.GM_CID,process.env.GM_SC,process.env.GM_RDRURI);
oAuth2Client.setCredentials({
    refresh_token: process.env.GM_RFT,
    // access_token:acessToken
});




export const sendVerificationEmail = async (email, token) => {
    try {
        // const accessToken = await oAuth2Client.getAccessToken();
        // console.log(acessToken);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Or use a custom SMTP provider
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER, // Your email (e.g., Gmail)
                clientId: process.env.GM_CID,  // App password or actual password 
                clientSecret: process.env.GM_SC,
                refreshToken: process.env.GM_RFT,
                accessToken: acessToken
            }
        });
        const mailOptions = {
            from: '"VaranasiBnB" <shantanubonerjee@gmail.com>',
            to: email,
            subject: "Email Verification",
            html: `<p>Click the link below to verify your email:</p>
            <a href="${process.env.BACK_URL}/api/v1/user/signup/verify/${token}">Verify Email</a>`
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// await transporter.verify()
sendVerificationEmail("singhsubrat35@gmail.com","gogogo");