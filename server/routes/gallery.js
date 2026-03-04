const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const auth = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validation');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    }
});

// GET /api/gallery - Public
router.get('/', [
    query('category').trim().optional().escape(),
    validate
], async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM gallery';
        const params = [];
        if (category && category !== 'all') {
            query += ' WHERE category = ?';
            params.push(category);
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/gallery/categories - Public
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT category FROM gallery ORDER BY category');
        res.json(rows.map(r => r.category));
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/gallery - Admin (JSON body with image_url)
router.post('/', [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('image_url').notEmpty().withMessage('Image URL is required'),
    body('category').trim().optional(),
    validate
], async (req, res) => {
    try {
        const { title, image_url, category } = req.body;
        if (!title || !image_url) {
            return res.status(400).json({ error: 'Title and image URL are required' });
        }
        const [result] = await pool.query(
            'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)',
            [title, image_url, category || 'general']
        );
        const [newItem] = await pool.query('SELECT * FROM gallery WHERE id = ?', [result.insertId]);
        res.status(201).json(newItem[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/gallery/upload - Admin (multipart file upload)
router.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !req.file) {
            return res.status(400).json({ error: 'Title and image file are required' });
        }
        const image_url = `/uploads/gallery/${req.file.filename}`;
        const [result] = await pool.query(
            'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)',
            [title, image_url, category || 'general']
        );
        const [newItem] = await pool.query('SELECT * FROM gallery WHERE id = ?', [result.insertId]);
        res.status(201).json(newItem[0]);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/gallery/:id - Admin
router.delete('/:id', [
    auth,
    param('id').isInt().withMessage('Invalid ID format'),
    validate
], async (req, res) => {
    try {
        // Get item to check if it's a local upload
        const [items] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
        if (items.length > 0 && items[0].image_url?.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', items[0].image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
