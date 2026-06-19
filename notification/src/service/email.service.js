import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
});

transporter.verify((error, success) => {
  if (error) {
    error.message = "Error connecting to email server";
    throw error;
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"CodeSandBox" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

  } catch (error) {
    error.message = "Error sending email";
    throw error;
  }
};

export default sendEmail;