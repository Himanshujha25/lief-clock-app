// In a separate script, run only ONCE
const mongoose = require('mongoose');
require('dotenv').config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Drop the unique index on auth0Id
  await db.collection('users').dropIndex('auth0Id_1');
  console.log('Index auth0Id_1 dropped');

  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
