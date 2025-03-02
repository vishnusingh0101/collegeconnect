const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

exports.signUp = async (req, res) => {
    try {
        const { name, mail, mobile, password } = req.body;

        if (!name || !mail || !mobile || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create new user
        const newUser = new User({
            name: name.trim(),
            mail: mail.trim(),
            mobile: mobile.trim(),
            password: hashedPassword,
            collegeid: null,
            emailIsVerified: false, 
            emailVerificationToken,
            phoneIsVerified: false
        });

        await newUser.save();

        //Send verification email
        sendVerificationEmail(newUser.mail, verificationToken);

        return res.status(201).json({
            success: true,
            message: "User registered successfully! Please verify your email."
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

function generateToken(id, name) {
    return jwt.sign({userId: id, name: name}, 'secretVishnu');
}

exports.login = async (req, res) => {
    try {
        const { mail, password } = req.body;

        // Validate input fields
        if (!mail || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required!" });
        }

        // Check if user exists
        const user = await User.findOne({ mail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Compare passwords securely
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        // Generate token
        const token = generateToken(user.id, user.name);

        return res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token,
            user: {
                name: user.name,
                mail: user.mail,
                mobile: user.mobile,
                registeras: user.registeras,
                joinas: user.joinas,
                email: user.emailIsVerified,
                phone: user.phoneIsVerified
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Find user with the token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token!" });
        }

        // Mark email as verified
        user.isVerified = true;
        user.emailVerificationToken = undefined; // Remove token after verification
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully!" });

    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};