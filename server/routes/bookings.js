import express from 'express';
import Booking from '../models/Booking.js';
import Classroom from '../models/Classroom.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware for JWT auth
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Authorization token is missing' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// POST /bookings/request - Faculty requests a booking
router.post('/request', verifyToken, async (req, res) => {
  try {
    const { classroom, date, slot, year } = req.body;
    if (!classroom || !date || !slot) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Find classroom by name if not ObjectId
    let classroomObj = classroom;
    if (typeof classroom === 'string' && classroom.length < 24) {
      // Use regex for case-insensitive and space-insensitive matching
      const pattern = classroom.replace(/\s+/g, '').replace(/[-_]/g, '').toLowerCase();
      const found = await Classroom.findOne({
        name: { $regex: new RegExp(pattern.split('').join('.*'), 'i') }
      });
      if (!found) return res.status(404).json({ error: 'Classroom not found' });
      classroomObj = found._id;
    }
    // Prevent duplicate or conflicting booking for same slot (pending or approved)
    const existing = await Booking.findOne({ classroom: classroomObj, date, slot, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(400).json({ error: 'This room is already booked or pending approval for this slot.' });
    const booking = new Booking({
      classroom: classroomObj,
      date,
      slot,
      year: year || 0,
      requestedBy: req.user.user_id,
      status: 'pending'
    });
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error('Error requesting booking:', err);
    res.status(500).json({ error: 'Failed to request booking' });
  }
});

// GET /bookings?facultyId=... - Faculty sees their requests
router.get('/', verifyToken, async (req, res) => {
  try {
    const { facultyId } = req.query;
    let filter = {};
    if (facultyId) filter.requestedBy = facultyId;
    const bookings = await Booking.find(filter).populate('classroom').populate('requestedBy').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /bookings/:id/approve - Admin approves a booking
router.post('/:id/approve', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'approved';
    booking.approvedBy = req.user.user_id;
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve booking' });
  }
});

// POST /bookings/:id/reject - Admin rejects a booking
router.post('/:id/reject', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'rejected';
    booking.approvedBy = req.user.user_id;
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject booking' });
  }
});

export default router; 