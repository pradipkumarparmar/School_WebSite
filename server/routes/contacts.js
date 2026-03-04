const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/contacts - Public: submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !subject || !message) {
            return res.status(400).json({ error: 'Name, subject, and message are required' });
        }
        const [result] = await pool.query(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email || null, phone || null, subject, message]
        );
        res.status(201).json({ message: 'Your message has been sent successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/contacts - Admin: get all contacts
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contacts ORDER BY is_read ASC, created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/contacts/:id/read - Admin: mark as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        await pool.query('UPDATE contacts SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Contact marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/contacts/:id - Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/contacts/stats - Admin: get stats
router.get('/stats', auth, async (req, res) => {
    try {
        const [events] = await pool.query('SELECT COUNT(*) as count FROM events');
        const [notices] = await pool.query('SELECT COUNT(*) as count FROM notices');
        const [galleryItems] = await pool.query('SELECT COUNT(*) as count FROM gallery');
        const [contacts] = await pool.query('SELECT COUNT(*) as count FROM contacts');
        const [unread] = await pool.query('SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE');

        res.json({
            events: events[0].count,
            notices: notices[0].count,
            gallery: galleryItems[0].count,
            contacts: contacts[0].count,
            unreadContacts: unread[0].count
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
