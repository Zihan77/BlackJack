// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/mongo';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();  // Ensures that your environment variables are loaded as early as possible

const app = express();

// Connect to the database
connectDB();

// CORS configuration to allow requests from the frontend
app.use(cors({
  origin: "http://localhost:31000", // or your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
  credentials: true // Allow cookies to be sent with requests
}));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Simple route for base URL to check if the server is running
app.get('/', (req, res) => {
  res.send('Blackjack Server is running');
});

export default app;