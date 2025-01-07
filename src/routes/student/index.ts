import express from 'express';
import { authenticateStudent } from '../../middleware/auth';
import { markAttendance, getAllCoursesOfferedByStudent, getSingleCourseOfferedByStudent } from '../../controllers/student';
const router = express.Router();

router.post('/attendance', authenticateStudent, markAttendance);
router.post('/courses', authenticateStudent, getAllCoursesOfferedByStudent);
router.get('/courses/:courseId', authenticateStudent, getSingleCourseOfferedByStudent);

export default router;