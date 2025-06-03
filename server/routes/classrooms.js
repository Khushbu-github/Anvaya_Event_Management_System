import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Utility to normalize room names
const normalizeRoom = str => str ? str.toLowerCase().replace(/\s+/g, '').replace('room', 'room-').replace('room--', 'room-') : str;

// GET /api/classroom-timetable?date=YYYY-MM-DD&classroom=Room-X or ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&classroom=Room-X
router.get('/api/classroom-timetable', async (req, res) => {
  let { date, startDate, endDate, classroom } = req.query;
  if (!classroom || (!date && (!startDate || !endDate))) {
    return res.status(400).json({ error: 'Date or date range and classroom are required' });
  }
  try {
    // Read both 2nd-year and 3rd-year timetables
    const timetablePaths = [
      path.join(process.cwd(), 'routes', '2nd-year.json'),
      path.join(process.cwd(), 'routes', '3rd-year.json'),
    ];
    const timetables = [];
    for (const timetablePath of timetablePaths) {
      if (!fs.existsSync(timetablePath)) {
        console.error('Timetable JSON file does not exist at:', timetablePath);
        timetables.push(null);
        continue;
      }
      try {
        const raw = fs.readFileSync(timetablePath, 'utf-8');
        timetables.push(JSON.parse(raw));
      } catch (err) {
        console.error('Error reading/parsing timetable JSON file:', timetablePath, err);
        timetables.push(null);
      }
    }
    // Each timetable has a .year property
    const timetableYears = timetables.map(t => t && t.year);
    const allSlots = [
      '09:00-10:00', '10:00-11:00', '11:15-12:15', '12:15-13:15',
      '13:15-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
    ];
    const normalize = str => str ? str.toLowerCase().replace(/\s+/g, '').replace('room', 'room-').replace('room--', 'room-') : str;
    const normClassroom = normalize(classroom);
    // Helper to process a single date
    const processDate = (dateKey) => {
      const slots = {};
      allSlots.forEach(slot => {
        let year2 = null, year3 = null;
        let lunch2 = false, lunch3 = false;
        // 2nd year
        if (timetables[0] && timetables[0][dateKey] && timetables[0][dateKey][slot]) {
          const info = timetables[0][dateKey][slot];
          if (info.subject === 'Lunch Break') lunch2 = true;
          else if (normalize(info.room) === normClassroom) year2 = timetableYears[0];
        }
        // 3rd year
        if (timetables[1] && timetables[1][dateKey] && timetables[1][dateKey][slot]) {
          const info = timetables[1][dateKey][slot];
          if (info.subject === 'Lunch Break') lunch3 = true;
          else if (normalize(info.room) === normClassroom) year3 = timetableYears[1];
        }
        // Lunch Break (display only once)
        if (lunch2 || lunch3) {
          slots[slot] = { status: 'Lunch Break', subject: 'Lunch Break', year: null };
        } else if (year3) {
          // Occupied by 3rd year (even if both)
          slots[slot] = { status: 'Occupied', subject: timetables[1][dateKey][slot].subject, year: year3 };
        } else if (year2) {
          // Occupied by 2nd year only
          slots[slot] = { status: 'Occupied', subject: timetables[0][dateKey][slot].subject, year: year2 };
        } else {
          // Available
          slots[slot] = { status: 'Available', subject: null, year: null };
        }
      });
      return slots;
    };
    // Date range logic
    let result = {};
    if (date) {
      // Convert YYYY-MM-DD to DD-MM-YYYY
      let [yyyy, mm, dd] = date.split('-');
      let dateKey = `${dd}-${mm}-${yyyy}`;
      result[date] = processDate(dateKey);
      // If the date is not in the timetable, ensure all slots are 'Available'
      if (!timetables.some(t => t && t[dateKey])) {
        const slots = {};
        allSlots.forEach(slot => { slots[slot] = { status: 'Available', subject: null, year: null }; });
        result[date] = slots;
      }
    } else {
      // Range
      let start = new Date(startDate);
      let end = new Date(endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        let yyyy = d.getFullYear();
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let dd = String(d.getDate()).padStart(2, '0');
        let dateKey = `${dd}-${mm}-${yyyy}`;
        let isoDate = `${yyyy}-${mm}-${dd}`;
        result[isoDate] = processDate(dateKey);
        if (!timetables.some(t => t && t[dateKey])) {
          const slots = {};
          allSlots.forEach(slot => { slots[slot] = { status: 'Available', subject: null, year: null }; });
          result[isoDate] = slots;
        }
      }
    }
    res.json({ classroom, timetable: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read timetable data' });
  }
});

export default router; 