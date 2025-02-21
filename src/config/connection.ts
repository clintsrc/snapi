/*
 * Connection
 *
 * Manage the connection to the local mongodb server.
 * The database is initially created when a collection is accessed
 *
 */

import mongoose from 'mongoose';
const dbName = 'snapiDB';

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`
    );
    console.log('Database connected.');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed.');
  }
};

export default db;
