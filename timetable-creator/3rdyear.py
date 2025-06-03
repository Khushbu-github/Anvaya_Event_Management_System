import datetime
import json

# Weekly timetable structure with Room names corrected (Room 1 instead of Room-1)
weekly_timetable = {
    "Monday": {
        "09:00-10:00": { "subject": "DL", "room": "Room 501" },
        "10:00-11:00": { "subject": "BDC", "room": "Room 501" },
        "11:15-12:15": { "subject": "ARVR Lab A1", "room": "Room 501" },
        "12:15-13:15": { "subject": "ARVR Lab A1", "room": "Room 502" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "IoT & 5G/RT", "room": "Room 501" },
        "15:00-16:00": { "subject": "DL", "room": "Room 501" },
        "16:00-17:00": { "subject": "YOGA/PE/NS", "room": None }
    },
    "Tuesday": {
        "09:00-10:00": { "subject": "BDC", "room": "Room 501" },
        "10:00-11:00": { "subject": "Bio", "room": "Room 501" },
        "11:15-12:15": { "subject": "ARVR Lab A2", "room": "Room 502" },
        "12:15-13:15": { "subject": "ARVR Lab A2", "room": "Room 501" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "DL", "room": "Room 501" },
        "15:00-16:00": { "subject": "Mini Project-II", "room": "Room 501" },
        "16:00-17:00": { "subject": "Club/Professional Activities", "room": None }
    },
    "Wednesday": {
        "09:00-10:00": { "subject": "BDC", "room": "Room 103" },
        "10:00-11:00": { "subject": "Bio", "room": "Room 103" },
        "11:15-12:15": { "subject": "DL", "room": "Room 501" },
        "12:15-13:15": { "subject": "DL", "room": "Room 501" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "IoT & 5G/RT", "room": "Room 501" },
        "15:00-16:00": { "subject": "Institutional Elective (IAI)", "room": "Room 501" },
        "16:00-17:00": { "subject": "Office Hour", "room": None }
    },
    "Thursday": {
        "09:00-10:00": { "subject": "MLOPS (Tutorial)", "room": "Room 501" },
        "10:00-11:00": { "subject": "Bio", "room": "Room 501" },
        "11:15-12:15": { "subject": "BDC Lab", "room": "Room 503" },
        "12:15-13:15": { "subject": "BDC Lab", "room": "Room 503" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "Institutional Elective (IAI)", "room": "Room 501" },
        "15:00-16:00": { "subject": "Preplacement/Skill Development", "room": None },
        "16:00-17:00": { "subject": "Preplacement/Skill Development", "room": None }
    },
    "Friday": {
        "09:00-10:00": { "subject": "DL Lab", "room": "Room 502" },
        "10:00-11:00": { "subject": "DL Lab", "room": "Room 501" },
        "11:15-12:15": { "subject": "Mini Project-II", "room": None },
        "12:15-13:15": { "subject": "Mini Project-II", "room": None },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "Proctor Meeting", "room": "Room 501" },
        "15:00-16:00": { "subject": "", "room": None },
        "16:00-17:00": { "subject": "", "room": None }
    },
    "Saturday": {
        "09:00-10:00": { "subject": "HPC", "room": "Room 501" },
        "10:00-11:00": { "subject": "MLOPS", "room": "Room 501" },
        "11:15-12:15": { "subject": "MLOPS", "room": "Room 501" },
        "12:15-13:15": { "subject": "MLOPS", "room": "Room 501" },
        "13:15-14:00": { "subject": "Lunch Break", "room": None },
        "14:00-15:00": { "subject": "", "room": None },
        "15:00-16:00": { "subject": "", "room": None },
        "16:00-17:00": { "subject": "", "room": None }
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
