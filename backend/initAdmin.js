const bcrypt = require('bcryptjs');
const db = require('./src/firebase');

async function createAdmin() {
  try {
    const email = 'alfrednat2020@gmail.com';
    const password = 'Professor01.';
    const name = 'Alfred Nat Kanu';
    const role = 'Admin';

    // Check if user already exists
    const usersRef = db.collection('users');
    const existing = await usersRef.where('email', '==', email).get();
    if (!existing.empty) {
      console.log('User already exists in Firestore.');
      process.exit(0);
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password_hash: hash,
      role,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('users').add(newUser);
    console.log(`Successfully created Admin User with ID: ${docRef.id}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
