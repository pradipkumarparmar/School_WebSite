const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/parents - Admin: get all parents
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM parents ORDER BY student_name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/parents/phones - Admin: get all active phone numbers
router.get('/phones', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT phone FROM parents WHERE is_active = TRUE AND phone IS NOT NULL');
        res.json(rows.map(r => r.phone));
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/parents - Admin: add parent
router.post('/', auth, async (req, res) => {
    try {
        const { student_name, parent_name, phone, class_name } = req.body;
        if (!student_name || !phone) {
            return res.status(400).json({ error: 'Student name and phone are required' });
        }
        const [result] = await pool.query(
            'INSERT INTO parents (student_name, parent_name, phone, class_name) VALUES (?, ?, ?, ?)',
            [student_name, parent_name || null, phone, class_name || null]
        );
        const [newParent] = await pool.query('SELECT * FROM parents WHERE id = ?', [result.insertId]);
        res.status(201).json(newParent[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'This phone number already exists' });
        }
        console.error('Add parent error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/parents/:id - Admin: update parent
router.put('/:id', auth, async (req, res) => {
    try {
        const { student_name, parent_name, phone, class_name, is_active } = req.body;
        await pool.query(
            'UPDATE parents SET student_name=?, parent_name=?, phone=?, class_name=?, is_active=? WHERE id=?',
            [student_name, parent_name, phone, class_name, is_active, req.params.id]
        );
        const [updated] = await pool.query('SELECT * FROM parents WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/parents/:id - Admin: delete parent
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM parents WHERE id = ?', [req.params.id]);
        res.json({ message: 'Parent deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
