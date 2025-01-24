import Attendance from "../../models/ATTENDANCE";
import Course from "../../models/COURSE";
import Student from "../../models/STUDENT";
import Venue from "../../models/VENUE";
import mongoose from "mongoose";

const getAttendanceForCousrseOnASpecificDate = async (req: any, res: any) => {
  const { _id } = req.user;
  const { course_id, date } = req.query;

    if (!course_id || !date) {
        return res.status(400).json({ message: "Course ID and date are required" });
    }
    try {

        const startOfDay = new Date(date); // 2025-01-19T00:00:00.000Z
        const endOfDay = new Date(date);
        endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

        const attendanceRecords = await Attendance.find({ lecturer: _id, course: course_id, date_class_was_held: {
            $gte: startOfDay,
            $lt: endOfDay // Use $lt for exclusive end
        }})
            .populate([
            {
                path: "course",
                select: "_id course_code course_name semester venue start_time end_time"
            },
            {
                path: "lecturer",
                select: "first_name last_name email"
            },
            {
                path: "student",
                select: "first_name last_name email matric_number"
            }

            ])
            .sort({ updatedAt: -1 })
            .lean() as any;

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        const attendance_details = attendanceRecords.map((record: any) => ({
            _id: record._id,
            student_id: record.student._id,
            student_name: `${record.student.first_name} ${record.student.last_name}`,
            matric_number: record.student.matric_number,
            status: record.status,
            check_in_time: record.check_in_time
        }));

        const courseDetails = attendanceRecords[0].course;

        const data = {
            course_id: courseDetails._id,
            course_name: courseDetails.course_name,
            course_code: courseDetails.course_code,
            attendance_details
        }

        res.status(200).json({data, message: "successful"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking attendance" });
  }
};

const updateStudentAttendanceRecord = async (req: any, res: any) => {
    const { attendance_id } = req.params;
    const { status } = req.body;

    if (!attendance_id || !status) {
        return res.status(400).json({messag: "Invalid parametes"});
    }

    try {
        const attendance = await Attendance.findByIdAndUpdate(
            {_id: mongoose.Types.ObjectId.createFromHexString(attendance_id)}, 
            {status: status.toUpperCase()}, 
            { new: true }
        );

        if (!attendance) {
            return res.status(404).json({message: "Attendance record not found"});
        }

        res.status(200).json({message: "successful"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking attendance" });
  }
}

export {
    getAttendanceForCousrseOnASpecificDate,
    updateStudentAttendanceRecord
}