import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  slot: { type: String, required: true }, // e.g. '09:00-10:00'
  year: { type: Number, required: true }, // 1, 2, 3
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking; 