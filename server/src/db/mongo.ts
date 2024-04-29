// src/db/mongo.ts
import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();
  db = client.db(process.env.DB_NAME); // Specify your database name here
  console.log('MongoDB Connected:', db.databaseName);
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};