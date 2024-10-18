import Course from "../../models/COURSE";
import Venue from "../../models/VENUE";
import Lecturer from "../../models/LECTURER";
import getVenueCoordinates from "../venue";
import QRCode from "qrcode";
const addCourse = async (req: any, res: any) => {
  const { _id } = req.user;
  const { course_code, course_name, venue, semester } = req.body;
  if (!course_code || !course_name || !venue || !semester) {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  try {
    const lecturer = await Lecturer.findById(_id);
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    const course = new Course({
      lecturer: _id,
      course_code,
      course_name,
      semester: Number(semester),
      department: lecturer.department._id,
      venue: await getVenueCoordinates(venue), // Expecting venueIds to be an array
    });

    await course.save();
    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding course" });
  }
};

const viewAllCourses = async (req: any, res: any) => {
  const { _id } = req.user;
  try {
    const coursesUnderLecturer = await Course.find({ lecturer: _id })
      .select("course_code course_name qr_code semester venue")
      .populate({
        path: "venue",
        select: "name_of_venue",
      });

    if (!coursesUnderLecturer.length) {
      return res
        .status(404)
        .json({ message: "No courses found for this lecturer." });
    }
    res.status(200).json(coursesUnderLecturer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting courses" });
  }
};

const getSingleCourse = async (req: any, res: any) => {
  const { _id } = req.user;
  const course_id = req.params.courseId;
  if (!course_id) {
    return res.status(400).json({ mesage: "Invalid parameters" });
  }
  try {
    const singleCourse = await Course.findOne({ _id: course_id, lecturer: _id })
      .select("course_code course_name qr_code semester venue")
      .populate({
        path: "department",
        select: "name",
      })
      .populate({
        path: "venue",
        select: "name_of_venue",
      });

    if (!singleCourse) {
      return res.status(404).json({ message: "Course not found." });
    }
    res.status(200).json(singleCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting course" });
  }
};

const updateCourse = async (req: any, res: any) => {
  const { _id } = req.user;
  const course_id = req.params.courseId;
  const { ...course_data } = req.body;
  if (!course_id) {
    return res.status(400).json({ mesage: "Invalid parameters" });
  }
  try {
    const filteredData = Object.fromEntries(
      Object.entries(course_data).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: course_id, lecturer: _id },
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        message:
          "Course not found or you do not have permission to update this course.",
      });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully.", course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding course" });
  }
};

const removeCourse = async (req: any, res: any) => {
  const { _id } = req.user;
  const course_id = req.params.courseId;
  if (!course_id) {
    return res.status(400).json({ mesage: "Invalid parameters" });
  }
  try {
    const deletedCourse = await Course.findOneAndDelete({
      _id: course_id,
      lecturer: _id,
    });

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({ message: "Course deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding course" });
  }
};

const generateQRCodeForCourse = async (req: any, res: any) => {
  const { courseId } = req.params;
  const { _id } = req.user;
  try {
    const course = (await Course.findOne({_id: courseId, lecturer: _id}).populate({
      path: "venue",
      model: Venue,
    })) as any;
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const qrData = {
      courseId: course._id.toString(),
      courseName: course.course_name,
      longitude: course.venue.longitude,
      latitude: course.venue.latitude,
      venue: course.venue.name_of_venue,
    };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    if (!qrCode) {
      return res
        .status(400)
        .json({
          message: "There was an error generating a QR code for this course.",
        });
    }

    course.qr_code = qrCode;
    await course.save();

    res.status(200).json({ qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating QR code" });
  }
};

export {
  addCourse,
  viewAllCourses,
  getSingleCourse,
  updateCourse,
  removeCourse,
  generateQRCodeForCourse,
};
