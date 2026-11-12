const express = require('express');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const Student = require('./models/Student');
require('dotenv').config();

const app = express();
app.use(express.json());
connectDB();

app.get('/health', (req, res) => res.json({ service: 'registration', status: 'ok' }));

app.post('/student', async (req, res) => {
    try {
        const { student_id, student_name, student_mobile, student_email, student_password } = req.body;

        if (!student_id || !student_name || !student_mobile || !student_email || !student_password) {
            return res.status(400).json({ error: 'All five student fields are required' });
        }
        const existingStudent = await Student.findOne({ student_id });
        if (existingStudent) return res.status(409).json({ error: 'Student ID already registered' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(student_password, salt);

        const newStudent = new Student({
            student_id, student_name, student_mobile,
            student_email: student_email.toLowerCase(), student_password: hashedPassword
        });_
        try {
            await newStudent.save();
        } catch (saveError) {
            if (saveError.code === 11000) return res.status(409).json({ error: 'Student ID or email already registered' });
            throw saveError;
        }

        res.status(201).json({ message: 'Student registered successfully', student_id: newStudent.student_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5001, () => console.log('Register Service running on port 5001'));