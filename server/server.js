const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/parents', require('./routes/parents'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'ધોતા પેકેન્દ્ર સ્કૂલ API is running!' });
});

// Production: Serve frontend build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        }
    });
}

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🏫 ધોતા પેકેન્દ્ર સ્કૂલ Server running on port ${PORT}`);
});
