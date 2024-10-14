import Course from "../../models/COURSE";
import { Request, Response } from 'express';
import Lecturer from "../../models/LECTURER";
import getVenueCoordinates from "../venue";

const addCourse = async (req: any, res: any) => {
    const { _id } = req.user;
    const { course_code, course_name, venue, semester } = req.body;
    if (!course_code || !course_name || !venue || !semester){
        return res.status(400).json({message: 'Invalid parameters'});
    }
    try {
        const lecturer = await Lecturer.findById(_id);
        if (!lecturer) {
            return res.status(404).json({ message: 'Lecturer not found' });
        }

        const course = new Course({
            lecturer: _id,
            course_code,
            course_name,
            semester: Number(semester),
            department: lecturer.department._id,
            venue: await getVenueCoordinates(venue) // Expecting venueIds to be an array
        });

        await course.save();
        res.status(201).json({ message: 'Course added successfully', course });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding course' });
    }
}

export {
    addCourse
}