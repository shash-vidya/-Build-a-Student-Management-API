// student_api.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: 'Shashvraj21!', // your MySQL password
    database: 'studentdb' // your database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Create students table if it doesn't exist
const createTableQuery = `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT
)`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating students table:', err);
    } else {
        console.log('Students table ready');
    }
});

// POST /students - Insert new student
app.post('/students', (req, res) => {
    const { name, email, age } = req.body;
    const sql = 'INSERT INTO students (name, email, age) VALUES (?, ?, ?)';
    db.query(sql, [name, email, age], (err, result) => {
        if (err) {
            console.error('Insert Error:', err);
            return res.status(500).json({ error: 'Database insert error' });
        }
        console.log('Inserted student with ID:', result.insertId);
        res.status(201).json({ message: 'Student added successfully', studentId: result.insertId });
    });
});

// GET /students - Retrieve all students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Retrieve Error:', err);
            return res.status(500).json({ error: 'Database retrieval error' });
        }
        res.json(results);
    });
});

// GET /students/:id - Retrieve student by ID
app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Retrieve by ID Error:', err);
            return res.status(500).json({ error: 'Database retrieval error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(results[0]);
    });
});

// PUT /students/:id - Update student details
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const sql = 'UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?';
    db.query(sql, [name, email, age, id], (err, result) => {
        if (err) {
            console.error('Update Error:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found for update' });
        }
        console.log('Updated student with ID:', id);
        res.json({ message: 'Student updated successfully' });
    });
});

// DELETE /students/:id - Delete student by ID
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Delete Error:', err);
            return res.status(500).json({ error: 'Database delete error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found for deletion' });
        }
        console.log('Deleted student with ID:', id);
        res.json({ message: 'Student deleted successfully' });
    });
});

// Server start
const PORT = 3011;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
