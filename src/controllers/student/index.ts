import Attendance from "../../models/ATTENDANCE";
import Course from "../../models/COURSE";
import Student from "../../models/STUDENT";
import Venue from "../../models/VENUE";
import mongoose from "mongoose";

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
  const { course_id, current_location } = req.body;
  // const { qrCodeData } = req.body;
  console.log(req.body);

  if (!course_id || !current_location){
    return res.status(401).json({ message: "Neccessary parameters are missing, try again"});
  }
  try {
    const currentTimestamp = new Date();
    
    const course = await Course.findById(mongoose.Types.ObjectId.createFromHexString(course_id)).populate({
      path: 'venue',
      model: Venue
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const startTime = parseTimeStringToTime(course.start_time);
    const validStartWindow = new Date(startTime!.getTime() + 15 * 60 * 1000);

    // check if the student has marked attendance for the course today (rn)
    const todaysAttendance = await Attendance.findOne({ student: _id, course: course_id, date_class_was_held: { $gte: startTime, $lte: validStartWindow, } });
    if (todaysAttendance) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const end_time = parseTimeStringToTime(course.end_time);
    if (end_time === null) {
      return res.status(400).json({ message: "Invalid course end time format" });
    }
    const timeDiffInMinutes = (currentTimestamp.getTime() - end_time.getTime()) / (1000 * 60);
    if (timeDiffInMinutes > 15) {
      return res.status(400).json({ message: "Attendance cannot be marked. Time limit exceeded." });
    }
    
    const venue = course.venue as any;
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    let distance: number;

    if (venue.name_of_venue.includes("Bucodel")){
      distance = calculateDistance(venue.latitude, venue.longitude,  venue.latitude, venue.longitude);
    } else {
      distance = calculateDistance(current_location.latitude, current_location.longitude,  venue.latitude, venue.longitude);
    }

    // const 

    console.log(`Calculated Distance: ${distance} meters`);

    const THRESHOLD_DISTANCE = 50;

    if (distance < THRESHOLD_DISTANCE){
     const todays_attendance = new Attendance({
      lecturer: course.lecturer,
      student: _id,
      course: course_id,
      date_class_was_held: Date.now(),
      status: "PRESENT",
      check_in_time: Date.now()
     });
     await todays_attendance.save();

    await addCourseOfferedByStudent(_id, course_id);

     res.status(200).json({ message: "Attendance marked successfully." });
    } else {
      res.status(400).json({ message: "You are not within the required range to mark attendance." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
}

// helper function
function parseTimeStringToTime(timeString: string): Date | null {
  const timeParts = timeString.split(":");

  if (timeParts.length !== 2) {
    console.error("Invalid time format. Expected format: 'HH:MM'.");
    return null;
  }

  const [hourPart, minutePart] = timeParts;
  const hour = parseInt(hourPart, 10);
  const minute = parseInt(minutePart, 10);

  if (
    isNaN(hour) || 
    isNaN(minute) || 
    hour < 0 || 
    hour > 23 || 
    minute < 0 || 
    minute > 59
  ) {
    console.error("Invalid time values. Ensure hours are 0-23 and minutes are 0-59.");
    return null;
  }

  const now = new Date();
  now.setHours(hour, minute, 0, 0); // Set hours, minutes, seconds, and milliseconds to match the parsed time
  return now;
}

const getAllCoursesOfferedByStudent = async (req: any, res: any) => {
  const { _id } = req.user;
  try {
    const student = await Student.findById(_id)
      .populate({
        path: "courses"
      })
      .sort({
        updatedAt: -1
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student.courses);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking attendance" });
  }
}

const getSingleCourseOfferedByStudent = async (req: any, res: any) => {
  const { _id } = req.user;
  const course_id = req.params.courseId;
  try {
    if (!course_id) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const attendanceRecords = await Attendance.find({ student: _id, course: course_id })
    .populate([
      {
        path: "course",
        select: "_id course_code course_name semester venue start_time end_time"
      },
      {
        path: "lecturer",
        select: "first_name last_name email"
      }
    ])
    .select("-student")
    .sort({ updatedAt: -1 })
    .lean() as any;


    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    const attendance_details = attendanceRecords.map((record: any) => ({
      class_date: getDate(record.date_class_was_held),
      status: record.status,
      check_in_time: getTime(record.check_in_time),
    }));

    const courseDetails = attendanceRecords[0].course;
    const lecturerDetails = attendanceRecords[0].lecturer;

    const data = {
      course_code: courseDetails.course_code,
      course_name: courseDetails.course_name,
      course_time: `${courseDetails.start_time} - ${courseDetails.end_time}`,
      semester: courseDetails.semester,
      lecturer: `${lecturerDetails.first_name} ${lecturerDetails.last_name}`,
      lecturer_email: lecturerDetails.email,
      attendance_details,
    };

    res.status(200).json({data, message: "Attendance record retrieved successfully."});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking attendance" });
  }
}

const deleteCourseOfferedByStudent = async (req: any, res: any) => {
}

const addCourseOfferedByStudent = async (student_id: string, course_id: string) => {
  try {
    const student = await Student.findById(student_id);

    if (!student) {
      console.error(`Student with ID ${student_id} not found`);
      return;
    }

    const courseObjectId = mongoose.Types.ObjectId.createFromHexString(course_id);

    const isCourseAlreadyAdded = student.courses.some(course => course.equals(courseObjectId));

    if (isCourseAlreadyAdded) {
      console.log(`Course ${course_id} is already offered by the student.`);
      return;
    }

    student.courses.push(courseObjectId);
    await student.save();
    console.log(`Course ${course_id} added to student ${student_id}.`);
  } catch (error: any) {
    console.error(`Error adding course to student: ${error.message}`);
  }
}

function getDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  // Format the date as YYYY-MM-DD
  return date.toISOString().split('T')[0];
}


function getTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  // Format the time as HH:mm:ss
  return date.toTimeString().split(' ')[0];
}


export {
    markAttendance,
    getAllCoursesOfferedByStudent,
    getSingleCourseOfferedByStudent
}