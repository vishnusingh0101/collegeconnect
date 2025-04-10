const User = require('../model/user');
const ScheduleCall = require('../model/ScheduleCall');
const studentlist = require('../model/studentlist');
const alumnilist = require('../model/alumnilist');

const Razorpay = require("razorpay");
const crypto = require("crypto");

const { createGoogleMeet } = require('../utils/googleCalender');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

require('dotenv').config();
const axios = require('axios');

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate phone number
const isValidPhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

// Generate JWT token
const generateToken = (id, name, phone) => {
    return jwt.sign({ userId: id, name, phone }, JWT_SECRET, { expiresIn: '7d' });
};

// Send OTP using MSG91
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

// User Signup
exports.signUp = async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        if (!name || !phone || !password) {
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

        // Prepare response user data (excluding sensitive fields)
        const userObj = newUser.toObject();
        delete userObj.password;
        delete userObj.otp;
        delete userObj.otpExpires;
        delete userObj.otpVerifiedForReset;

        return res.status(201).json({
            success: true,
            message: "User registered! Verify OTP to activate your account.",
            user: userObj
        });

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
        const token = generateToken(user._id, user.name, user.phone);

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

        const user = await User.findOne({ phone })
            .populate('about')
            .populate('prices')
            .populate('scheduledCalls');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found! Please check your number." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        if (!user.phoneIsVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000;

            await user.save();
            await sendOTP(phone, otp);

            return res.status(403).json({ success: false, message: "Phone number not verified! Please verify OTP first." });
        }

        const token = generateToken(user.id, user.name, user.phone);

        // Convert Mongoose document to plain object
        const userObj = user.toObject();

        // Remove sensitive fields
        delete userObj.password;
        delete userObj.otp;
        delete userObj.otpExpires;
        delete userObj.otpVerifiedForReset;

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: userObj
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Schedule a Call after payment
// exports.scheduleCall = async (req, res) => {
//     try {
//         const { userId, participantId, participantType, date, time, duration, paymentId, paymentSignature, transactionId, amount } = req.body;

//         // Validate duration
//         const allowedDurations = [15, 30, 60];
//         if (!allowedDurations.includes(duration)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid duration. Allowed: 15, 30, 60 minutes.",
//             });
//         }

//         const participantModelMap = {
//             student: Student,
//             alumni: Alumni,
//         };
//         const ParticipantCollection = participantModelMap[participantType.toLowerCase()];
//         if (!ParticipantCollection) {
//             return res.status(400).json({ success: false, message: "Invalid participant type. Use 'student' or 'alumni'." });
//         }

//         const participant = await ParticipantCollection.findById(participantId);
//         if (!participant) {
//             return res.status(404).json({ success: false, message: `${participantType} not found.` });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }

//         const dateTime = moment(`${date}T${time}`).toDate();

//         const existingCall = await ScheduleCall.findOne({
//             $or: [{ caller: userId }, { participant: participantId }],
//             dateTime,
//         });
//         if (existingCall) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User or participant already has a call at this time.",
//             });
//         }

//         if (!paymentId || !paymentSignature) {
//             return res.status(400).json({ success: false, message: "Payment ID and Signature are required to schedule the call." });
//         }

       
//         // const isPaymentVerified = await verifyPayment(paymentId, paymentSignature);
//         // if (!isPaymentVerified) {
//         //     return res.status(400).json({ success: false, message: "Payment verification failed." });
//         // }

//         const paymentDetails = {
//             paymentId,
//             transactionId,
//             amount,
//             paymentDate: new Date(),
//             paymentGateway: "Razorpay", 
//         };

//         const newCall = new ScheduleCall({
//             caller: userId,
//             participant: participantId,
//             participantModel: participantType.toLowerCase(),
//             dateTime,
//             duration,
//             status: "Scheduled", 
//             paymentDetails, 
//         });

//         await newCall.save();

//         user.scheduledCalls.push(newCall._id);
//         await user.save();

//         res.status(201).json({
//             success: true,
//             message: "Call scheduled successfully!",
//             call: newCall,
//         });
//     } catch (error) {
//         console.error("Error scheduling call:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };


// Assuming razorpayInstance is initialized somewhere
// const razorpayInstance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

exports.scheduleCall = async (req, res) => {
    try {
        const {
            userId,
            participantId,
            participantType,
            date,
            time,
            duration,
            paymentId,
            paymentSignature,
            transactionId,
            amount,
            callType,
        } = req.body;

        // Validate required fields
        if (!userId || !participantId || !participantType || !date || !time || !duration || !paymentId || !paymentSignature || !transactionId || !amount || !callType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Validate duration
        const allowedDurations = [15, 30, 60];
        if (!allowedDurations.includes(duration)) {
            return res.status(400).json({
                success: false,
                message: "Invalid duration. Allowed values: 15, 30, 60 minutes.",
            });
        }

        // Get participant model
        const participantModelMap = {
            studentlist: studentlist,
            alumnilist: alumnilist,
        };
        const ParticipantCollection = participantModelMap[participantType.toLowerCase()];
        if (!ParticipantCollection) {
            return res.status(400).json({
                success: false,
                message: "Invalid participant type. Use 'studentlist' or 'alumnilist'.",
            });
        }

        // Fetch participant
        const participant = await ParticipantCollection.findById(participantId);
        if (!participant) {
            return res.status(404).json({
                success: false,
                message: `${participantType} not found.`,
            });
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const startTime = moment(`${date}T${time}`);
        const endTime = startTime.clone().add(duration, 'minutes');
        const dateTime = startTime.toDate();

        // Scheduling conflict check
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

        // Validate payment signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${transactionId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== paymentSignature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        // Generate Google Meet link
        let meetLink = null;
        try {
            meetLink = await createGoogleMeet({
                startTime,
                endTime,
                user,
                participant,
            });
        } catch (err) {
            console.error("Google Meet error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Failed to generate Google Meet link.",
            });
        }

        // Construct payment details
        const paymentDetails = {
            paymentId,
            transactionId,
            amount,
            paymentDate: new Date(),
            paymentGateway: "Razorpay",
        };

        // Create and save call record
        const newCall = new ScheduleCall({
            caller: userId,
            participant: participantId,
            participantModel: participantType.toLowerCase(),
            dateTime,
            duration,
            callType,
            status: "Scheduled",
            paymentDetails,
            meetLink,
        });

        await newCall.save();

        // Add call to user's record
        user.scheduledCalls.push(newCall._id);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Call scheduled successfully!",
            call: newCall,
            meetLink, // easy access
        });

    } catch (error) {
        console.error("Unexpected error in scheduleCall:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getCalls = async (req, res) => {
    try {
        const { participantId, date } = req.query;

        if (!participantId) {
            return res.status(400).json({ success: false, message: "Participant ID is required" });
        }

        const query = { participant: participantId };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.dateTime = { $gte: startOfDay, $lte: endOfDay };
        }

        const calls = await ScheduleCall.find(query)
            .populate('caller', '-password -otp -otpExpires') 
            .populate({
                path: 'participant',
                model: doc => doc.participantModel,
                select: '-password -otp -otpExpires'
            });

        return res.status(200).json({
            success: true,
            count: calls.length,
            data: calls
        });

    } catch (error) {
        console.error("Error fetching calls:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};