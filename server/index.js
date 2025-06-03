import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import achievementRoutes from './routes/achievements.js';
import classroomRoutes from './routes/classrooms.js';
import User from './models/User.js'; // Import the User model
import bcrypt from 'bcryptjs';
import bookingsRouter from './routes/bookings.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    seedUsers(); 
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to seed users
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments(); // Check the number of users in the database
    if (userCount === 0) {
      // Only seed if no users exist
      const hashedPassword1 = await bcrypt.hash('password123', 10);
      const hashedPassword2 = await bcrypt.hash('password456', 10);
      const hashedPassword3 = await bcrypt.hash('password789', 10);
    

      const users = [
        { name: 'Admin User', email: 'admin@example.com', password: hashedPassword1, role: 'admin' },
        { name: 'Faculty User', email: 'faculty@example.com', password: hashedPassword2, role: 'faculty' },
        { name: 'Student One', email: 'student1@example.com', password: hashedPassword3, role: 'student' },
        { name: 'Student Two', email: 'student2@example.com', password: hashedPassword3, role: 'student' },
         { name: 'Student Three', email: 'student3@example.com', password: hashedPassword3, role: 'student' },
          { name: 'Student Four', email: 'student4@example.com', password: hashedPassword3, role: 'student' },
        { name: 'Student Five', email: 'student5@example.com', password: hashedPassword3, role: 'student' }, 
      ];

      await User.insertMany(users); // Insert users into the database
      console.log('Users seeded successfully');
    } else {
      console.log('Users already exist, skipping seeding'); // Skip seeding if users exist
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', achievementRoutes);
app.use('/api', classroomRoutes);
app.use('/api/bookings', bookingsRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
