const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const auth = require('../middleware/auth');
const { body, param } = require('express-validator');
const validate = require('../middleware/validation');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'events');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    }
});

// GET /api/events - Public: get all active events
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM events WHERE is_active = TRUE ORDER BY event_date DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/events/all - Admin: get all events
router.get('/all', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/events/:id - Public: get single event
router.get('/:id', [
    param('id').isInt().withMessage('Invalid ID format'),
    validate
], async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/events - Admin: create event (JSON)
router.post('/', [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required').escape(),
    body('description').trim().optional().escape(),
    body('event_date').isDate().withMessage('Valid event date is required'),
    body('event_time').optional({ checkFalsy: true }).matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Invalid time format'),
    body('location').trim().optional().escape(),
    validate
], async (req, res) => {
    try {
        const { title, description, event_date, event_time, location, image_url } = req.body;
        if (!title || !event_date) {
            return res.status(400).json({ error: 'Title and event date are required' });
        }
        const [result] = await pool.query(
            'INSERT INTO events (title, description, event_date, event_time, location, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, event_date, event_time || null, location || null, image_url || null]
        );
        const [newEvent] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
        res.status(201).json(newEvent[0]);
    } catch (err) {
        console.error('Create event error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/events/upload - Admin: create event with file upload
router.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, event_date, event_time, location } = req.body;
        if (!title || !event_date) {
            return res.status(400).json({ error: 'Title and event date are required' });
        }
        const image_url = req.file ? `/uploads/events/${req.file.filename}` : null;
        const [result] = await pool.query(
            'INSERT INTO events (title, description, event_date, event_time, location, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, event_date, event_time || null, location || null, image_url]
        );
        const [newEvent] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
        res.status(201).json(newEvent[0]);
    } catch (err) {
        console.error('Upload event error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/events/:id - Admin: update event
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, event_date, event_time, location, image_url, is_active } = req.body;
        await pool.query(
            'UPDATE events SET title=?, description=?, event_date=?, event_time=?, location=?, image_url=?, is_active=? WHERE id=?',
            [title, description, event_date, event_time, location, image_url, is_active, req.params.id]
        );
        const [updated] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/events/:id/upload - Admin: update event with file upload
router.put('/:id/upload', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, event_date, event_time, location, is_active } = req.body;
        // Delete old file if replacing with new upload
        if (req.file) {
            const [old] = await pool.query('SELECT image_url FROM events WHERE id = ?', [req.params.id]);
            if (old.length > 0 && old[0].image_url?.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '..', old[0].image_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }
        const image_url = req.file ? `/uploads/events/${req.file.filename}` : (req.body.image_url || null);
        await pool.query(
            'UPDATE events SET title=?, description=?, event_date=?, event_time=?, location=?, image_url=?, is_active=? WHERE id=?',
            [title, description, event_date, event_time, location, image_url, is_active === 'true' || is_active === true ? 1 : 0, req.params.id]
        );
        const [updated] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (err) {
        console.error('Update event upload error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/events/:id - Admin: delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        // Clean up uploaded file
        const [items] = await pool.query('SELECT image_url FROM events WHERE id = ?', [req.params.id]);
        if (items.length > 0 && items[0].image_url?.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', items[0].image_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
