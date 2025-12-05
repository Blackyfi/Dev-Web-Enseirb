import db from '../database/db.js';
import { hashPassword } from '../utils/passwordHash.js';

async function seed() {
  try {
    const email = 'alice@example.org';
    const password = 'roottt';

    const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

    let userId;
    if (users.length > 0) {
      userId = users[0].id;
      await db.execute('DELETE FROM favorites WHERE user_id = ?', [userId]);
    } else {
      const hash = await hashPassword(password);
      const [result] = await db.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash]);
      userId = result.insertId;
    }

    const favorites = [
      [userId, 269149, 'movie', 5, 'Film d\'animation super cute'],
      [userId, 16235, 'movie', 1, 'Vraiment pas ouf']
    ];

    for (const fav of favorites) {
      await db.execute('INSERT INTO favorites (user_id, movie_id, type, rating, comment) VALUES (?, ?, ?, ?, ?)', fav);
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
