import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  semester: { 
    type: Number, 
    required: true,
    min: 1,
    max: 8
  },
  teamName: { 
    type: String,
    trim: true
  },
  phone: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  collegeName: { 
    type: String, 
    required: true,
    trim: true
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered'
  }
}, { 
  timestamps: true 
});

eventRegistrationSchema.index({ event: 1, email: 1 }, { unique: true });
eventRegistrationSchema.index({ event: 1, registrationDate: -1 });
eventRegistrationSchema.index({ email: 1 });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;