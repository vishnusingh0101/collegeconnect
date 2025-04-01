const User = require('../model/user');
const ScheduleCall = require('../model/ScheduleCall');
const Student = require('../model/studentlist');
const Alumni = require('../model/alumnilist');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const axios = require('axios');

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const JWT_SECRET = process.env.JWT_SECRET;
console.log(MSG91_AUTH_KEY);
console.log(MSG91_SENDER_ID);
console.log(MSG91_TEMPLATE_ID);
console.log(JWT_SECRET);

// Validate phone number
const isValidPhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

// Generate JWT token
const generateToken = (id, name) => {
    return jwt.sign({ userId: id, name }, JWT_SECRET, { expiresIn: '7d' });
};

// Send OTP using MSG91
const sendOTP = async (phone, otp) => {
    // process.env.MSG91_AUTH_KEY='395515AY2hQSax64494ec4P1'
    // process.env.MSG91_SENDER_ID='PRVIDR'
    // process.env.MSG91_TEMPLATE_ID='646c9410d6fc0575cf7d4903'
    // process.env.JWT_SECRET='HTRDUTD6U5RK6UR5dfghjkjhgfcvbmnb345678fghjDFGHJ567dfgb56yuCHRTDY5YD5687T5E56L7I'
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
            phone: phone.trim(),
            password: hashedPassword,
            phoneIsVerified: false,
            emailIsVerified: false,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000 
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

        if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });
        }

        // Mark phone as verified
        user.phoneIsVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id, user.name);

        return res.status(200).json({ 
            success: true, 
            message: "Phone number verified successfully!", 
            token 
        });

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
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Update the existing user document instead of creating a new one
            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; 

            await user.save();
            await sendOTP(phone, otp);

            return res.status(403).json({ success: false, message: "Phone number not verified! Please verify OTP first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const token = generateToken(user.id);

        return res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token,
            user: { id: user.id, name: user.name, phone: user.phone }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Schedule a Call after payment
exports.scheduleCall = async (req, res) => {
    try {
        const { userId, participantId, participantType, date, time, duration, paymentId, paymentSignature, transactionId, amount } = req.body;

        // Validate duration
        const allowedDurations = [15, 30, 60];
        if (!allowedDurations.includes(duration)) {
            return res.status(400).json({
                success: false,
                message: "Invalid duration. Allowed: 15, 30, 60 minutes.",
            });
        }

        const participantModelMap = {
            student: Student,
            alumni: Alumni,
        };
        const ParticipantCollection = participantModelMap[participantType.toLowerCase()];
        if (!ParticipantCollection) {
            return res.status(400).json({ success: false, message: "Invalid participant type. Use 'student' or 'alumni'." });
        }

        const participant = await ParticipantCollection.findById(participantId);
        if (!participant) {
            return res.status(404).json({ success: false, message: `${participantType} not found.` });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const dateTime = moment(`${date}T${time}`).toDate();

        const existingCall = await ScheduleCall.findOne({
            $or: [{ caller: userId }, { participant: participantId }],
            dateTime,
        });
        if (existingCall) {
            return res.status(400).json({
                success: false,
                message: "User or participant already has a call at this time.",
            });
        }

        if (!paymentId || !paymentSignature) {
            return res.status(400).json({ success: false, message: "Payment ID and Signature are required to schedule the call." });
        }

       
        const isPaymentVerified = await verifyPayment(paymentId, paymentSignature);
        if (!isPaymentVerified) {
            return res.status(400).json({ success: false, message: "Payment verification failed." });
        }

        const paymentDetails = {
            paymentId,
            transactionId,
            amount,
            paymentDate: new Date(),
            paymentGateway: "Razorpay", 
        };

        const newCall = new ScheduleCall({
            caller: userId,
            participant: participantId,
            participantModel: participantType.toLowerCase(), 
            dateTime,
            duration,
            status: "Scheduled", 
            paymentDetails, 
        });

        await newCall.save();

        user.scheduledCalls.push(newCall._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Call scheduled successfully!",
            call: newCall,
        });
    } catch (error) {
        console.error("Error scheduling call:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};