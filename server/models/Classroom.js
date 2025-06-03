import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom; 