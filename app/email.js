// utils/email.js

'use server'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  // debug: true, // Enable debug mode
  // logger: true, // Enable logger
});


/**
 * Sends a welcome email to the specified recipient.
 * 
 * This function uses Nodemailer to send an email with a customizable subject and HTML body.
 * 
 * @param {string} to - The sender's email address or a string of anything entirely that indicates where the mail is coming from.
 * @param {string} to - The recipient's email address. This can be a single email address, a comma-separated string, or an array of email addresses.
 * @param {string} text - The text line of the email. This is what appears with the subject in the gmail notification and if the receiver mail doesn't render html.
 * @param {string} subject - The subject line of the email. This is what appears as the email's subject.
 * @param {string} html - The HTML content of the email. This is the main content displayed in the email body.
 * 
 * @returns {Promise<void>} - A promise that resolves when the email has been sent successfully.
 * 
 * @throws {Error} - Throws an error if there is an issue sending the email, such as connection issues or invalid email addresses.
 */

export async function sendWelcomeEmail(from, to, text, subject, html) {
  const mailOptions = {
    from, // sender address
    to, // list of receivers
    text,
    subject, // Subject line
    html, // HTML body content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}


