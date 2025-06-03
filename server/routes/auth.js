import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
import mongoose from 'mongoose';

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
  }
  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email, password, or role' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email, password, or role' });
    }
    const token = jwt.sign({ user_id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        id: user._id
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 