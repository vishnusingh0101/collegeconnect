const uuid = require('uuid');
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../model/user');
require('dotenv').config();

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// Utility: Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Utility: Hash password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

//Send OTP using MSG91
const sendOTP = async (phone, otp) => {
    try {
        const response = await axios.post('https://control.msg91.com/api/v5/otp',
            {
                mobile: `91${phone}`,
                otp: otp,
                sender: MSG91_SENDER_ID,
                template_id: MSG91_TEMPLATE_ID
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authkey': MSG91_AUTH_KEY
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error.response?.data || error.message);
        throw new Error("Failed to send OTP");
    }
};

// request-password-reset
exports.requestPasswordReset = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: "Phone is required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
        await sendOTP(phone, otp);
        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

//verify-password-reset
exports.verifyPasswordResetOTP = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.otpVerifiedForReset = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified. You can now reset your password." });
};

//reset-password
exports.resetPassword = async (req, res) => {
    const { phone, newPassword } = req.body;

    if (!phone || !newPassword) {
        return res.status(400).json({ success: false, message: "Phone and new password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.otpVerifiedForReset) {
        return res.status(403).json({ success: false, message: "OTP verification required" });
    }

    user.password = await hashPassword(newPassword);
    user.otpVerifiedForReset = false;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
};


// Send OTP via MSG91
// const sendResetOTP = async (number, otp) => {
//     try {
//         const payload = {
//             mobiles: number,
//             authkey: MSG91_AUTH_KEY,
//             message: `Your password reset OTP is: ${otp}. Do not share this OTP.`,
//             sender: MSG91_SENDER_ID,
//             route: 4, // Transactional route
//         };

//         const response = await axios.post(`https://api.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}`, payload, {
//             headers: { 'Content-Type': 'application/json' }
//         });

//         return response.data;
//     } catch (error) {
//         console.error("Error sending OTP:", error.message);
//         throw new Error("Failed to send OTP for password reset");
//     }
// };

// Forgot password
// const forgotpassword = async (req, res) => {
//     try {
//         const { number } = req.body;

//         const user = await User.findOne({ number });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
//         const uid = uuid.v4();

//         await Forgotpassword.create({ uuid: uid, active: true, userId: user._id, otp });

//         await sendResetOTP(number, otp);

//         res.status(200).json({ message: 'OTP sent to your mobile number', success: true });
//     } catch (error) {
//         console.error("Error in forgot password:", error.message);
//         res.status(500).json({ message: 'Internal Server Error', success: false });
//     }
// };

// Verify OTP & provide reset link
// const verifyOtp = async (req, res) => {
//     try {
//         const { number, otp } = req.body;

//         const forgotpassword = await Forgotpassword.findOne({ otp, active: true }).populate('userId');
//         if (!forgotpassword || forgotpassword.userId.number !== number) {
//             return res.status(400).json({ message: 'Invalid OTP or expired', success: false });
//         }

//         const resetLink = `http://yourwebsite.com/password/resetpassword/${forgotpassword.uuid}`;
//         res.status(200).json({ message: 'OTP verified. Use reset link.', resetLink, success: true });
//     } catch (error) {
//         console.error("Error verifying OTP:", error.message);
//         res.status(500).json({ message: 'Internal Server Error', success: false });
//     }
// };

// Update password
// const updatepassword = async (req, res) => {
//     try {
//         const { newPass } = req.body;
//         const { id } = req.params;

//         const forgotpassword = await Forgotpassword.findOne({ uuid: id, active: true });
//         if (!forgotpassword) {
//             return res.status(400).json({ message: 'Invalid or expired reset link', success: false });
//         }

//         const user = await User.findById(forgotpassword.userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found', success: false });
//         }

//         user.password = await bcrypt.hash(newPass, 10);
//         await user.save();

//         forgotpassword.active = false;
//         await forgotpassword.save();

//         res.status(200).json({ message: 'Password updated successfully', success: true });
//     } catch (error) {
//         console.error("Error updating password:", error.message);
//         res.status(500).json({ message: 'Internal Server Error', success: false });
//     }
// };

// module.exports = {
//     forgotpassword,
//     verifyOtp,
//     updatepassword
// };
