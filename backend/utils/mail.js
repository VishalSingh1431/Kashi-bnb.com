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
      from: "shantanubonerjee@gmail.com <Kashi-BnB>",
      to: toEmail,
      subject: "KASHI-BnB: verify your mail",
      html: `<p>Click the link below to verify your email:</p>
            <a href="${process.env.BACK_URL}/api/v1/user/signup/verify/?token=${token}&email=${toEmail}">Verify Email</a>` ,
    };
    if (!transporter) {
      throw new Error("Transporter is not defined.");
    }
  
    await transporter.sendMail(mailOptions).catch((error) => {
      throw new Error(error);
    });

    return;
  };
    // sendEmail("singhsubrat35@gmail.com","gogogo");
