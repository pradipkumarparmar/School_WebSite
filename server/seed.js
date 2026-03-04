const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'dhota_school',
        multipleStatements: true
    });

    console.log('🌱 Seeding database...');

    // Create admin with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
        `INSERT INTO admins (username, email, password_hash) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = ?`,
        ['admin', 'admin@dhotaschool.com', hashedPassword, hashedPassword]
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Seed events
    const events = [
        ['વાર્ષિક ઉત્સવ 2026', 'શાળાનો વાર્ષિક ઉત્સવ - સાંસ્કૃતિક કાર્યક્રમો, રમતોત્સવ અને ઈનામ વિતરણ.', '2026-04-15', '09:00:00', 'શાળા મેદાન', 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600'],
        ['વિજ્ઞાન પ્રદર્શન', 'વિદ્યાર્થીઓ દ્વારા તૈયાર કરેલા વિજ્ઞાન પ્રોજેક્ટ્સનું પ્રદર્શન.', '2026-03-20', '10:00:00', 'વિજ્ઞાન પ્રયોગશાળા', 'https://images.unsplash.com/photo-1564429238961-04e3ffc5a1fc?w=600'],
        ['રમતોત્સવ', 'આંતર-શાળા રમતોત્સવ - ક્રિકેટ, ફૂટબોલ, કબડ્ડી.', '2026-05-01', '08:00:00', 'રમત મેદાન', 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0a5c?w=600'],
        ['પ્રજાસત્તાક દિન ઉજવણી', 'શાળામાં પ્રજાસત્તાક દિનની ઉજવણી - ધ્વજ વંદન અને સંસ્કૃતિક કાર્યક્રમ.', '2026-01-26', '08:30:00', 'શાળા પ્રાંગણ', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600']
    ];

    for (const event of events) {
        await connection.query(
            'INSERT INTO events (title, description, event_date, event_time, location, image_url) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=title',
            event
        );
    }
    console.log('✅ Events seeded');

    // Seed notices
    const notices = [
        ['ઉનાળુ વેકેશન જાહેરાત', 'ધોરણ 1 થી 12 ના વિદ્યાર્થીઓ માટે ઉનાળુ વેકેશન તારીખ 1 મે થી 10 જૂન સુધી રહેશે.', 'high', '2026-06-10'],
        ['પરીક્ષા સમેયપત્રક', 'વાર્ષિક પરીક્ષાનો સમયપત્રક જાહેર થયો છે. વિગતો માટે શાળા કાર્યાલયનો સંપર્ક કરો.', 'urgent', '2026-04-01'],
        ['વાલી મીટિંગ', 'મિત્રો, તારીખ 25 માર્ચે સવારે 10 વાગ્યે વાલી મીટિંગ યોજાશે.', 'medium', '2026-03-25'],
        ['પુસ્તકાલય નવા પુસ્તકો', 'શાળા પુસ્તકાલયમાં 200+ નવા પુસ્તકો ઉમેરાયા છે. વિદ્યાર્થીઓ લાભ લેશો.', 'low', null]
    ];

    for (const notice of notices) {
        await connection.query(
            'INSERT INTO notices (title, content, priority, expires_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=title',
            notice
        );
    }
    console.log('✅ Notices seeded');

    // Seed gallery
    const gallery = [
        ['વાર્ષિક ઉત્સવ 2025', 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600', 'ઉત્સવ'],
        ['વિજ્ઞાન પ્રદર્શન', 'https://images.unsplash.com/photo-1564429238961-04e3ffc5a1fc?w=600', 'શૈક્ષણિક'],
        ['રમતોત્સવ', 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0a5c?w=600', 'રમત'],
        ['શાળા મકાન', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600', 'શાળા'],
        ['પ્રયોગશાળા', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600', 'શૈક્ષણિક'],
        ['પુસ્તકાલય', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600', 'શાળા']
    ];

    for (const item of gallery) {
        await connection.query(
            'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title=title',
            item
        );
    }
    console.log('✅ Gallery seeded');

    await connection.end();
    console.log('\n🎉 Database seeded successfully!');
    console.log('📝 Admin Login: username=admin, password=admin123');
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
