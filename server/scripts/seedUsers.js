import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Adjust the path if needed

// Load environment variables
dotenv.config();

// Debugging: Check if MONGO_URI is loaded
console.log('Mongo URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const testInsert = async () => {
  try {
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword',
      role: 'student',
    });
    console.log('Test user inserted:', user);
  } catch (error) {
    console.error('Error inserting test user:', error);
  } finally {
    mongoose.connection.close();
  }
};

testInsert();