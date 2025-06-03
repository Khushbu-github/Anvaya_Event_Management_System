import mongoose from 'mongoose';

const TimetableEntrySchema = new mongoose.Schema({
  classroom: String,
  day_of_week: String,
  slot: String,
  subject: String,
  semester: String,
  section: String,
  session: String,
});

const TimetableEntry = mongoose.model('TimetableEntry', TimetableEntrySchema);
export default TimetableEntry; 