const uuid = require('uuid');
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Forgotpassword = require('../model/password');
require('dotenv').config();

// MSG91 API credentials
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// Function to send password reset OTP via MSG91 SMS
const sendResetOTP = async (number, otp) => {
    try {
        const payload = {
            mobiles: number,
            authkey: MSG91_AUTH_KEY,
            message: `Your password reset OTP is: ${otp}. Do not share this OTP.`,
            sender: MSG91_SENDER_ID,
            route: 4, // Transactional route
        };

        const response = await axios.post(`https://api.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log("OTP sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error.response?.data || error.message);
        throw new Error("Failed to send OTP for password reset");
    }
};

// Forgot Password (Generate Reset OTP)
const forgotpassword = async (req, res) => {
    try {
        const { number } = req.body;

        const user = await User.findOne({ number });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const uid = uuid.v4();

        await Forgotpassword.create({ uuid: uid, active: true, userId: user._id, otp });

        // Send OTP via MSG91
        await sendResetOTP(number, otp);

        return res.status(200).json({ message: 'OTP sent to your mobile number', success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

// Verify OTP & Provide Reset Link
const verifyOtp = async (req, res) => {
    try {
        const { number, otp } = req.body;

        const forgotpassword = await Forgotpassword.findOne({ otp, active: true }).populate('userId');
        if (!forgotpassword || forgotpassword.userId.number !== number) {
            return res.status(400).json({ message: 'Invalid OTP or expired', success: false });
        }

        const resetLink = `http://yourwebsite.com/password/resetpassword/${forgotpassword.uuid}`;
        return res.status(200).json({ message: 'OTP verified. Use reset link.', resetLink, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

// Reset Password (Update Password)
const updatepassword = async (req, res) => {
    try {
        const { newPass } = req.body;
        const { id } = req.params;

        const forgotpassword = await Forgotpassword.findOne({ uuid: id, active: true });
        if (!forgotpassword) {
            return res.status(400).json({ message: 'Invalid or expired reset link', success: false });
        }

        const user = await User.findById(forgotpassword.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        user.password = await bcrypt.hash(newPass, 10);
        await user.save();

        // Mark reset entry as used
        forgotpassword.active = false;
        await forgotpassword.save();

        return res.status(200).json({ message: 'Password updated successfully', success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

module.exports = {
    forgotpassword,
    verifyOtp,
    updatepassword
};