const uuid = require('uuid');
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Forgotpassword = require('../model/password');
require('dotenv').config();

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// Send OTP via MSG91
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

        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw new Error("Failed to send OTP for password reset");
    }
};

// Forgot password
const forgotpassword = async (req, res) => {
    try {
        const { number } = req.body;

        const user = await User.findOne({ number });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const uid = uuid.v4();

        await Forgotpassword.create({ uuid: uid, active: true, userId: user._id, otp });

        await sendResetOTP(number, otp);

        res.status(200).json({ message: 'OTP sent to your mobile number', success: true });
    } catch (error) {
        console.error("Error in forgot password:", error.message);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

// Verify OTP & provide reset link
const verifyOtp = async (req, res) => {
    try {
        const { number, otp } = req.body;

        const forgotpassword = await Forgotpassword.findOne({ otp, active: true }).populate('userId');
        if (!forgotpassword || forgotpassword.userId.number !== number) {
            return res.status(400).json({ message: 'Invalid OTP or expired', success: false });
        }

        const resetLink = `http://yourwebsite.com/password/resetpassword/${forgotpassword.uuid}`;
        res.status(200).json({ message: 'OTP verified. Use reset link.', resetLink, success: true });
    } catch (error) {
        console.error("Error verifying OTP:", error.message);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

// Update password
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

        forgotpassword.active = false;
        await forgotpassword.save();

        res.status(200).json({ message: 'Password updated successfully', success: true });
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

module.exports = {
    forgotpassword,
    verifyOtp,
    updatepassword
};
