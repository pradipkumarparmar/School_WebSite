require('dotenv').config();
const pool = require('./db');

async function createParentsTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS parents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_name VARCHAR(100) NOT NULL,
                parent_name VARCHAR(100),
                phone VARCHAR(15) NOT NULL UNIQUE,
                class_name VARCHAR(50),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Parents table created successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

createParentsTable();
