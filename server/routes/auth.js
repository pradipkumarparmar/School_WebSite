const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/login
router.post('/login', [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: { id: admin.id, username: admin.username, email: admin.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/me  (protected)
router.get('/me', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, created_at FROM admins WHERE id = ?',
            [req.admin.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
