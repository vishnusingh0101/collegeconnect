const mongoose = require('mongoose');
const Colleges = require('../model/collegeslist');
const Students = require('../model/studentlist');
const Alumni = require('../model/alumnilist');
const fs = require('fs');
const path = require('path');

const readJSONFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log(`File Not Found: ${filePath}`);
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const filePaths = {
    colleges: path.join(__dirname, '../alldata/CData.json'),
    students: path.join(__dirname, '../alldata/StudentData.json'),
    alumni: path.join(__dirname, '../alldata/AlumniData.json'),
};

// Function to backup and delete existing data
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
        console.error(`Error creating backup for ${collectionName}:`, error);
    }
};

// Function to upload new JSON data
const uploadData = async (Model, filePath, dataType, collectionName) => {
    try {
        await backupAndDeleteExistingData(Model, collectionName);

        const data = readJSONFile(filePath);
        if (!data) return;

        await Model.insertMany(data);
        console.log(`${dataType} Data Successfully Imported!`);
    } catch (error) {
        console.error(`Error Importing ${dataType} Data:`, error);
    }
};

// Function to upload all data (Colleges, Students, Alumni)
exports.uploadAllData = async (req, res) => {
    try {
        await uploadData(Colleges, filePaths.colleges, "Colleges", "colleges");
        await uploadData(Students, filePaths.students, "Students", "students");
        await uploadData(Alumni, filePaths.alumni, "Alumni", "alumni");

        if (res) {
            return res.status(201).json({ message: "All data uploaded successfully!" });
        }
    } catch (error) {
        console.error("Error in uploadAllData:", error);
        if (res) {
            return res.status(500).json({ message: "Error uploading data", error });
        }
    }
};
