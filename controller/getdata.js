const Colleges = require('../model/collegeslist');
const Alumni = require('../model/alumnilist');
const Student = require('../model/studentlist');

// Get all colleges
exports.collegeList = async (req, res) => {
    try {
        const colleges = await Colleges.find(); 
        res.status(200).json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error) {
        console.error("Error fetching college list:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// Get all alumni
exports.alumniList = async (req, res) => {
    try {
        const alumni = await Alumni.find(); 
        res.status(200).json({
            success: true,
            count: alumni.length,
            data: alumni
        });
    } catch (error) {
        console.error("Error fetching alumni list:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// Get all students
exports.studentList = async (req, res) => {
    try {
        const student = await Student.find(); 
        res.status(200).json({
            success: true,
            count: student.length,
            data: student
        });
    } catch (error) {
        console.error("Error fetching student list:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
