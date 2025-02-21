const nodemailer = require('nodemailer');
require('dotenv').config();  // Load environment variables

const sendVerificationEmail = async (userEmail, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com", // Sendinblue SMTP host
            port: 587,  // Recommended port for TLS
            secure: false, // Use `false` for TLS, `true` for SSL
            auth: {
                user: process.env.SENDINBLUE_EMAIL, // Sendinblue email
                pass: process.env.SENDINBLUE_SMTP_KEY // Sendinblue SMTP key
            }
        });

        const verificationLink = `http://localhost:5000/email/verify/${token}`;

        const mailOptions = {
            from: `"Your App Name" <${process.env.SENDINBLUE_EMAIL}>`,  // Use verified sender email
            to: userEmail,
            subject: 'Verify Your Email',
            html: `
                <h2>Email Verification</h2>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}" style="display:inline-block;padding:10px 15px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent!");

    } catch (error) {
        console.error("❌ Error sending verification email:", error);
    }
};

module.exports = sendVerificationEmail;
