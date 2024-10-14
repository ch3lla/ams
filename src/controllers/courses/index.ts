import Course from "../../models/COURSE";
import { Request, Response } from 'express';
import Lecturer from "../../models/LECTURER";

// course name, course scoe, venue
const addCourse = async (req: any, res: Response) => {
    const { id } = req.user;
    const { course_code, course_name, venue, semester } = req.body;
    if (!course_code || !course_name || !venue || !semester){
        return res.status(400).json({message: 'Invalid parameters'});
    }
    try {
        const lecturer = await Lecturer.findById(id);
        if (!lecturer) {
            return res.status(404).json({ message: 'Lecturer not found' });
        }

        const course = new Course({
            lecturer: id,
            course_code,
            course_name,
            semester,
            department: lecturer.department,
            venue: venueIds // Expecting venueIds to be an array
        });

        // Save the course
        await course.save();


        res.status(201).json({ message: 'Course added successfully', course });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding course', error });
    }
}