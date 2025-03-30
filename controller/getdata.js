const mongoose = require('mongoose');
const Colleges = require('../model/collegeslist');
const Alumni = require('../model/alumnilist');
const Student = require('../model/studentlist');
const fs = require('fs');


//controller to get all the collegelist
exports.collegeList = async (req, res) => {
    try {
        const colleges = await Colleges.find(); 
        res.status(200).json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

exports.alumniList = async (req, res) => {
    try {
        const alumni = await Alumni.find(); 
        res.status(200).json({
            success: true,
            count: alumni.length,
            data: alumni
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

exports.studentList = async (req, res) => {
    try {
        const student = await Student.find(); 
        res.status(200).json({
            success: true,
            count: student.length,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
