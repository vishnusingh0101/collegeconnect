const mongoose = require('mongoose');
const Colleges = require('../model/colleges');
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
