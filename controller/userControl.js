const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate phone number
const isValidPhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

// Generate JWT token
const generateToken = (id, name) => {
    return jwt.sign({ userId: id, name }, JWT_SECRET, { expiresIn: '7d' });
};

// Send OTP using MSG91
const sendOTP = async (phone, otp) => {
    try {
        const response = await axios.post('https://control.msg91.com/api/v5/otp', {
            authkey: MSG91_AUTH_KEY,
            mobile: `91${phone}`,
            otp: otp,
            sender: MSG91_SENDER_ID,
            template_id: MSG91_TEMPLATE_ID
        });
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error.response?.data || error.message);
        throw new Error("Failed to send OTP");
    }
};

// User Signup
exports.signUp = async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        if (!name || !phone || !password ) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number!" });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Phone number already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            name: name.trim(),
            mail: mail ? mail.trim() : null,
            phone: phone.trim(),
            password: hashedPassword,
            phoneIsVerified: false,
            emailIsVerified: false,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
        });

        await newUser.save();
        await sendOTP(phone, otp);

        return res.status(201).json({ success: true, message: "User registered! Verify OTP to activate your account." });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: "Phone and OTP are required!" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });
        }

        user.phoneIsVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Phone number verified successfully!" });

    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required!" });
        }
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number format!" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTP(phone, otp);
        return res.status(200).json({ success: true, message: "OTP sent successfully!" });

    } catch (error) {
        console.error("Resend OTP error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: "Phone and password are required!" });
        }

        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number format!" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found! Please check your number." });
        }

        if (!user.phoneIsVerified) {
            return res.status(403).json({ success: false, message: "Phone number not verified! Please verify OTP first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const token = generateToken(user.id, user.name);

        return res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token,
            user: {
                name: user.name,
                mail: user.mail,
                phone: user.phone,
                registeras: user.registeras,
                emailVerified: user.emailIsVerified,
                phoneVerified: user.phoneIsVerified
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
