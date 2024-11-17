const nodemailer = require('nodemailer');
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter for email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM_USER,
    pass: process.env.EMAIL_FROM_PASS,
  },
});

export async function sendEmail(subject: string, text: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM_USER,
    to: process.env.EMAIL_TO_USER,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}