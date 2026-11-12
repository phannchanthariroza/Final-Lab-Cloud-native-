const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const studentSchema = new mongoose.Schema({
    student_id: String, student_name: String, student_mobile: String,
    student_email: String, student_password: String
}, { collection: 'students' });
const Student = mongoose.model('Student', studentSchema);

app.get('/health', (req, res) => res.json({ service: 'search', status: 'ok' }));
app.get('/students', async (req, res) => {
    try {
        const { id, name } = req.query;
        if (!id && !name) return res.status(400).json({ error: 'Provide id or name query parameter' });
        const filter = id ? { student_id: id } : { student_name: new RegExp(name, 'i') };
        const students = await Student.find(filter).select('-student_password');
        res.json({ count: students.length, students });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/university_db')
    .then(() => app.listen(process.env.PORT || 5002, () => console.log('Search service running on port 5002')))
    .catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
