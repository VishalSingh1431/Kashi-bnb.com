import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { MailtrapTransport } from 'mailtrap';

dotenv.config();


// const transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "8b77b35d1c8257",
//       pass: "cb1fb4812d7634"
//     }
//   });

// const sender = {
//   address: "cont@vbnb.com",
//   name: "VransBnB",
// };
// const recipients =
//   "shantanubonerjee@gmail.com";

// transport
//   .sendMail({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//     sandbox: true
//   })
//   .then(console.log, console.error);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Or use a custom SMTP provider
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER, // Your email (e.g., Gmail)
        pass: process.env.EMAIL_PASS,  // App password or actual password 
    }
})

export const sendVerificationEmail = async (email, token) => {
    try {
        const mailOptions = {
            from: '"Your App Name" <your-email@gmail.com>',
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

await transporter.verify()
// sendVerificationEmail("singhsubrat35@gmail.com","gogogo");