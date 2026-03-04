const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { body, param } = require('express-validator');
const validate = require('../middleware/validation');

const router = express.Router();

// GET /api/notices - Public: get active notices
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM notices 
       WHERE is_active = TRUE AND (expires_at IS NULL OR expires_at >= CURDATE()) 
       ORDER BY priority = 'urgent' DESC, priority = 'high' DESC, published_at DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/notices/all - Admin: get all notices
router.get('/all', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/notices/:id
router.get('/:id', [
    param('id').isInt().withMessage('Invalid ID format'),
    validate
], async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Notice not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/notices - Admin (with SMS notification)
router.post('/', [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('expires_at').optional({ checkFalsy: true }).isDate().withMessage('Invalid expiry date'),
    validate
], async (req, res) => {
    try {
        const { title, content, priority, expires_at, send_sms } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const [result] = await pool.query(
            'INSERT INTO notices (title, content, priority, expires_at) VALUES (?, ?, ?, ?)',
            [title, content, priority || 'medium', expires_at || null]
        );
        const [newNotice] = await pool.query('SELECT * FROM notices WHERE id = ?', [result.insertId]);

        res.status(201).json({ ...newNotice[0] });
    } catch (err) {
        console.error('Create notice error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/notices/:id - Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, content, priority, is_active, expires_at } = req.body;
        await pool.query(
            'UPDATE notices SET title=?, content=?, priority=?, is_active=?, expires_at=? WHERE id=?',
            [title, content, priority, is_active, expires_at, req.params.id]
        );
        const [updated] = await pool.query('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/notices/:id - Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM notices WHERE id = ?', [req.params.id]);
        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
