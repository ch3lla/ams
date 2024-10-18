import Attendance from "../../models/ATTENDANCE";
import Course from "../../models/COURSE";
import Student from "../../models/STUDENT";
import Venue from "../../models/VENUE";

const addStudent = async (req: any, res: any) => {
  const { matric_number, first_name, last_name, department, level, email } = req.body;
  if (!matric_number || !first_name || !last_name || !department || !level || !email) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    const student = new Student({
      matric_number,
      first_name,
      last_name,
      department,
      level,
      email
    });

    await student.save();
    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding student" });
  }
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const R = 6371e3;
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

const markAttendance = async (req: any, res: any) => {
  const { _id } = req.user;
  const { qrCodeData } = req.body;
  try {

    const decodedData = JSON.parse(qrCodeData);

    const currentTimestamp = new Date();
    const qrTimestamp = new Date(decodedData.timestamp); 

    const timeDiffInMinutes = (currentTimestamp.getTime() - qrTimestamp.getTime()) / (1000 * 60);
    if (timeDiffInMinutes > 15) {
      return res.status(400).json({ message: "Attendance cannot be marked. Time limit exceeded." });
    }

    const course = await Course.findById(decodedData.courseId).populate({
      path: 'venue',
      model: Venue
    });
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    const venue = course.venue as any;
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const distance = calculateDistance(decodedData.userLatitude, decodedData.userLongitude,  venue.latitude, venue.longitude);

    const THRESHOLD_DISTANCE = 20;

    if (distance < THRESHOLD_DISTANCE){
     const todays_attendnace = new Attendance({
      lecturer: course.lecturer,
      student: _id,
      course: decodedData.courseId,
      date_class_was_held: Date.now(),
      status: "PRESENT",
      check_in_time: Date.now()
     });
     await todays_attendnace.save();
     res.status(200).json({ message: "Attendance marked successfully." });
    } else {
      res.status(400).json({ message: "You are not within the required range to mark attendance." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
}

export {
    addStudent,
    markAttendance
}