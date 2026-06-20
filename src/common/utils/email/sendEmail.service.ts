import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer/index";





export const sendEmail = async (mailOptions: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // tls: {
    //   rejectUnauthorized: false,
    // },
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    ...mailOptions
  });
  console.log("message sent to: ",info.messageId)
  return info.accepted.length > 0 ? true : false;
};

export const generateOTP = async () => {
  return Math.floor(Math.random() * 900000 + 100000);
}

