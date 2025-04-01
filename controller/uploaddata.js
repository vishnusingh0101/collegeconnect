const mongoose = require('mongoose');
const Colleges = require('../model/collegeslist');
const Students = require('../model/studentlist');
const Alumni = require('../model/alumnilist');
const fs = require('fs');
const path = require('path');

// Function to read JSON data
const readJSONFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return null;
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return null;
    }
};

// File paths for JSON data
const filePaths = {
    colleges: path.join(__dirname, '../alldata/CData.json'),
    students: path.join(__dirname, '../alldata/StudentData.json'),
    alumni: path.join(__dirname, '../alldata/AlumniData.json'),
};

// Backup and delete existing data
const backupAndDeleteExistingData = async (Model, collectionName) => {
    try {
        const existingData = await Model.find();
        if (existingData.length === 0) {
            console.log(`No existing data in ${collectionName}, skipping backup.`);
            return;
        }

        const backupCollectionName = `${collectionName}_backup_${Date.now()}`;
        const backupModel = mongoose.model(backupCollectionName, Model.schema);

        await backupModel.insertMany(existingData);
        console.log(`Backup created: ${backupCollectionName} (${existingData.length} records)`);

        await Model.deleteMany();
        console.log(`All existing data deleted from ${collectionName}`);
    } catch (error) {
        console.error(`Error creating backup for ${collectionName}:`, error.message);
    }
};

// Upload data function
const uploadData = async (Model, filePath, dataType, collectionName) => {
    try {
        const data = readJSONFile(filePath);
        if (!data) return;

        await backupAndDeleteExistingData(Model, collectionName);

        await Model.insertMany(data);
        console.log(`${dataType} Data Successfully Imported!`);
    } catch (error) {
        console.error(`Error importing ${dataType} data:`, error.message);
    }
};

// Function to upload all data (Colleges, Students, Alumni)
exports.uploadAllData = async (req, res) => {
    try {
        await uploadData(Colleges, filePaths.colleges, 'Colleges', 'colleges');
        await uploadData(Students, filePaths.students, 'Students', 'students');
        await uploadData(Alumni, filePaths.alumni, 'Alumni', 'alumni');

        res.status(201).json({ message: "All data uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading all data:", error.message);
        res.status(500).json({ message: "Error uploading data", error: error.message });
    }
};
