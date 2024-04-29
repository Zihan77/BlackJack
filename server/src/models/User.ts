// src/models/User.ts
import { getDb } from '../db/mongo';
import bcrypt from 'bcryptjs';

// Utility function to hash password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export const createUser = async (userData: {
  email: string,
  username: string,
  password: string,
  gender?: string,
  slogan?: string,
  coin?: number
}) => {
  const db = getDb();
  const hashedPassword = await hashPassword(userData.password);
  const result = await db.collection('users').insertOne({
    ...userData,
    password: hashedPassword
  });
  return result.insertedId;
};

export const findUserByEmail = async (email: string) => {
  const db = getDb();
  return db.collection('users').findOne({ email });
};

export const comparePassword = async (candidatePassword: string, userPassword: string): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, userPassword);
};