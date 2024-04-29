// src/routes/authRoutes.ts
import { getDb } from '../db/mongo'; // Adjust this import based on your actual DB setup file
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

// Define the User type with optional _id for insertion
interface User {
  _id?: ObjectId;
  email: string;
  username: string;
  password: string;
  gender: string;
  slogan: string;
  coin: number;
}

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, username, password, gender = 'default', slogan = 'I love Blackjack Buddy!', coin = 100 } = req.body;
  try {
    const db = getDb();
    const usersCollection = db.collection<User>('users');

    // Check if user exists
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const newUser: User = {
      email,
      username,
      password: hashedPassword,
      gender,
      slogan,
      coin
    };

    // Insert the user into the database
    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId;

    // Generate JWT token
    const token = jwt.sign({ userId: userId.toString() }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = getDb();
    const usersCollection = db.collection<User>('users');

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
});

export default router;