import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Cultural', 'Technical', 'Sports', 'Workshops'], required: true },
  status: { type: String, enum: ['Planning', 'Upcoming', 'Live', 'Ended'], default: 'Planning' },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  venue: { type: String },
  description: { type: String },
  guest_name: { type: String },
  guest_contact: { type: String },
  session_details: { type: String },
  number_of_participants: { type: Number, default: 0 },
  image: { type: String, default: '/placeholder.svg' } // Default placeholder image
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event; 