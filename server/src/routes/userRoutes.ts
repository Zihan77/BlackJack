import { Router } from 'express';
import { getDb } from '../db/mongo'; // Adjust this import based on your actual DB setup file
import { ObjectId } from 'mongodb';

const router = Router();

// GET route to retrieve user information
router.get('/:userId', async (req, res) => {
  try {
    const db = getDb();
    const usersCollection = db.collection('users'); // Accessing the users collection

    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// PUT route to update user information
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body; // Data to update

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after', upsert: false } // options to return the updated document and not to create a new one if not exists
    );

    if (!result || !result.value) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.value);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;