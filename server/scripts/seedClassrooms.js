import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Classroom from '../models/Classroom.js';

dotenv.config();

// const MONGO_URI =  "mongodb://localhost:27017/anvaya";
const MONGO_URI = process.env.MONGO_URI

async function seedClassrooms() {
  await mongoose.connect(MONGO_URI);
  const classrooms = [
    { name: 'Room 103' },
    { name: 'Room 501' },
    { name: 'Room 502' },
    { name: 'Room 503' }
  ];
  await Classroom.deleteMany({});
  await Classroom.insertMany(classrooms);
  console.log('Classrooms seeded');
  await mongoose.disconnect();
}

seedClassrooms(); 