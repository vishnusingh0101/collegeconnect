const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Function to send verification email
const sendVerificationEmail = async (userEmail, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.sendinblue.com', 
            port: 587,  
            secure: false, // Use false for TLS
            auth: {
                user: process.env.SENDINBLUE_EMAIL, 
                pass: process.env.SENDINBLUE_SMTP_KEY,
            },
        });

        // Ensure all required environment variables are set
        if (!process.env.SENDINBLUE_EMAIL || !process.env.SENDINBLUE_SMTP_KEY) {
            throw new Error('Sendinblue credentials are missing!');
        }

        const verificationLink = `http://localhost:5000/email/verify/${token}`;

        // Define email content and options
        const mailOptions = {
            from: `"Your App Name" <${process.env.SENDINBLUE_EMAIL}>`,
            to: userEmail,
            subject: 'Verify Your Email',
            html: `
                <h2>Email Verification</h2>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}" style="display:inline-block;padding:10px 15px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent:", info.messageId);

    } catch (error) {
        console.error("Error sending verification email:", error.message);
        throw new Error('Failed to send verification email');
    }
};

module.exports = sendVerificationEmail;