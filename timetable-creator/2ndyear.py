import datetime
import json

# Weekly timetable structure with Room names corrected (Room 1 instead of Room-1)
weekly_timetable = {
    "Monday": {
        "09:00-10:00": { "subject": "OS", "room": "Room 103" },
        "10:00-11:00": { "subject": "DMS", "room": "Room 103" },
        "11:15-12:15": { "subject": "DAA", "room": "Room 103" },
        "12:15-13:15": { "subject": "JAVA LAB – A1", "room": "Room 501" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "JAVA LAB – A1", "room": "Room 501" },
        "15:00-16:00": { "subject": "Library/MOOC", "room": None },
        "16:00-17:00": { "subject": "Library/MOOC", "room": None }
    },
    "Tuesday": {
        "09:00-10:00": { "subject": "DV/MLE Lab - A1", "room": "Room 501" },
        "10:00-11:00": { "subject": "DV/MLE Lab - A1", "room": "Room 501" },
        "11:15-12:15": { "subject": "DAA Lab", "room": "Room 502" },
        "12:15-13:15": { "subject": "DAA Lab", "room": "Room 502" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "YOGA/PE/NSS", "room": None },
        "15:00-16:00": { "subject": "Proctor Meeting", "room": "Room 501" },
        "16:00-17:00": { "subject": "Office Hour", "room": None }
    },
    "Wednesday": {
        "09:00-10:00": { "subject": "UHV", "room": "Room 103" },
        "10:00-11:00": { "subject": "DMS", "room": "Room 103" },
        "11:15-12:15": { "subject": "DAA", "room": "Room 103" },
        "12:15-13:15": { "subject": "SE", "room": "Room 103" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "OS (Tutorial)", "room": "Room 103" },
        "15:00-16:00": { "subject": "Club/Professional Activities", "room": None },
        "16:00-17:00": { "subject": "Club/Professional Activities", "room": None }
    },
    "Thursday": {
        "09:00-10:00": { "subject": "JAVA Lab - A2",  "room": "Room 501" },
        "10:00-11:00": { "subject": "JAVA Lab - A2", "room": "Room 501" },
        "11:15-12:15": { "subject": "SE", "room": "Room 103" },
        "12:15-13:15": { "subject": "DMS", "room": "Room 103" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "OS", "room": "Room 103" },
        "15:00-16:00": { "subject": "Mini Project-I", "room": "Room 103" },
        "16:00-17:00": { "subject": "Mini Project-I", "room": "Room 103" }
    },
    "Friday": {
        "09:00-10:00": { "subject": "SE", "room": "Room 103" },
        "10:00-11:00": { "subject": "DAA", "room": "Room 103" },
        "11:15-12:15": { "subject": "DV/MLE Lab - A2", "room": "Room 501" },
        "12:15-13:15": { "subject": "DV/MLE Lab - A2", "room": "Room 501" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "OS", "room": "Room 103" },
        "15:00-16:00": { "subject": "Preplacement/Skill Dev/Value Added", "room": None },
        "16:00-17:00": { "subject": "Preplacement/Skill Dev/Value Added", "room": None }
    },
    "Saturday": {
        "09:00-10:00": { "subject": "HPC", "room": "Room 103" },
        "10:00-11:00": { "subject": "MLE", "room": "Room 103" },
        "11:15-12:15": { "subject": "MLE", "room": "Room 103" },
        "12:15-13:15": { "subject": "MLE", "room": "Room 103" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "Mini Project-I", "room": None },
        "15:00-16:00": { "subject": "Mini Project-I", "room": None },
        "16:00-17:00": { "subject": "Mini Project-I", "room": None }
    }
}

# Generate date-wise timetable
start_date = datetime.date(2025, 2, 1)
end_date = datetime.date(2025, 5, 31)
datewise_timetable = {}

delta = datetime.timedelta(days=1)
current = start_date

while current <= end_date:
    weekday = current.strftime("%A")
    if weekday != "Sunday" and weekday in weekly_timetable:
        date_str = current.strftime("%d-%m-%Y")
        datewise_timetable[date_str] = weekly_timetable[weekday]
    current += delta

# Save output
with open("full_datewise_timetable.json", "w") as f:
    json.dump(datewise_timetable, f, indent=2)

print("✅ Timetable with dd-mm-yyyy format and Room X style saved to 'full_datewise_timetable.json'")
